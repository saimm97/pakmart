import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, productsTable, brandsTable, categoriesTable } from "@workspace/db";
import { GetFlashDealResponse } from "@workspace/api-zod";
import { serializeProduct } from "../lib/serialize";

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

router.get("/deals/flash", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isFlashDeal, true))
    .orderBy(desc(productsTable.sold))
    .limit(12);
  const brands = await db.select().from(brandsTable);
  const cats = await db.select().from(categoriesTable);
  const brandsBySlug = new Map(brands.map((b) => [b.slug, b.name]));
  const categoriesBySlug = new Map(cats.map((c) => [c.slug, c.name]));
  const items = rows.map((p) => serializeProduct(p, brandsBySlug, categoriesBySlug));
  res.json(
    GetFlashDealResponse.parse({
      endsAt: nextEndsAt(),
      items,
    }),
  );
});

export default router;
