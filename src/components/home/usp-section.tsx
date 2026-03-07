import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

function WifiIcon() {
  return (
    <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
    </svg>
  );
}

function DashcamIcon() {
  return (
    <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ScreenIcon() {
  return (
    <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

const usps = [
  { titleKey: "uspWireless", descKey: "uspWirelessDesc", Icon: WifiIcon },
  { titleKey: "uspMusic", descKey: "uspMusicDesc", Icon: DashcamIcon },
  { titleKey: "uspNav", descKey: "uspNavDesc", Icon: PlugIcon },
  { titleKey: "uspInstall", descKey: "uspInstallDesc", Icon: ScreenIcon },
] as const;

export function UspSection() {
  const t = useTranslations("home");

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map(({ titleKey, descKey, Icon }) => (
            <Card key={titleKey} className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <Icon />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t(titleKey)}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                {t(descKey)}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
