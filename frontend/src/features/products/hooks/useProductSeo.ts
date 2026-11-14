import { useEffect } from "react";
import type { ProductListItem } from "../types/products.types";

const SCRIPT_ID = "product-jsonld";

const setMeta = (name: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

export const useProductSeo = (product?: ProductListItem) => {
  useEffect(() => {
    if (!product) return;

    const previousTitle = document.title;
    const description =
      product.seo?.description ??
      product.description ??
      `Buy ${product.name} (${product.unit}) online from SNT Supermart. Delivered in 2 hours.`;

    document.title = product.seo?.title ?? `${product.name} ${product.unit} | SNT Supermart`;
    setMeta("description", description.slice(0, 160));

    const image = product.image;
    const data = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description,
      sku: product.sku,
      brand: { "@type": "Brand", name: product.brand.name },
      image: image ? new URL(image, window.location.origin).href : undefined,
      offers: {
        "@type": "Offer",
        priceCurrency: "PKR",
        price: product.price,
        availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: window.location.href,
      },
      ...(product.ratingCount > 0 && {
        aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.ratingCount },
      }),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCRIPT_ID;
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.title = previousTitle;
      document.getElementById(SCRIPT_ID)?.remove();
    };
  }, [product]);
};
