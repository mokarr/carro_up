import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";
import {
  getAllBrands,
  getBrand,
  getConfigurationsForYear,
  t as tl,
} from "@/lib/vehicles";
import { getProduct } from "@/lib/products";
import { WizardContainer } from "@/components/selector/wizard-container";
import { YearStep } from "@/components/selector/year-step";
import { ConfigStep } from "@/components/selector/config-step";
import { ResultStep } from "@/components/selector/result-step";

type PageParams = {
  locale: string;
  steps: string[];
};

export async function generateStaticParams() {
  const brands = await getAllBrands();
  const params: { locale: string; steps: string[] }[] = [];

  for (const locale of locales) {
    for (const brand of brands) {
      // Each brand has exactly 1 model — auto-selected
      const model = brand.models[0];
      if (!model) continue;

      // Step 2: brand selected → year selection
      params.push({ locale, steps: [brand.brand] });

      for (
        let year = model.yearRange.from;
        year <= model.yearRange.to;
        year++
      ) {
        // Step 3: year selected → config selection
        params.push({
          locale,
          steps: [brand.brand, String(year)],
        });

        const configs = getConfigurationsForYear(model, year);
        for (const config of configs) {
          // Step 4: config selected → result
          params.push({
            locale,
            steps: [brand.brand, String(year), config.id],
          });
        }
      }
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, steps } = await params;
  const loc = locale as Locale;

  const brandId = steps[0];
  const yearStr = steps[1];
  const configId = steps[2];

  const brand = await getBrand(brandId);
  if (!brand) return { title: "UpCarPlay" };

  const brandName = tl(brand.displayName, loc);
  const model = brand.models[0];
  const modelName = model ? tl(model.displayName, loc) : "";

  // Step 2: brand selected → year selection
  if (!yearStr) {
    return {
      title: `${brandName} ${modelName} — ${loc === "nl" ? "Selecteer bouwjaar" : loc === "de" ? "Baujahr auswählen" : loc === "fr" ? "Sélectionnez l'année" : "Select build year"} | UpCarPlay`,
    };
  }

  const year = parseInt(yearStr, 10);

  // Step 3: year selected → config selection
  if (!configId) {
    return {
      title: `${brandName} ${modelName} ${year} — ${loc === "nl" ? "Selecteer configuratie" : loc === "de" ? "Konfiguration auswählen" : loc === "fr" ? "Sélectionnez la configuration" : "Select configuration"} | UpCarPlay`,
    };
  }

  // Step 4: result
  return {
    title: `${brandName} ${modelName} ${year} — ${loc === "nl" ? "Jouw CarPlay scherm" : loc === "de" ? "Dein CarPlay-Bildschirm" : loc === "fr" ? "Votre écran CarPlay" : "Your CarPlay screen"} | UpCarPlay`,
  };
}

export default async function StepsPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale, steps } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const brandId = steps[0];
  const yearStr = steps[1];
  const configId = steps[2];

  // Validate brand
  const brand = await getBrand(brandId);
  if (!brand) notFound();

  // Each brand has exactly 1 model — auto-select it
  const model = brand.models[0];
  if (!model) notFound();

  // Step 2: show years for the brand's single model
  if (!yearStr) {
    return (
      <WizardContainer currentStep={2} backHref="/selecteer">
        <YearStep brand={brand} model={model} locale={loc} />
      </WizardContainer>
    );
  }

  // Validate year
  const year = parseInt(yearStr, 10);
  if (
    isNaN(year) ||
    year < model.yearRange.from ||
    year > model.yearRange.to
  ) {
    notFound();
  }

  // Step 3: show configurations for year
  if (!configId) {
    const configurations = getConfigurationsForYear(model, year);
    if (configurations.length === 0) notFound();

    return (
      <WizardContainer
        currentStep={3}
        backHref={`/selecteer/${brandId}`}
      >
        <ConfigStep
          brand={brand}
          model={model}
          year={year}
          configurations={configurations}
          locale={loc}
        />
      </WizardContainer>
    );
  }

  // Validate configuration
  const configurations = getConfigurationsForYear(model, year);
  const configuration = configurations.find((c) => c.id === configId);
  if (!configuration) notFound();

  // Step 4: show result
  if (configuration.compatibleProducts.length === 0) notFound();

  const allProducts = await Promise.all(
    configuration.compatibleProducts.map((pid) => getProduct(pid)),
  );
  const validProducts = allProducts.filter(
    (p): p is NonNullable<typeof p> => p !== null,
  );
  if (validProducts.length === 0) notFound();

  return (
    <WizardContainer
      currentStep={4}
      backHref={`/selecteer/${brandId}/${year}`}
    >
      <ResultStep
        brand={brand}
        model={model}
        year={year}
        configuration={configuration}
        products={validProducts}
        locale={loc}
      />
    </WizardContainer>
  );
}
