import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import {
  db,
  cartItemsTable,
  ordersTable,
  type OrderItemSnapshot,
} from "@workspace/db";
import {
  CreateOrderBody,
  GetOrderParams,
  GetOrderResponse,
} from "@workspace/api-zod";
import { loadCart } from "../lib/cart";

const router: IRouter = Router();

function makeOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PM-${ts}-${rand}`;
}

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const cart = await loadCart(req.sessionId);
  if (cart.items.length === 0) {
    res.status(400).json({ error: "Your cart is empty" });
    return;
  }
  const items: OrderItemSnapshot[] = cart.items.map((item) => ({
    productId: item.productId,
    productSlug: item.productSlug,
    productName: item.productName,
    productBrand: item.productBrand,
    productImage: item.productImage,
    price: item.price,
    quantity: item.quantity,
    lineTotal: item.lineTotal,
  }));

  const [order] = await db
    .insert(ordersTable)
    .values({
      orderNumber: makeOrderNumber(),
      sessionId: req.sessionId,
      status: "confirmed",
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email ?? null,
      address: parsed.data.address,
      city: parsed.data.city,
      paymentMethod: parsed.data.paymentMethod,
      notes: parsed.data.notes ?? null,
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      discount: cart.discount,
      total: cart.total,
      items,
    })
    .returning();

  await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, req.sessionId));

  res.status(201).json(
    GetOrderResponse.parse({
      ...order,
      items,
    }),
  );
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.id, params.data.id),
        eq(ordersTable.sessionId, req.sessionId),
      ),
    );
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(GetOrderResponse.parse(order));
});

export default router;
