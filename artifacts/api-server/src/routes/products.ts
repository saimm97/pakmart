import { Router, type IRouter } from "express";
import { and, asc, desc, eq, gte, ilike, lte, ne, or, sql } from "drizzle-orm";
import { db, productsTable, brandsTable, categoriesTable } from "@workspace/db";
import {
  GetProductParams,
  GetProductResponse,
  GetRelatedProductsParams,
  GetRelatedProductsResponse,
  ListProductsQueryParams,
  ListProductsResponse,
} from "@workspace/api-zod";
import { serializeProduct } from "../lib/serialize";

const router: IRouter = Router();

async function getLookups() {
  const brands = await db.select().from(brandsTable);
  const categories = await db.select().from(categoriesTable);
  return {
    brandsBySlug: new Map(brands.map((b) => [b.slug, b.name])),
    categoriesBySlug: new Map(categories.map((c) => [c.slug, c.name])),
  };
}

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, brand, search, minPrice, maxPrice, sort, limit, offset } =
    parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(productsTable.categorySlug, category));
  if (brand) conditions.push(eq(productsTable.brandSlug, brand));
  if (typeof minPrice === "number") conditions.push(gte(productsTable.price, minPrice));
  if (typeof maxPrice === "number") conditions.push(lte(productsTable.price, maxPrice));
  if (search) {
    const q = `%${search}%`;
    conditions.push(
      or(
        ilike(productsTable.name, q),
        ilike(productsTable.description, q),
        ilike(productsTable.brandSlug, q),
        ilike(productsTable.categorySlug, q),
      )!,
    );
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderClause = (() => {
    switch (sort) {
      case "newest":
        return desc(productsTable.createdAt);
      case "price_asc":
        return asc(productsTable.price);
      case "price_desc":
        return desc(productsTable.price);
      case "rating":
        return desc(productsTable.rating);
      case "popular":
      default:
        return desc(productsTable.sold);
    }
  })();

  const lim = typeof limit === "number" && limit > 0 ? Math.min(limit, 100) : 24;
  const off = typeof offset === "number" && offset > 0 ? offset : 0;

  const [{ total }] = await db
    .select({ total: sql<number>`cast(count(*) as int)` })
    .from(productsTable)
    .where(whereClause);

  const rows = await db
    .select()
    .from(productsTable)
    .where(whereClause)
    .orderBy(orderClause)
    .limit(lim)
    .offset(off);

  const { brandsBySlug, categoriesBySlug } = await getLookups();
  const items = rows.map((p) => serializeProduct(p, brandsBySlug, categoriesBySlug));

  res.json(ListProductsResponse.parse({ items, total: total ?? 0 }));
});

router.get("/products/:slug", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, params.data.slug));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const { brandsBySlug, categoriesBySlug } = await getLookups();
  res.json(
    GetProductResponse.parse(
      serializeProduct(product, brandsBySlug, categoriesBySlug),
    ),
  );
});

router.get("/products/:slug/related", async (req, res): Promise<void> => {
  const params = GetRelatedProductsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, params.data.slug));
  if (!product) {
    res.json(GetRelatedProductsResponse.parse([]));
    return;
  }
  const rows = await db
    .select()
    .from(productsTable)
    .where(
      and(
        eq(productsTable.categorySlug, product.categorySlug),
        ne(productsTable.id, product.id),
      ),
    )
    .orderBy(desc(productsTable.sold))
    .limit(8);
  const { brandsBySlug, categoriesBySlug } = await getLookups();
  const items = rows.map((p) => serializeProduct(p, brandsBySlug, categoriesBySlug));
  res.json(GetRelatedProductsResponse.parse(items));
});

export default router;
