import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n/config";
import { Container } from "@/components/ui/container";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");

  return {
    title: `${t("title")} | UpCarPlay`,
    description: t("introText").slice(0, 160),
  };
}

const SECTIONS = [
  { titleKey: "introTitle", textKey: "introText" },
  { titleKey: "definitionsTitle", textKey: "definitionsText" },
  { titleKey: "ordersTitle", textKey: "ordersText" },
  { titleKey: "shippingTitle", textKey: "shippingText" },
  { titleKey: "returnsTitle", textKey: "returnsText" },
  { titleKey: "warrantyTitle", textKey: "warrantyText" },
  { titleKey: "liabilityTitle", textKey: "liabilityText" },
  { titleKey: "privacyTitle", textKey: "privacyText" },
  { titleKey: "amendmentsTitle", textKey: "amendmentsText" },
  { titleKey: "contactTitle", textKey: "contactText" },
] as const;

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("terms");

  return (
    <section className="py-12 sm:py-20">
      <Container className="max-w-3xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">{t("lastUpdated")}</p>
        </div>

        <div className="mt-10 flex flex-col gap-8">
          {SECTIONS.map((section) => (
            <div key={section.titleKey}>
              <h2 className="text-lg font-semibold text-text-primary">
                {t(section.titleKey)}
              </h2>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {t(section.textKey)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
