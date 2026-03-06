"use client";

import { useTranslations } from "next-intl";

type ProgressBarProps = {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
  className?: string;
};

export function ProgressBar({
  currentStep,
  totalSteps = 5,
  labels = [],
  className = "",
}: ProgressBarProps) {
  const t = useTranslations("common");

  return (
    <div className={`w-full ${className}`}>
      <p className="text-sm text-text-secondary mb-4 text-center">
        {t("step")} {currentStep} {t("of")} {totalSteps}
      </p>
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      isCompleted ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors duration-200 ${
                    isCompleted
                      ? "bg-accent text-white"
                      : isCurrent
                        ? "bg-accent text-white ring-2 ring-accent/30"
                        : "bg-card border border-border text-text-secondary"
                  }`}
                >
                  {step}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      isCompleted ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </div>
              {labels[i] && (
                <span className="hidden md:block text-xs text-text-secondary mt-2 text-center">
                  {labels[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
