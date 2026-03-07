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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
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

          {/* Social media */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-dark-text">
              {tFooter("followUs")}
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.instagram.com/upcarplay/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-dark-text-secondary hover:text-accent transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@upcarplay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-dark-text-secondary hover:text-accent transition-colors duration-200"
                aria-label="TikTok"
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
                TikTok
              </a>
              <a
                href="https://www.facebook.com/upcarplay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-dark-text-secondary hover:text-accent transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
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
