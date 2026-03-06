"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/products";
import type { Locale } from "@/i18n/config";
import { useState } from "react";

export function CartSidebar() {
  const { items, total, sidebarOpen, closeSidebar, removeItem, clear } = useCart();
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variant: item.variantId,
            accessories: item.accessories.map((a) => a.id),
          })),
          locale,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
    }
  }

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            {t("title")} ({items.length})
          </h2>
          <button
            onClick={closeSidebar}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-text-secondary/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <p className="text-text-secondary">{t("empty")}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={closeSidebar}
              >
                {t("continueShopping")}
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const itemTotal =
                item.productPrice +
                item.variantPriceModifier +
                item.accessories.reduce((sum, a) => sum + a.price, 0);

              return (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex gap-3">
                    {item.productImage && (
                      <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text-primary text-sm truncate">
                        {item.productName}
                      </h3>
                      {item.variantName && (
                        <p className="text-xs text-text-secondary mt-0.5">
                          {item.variantName}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-accent mt-1">
                        {formatPrice(itemTotal, item.currency, locale)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-text-secondary hover:text-error transition-colors shrink-0 cursor-pointer"
                      aria-label={t("remove")}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Accessories sub-items */}
                  {item.accessories.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                      {item.accessories.map((acc) => (
                        <div key={acc.id} className="flex items-center justify-between text-xs text-text-secondary">
                          <span>+ {acc.name}</span>
                          <span>{formatPrice(acc.price, item.currency, locale)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-primary">{t("total")}</span>
              <span className="text-xl font-bold text-accent">
                {formatPrice(total, "EUR", locale)}
              </span>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? tc("sending") : t("checkout")}
            </Button>
            <div className="flex items-center justify-between">
              <button
                onClick={() => { clear(); }}
                className="text-xs text-text-secondary hover:text-error transition-colors cursor-pointer"
              >
                {t("clearCart")}
              </button>
              <Link
                href="/winkelwagen"
                onClick={closeSidebar}
                className="text-xs text-accent hover:underline"
              >
                {t("viewCart")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
