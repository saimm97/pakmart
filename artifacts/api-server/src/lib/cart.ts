import { db, cartItemsTable, productsTable, brandsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";

export const FREE_DELIVERY_THRESHOLD = 2500;
export const DELIVERY_FEE = 200;

export type SerializedCartItem = {
  id: number;
  productId: number;
  productSlug: string;
  productName: string;
  productBrand: string;
  productImage: string;
  price: number;
  quantity: number;
  stock: number;
  lineTotal: number;
};

export type SerializedCart = {
  items: SerializedCartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  freeDeliveryThreshold: number;
  amountToFreeDelivery: number;
};

export async function loadCart(sessionId: string): Promise<SerializedCart> {
  const rows = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.sessionId, sessionId))
    .orderBy(cartItemsTable.createdAt);

  if (rows.length === 0) {
    return {
      items: [],
      itemCount: 0,
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      total: 0,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      amountToFreeDelivery: FREE_DELIVERY_THRESHOLD,
    };
  }

  const productIds = rows.map((r) => r.productId);
  const products = await db
    .select()
    .from(productsTable)
    .where(inArray(productsTable.id, productIds));
  const productMap = new Map(products.map((p) => [p.id, p]));

  const brandSlugs = Array.from(new Set(products.map((p) => p.brandSlug)));
  const brands =
    brandSlugs.length > 0
      ? await db.select().from(brandsTable).where(inArray(brandsTable.slug, brandSlugs))
      : [];
  const brandMap = new Map(brands.map((b) => [b.slug, b.name]));

  const items: SerializedCartItem[] = [];
  let subtotal = 0;
  let itemCount = 0;
  for (const row of rows) {
    const product = productMap.get(row.productId);
    if (!product) continue;
    const lineTotal = product.price * row.quantity;
    subtotal += lineTotal;
    itemCount += row.quantity;
    items.push({
      id: row.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productBrand: brandMap.get(product.brandSlug) ?? product.brandSlug,
      productImage: product.image,
      price: product.price,
      quantity: row.quantity,
      stock: product.stock,
      lineTotal,
    });
  }

  const deliveryFee =
    items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;
  const amountToFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

  return {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    discount,
    total,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    amountToFreeDelivery,
  };
}
