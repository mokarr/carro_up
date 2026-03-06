import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct, type Product } from "@/lib/products";
import { t } from "@/lib/vehicles";
import type { Locale } from "@/i18n/config";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

function buildLineItem(
  product: Product,
  locale: Locale,
  variantLabel?: string,
): Stripe.Checkout.SessionCreateParams.LineItem {
  let name = t(product.name, locale);
  if (variantLabel) {
    name = `${name} — ${variantLabel}`;
  }

  // Use existing Stripe price if configured, otherwise use inline price_data
  if (product.stripePriceId) {
    return {
      price: product.stripePriceId,
      quantity: 1,
    };
  }

  return {
    price_data: {
      currency: product.currency.toLowerCase(),
      product_data: {
        name,
        ...(product.shortDescription
          ? { description: t(product.shortDescription, locale) }
          : {}),
        ...(product.images.length > 0
          ? {
              images: product.images
                .filter((img) => img.startsWith("http"))
                .slice(0, 8),
            }
          : {}),
      },
      unit_amount: product.price,
    },
    quantity: 1,
  };
}

// Process a single product with optional variant and accessories
async function processProduct(
  productId: string,
  locale: Locale,
  variant?: string,
  accessories?: string[],
): Promise<{
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  variantLabel?: string;
}> {
  const product = await getProduct(productId);
  if (!product) throw new Error(`Product not found: ${productId}`);

  let variantLabel: string | undefined;
  let priceModifier = 0;
  if (variant && product.variants) {
    const selectedVariant = product.variants.find((v) => v.id === variant);
    if (selectedVariant) {
      variantLabel = t(selectedVariant.name, locale);
      priceModifier = selectedVariant.priceModifier;
    }
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    buildLineItem(
      priceModifier !== 0
        ? { ...product, price: product.price + priceModifier }
        : product,
      locale,
      variantLabel,
    ),
  ];

  if (accessories && accessories.length > 0) {
    for (const accId of accessories) {
      const accessory = await getProduct(accId);
      if (accessory) {
        lineItems.push(buildLineItem(accessory, locale));
      }
    }
  }

  return { lineItems, variantLabel };
}

type CartBody = {
  items: {
    productId: string;
    variant?: string;
    accessories?: string[];
  }[];
  locale?: Locale;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale: Locale = body.locale || "nl";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const allLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const metadata: Record<string, string> = { locale };

    const cartBody = body as CartBody;

    if (!cartBody.items || !Array.isArray(cartBody.items) || cartBody.items.length === 0) {
      return NextResponse.json(
        { error: "items array is required" },
        { status: 400 },
      );
    }

    for (const item of cartBody.items) {
      const { lineItems } = await processProduct(
        item.productId,
        locale,
        item.variant,
        item.accessories,
      );
      allLineItems.push(...lineItems);
    }

    metadata.productIds = cartBody.items.map((i) => i.productId).join(",");

    if (allLineItems.length === 0) {
      return NextResponse.json(
        { error: "No valid products" },
        { status: 400 },
      );
    }

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: allLineItems,
      success_url: `${siteUrl}/${locale}/bestelling/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${locale}/bestelling/geannuleerd`,
      metadata,
      shipping_address_collection: {
        allowed_countries: [
          "NL",
          "BE",
          "DE",
          "FR",
          "AT",
          "IT",
          "ES",
          "GB",
          "US",
        ],
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
