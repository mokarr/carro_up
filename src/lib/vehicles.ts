import { Locale } from "@/i18n/config";

// Types
export interface TranslatedString {
  nl: string;
  en: string;
  de?: string;
  fr?: string;
}

export interface VehicleConfiguration {
  id: string;
  displayName: TranslatedString;
  description?: TranslatedString;
  image: string;
  availableYears: number[];
  compatibleProducts: string[];
  requiredAccessories?: string[];
  optionalAccessories?: string[];
  notes: TranslatedString | null;
}

export interface VehicleModel {
  id: string;
  displayName: TranslatedString;
  subtitle?: TranslatedString;
  image: string;
  yearRange: { from: number; to: number };
  configurations: VehicleConfiguration[];
}

export interface VehicleBrand {
  brand: string;
  displayName: TranslatedString;
  logo: string;
  heroImage?: string;
  models: VehicleModel[];
}

// Helper to get translated string for current locale
export function t(str: TranslatedString, locale: Locale): string {
  return str[locale] ?? str.en ?? str.nl;
}

// Load all brands
export async function getAllBrands(): Promise<VehicleBrand[]> {
  const brands = await Promise.all([
    import("@/data/vehicles/volkswagen.json"),
    import("@/data/vehicles/seat.json"),
    import("@/data/vehicles/skoda.json"),
  ]);
  return brands.map((b) => b.default as VehicleBrand);
}

// Get a specific brand
export async function getBrand(brandId: string): Promise<VehicleBrand | null> {
  const brands = await getAllBrands();
  return brands.find((b) => b.brand === brandId) || null;
}

// Get a specific model within a brand
export async function getModel(
  brandId: string,
  modelId: string,
): Promise<VehicleModel | null> {
  const brand = await getBrand(brandId);
  if (!brand) return null;
  return brand.models.find((m) => m.id === modelId) || null;
}

// Get configurations available for a specific year
export function getConfigurationsForYear(
  model: VehicleModel,
  year: number,
): VehicleConfiguration[] {
  return model.configurations.filter((c) => c.availableYears.includes(year));
}

// Get all years for a model
export function getYearsForModel(model: VehicleModel): number[] {
  const years: number[] = [];
  for (let y = model.yearRange.from; y <= model.yearRange.to; y++) {
    years.push(y);
  }
  return years;
}
