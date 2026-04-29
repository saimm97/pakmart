import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, brandsTable, productsTable } from "@workspace/db";
import { ListBrandsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

async function loadBrandsWithCounts() {
  const brands = await db.select().from(brandsTable).orderBy(brandsTable.position);
  const counts = await db
    .select({
      slug: productsTable.brandSlug,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(productsTable)
    .groupBy(productsTable.brandSlug);
  const countMap = new Map(counts.map((c) => [c.slug, c.count]));
  return brands.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    productCount: countMap.get(b.slug) ?? 0,
  }));
}

router.get("/brands", async (_req, res): Promise<void> => {
  const brands = await loadBrandsWithCounts();
  res.json(ListBrandsResponse.parse(brands));
});

export default router;
export { loadBrandsWithCounts };
