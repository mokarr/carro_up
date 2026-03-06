import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import type { VehicleBrand, VehicleModel, VehicleConfiguration } from "@/lib/vehicles";
import type { Locale } from "@/i18n/config";
import { t as tl } from "@/lib/vehicles";

type ConfigStepProps = {
  brand: VehicleBrand;
  model: VehicleModel;
  year: number;
  configurations: VehicleConfiguration[];
  locale: Locale;
};

export function ConfigStep({
  brand,
  model,
  year,
  configurations,
  locale,
}: ConfigStepProps) {
  const t = useTranslations("selector");

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
        {t("step3Title")}
      </h2>
      <p className="text-text-secondary mb-6">{t("step3Subtitle")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {configurations.map((config) => (
          <Link
            key={config.id}
            href={`/selecteer/${brand.brand}/${year}/${config.id}`}
            className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:border-accent group"
          >
            <div className="relative w-full aspect-video">
              <Image
                src={config.image}
                alt={tl(config.displayName, locale)}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                {tl(config.displayName, locale)}
              </h3>
              {config.description && (
                <p className="text-sm text-text-secondary mt-1">
                  {tl(config.description, locale)}
                </p>
              )}
              {config.notes && (
                <div className="mt-3">
                  <Badge variant="warning">{tl(config.notes, locale)}</Badge>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
