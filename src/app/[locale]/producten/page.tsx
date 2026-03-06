import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { getAllProducts } from "@/lib/products";
import { t } from "@/lib/vehicles";
import { locales, type Locale } from "@/i18n/config";
import { ProductGrid } from "@/components/product/product-grid";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tp = await getTranslations({ locale, namespace: "products" });

  return {
    title: tp("pageTitle"),
    description: tp("pageSubtitle"),
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const allProducts = await getAllProducts();
  const tp = await getTranslations("products");

  // Serialize products for the client component
  const serializedProducts = allProducts.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: t(product.name, typedLocale),
    shortDescription: product.shortDescription
      ? t(product.shortDescription, typedLocale)
      : undefined,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    currency: product.currency,
    image: product.images[0] ?? null,
    category: product.category,
    recommended: product.recommended ?? false,
  }));

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {tp("pageTitle")}
          </h1>
          <p className="mt-2 text-text-secondary">
            {tp("pageSubtitle")}
          </p>
        </div>

        <ProductGrid products={serializedProducts} locale={typedLocale} />
      </Container>
    </section>
  );
}
