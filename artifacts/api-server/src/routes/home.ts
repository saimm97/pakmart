import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, productsTable, brandsTable, categoriesTable, testimonialsTable } from "@workspace/db";
import { GetHomeFeedResponse } from "@workspace/api-zod";
import { serializeProduct } from "../lib/serialize";
import { loadCategoriesWithCounts } from "./categories";
import { loadBrandsWithCounts } from "./brands";

const router: IRouter = Router();

function nextEndsAt(): Date {
  const now = new Date();
  const end = new Date(now);
  end.setUTCHours(23, 59, 59, 0);
  if (end.getTime() <= now.getTime()) {
    end.setUTCDate(end.getUTCDate() + 1);
  }
  return end;
}

router.get("/home/feed", async (_req, res): Promise<void> => {
  const [allBrands, allCats] = await Promise.all([
    db.select().from(brandsTable),
    db.select().from(categoriesTable),
  ]);
  const brandsBySlug = new Map(allBrands.map((b) => [b.slug, b.name]));
  const categoriesBySlug = new Map(allCats.map((c) => [c.slug, c.name]));

  const [flashRows, newRows, trendingRows, featuredRows, categories, topBrands, testimonials] =
    await Promise.all([
      db
        .select()
        .from(productsTable)
        .where(eq(productsTable.isFlashDeal, true))
        .orderBy(desc(productsTable.sold))
        .limit(8),
      db
        .select()
        .from(productsTable)
        .where(eq(productsTable.isNew, true))
        .orderBy(desc(productsTable.createdAt))
        .limit(8),
      db
        .select()
        .from(productsTable)
        .orderBy(desc(productsTable.sold))
        .limit(8),
      db
        .select()
        .from(productsTable)
        .where(eq(productsTable.isFeatured, true))
        .orderBy(desc(productsTable.rating))
        .limit(8),
      loadCategoriesWithCounts(),
      loadBrandsWithCounts(),
      db.select().from(testimonialsTable).orderBy(testimonialsTable.position),
    ]);

  res.json(
    GetHomeFeedResponse.parse({
      flashDeal: {
        endsAt: nextEndsAt(),
        items: flashRows.map((p) => serializeProduct(p, brandsBySlug, categoriesBySlug)),
      },
      categories,
      newArrivals: newRows.map((p) => serializeProduct(p, brandsBySlug, categoriesBySlug)),
      trending: trendingRows.map((p) =>
        serializeProduct(p, brandsBySlug, categoriesBySlug),
      ),
      featured: featuredRows.map((p) =>
        serializeProduct(p, brandsBySlug, categoriesBySlug),
      ),
      topBrands,
      testimonials,
    }),
  );
});

export default router;
