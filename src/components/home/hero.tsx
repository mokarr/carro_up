import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36 bg-dark">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent" />

      <Container className="relative text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
            {t("heroTitleHighlight")}
          </span>
          <br />
          <span className="mt-2 block">{t("heroTitleLine1")}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-dark-text-secondary sm:text-xl">
          {t("heroSubtitle")}
        </p>

        <div className="mt-10">
          <Button href="/selecteer" size="lg">
            {t("heroCta")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
