import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getAllBrands } from "@/lib/vehicles";
import { getAllProducts } from "@/lib/products";
import { getLocalizedUrl } from "@/lib/seo";

/**
 * Build alternate languages map for a path that is the same across locales.
 */
function alternatesForPath(path: string): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = getLocalizedUrl(locale, path);
  }
  languages["x-default"] = getLocalizedUrl("nl", path);
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const brands = await getAllBrands();
  const products = await getAllProducts();
  const entries: MetadataRoute.Sitemap = [];

  // --- Static pages ---
  const staticPages = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1.0 },
    { path: "/selecteer", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/producten", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/faq", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/voorwaarden", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  for (const page of staticPages) {
    entries.push({
      url: getLocalizedUrl("nl", page.path),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: alternatesForPath(page.path),
    });
  }

  // --- Product pages ---
  for (const product of products) {
    const productPath = `/product/${product.slug}`;

    entries.push({
      url: getLocalizedUrl("nl", productPath),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: alternatesForPath(productPath),
    });
  }

  // --- Wizard brand pages ---
  for (const brand of brands) {
    const brandPath = `/selecteer/${brand.brand}`;

    entries.push({
      url: getLocalizedUrl("nl", brandPath),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: alternatesForPath(brandPath),
    });

    // --- Wizard brand + model pages ---
    for (const model of brand.models) {
      const modelPath = `/selecteer/${brand.brand}/${model.id}`;

      entries.push({
        url: getLocalizedUrl("nl", modelPath),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: alternatesForPath(modelPath),
      });
    }
  }

  return entries;
}
