import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brandSlug: text("brand_slug").notNull(),
  categorySlug: text("category_slug").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  oldPrice: integer("old_price"),
  image: text("image").notNull(),
  images: text("images").array().notNull().default([]),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("4.5"),
  reviewCount: integer("review_count").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  sold: integer("sold").notNull().default(0),
  isFlashDeal: boolean("is_flash_deal").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof productsTable.$inferSelect;
export type InsertProduct = typeof productsTable.$inferInsert;
