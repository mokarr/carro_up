import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { VehicleBrand, VehicleModel } from "@/lib/vehicles";
import type { Locale } from "@/i18n/config";
import { t as tl, getYearsForModel } from "@/lib/vehicles";

type YearStepProps = {
  brand: VehicleBrand;
  model: VehicleModel;
  locale: Locale;
};

export function YearStep({ brand, model, locale }: YearStepProps) {
  const t = useTranslations("selector");
  const years = getYearsForModel(model);

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
        {t("step2Title")}
      </h2>
      <p className="text-text-secondary mb-6">
        {tl(brand.displayName, locale)} {tl(model.displayName, locale)}
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {years.map((year) => (
          <Link
            key={year}
            href={`/selecteer/${brand.brand}/${year}`}
            className="bg-card border border-border rounded-lg p-4 text-center font-medium text-text-primary hover:border-accent hover:text-accent hover:scale-[1.02] transition-all duration-200"
          >
            {year}
          </Link>
        ))}
      </div>
    </div>
  );
}
