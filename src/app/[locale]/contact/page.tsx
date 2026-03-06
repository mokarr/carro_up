import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { ContactFormFields } from "@/components/home/contact-form";

const BUSINESS_EMAIL = "info@upcarplay.nl";
const BUSINESS_PHONE = "+31 (0)85 060 2850";
const BUSINESS_ADDRESS = "UpCarPlay, Amsterdam, Nederland";

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
  const t = await getTranslations("contact");

  return {
    title: `${t("pageTitle")} | UpCarPlay`,
    description: t("pageSubtitle"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  return (
    <section className="py-12 sm:py-20">
      <Container className="max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 text-text-secondary">{t("pageSubtitle")}</p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-5">
          {/* Business info */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-text-primary">
              {t("businessTitle")}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Email
                  </p>
                  <a
                    href={`mailto:${BUSINESS_EMAIL}`}
                    className="text-sm text-accent hover:underline"
                  >
                    {BUSINESS_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {t("businessPhoneLabel")}
                  </p>
                  <a
                    href={`tel:${BUSINESS_PHONE}`}
                    className="text-sm text-accent hover:underline"
                  >
                    {BUSINESS_PHONE}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-text-secondary">
                    {BUSINESS_ADDRESS}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-text-secondary">
                    {t("businessHours")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <ContactFormFields />
          </div>
        </div>
      </Container>
    </section>
  );
}
