import type { Product } from "@workspace/db";

export function calcDiscount(price: number, oldPrice: number | null): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export type SerializedProduct = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  description: string;
  price: number;
  oldPrice: number | null;
  discount: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sold: number;
  categoryName: string;
  categorySlug: string;
  isFlashDeal: boolean;
  isNew: boolean;
  isFeatured: boolean;
  tags: string[];
};

export function serializeProduct(
  p: Product,
  brandsBySlug: Map<string, string>,
  categoriesBySlug: Map<string, string>,
): SerializedProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: brandsBySlug.get(p.brandSlug) ?? p.brandSlug,
    brandSlug: p.brandSlug,
    description: p.description,
    price: p.price,
    oldPrice: p.oldPrice ?? null,
    discount: calcDiscount(p.price, p.oldPrice ?? null),
    image: p.image,
    images: p.images.length > 0 ? p.images : [p.image],
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    stock: p.stock,
    sold: p.sold,
    categoryName: categoriesBySlug.get(p.categorySlug) ?? p.categorySlug,
    categorySlug: p.categorySlug,
    isFlashDeal: p.isFlashDeal,
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    tags: p.tags,
  };
}
