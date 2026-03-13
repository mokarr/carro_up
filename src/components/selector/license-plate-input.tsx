"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type LicensePlateInputProps = {
  locale: string;
};

export function LicensePlateInput({ locale }: LicensePlateInputProps) {
  const t = useTranslations("selector");
  const router = useRouter();
  const [plate, setPlate] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Only show for Dutch locale
  if (locale !== "nl") return null;

  function formatPlate(value: string): string {
    return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanPlate = formatPlate(plate);
    if (cleanPlate.length < 4) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/kenteken?plate=${encodeURIComponent(cleanPlate)}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        const errorKey =
          data.error === "not_found"
            ? "licensePlateNotFound"
            : data.error === "unsupported"
              ? "licensePlateUnsupported"
              : "licensePlateError";
        setErrorMessage(t(errorKey));
        setStatus("error");
        return;
      }

      // Success — redirect to config step
      setErrorMessage(t("licensePlateFound"));
      router.push(`/selecteer/${data.brand}/${data.year}`);
    } catch {
      setErrorMessage(t("licensePlateError"));
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <p className="text-sm text-dark-text-secondary mb-3 text-center">
        {t("licensePlateSubtitle")}
      </p>

      <form onSubmit={handleSubmit} className="flex items-stretch gap-0">
        {/* NL country badge */}
        <div className="flex items-center justify-center bg-[#003399] text-white rounded-l-lg px-2.5 border-2 border-r-0 border-[#003399]">
          <div className="flex flex-col items-center leading-none">
            <span className="text-[8px] tracking-widest">★★★</span>
            <span className="text-xs font-bold">NL</span>
          </div>
        </div>

        {/* License plate input */}
        <input
          type="text"
          value={plate}
          onChange={(e) => setPlate(formatPlate(e.target.value))}
          placeholder={t("licensePlatePlaceholder")}
          disabled={status === "loading"}
          className="flex-1 min-w-0 bg-[#F7B731] text-[#1a1a1a] text-center text-lg font-bold tracking-wider px-4 py-3 border-2 border-[#F7B731] placeholder:text-[#1a1a1a]/40 placeholder:font-normal placeholder:tracking-normal placeholder:text-base focus:outline-none focus:border-accent transition-colors"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "loading" || formatPlate(plate).length < 4}
          className="bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-semibold px-5 rounded-r-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>

      {/* Error/success message */}
      {errorMessage && (
        <p className={`mt-2 text-sm text-center ${
          errorMessage === t("licensePlateFound") ? "text-success" : "text-error"
        }`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
