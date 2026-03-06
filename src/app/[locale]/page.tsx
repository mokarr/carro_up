import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { UspSection } from "@/components/home/usp-section";
import { Transformation } from "@/components/home/transformation";
import { ProductHighlight } from "@/components/home/product-highlight";
import { Reviews } from "@/components/home/reviews";
import { ContactForm } from "@/components/home/contact-form";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <UspSection />
      <Transformation />
      <ProductHighlight />
      <Reviews />
      <ContactForm />
    </>
  );
}
