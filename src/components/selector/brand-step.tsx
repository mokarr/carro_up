import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { VehicleBrand } from "@/lib/vehicles";
import type { Locale } from "@/i18n/config";
import { t as tl } from "@/lib/vehicles";
import { LicensePlateInput } from "@/components/selector/license-plate-input";

type BrandStepProps = {
  brands: VehicleBrand[];
  locale: Locale;
};

export function BrandStep({ brands, locale }: BrandStepProps) {
  const t = useTranslations("selector");

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
        {t("step1Title")}
      </h2>
      <p className="text-text-secondary mb-6">{t("subtitle")}</p>

      {/* License plate lookup (NL only) */}
      {locale === "nl" && (
        <div className="mb-8">
          <LicensePlateInput locale={locale} />
          <div className="flex items-center gap-4 mt-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-text-secondary">{t("licensePlateOr")}</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <Link
            key={brand.brand}
            href={`/selecteer/${brand.brand}`}
            className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:border-accent group"
          >
            <div className="flex flex-col items-center justify-center p-8">
              <div className="relative w-20 h-20 mb-4">
                <img
                  src={brand.logo}
                  alt={tl(brand.displayName, locale)}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                {tl(brand.displayName, locale)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
