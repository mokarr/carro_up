import { TranslatedString } from "./vehicles";
import { Locale } from "@/i18n/config";

export interface ProductVariant {
  id: string;
  name: TranslatedString;
  priceModifier: number;
}

export interface Product {
  id: string;
  category: "screen" | "accessory";
  slug: string;
  name: TranslatedString;
  shortDescription?: TranslatedString;
  description?: TranslatedString;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  specs: Record<string, unknown>;
  images: string[];
  packageContents?: Record<string, string[]>;
  features?: Record<string, string[]>;
  recommended?: boolean;
  variants?: ProductVariant[];
  stripeProductId: string;
  stripePriceId: string;
}

// Load all products
export async function getAllProducts(): Promise<Product[]> {
  const products = await Promise.all([
    // VW Up screens (8)
    import("@/data/products/vw-up-screen-pre-facelift-no-garmin.json"),
    import("@/data/products/vw-up-screen-pre-facelift-garmin.json"),
    import("@/data/products/vw-up-screen-facelift-low-holder.json"),
    import("@/data/products/vw-up-screen-facelift-low-no-holder-bt.json"),
    import("@/data/products/vw-up-screen-facelift-low-no-holder-no-bt.json"),
    import("@/data/products/vw-up-screen-facelift-high-holder.json"),
    import("@/data/products/vw-up-screen-facelift-high-no-holder-bt.json"),
    import("@/data/products/vw-up-screen-facelift-high-no-holder-no-bt.json"),
    // Seat Mii screens (8)
    import("@/data/products/seat-mii-screen-pre-facelift-no-garmin.json"),
    import("@/data/products/seat-mii-screen-pre-facelift-garmin.json"),
    import("@/data/products/seat-mii-screen-facelift-low-holder.json"),
    import("@/data/products/seat-mii-screen-facelift-low-no-holder-bt.json"),
    import("@/data/products/seat-mii-screen-facelift-low-no-holder-no-bt.json"),
    import("@/data/products/seat-mii-screen-facelift-high-holder.json"),
    import("@/data/products/seat-mii-screen-facelift-high-no-holder-bt.json"),
    import("@/data/products/seat-mii-screen-facelift-high-no-holder-no-bt.json"),
    // Skoda Citigo screens (8)
    import("@/data/products/skoda-citigo-screen-pre-facelift-no-garmin.json"),
    import("@/data/products/skoda-citigo-screen-pre-facelift-garmin.json"),
    import("@/data/products/skoda-citigo-screen-facelift-low-holder.json"),
    import("@/data/products/skoda-citigo-screen-facelift-low-no-holder-bt.json"),
    import("@/data/products/skoda-citigo-screen-facelift-low-no-holder-no-bt.json"),
    import("@/data/products/skoda-citigo-screen-facelift-high-holder.json"),
    import("@/data/products/skoda-citigo-screen-facelift-high-no-holder-bt.json"),
    import("@/data/products/skoda-citigo-screen-facelift-high-no-holder-no-bt.json"),
    // Accessories (10)
    import("@/data/products/phone-holder-bracket.json"),
    import("@/data/products/microsd-card-64gb.json"),
    import("@/data/products/obd2-scanner.json"),
    import("@/data/products/storage-box.json"),
    import("@/data/products/ice-scraper.json"),
    import("@/data/products/grille-3d.json"),
    import("@/data/products/cold-air-intake.json"),
    import("@/data/products/usb-insert.json"),
    import("@/data/products/build-in-kit-usb.json"),
    import("@/data/products/phone-holder-loose.json"),
  ]);
  return products.map((p) => p.default as Product);
}

// Get product by ID
export async function getProduct(id: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => p.id === id) || null;
}

// Format price from cents to display string
const intlLocaleMap: Record<Locale, string> = {
  nl: "nl-NL",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
};

export function formatPrice(
  cents: number,
  currency: string = "EUR",
  locale: Locale = "nl",
): string {
  return new Intl.NumberFormat(intlLocaleMap[locale], {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
