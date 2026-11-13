import { brands } from "./brands.data";
import { categories, collections } from "./category.data";
import { flashDeals } from "./flashDeals.data";
import { products } from "./products.data";

const findDuplicates = (values: string[]) => values.filter((v, i) => values.indexOf(v) !== i);

export const validateCatalog = () => {
  const errors: string[] = [];
  const collectionSlugs = new Set(collections.map((c) => c.slug));
  const categoryIds = new Set(categories.map((c) => c.id));
  const brandIds = new Set(brands.map((b) => b.id));
  const productIds = new Set(products.map((p) => p.id));

  for (const d of findDuplicates(categories.map((c) => c.slug))) errors.push(`Duplicate category slug "${d}"`);
  for (const d of findDuplicates(categories.map((c) => c.id))) errors.push(`Duplicate category id "${d}"`);
  for (const d of findDuplicates(products.map((p) => p.slug))) errors.push(`Duplicate product slug "${d}"`);
  for (const d of findDuplicates(products.map((p) => p.id))) errors.push(`Duplicate product id "${d}"`);
  for (const d of findDuplicates(brands.map((b) => b.id))) errors.push(`Duplicate brand id "${d}"`);

  for (const c of categories) {
    if (!collectionSlugs.has(c.collectionSlug)) {
      errors.push(`Category "${c.slug}" uses unknown collection "${c.collectionSlug}"`);
    }
  }

  for (const p of products) {
    if (!categoryIds.has(p.categoryId)) errors.push(`Product "${p.slug}" uses unknown categoryId "${p.categoryId}"`);
    if (!brandIds.has(p.brandId)) errors.push(`Product "${p.slug}" uses unknown brandId "${p.brandId}"`);
    if (p.oldPrice !== undefined && p.oldPrice <= p.price) {
      errors.push(`Product "${p.slug}": oldPrice must be higher than price`);
    }
    if (p.stockQuantity < 0) errors.push(`Product "${p.slug}": stockQuantity cannot be negative`);
    if (p.rating < 0 || p.rating > 5) errors.push(`Product "${p.slug}": rating must be between 0 and 5`);
  }

  for (const d of flashDeals) {
    if (!productIds.has(d.productId)) errors.push(`Flash deal uses unknown productId "${d.productId}"`);
  }

  if (errors.length > 0) {
    console.error(`Catalog data has ${errors.length} problem(s):\n- ${errors.join("\n- ")}`);
  }
};
