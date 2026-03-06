import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const tOrder = await getTranslations("order");

  return {
    title: tOrder("cancelledTitle"),
    description: tOrder("cancelledMessage"),
    robots: { index: false, follow: false },
  };
}

export default async function OrderCancelledPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tOrder = await getTranslations("order");

  return (
    <section className="py-12 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          {/* Cancel icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <svg
              className="h-8 w-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {tOrder("cancelledTitle")}
          </h1>

          <p className="mt-4 text-text-secondary">
            {tOrder("cancelledMessage")}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href="/" variant="primary" size="lg">
              {tOrder("backToHome")}
            </Button>
            <Button href="/selecteer" variant="secondary" size="lg">
              {tOrder("backToProducts")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
