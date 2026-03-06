"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { Nav } from "./nav";
import { LanguageSwitcher } from "./language-switcher";
import { CartIcon } from "@/components/cart/cart-icon";

export function Header() {
  const t = useTranslations("common");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-dark-border">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-accent">Up</span>
            <span className="text-white">CarPlay</span>
          </Link>

          {/* Desktop Navigation */}
          <Nav className="hidden md:flex" />

          {/* Right side: Cart + Language Switcher + Mobile menu button */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden sm:block" />
            <CartIcon />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-dark-text-secondary hover:text-dark-text transition-colors duration-200 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-dark-border bg-dark">
          <Container>
            <div className="py-4 flex flex-col gap-4">
              <Nav
                orientation="vertical"
                onNavigate={() => setMobileMenuOpen(false)}
              />
              <LanguageSwitcher className="sm:hidden" />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
