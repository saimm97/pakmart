import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, cartItemsTable, productsTable } from "@workspace/db";
import {
  AddCartItemBody,
  AddCartItemResponse,
  ClearCartResponse,
  GetCartResponse,
  RemoveCartItemParams,
  RemoveCartItemResponse,
  UpdateCartItemBody,
  UpdateCartItemParams,
  UpdateCartItemResponse,
} from "@workspace/api-zod";
import { loadCart } from "../lib/cart";

const router: IRouter = Router();

router.get("/cart", async (req, res): Promise<void> => {
  const cart = await loadCart(req.sessionId);
  res.json(GetCartResponse.parse(cart));
});

router.post("/cart/items", async (req, res): Promise<void> => {
  const parsed = AddCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { productId, quantity } = parsed.data;
  const qty = Math.max(1, quantity ?? 1);
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.sessionId, req.sessionId),
        eq(cartItemsTable.productId, productId),
      ),
    );
  if (existing) {
    const newQty = Math.min(existing.quantity + qty, Math.max(product.stock, 1));
    await db
      .update(cartItemsTable)
      .set({ quantity: newQty })
      .where(eq(cartItemsTable.id, existing.id));
  } else {
    await db.insert(cartItemsTable).values({
      sessionId: req.sessionId,
      productId,
      quantity: Math.min(qty, Math.max(product.stock, 1)),
    });
  }
  const cart = await loadCart(req.sessionId);
  res.json(AddCartItemResponse.parse(cart));
});

router.patch("/cart/items/:id", async (req, res): Promise<void> => {
  const params = UpdateCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateCartItemBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [item] = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.id, params.data.id),
        eq(cartItemsTable.sessionId, req.sessionId),
      ),
    );
  if (!item) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }
  if (body.data.quantity <= 0) {
    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, item.id));
  } else {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, item.productId));
    const maxQty = product ? Math.max(product.stock, 1) : body.data.quantity;
    await db
      .update(cartItemsTable)
      .set({ quantity: Math.min(body.data.quantity, maxQty) })
      .where(eq(cartItemsTable.id, item.id));
  }
  const cart = await loadCart(req.sessionId);
  res.json(UpdateCartItemResponse.parse(cart));
});

router.delete("/cart/items/:id", async (req, res): Promise<void> => {
  const params = RemoveCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db
    .delete(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.id, params.data.id),
        eq(cartItemsTable.sessionId, req.sessionId),
      ),
    );
  const cart = await loadCart(req.sessionId);
  res.json(RemoveCartItemResponse.parse(cart));
});

router.post("/cart/clear", async (req, res): Promise<void> => {
  await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, req.sessionId));
  const cart = await loadCart(req.sessionId);
  res.json(ClearCartResponse.parse(cart));
});

export default router;
