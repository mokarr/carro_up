import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";

export function Transformation() {
  const t = useTranslations("home");

  return (
    <section className="py-16 sm:py-20 bg-card">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {t("transformTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            {t("transformSubtitle")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Before */}
          <div className="flex flex-col items-center">
            <div className="flex h-56 w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-background sm:h-64">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                <p className="mt-2 text-sm text-text-secondary">{t("transformBefore")}</p>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="flex flex-col items-center">
            <div className="flex h-56 w-full items-center justify-center rounded-xl border-2 border-accent/30 bg-background sm:h-64">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                <p className="mt-2 text-sm text-accent">{t("transformAfter")}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
