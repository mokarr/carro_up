import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/products";
import { t as translate } from "@/lib/vehicles";
import type { Locale } from "@/i18n/config";
import product from "@/data/products/vw-up-screen-facelift-low-holder.json";

export function ProductHighlight() {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  const name = translate(product.name as any, locale);
  const shortDesc = translate(product.shortDescription as any, locale);
  const price = formatPrice(product.price, product.currency, locale);
  const comparePrice = product.compareAtPrice
    ? formatPrice(product.compareAtPrice, product.currency, locale)
    : null;
  const savings = product.compareAtPrice
    ? formatPrice(product.compareAtPrice - product.price, product.currency, locale)
    : null;

  const specs = [
    { labelKey: "specDisplay", value: product.specs.display },
    { labelKey: "specResolution", value: product.specs.resolution },
    { labelKey: "specDashcam", value: product.specs.dashcam },
    { labelKey: "specRAM", value: product.specs.ram },
    { labelKey: "specBrightness", value: product.specs.brightness },
    { labelKey: "specWireless", value: product.specs.wireless },
    { labelKey: "specConnections", value: product.specs.connections },
    { labelKey: "specPower", value: product.specs.power },
  ];

  const slug = product.slug;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product image placeholder */}
            <div className="flex items-center justify-center bg-card p-8 sm:p-12">
              <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border sm:h-64">
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-text-secondary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-text-secondary">UpCarPlay</p>
                </div>
              </div>
            </div>

            {/* Product details */}
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <Badge variant="accent" className="mb-4 self-start">
                {t("salePrice")}
              </Badge>

              <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
                {name}
              </h2>

              <p className="mt-3 text-text-secondary">
                {shortDesc}
              </p>

              {/* Pricing */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-accent">
                  {price}
                </span>
                {comparePrice && (
                  <span className="text-lg text-text-secondary line-through">
                    {comparePrice}
                  </span>
                )}
              </div>
              {savings && (
                <p className="mt-1 text-sm text-success">
                  {t("save")} {savings}
                </p>
              )}

              {/* Specs grid */}
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
                {specs.map((spec) => (
                  <div key={spec.labelKey} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t(spec.labelKey)}</span>
                    <span className="font-medium text-text-primary">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={`/product/${slug}`} variant="secondary" size="md">
                  {t("description")}
                </Button>
                <Button href={`/product/${slug}`} variant="primary" size="md">
                  {tCommon("orderNow")}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
}
