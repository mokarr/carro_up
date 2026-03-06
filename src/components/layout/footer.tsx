"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";

export function Footer() {
  const t = useTranslations("common");
  const tFooter = useTranslations("footer");

  return (
    <footer className="border-t border-dark-border bg-dark mt-auto">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {/* Logo + description */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-xl font-bold tracking-tight w-fit">
              <span className="text-accent">Up</span>
              <span className="text-white">CarPlay</span>
            </Link>
            <p className="text-sm text-dark-text-secondary max-w-xs">
              {tFooter("description")}
            </p>
          </div>

          {/* Navigation links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-dark-text">
              {t("siteName")}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-dark-text-secondary hover:text-dark-text transition-colors duration-200"
              >
                {t("home")}
              </Link>
              <Link
                href="/selecteer"
                className="text-sm text-dark-text-secondary hover:text-dark-text transition-colors duration-200"
              >
                {t("selectModel")}
              </Link>
              <Link
                href="/producten"
                className="text-sm text-dark-text-secondary hover:text-dark-text transition-colors duration-200"
              >
                {t("products")}
              </Link>
              <Link
                href="/faq"
                className="text-sm text-dark-text-secondary hover:text-dark-text transition-colors duration-200"
              >
                {t("faq")}
              </Link>
              <Link
                href="/contact"
                className="text-sm text-dark-text-secondary hover:text-dark-text transition-colors duration-200"
              >
                {t("contact")}
              </Link>
              <Link
                href="/voorwaarden"
                className="text-sm text-dark-text-secondary hover:text-dark-text transition-colors duration-200"
              >
                {t("terms")}
              </Link>
            </nav>
          </div>

          {/* Badges */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
              <svg
                className="w-5 h-5 text-success shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              {tFooter("securePayment")}
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
              <svg
                className="w-5 h-5 text-success shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {tFooter("shipping")}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-dark-border py-6">
          <p className="text-xs text-dark-text-secondary text-center">
            &copy; 2026 {t("siteName")}. {tFooter("rights")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
