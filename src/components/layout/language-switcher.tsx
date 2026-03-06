"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { locales, type Locale } from "@/i18n/config";

const localeLabels: Record<Locale, string> = {
  nl: "NL",
  en: "EN",
  de: "DE",
  fr: "FR",
};

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(nextLocale: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-dark-border px-3 py-1.5 text-sm font-medium text-dark-text-secondary hover:text-dark-text hover:border-accent transition-colors duration-200 cursor-pointer"
        aria-label={t("language")}
      >
        {localeLabels[locale]}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 rounded-lg border border-dark-border bg-dark-lighter py-1 shadow-xl z-50 min-w-[80px]">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`w-full px-4 py-1.5 text-left text-sm transition-colors duration-200 cursor-pointer ${
                l === locale
                  ? "text-accent font-medium"
                  : "text-dark-text-secondary hover:text-dark-text hover:bg-dark"
              }`}
            >
              {localeLabels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
