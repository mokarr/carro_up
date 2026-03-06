import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/products";
import { getStripe } from "@/lib/stripe";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";

// This page must be dynamic — it retrieves the Stripe session at render time
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("order");

  return {
    title: t("successTitle"),
    description: t("successMessage"),
    robots: { index: false, follow: false },
  };
}

type LineItem = {
  description: string;
  quantity: number;
  amount: number;
  currency: string;
};

async function getOrderDetails(
  sessionId: string,
): Promise<{ lineItems: LineItem[]; total: number; currency: string } | null> {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.payment_status !== "paid") {
      return null;
    }

    const items = session.line_items?.data ?? [];
    const lineItems: LineItem[] = items.map((item) => ({
      description: item.description ?? "",
      quantity: item.quantity ?? 1,
      amount: item.amount_total ?? 0,
      currency: item.currency ?? "eur",
    }));

    return {
      lineItems,
      total: session.amount_total ?? 0,
      currency: session.currency ?? "eur",
    };
  } catch {
    return null;
  }
}

export default async function OrderSuccessPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { session_id: sessionId } = await searchParams;
  setRequestLocale(locale);

  const tOrder = await getTranslations("order");

  const orderDetails = sessionId ? await getOrderDetails(sessionId) : null;

  return (
    <section className="py-12 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          {/* Success icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <svg
              className="h-8 w-8 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {tOrder("successTitle")}
          </h1>

          <p className="mt-4 text-text-secondary">
            {tOrder("successMessage")}
          </p>

          {/* Order summary */}
          {orderDetails && (
            <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">
                {tOrder("orderSummary")}
              </h2>
              <ul className="divide-y divide-border">
                {orderDetails.lineItems.map((item, index) => (
                  <li
                    key={`${item.description}-${index}`}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="text-sm text-text-primary">
                      {item.quantity > 1 ? `${item.quantity}\u00D7 ` : ""}
                      {item.description}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {formatPrice(
                        item.amount,
                        item.currency,
                        locale as Locale,
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold text-text-primary">
                  {tOrder("total")}
                </span>
                <span className="text-lg font-bold text-text-primary">
                  {formatPrice(
                    orderDetails.total,
                    orderDetails.currency,
                    locale as Locale,
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-text-secondary">
              {tOrder("emailNotice")}
            </p>
          </div>

          <div className="mt-8">
            <Button href="/" variant="primary" size="lg">
              {tOrder("backToHome")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
