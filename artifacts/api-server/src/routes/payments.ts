import { Router, type IRouter } from "express";
import {
  ProcessCardPaymentBody,
  ProcessMobilePaymentBody,
  ProcessCardPaymentResponse,
  ProcessMobilePaymentResponse,
} from "@workspace/api-zod";
import { loadCart } from "../lib/cart";

const router: IRouter = Router();

function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "").split("").reverse().map(Number);
  if (digits.length < 12 || digits.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

function detectBrand(cardNumber: string): string {
  const n = cardNumber.replace(/\D/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6(?:011|5)/.test(n)) return "Discover";
  return "Card";
}

function makeTxnId(prefix: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${ts}${rand}`;
}

router.post("/payments/card", async (req, res): Promise<void> => {
  const parsed = ProcessCardPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { cardNumber, expMonth, expYear, cvv, amount } = parsed.data;

  const cart = await loadCart(req.sessionId);
  if (cart.items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }
  if (cart.total !== amount) {
    res.status(400).json({ error: "Payment amount does not match cart total" });
    return;
  }

  const cleanNumber = cardNumber.replace(/\s|-/g, "");
  if (!/^\d+$/.test(cleanNumber)) {
    res.status(400).json({ error: "Card number must contain only digits" });
    return;
  }
  if (!luhnCheck(cleanNumber)) {
    const failResult = ProcessCardPaymentResponse.parse({
      success: false,
      transactionId: makeTxnId("decl"),
      status: "failed",
      amount,
      cardBrand: null,
      cardLast4: null,
      message: "Card number is invalid. Please double-check and try again.",
    });
    res.status(402).json(failResult);
    return;
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    res.status(400).json({ error: "CVV must be 3 or 4 digits" });
    return;
  }
  const now = new Date();
  const expDate = new Date(expYear, expMonth, 0);
  if (expDate < now) {
    const failResult = ProcessCardPaymentResponse.parse({
      success: false,
      transactionId: makeTxnId("decl"),
      status: "failed",
      amount,
      cardBrand: null,
      cardLast4: null,
      message: "This card has expired. Please use another card.",
    });
    res.status(402).json(failResult);
    return;
  }

  // Sandbox processor: cards ending in 0000 simulate a decline (insufficient funds)
  // for test/QA purposes. All other Luhn-valid cards succeed.
  const last4 = cleanNumber.slice(-4);
  if (last4 === "0000") {
    const failResult = ProcessCardPaymentResponse.parse({
      success: false,
      transactionId: makeTxnId("decl"),
      status: "failed",
      amount,
      cardBrand: detectBrand(cleanNumber),
      cardLast4: last4,
      message: "Card declined: insufficient funds.",
    });
    res.status(402).json(failResult);
    return;
  }

  // Simulate processor latency
  await new Promise((r) => setTimeout(r, 800));

  const result = ProcessCardPaymentResponse.parse({
    success: true,
    transactionId: makeTxnId("txn"),
    status: "succeeded",
    amount,
    cardBrand: detectBrand(cleanNumber),
    cardLast4: last4,
    message: "Payment authorized successfully.",
  });
  req.log.info({ transactionId: result.transactionId, amount }, "card payment authorized");
  res.json(result);
});

router.post("/payments/mobile", async (req, res): Promise<void> => {
  const parsed = ProcessMobilePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { mobileNumber, amount } = parsed.data;

  const cart = await loadCart(req.sessionId);
  if (cart.items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }
  if (cart.total !== amount) {
    res.status(400).json({ error: "Payment amount does not match cart total" });
    return;
  }
  const cleanMobile = mobileNumber.replace(/\D/g, "");
  if (!/^(03\d{9}|923\d{9})$/.test(cleanMobile)) {
    res.status(400).json({ error: "Enter a valid Pakistani mobile number (e.g. 03XX XXXXXXX)" });
    return;
  }

  // Sandbox: numbers ending in 0000 simulate decline
  if (cleanMobile.endsWith("0000")) {
    const failResult = ProcessMobilePaymentResponse.parse({
      success: false,
      transactionId: makeTxnId("decl"),
      status: "failed",
      amount,
      cardBrand: null,
      cardLast4: null,
      message: "Wallet payment declined. Please verify your account balance.",
    });
    res.status(402).json(failResult);
    return;
  }

  await new Promise((r) => setTimeout(r, 800));

  const result = ProcessMobilePaymentResponse.parse({
    success: true,
    transactionId: makeTxnId("txn"),
    status: "succeeded",
    amount,
    cardBrand: null,
    cardLast4: null,
    message: "Wallet payment confirmed.",
  });
  req.log.info({ transactionId: result.transactionId, amount }, "mobile payment authorized");
  res.json(result);
});

export default router;
