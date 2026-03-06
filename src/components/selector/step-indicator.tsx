"use client";

import { useTranslations } from "next-intl";

const STEP_SHORT_LABEL_KEYS = [
  "stepBrand",
  "stepYear",
  "stepConfig",
  "stepResult",
] as const;

type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
  className?: string;
};

export function StepIndicator({
  currentStep,
  totalSteps = 4,
  className = "",
}: StepIndicatorProps) {
  const tSelector = useTranslations("selector");

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-start">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              {/* Connecting line (before circle) */}
              {i > 0 && (
                <div
                  className={`absolute top-3 right-1/2 w-full h-px ${
                    isCompleted || isCurrent ? "bg-accent/40" : "bg-border"
                  }`}
                />
              )}

              {/* Step circle */}
              <div
                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                  isCompleted
                    ? "bg-success/10 text-success"
                    : isCurrent
                      ? "bg-accent text-white shadow-sm shadow-accent/25"
                      : "bg-background border border-border text-text-secondary/60"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1.5 text-center leading-tight ${
                  isCurrent
                    ? "text-accent font-medium"
                    : isCompleted
                      ? "text-text-secondary"
                      : "text-text-secondary/50"
                }`}
              >
                {tSelector(STEP_SHORT_LABEL_KEYS[i])}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
