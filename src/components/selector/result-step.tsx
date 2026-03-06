"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import type { VehicleBrand, VehicleModel, VehicleConfiguration } from "@/lib/vehicles";
import type { Product } from "@/lib/products";
import type { Locale } from "@/i18n/config";
import { t as tl } from "@/lib/vehicles";
import { formatPrice } from "@/lib/products";

type ResultStepProps = {
  brand: VehicleBrand;
  model: VehicleModel;
  year: number;
  configuration: VehicleConfiguration;
  products: Product[];
  locale: Locale;
};

export function ResultStep({
  brand,
  model,
  year,
  configuration,
  products,
  locale,
}: ResultStepProps) {
  const t = useTranslations("selector");

  // Build query params for vehicle context
  const vehicleQuery = new URLSearchParams({
    brand: brand.brand,
    model: model.id,
    year: String(year),
    config: configuration.id,
  }).toString();

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
        {t("resultTitle")}
      </h2>
      <p className="text-text-secondary mb-6">
        {t("resultSubtitle")}
      </p>

      {/* Vehicle info badge */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="accent">
          {tl(brand.displayName, locale)} {tl(model.displayName, locale)}{" "}
          {year}
        </Badge>
        <Badge variant="default">
          {tl(configuration.displayName, locale)}
        </Badge>
      </div>

      {/* Configuration notes */}
      {configuration.notes && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-6">
          <p className="text-sm text-warning">
            {tl(configuration.notes, locale)}
          </p>
        </div>
      )}

      {/* Product Cards */}
      <div className="space-y-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}?${vehicleQuery}`}
            className="block bg-background border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-colors group"
          >
            <div className="flex flex-col sm:flex-row">
              {product.images[0] && (
                <div className="relative w-full sm:w-40 aspect-video sm:aspect-square shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={tl(product.name, locale)}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {tl(product.name, locale)}
                    </h3>
                    {product.recommended && (
                      <Badge variant="accent">{t("recommended")}</Badge>
                    )}
                  </div>
                  {product.shortDescription && (
                    <p className="text-sm text-text-secondary mt-1">
                      {tl(product.shortDescription, locale)}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-accent">
                      {formatPrice(product.price, product.currency, locale)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-text-secondary line-through">
                        {formatPrice(
                          product.compareAtPrice,
                          product.currency,
                          locale
                        )}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-accent group-hover:underline">
                    {t("viewProduct")} &rarr;
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Not found link */}
      <div className="mt-8 text-center">
        <p className="text-text-secondary text-sm">
          {t("notFound")}{" "}
          <Link
            href="/contact"
            className="text-accent hover:underline"
          >
            {t("contactUs")}
          </Link>
        </p>
      </div>
    </div>
  );
}
