"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/products";
import type { Locale } from "@/i18n/config";

type SerializedProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  image: string | null;
  category: "screen" | "accessory";
  recommended: boolean;
};

type SortOption = "recommended" | "price-asc" | "price-desc";
type FilterOption = "all" | "screen" | "accessory";

export function ProductGrid({
  products,
  locale,
}: {
  products: SerializedProduct[];
  locale: Locale;
}) {
  const t = useTranslations("products");
  const tSelector = useTranslations("selector");

  const [filter, setFilter] = useState<FilterOption>("all");
  const [sort, setSort] = useState<SortOption>("recommended");

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Filter
    if (filter !== "all") {
      result = result.filter((p) => p.category === filter);
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "recommended":
        result.sort((a, b) => {
          if (a.recommended && !b.recommended) return -1;
          if (!a.recommended && b.recommended) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [products, filter, sort]);

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: "all", label: t("filterAll") },
    { value: "screen", label: t("filterScreens") },
    { value: "accessory", label: t("filterAccessories") },
  ];

  return (
    <div>
      {/* Filter & Sort bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Filter tabs */}
        <div className="flex gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                filter === option.value
                  ? "bg-accent text-white"
                  : "bg-card border border-border text-text-secondary hover:text-text-primary hover:border-accent/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary cursor-pointer"
        >
          <option value="recommended">{t("sortRecommended")}</option>
          <option value="price-asc">{t("sortPriceAsc")}</option>
          <option value="price-desc">{t("sortPriceDesc")}</option>
        </select>
      </div>

      {/* Product count */}
      <p className="text-sm text-text-secondary mb-4">
        {t("productCount", { count: filteredAndSorted.length })}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSorted.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-colors"
          >
            {/* Image */}
            <div className="relative aspect-video bg-background">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-secondary/30">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-1.5">
                {product.recommended && (
                  <Badge variant="accent">{tSelector("recommended")}</Badge>
                )}
                {product.compareAtPrice && (
                  <Badge variant="accent">
                    {t("sale")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-1">
                {product.name}
              </h3>
              {product.shortDescription && (
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                  {product.shortDescription}
                </p>
              )}
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-lg font-bold text-accent">
                  {formatPrice(product.price, product.currency, locale)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-text-secondary line-through">
                    {formatPrice(product.compareAtPrice, product.currency, locale)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {filteredAndSorted.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">{t("noProducts")}</p>
        </div>
      )}
    </div>
  );
}
