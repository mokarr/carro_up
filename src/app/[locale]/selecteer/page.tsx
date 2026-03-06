import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";
import { getAllBrands } from "@/lib/vehicles";
import { WizardContainer } from "@/components/selector/wizard-container";
import { BrandStep } from "@/components/selector/brand-step";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === "nl"
      ? "Selecteer je merk | UpCarPlay"
      : locale === "de"
        ? "Wähle deine Marke | UpCarPlay"
        : locale === "fr"
          ? "Sélectionnez votre marque | UpCarPlay"
          : "Select your brand | UpCarPlay";

  const description =
    locale === "nl"
      ? "Vind het juiste CarPlay scherm voor jouw auto"
      : locale === "de"
        ? "Finden Sie den richtigen CarPlay-Bildschirm für Ihr Auto"
        : locale === "fr"
          ? "Trouvez le bon écran CarPlay pour votre voiture"
          : "Find the right CarPlay screen for your car";

  return { title, description };
}

export default async function SelecteerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const brands = await getAllBrands();

  return (
    <WizardContainer currentStep={1}>
      <BrandStep brands={brands} locale={locale as Locale} />
    </WizardContainer>
  );
}
