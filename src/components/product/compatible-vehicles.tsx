"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type CompatibleModel = {
  id: string;
  name: string;
  subtitle: string;
};

type CompatibleBrand = {
  brand: string;
  name: string;
  models: CompatibleModel[];
};

type CompatibleVehiclesProps = {
  brands: CompatibleBrand[];
};

export function CompatibleVehicles({ brands }: CompatibleVehiclesProps) {
  const t = useTranslations("product");
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(
    new Set(brands.map((b) => b.brand))
  );

  if (brands.length === 0) return null;

  function toggleBrand(brand: string) {
    setExpandedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) {
        next.delete(brand);
      } else {
        next.add(brand);
      }
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {brands.map((brand) => {
        const isExpanded = expandedBrands.has(brand.brand);
        return (
          <div
            key={brand.brand}
            className="overflow-hidden rounded-lg border border-border"
          >
            <button
              onClick={() => toggleBrand(brand.brand)}
              aria-expanded={isExpanded}
              aria-controls={`brand-panel-${brand.brand}`}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-card-hover"
            >
              <span className="font-medium text-text-primary">
                {brand.name}
              </span>
              <svg
                className={`h-5 w-5 text-text-secondary transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isExpanded && (
              <div id={`brand-panel-${brand.brand}`} className="border-t border-border">
                {brand.models.map((model) => (
                  <Link
                    key={model.id}
                    href={`/selecteer/${brand.brand}/${model.id}`}
                    className="flex items-center justify-between border-b border-border px-4 py-2.5 text-sm transition-colors last:border-b-0 hover:bg-card-hover"
                  >
                    <div>
                      <span className="text-text-primary">{model.name}</span>
                      {model.subtitle && (
                        <span className="ml-2 text-text-secondary">
                          {model.subtitle}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-accent">
                      {t("checkCompatibility")}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
