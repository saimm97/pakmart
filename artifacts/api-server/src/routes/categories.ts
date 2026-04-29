import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, productsTable } from "@workspace/db";
import {
  GetCategoryParams,
  GetCategoryResponse,
  ListCategoriesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function loadCategoriesWithCounts() {
  const cats = await db
    .select()
    .from(categoriesTable)
    .orderBy(categoriesTable.position);
  const counts = await db
    .select({
      slug: productsTable.categorySlug,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(productsTable)
    .groupBy(productsTable.categorySlug);
  const countMap = new Map(counts.map((c) => [c.slug, c.count]));
  return cats.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    image: c.image,
    icon: c.icon,
    productCount: countMap.get(c.slug) ?? 0,
  }));
}

router.get("/categories", async (_req, res): Promise<void> => {
  const cats = await loadCategoriesWithCounts();
  res.json(ListCategoriesResponse.parse(cats));
});

router.get("/categories/:slug", async (req, res): Promise<void> => {
  const params = GetCategoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [cat] = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.slug, params.data.slug));
  if (!cat) {
    res.status(404).json({ error: "Category not found" });
    return;
  }
  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(productsTable)
    .where(eq(productsTable.categorySlug, cat.slug));
  res.json(
    GetCategoryResponse.parse({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      image: cat.image,
      icon: cat.icon,
      productCount: count ?? 0,
    }),
  );
});

export default router;
export { loadCategoriesWithCounts };
