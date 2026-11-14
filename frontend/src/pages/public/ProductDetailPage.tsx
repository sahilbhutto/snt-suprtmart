import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LuArrowRight, LuSearchX } from "react-icons/lu";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import { useProduct, type ProductDetailData } from "../../features/products/hooks/useProduct";
import type { ProductTabKey } from "../../features/products/components/ProductTabs";
import { useProductSeo } from "../../features/products/hooks/useProductSeo";
import ProductGallery from "../../features/products/components/ProductGallery";
import ProductBuyBox from "../../features/products/components/ProductBuyBox";
import ProductTabs from "../../features/products/components/ProductTabs";
import ProductShelf from "../../features/products/components/ProductShelf";
import ProductStickyBar from "../../features/products/components/ProductStickyBar";


const ProductNotFound = () => (
  <Container className="grid place-items-center py-24 text-center">
    <div className="grid max-w-md gap-4">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-surface-muted text-muted-foreground">
        <LuSearchX size={30} />
      </span>
      <h1 className="text-3xl font-bold">Product not found</h1>
      <p className="text-muted-foreground">This product may have been removed or the link is wrong.</p>
      <Button to="/products" className="mx-auto">
        Browse all products <LuArrowRight size={16} className="rtl:rotate-180" />
      </Button>
    </div>
  </Container>
);


const ProductDetailContent = ({ data }: { data: ProductDetailData }) => {
  const { product, categoryProducts, brandProducts, bestSellers, reviews, summary } = data;

  const [tab, setTab] = useState<ProductTabKey>("description");
  const [showBar, setShowBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useProductSeo(product);

  // Show the phone bar once the real buy buttons have scrolled out of view
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const seeReviews = () => {
    setTab("reviews");
    document.getElementById("product-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pb-28 lg:pb-12">
      <Container className="grid gap-8 pt-4 sm:gap-10 sm:pt-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="transition hover:text-foreground">Home</Link>
          <span aria-hidden>/</span>
          <Link to="/products" className="transition hover:text-foreground">All products</Link>
          <span aria-hidden>/</span>
          <Link to={`/category/${product.category.slug}`} className="transition hover:text-foreground">{product.category.name}</Link>
          <span aria-hidden>/</span>
          <span aria-current="page" className="text-foreground">{product.name}</span>
        </nav>

        {/* Gallery and buy box */}
        <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:gap-14">
          <div className="lg:sticky lg:top-24">
            <ProductGallery product={product} />
          </div>
          <ProductBuyBox product={product} ctaRef={ctaRef} onSeeReviews={seeReviews} />
        </section>

        <ProductTabs product={product} reviews={reviews} summary={summary} active={tab} onChange={setTab} />

        {categoryProducts.length > 0 ? (
          <ProductShelf
            title={`More in ${product.category.name}`}
            products={categoryProducts}
            actionLabel="See all"
            actionTo={`/category/${product.category.slug}`}
          />
        ) : (
          <ProductShelf title="Best sellers" products={bestSellers} actionLabel="See all" actionTo="/products" />
        )}

        <ProductShelf
          title={`More from ${product.brand.name}`}
          products={brandProducts}
          actionLabel="See all"
          actionTo={`/products?brand=${product.brand.slug}`}
        />
      </Container>

      <ProductStickyBar product={product} visible={showBar} />
    </div>
  );
};

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = useProduct(slug);

  // key resets the quantity, tabs and gallery when you move to another product
  return data ? <ProductDetailContent key={data.product.id} data={data} /> : <ProductNotFound />;
};

export default ProductDetailPage;
