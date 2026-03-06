"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/products";
import type { Locale } from "@/i18n/config";

export function CartPageContent({ locale }: { locale: Locale }) {
  const { items, total, removeItem, clear } = useCart();
  const t = useTranslations("cart");
  const tc = useTranslations("common");
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

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-20 h-20 mx-auto text-text-secondary/20 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {t("emptyTitle")}
        </h1>
        <p className="text-text-secondary mb-6">{t("emptyMessage")}</p>
        <Button href="/producten" variant="primary" size="lg">
          {t("browseProducts")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
          {t("title")} ({items.length})
        </h1>
        <button
          onClick={clear}
          className="text-sm text-text-secondary hover:text-error transition-colors cursor-pointer"
        >
          {t("clearCart")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const itemTotal =
              item.productPrice +
              item.variantPriceModifier +
              item.accessories.reduce((sum, a) => sum + a.price, 0);

            return (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex gap-4">
                  {item.productImage && (
                    <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          {item.productName}
                        </h3>
                        {item.variantName && (
                          <p className="text-sm text-text-secondary mt-0.5">
                            {item.variantName}
                          </p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-accent shrink-0">
                        {formatPrice(itemTotal, item.currency, locale)}
                      </span>
                    </div>

                    {/* Accessories */}
                    {item.accessories.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
                        {item.accessories.map((acc) => (
                          <div
                            key={acc.id}
                            className="flex items-center justify-between text-sm text-text-secondary"
                          >
                            <span>+ {acc.name}</span>
                            <span>
                              {formatPrice(acc.price, item.currency, locale)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Vehicle context */}
                    {item.vehicleContext && (
                      <p className="text-xs text-text-secondary mt-2">
                        {item.vehicleContext.brand} {item.vehicleContext.model}{" "}
                        {item.vehicleContext.year}
                      </p>
                    )}

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-text-secondary hover:text-error transition-colors mt-3 cursor-pointer"
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              {t("orderSummary")}
            </h2>

            <div className="space-y-2 mb-4">
              {items.map((item) => {
                const itemTotal =
                  item.productPrice +
                  item.variantPriceModifier +
                  item.accessories.reduce((sum, a) => sum + a.price, 0);
                return (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-text-secondary"
                  >
                    <span className="truncate mr-2">{item.productName}</span>
                    <span className="shrink-0">
                      {formatPrice(itemTotal, item.currency, locale)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary">
                  {t("total")}
                </span>
                <span className="text-2xl font-bold text-accent">
                  {formatPrice(total, "EUR", locale)}
                </span>
              </div>
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

            <p className="text-xs text-text-secondary text-center mt-3">
              {tc("freeShipping")}
            </p>

            <div className="mt-4 text-center">
              <Link
                href="/producten"
                className="text-sm text-accent hover:underline"
              >
                {t("continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
