/**
 * Generates a consistent placeholder product image URL.
 * In production this would come from a CDN / media service.
 * Using picsum or a local pattern for demo.
 */
export const productImage = (slug: string, width = 400, height = 400): string => {
  // Deterministic seed from slug so the same product always gets the same image
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash) % 1000;
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};

export default productImage;
