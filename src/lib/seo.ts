import type { Locale } from "@/i18n/config";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://upcarplay.nl";

/**
 * Generate Organization JSON-LD structured data.
 */
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UpCarPlay",
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    description:
      "Specialist in CarPlay schermen voor Volkswagen Up, SEAT Mii en Skoda Citigo",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Dutch", "English", "German", "French"],
      url: `${BASE_URL}/contact`,
    },
  };
}

/**
 * Build a full URL for a given locale and path.
 * The default locale (nl) has no prefix; others get /{locale} prefix.
 */
export function getLocalizedUrl(locale: Locale, path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === "nl") {
    return `${BASE_URL}${cleanPath}`;
  }
  return `${BASE_URL}/${locale}${cleanPath}`;
}
