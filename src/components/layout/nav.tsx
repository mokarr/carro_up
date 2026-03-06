"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

type NavProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
};

export function Nav({
  className = "",
  orientation = "horizontal",
  onNavigate,
}: NavProps) {
  const t = useTranslations("common");
  const pathname = usePathname();

  const navLinks = [
    { href: "/" as const, labelKey: "home" },
    { href: "/selecteer" as const, labelKey: "selectModel" },
    { href: "/producten" as const, labelKey: "products" },
    { href: "/faq" as const, labelKey: "faq" },
    { href: "/contact" as const, labelKey: "contact" },
    { href: "/voorwaarden" as const, labelKey: "terms" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`flex ${
        orientation === "vertical"
          ? "flex-col gap-1"
          : "items-center gap-6"
      } ${className}`}
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={`text-sm font-medium transition-colors duration-200 ${
            orientation === "vertical" ? "px-3 py-2 rounded-lg" : ""
          } ${
            isActive(link.href)
              ? "text-accent"
              : "text-dark-text-secondary hover:text-dark-text"
          }`}
        >
          {t(link.labelKey)}
        </Link>
      ))}
    </nav>
  );
}
