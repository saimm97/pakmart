import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export type OrderItemSnapshot = {
  productId: number;
  productSlug: string;
  productName: string;
  productBrand: string;
  productImage: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  sessionId: text("session_id").notNull(),
  status: text("status").notNull().default("pending"),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  transactionId: text("transaction_id"),
  cardBrand: text("card_brand"),
  cardLast4: text("card_last4"),
  paymentMobile: text("payment_mobile"),
  notes: text("notes"),
  subtotal: integer("subtotal").notNull(),
  deliveryFee: integer("delivery_fee").notNull(),
  discount: integer("discount").notNull().default(0),
  total: integer("total").notNull(),
  items: jsonb("items").$type<OrderItemSnapshot[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Order = typeof ordersTable.$inferSelect;
export type InsertOrder = typeof ordersTable.$inferInsert;
