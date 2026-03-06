import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ImageCarousel } from "@/components/product/image-carousel";
import { SpecTable } from "@/components/product/spec-table";
import { PackageList } from "@/components/product/package-list";
import { CompatibleVehicles } from "@/components/product/compatible-vehicles";
import { ProductOrderSection } from "@/components/product/product-order-section";
import { getAllProducts, getProduct, formatPrice, type Product } from "@/lib/products";
import {
  getAllBrands,
  t,
  type VehicleBrand,
  type VehicleConfiguration,
} from "@/lib/vehicles";
import { locales, type Locale } from "@/i18n/config";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function findProductBySlug(
  products: Product[],
  slug: string,
): Product | undefined {
  return products.find((p) => p.slug === slug);
}

function getCompatibleBrands(
  brands: VehicleBrand[],
  productId: string,
  locale: Locale
) {
  const result: {
    brand: string;
    name: string;
    models: { id: string; name: string; subtitle: string }[];
  }[] = [];

  for (const brand of brands) {
    const compatibleModels: {
      id: string;
      name: string;
      subtitle: string;
    }[] = [];

    for (const model of brand.models) {
      const isCompatible = model.configurations.some((config) =>
        config.compatibleProducts.includes(productId)
      );

      if (isCompatible) {
        compatibleModels.push({
          id: model.id,
          name: t(model.displayName, locale),
          subtitle: model.subtitle ? t(model.subtitle, locale) : "",
        });
      }
    }

    if (compatibleModels.length > 0) {
      result.push({
        brand: brand.brand,
        name: t(brand.displayName, locale),
        models: compatibleModels,
      });
    }
  }

  return result;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const product of products) {
      params.push({
        locale,
        slug: product.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const products = await getAllProducts();
  const product = findProductBySlug(products, slug);

  if (!product) return {};

  const name = t(product.name, locale as Locale);
  const description = product.shortDescription
    ? t(product.shortDescription, locale as Locale)
    : undefined;

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const [products, brands] = await Promise.all([
    getAllProducts(),
    getAllBrands(),
  ]);

  const product = findProductBySlug(products, slug);
  if (!product) notFound();

  const tp = await getTranslations("product");

  const name = t(product.name, typedLocale);
  const description = product.description
    ? t(product.description, typedLocale)
    : null;
  const price = formatPrice(product.price, product.currency, typedLocale);
  const comparePrice = product.compareAtPrice
    ? formatPrice(product.compareAtPrice, product.currency, typedLocale)
    : null;
  const savings = product.compareAtPrice
    ? formatPrice(
        product.compareAtPrice - product.price,
        product.currency,
        typedLocale
      )
    : null;

  const packageItems = product.packageContents?.[typedLocale] ?? [];
  const featureItems = product.features?.[typedLocale] ?? [];
  const compatibleBrands = getCompatibleBrands(
    brands,
    product.id,
    typedLocale
  );
  const hasSpecs = Object.keys(product.specs).length > 0;

  // --- Vehicle context from query params ---
  const brandId = typeof query.brand === "string" ? query.brand : undefined;
  const modelId = typeof query.model === "string" ? query.model : undefined;
  const yearStr = typeof query.year === "string" ? query.year : undefined;
  const configId = typeof query.config === "string" ? query.config : undefined;

  let vehicleContext: {
    brandName: string;
    modelName: string;
    year: number;
    configName?: string;
    configId: string;
    modelId: string;
  } | null = null;

  let requiredAccessories: Product[] = [];
  let optionalAccessories: Product[] = [];

  if (brandId && modelId && yearStr && configId) {
    const brand = brands.find((b) => b.brand === brandId);
    const model = brand?.models.find((m) => m.id === modelId);
    const year = parseInt(yearStr, 10);

    if (brand && model && !isNaN(year)) {
      let configuration: VehicleConfiguration | undefined;
      if (configId !== "aftermarket") {
        configuration = model.configurations.find((c) => c.id === configId);
      }

      vehicleContext = {
        brandName: t(brand.displayName, typedLocale),
        modelName: t(model.displayName, typedLocale),
        year,
        configName: configuration ? t(configuration.displayName, typedLocale) : undefined,
        configId,
        modelId: model.id,
      };

      // Load accessories for this configuration
      if (configuration) {
        const reqAccIds = configuration.requiredAccessories ?? [];
        const optAccIds = configuration.optionalAccessories ?? [];

        const [reqAccProducts, optAccProducts] = await Promise.all([
          Promise.all(reqAccIds.map((id) => getProduct(id))),
          Promise.all(optAccIds.map((id) => getProduct(id))),
        ]);

        requiredAccessories = reqAccProducts.filter(
          (p): p is Product => p !== null
        );
        optionalAccessories = optAccProducts.filter(
          (p): p is Product => p !== null
        );
      } else if (configId === "aftermarket") {
        // For aftermarket, load optional accessories from the first config
        const firstConfig = model.configurations[0];
        if (firstConfig) {
          const optAccIds = firstConfig.optionalAccessories ?? [];
          const optAccProducts = await Promise.all(
            optAccIds.map((id) => getProduct(id))
          );
          optionalAccessories = optAccProducts.filter(
            (p): p is Product => p !== null
          );
        }
      }
    }
  }

  // Serialize products for client component (pre-translate strings)
  function serializeProduct(p: Product) {
    return {
      id: p.id,
      name: t(p.name, typedLocale),
      shortDescription: p.shortDescription
        ? t(p.shortDescription, typedLocale)
        : undefined,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      currency: p.currency,
      image: p.images[0],
      variants: p.variants,
    };
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description ?? undefined,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="py-8 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {/* Left: Image carousel */}
            <ImageCarousel images={product.images} alt={name} />

            {/* Right: Product info + order section */}
            <div>
              <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
                {name}
              </h1>

              {/* Pricing */}
              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-accent">{price}</span>
                {comparePrice && (
                  <span className="text-lg text-text-secondary line-through">
                    {comparePrice}
                  </span>
                )}
              </div>
              {savings && (
                <p className="mt-1 text-sm text-success">
                  {tp("save")} {savings}
                </p>
              )}
              {comparePrice && (
                <div className="mt-2 flex gap-2">
                  <Badge variant="accent">{tp("salePrice")}</Badge>
                </div>
              )}

              {/* Description */}
              {description && (
                <p className="mt-6 leading-relaxed text-text-secondary">
                  {description}
                </p>
              )}

              {/* Features */}
              {featureItems.length > 0 && (
                <div className="mt-6">
                  <h2 className="mb-3 text-lg font-semibold text-text-primary">
                    {tp("features")}
                  </h2>
                  <ul className="space-y-1.5">
                    {featureItems.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-text-primary"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-success"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Order section with variant picker, accessories, and checkout */}
              <div className="mt-8">
                <ProductOrderSection
                  product={serializeProduct(product)}
                  requiredAccessories={requiredAccessories.map(serializeProduct)}
                  optionalAccessories={optionalAccessories.map(serializeProduct)}
                  vehicleContext={vehicleContext}
                  locale={typedLocale}
                  formattedPrice={price}
                />
              </div>
            </div>
          </div>

          {/* Below-fold sections */}
          <div className="mt-12 space-y-12">
            {/* Specifications */}
            {hasSpecs && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">
                  {tp("specifications")}
                </h2>
                <SpecTable specs={product.specs} />
              </div>
            )}

            {/* Package contents */}
            {packageItems.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">
                  {tp("packageContents")}
                </h2>
                <PackageList items={packageItems} />
              </div>
            )}

            {/* Compatible vehicles */}
            {compatibleBrands.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">
                  {tp("compatibleVehicles")}
                </h2>
                <CompatibleVehicles brands={compatibleBrands} />
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
