"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { StepIndicator } from "./step-indicator";

type WizardContainerProps = {
  currentStep: number;
  children: React.ReactNode;
  backHref?: string;
};

export function WizardContainer({
  currentStep,
  children,
  backHref,
}: WizardContainerProps) {
  const t = useTranslations("common");
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        <StepIndicator currentStep={currentStep} className="mb-8" />

        {backHref && (
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors mb-6 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t("backButton")}
          </button>
        )}

        <div className="animate-in fade-in duration-300">{children}</div>
      </div>
    </div>
  );
}
