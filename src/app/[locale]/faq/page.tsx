import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Accordion } from "@/components/faq/accordion";

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
  const t = await getTranslations("faq");

  return {
    title: `${t("title")} | UpCarPlay`,
    description: t("subtitle"),
  };
}

const FAQ_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"] as const;

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("faq");

  const faqItems = FAQ_KEYS.map((key) => ({
    question: t(`q${key}`),
    answer: t(`a${key}`),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="py-12 sm:py-20">
        <Container className="max-w-3xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-text-secondary">{t("subtitle")}</p>
          </div>

          <div className="mt-10">
            <Accordion items={faqItems} />
          </div>
        </Container>
      </section>
    </>
  );
}
