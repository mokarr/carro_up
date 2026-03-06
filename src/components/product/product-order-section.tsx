"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import type { ProductVariant } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import type { Locale } from "@/i18n/config";

type SerializedProduct = {
  id: string;
  name: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  image?: string;
  variants?: ProductVariant[];
};

type VehicleContext = {
  brandName: string;
  modelName: string;
  year: number;
  configName?: string;
  configId: string;
  modelId: string;
};

type ProductOrderSectionProps = {
  product: SerializedProduct;
  requiredAccessories: SerializedProduct[];
  optionalAccessories: SerializedProduct[];
  vehicleContext: VehicleContext | null;
  locale: Locale;
  formattedPrice: string;
};

export function ProductOrderSection({
  product,
  requiredAccessories,
  optionalAccessories,
  vehicleContext,
  locale,
}: ProductOrderSectionProps) {
  const tSelector = useTranslations("selector");
  const tCommon = useTranslations("common");
  const tCart = useTranslations("cart");
  const { items: cartItems, addItem } = useCart();

  // State: checkout loading
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // State: selected variant (startup logo)
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants?.[0]?.id ?? ""
  );

  // State: selected optional accessories
  const [selectedOptionalIds, setSelectedOptionalIds] = useState<Set<string>>(new Set());

  // State: add to cart feedback
  const [addedToCart, setAddedToCart] = useState(false);

  function toggleOptionalAccessory(id: string) {
    setSelectedOptionalIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // Calculate variant price modifier
  const variantModifier = useMemo(() => {
    if (!product.variants) return 0;
    const variant = product.variants.find((v) => v.id === selectedVariantId);
    return variant?.priceModifier ?? 0;
  }, [product.variants, selectedVariantId]);

  // Selected variant name
  const selectedVariantName = useMemo(() => {
    if (!product.variants) return undefined;
    const variant = product.variants.find((v) => v.id === selectedVariantId);
    return variant ? (variant.name[locale] ?? variant.name.nl) : undefined;
  }, [product.variants, selectedVariantId, locale]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    const productPrice = product.price + variantModifier;
    const requiredTotal = requiredAccessories.reduce((sum, acc) => sum + acc.price, 0);
    const optionalTotal = optionalAccessories
      .filter((acc) => selectedOptionalIds.has(acc.id))
      .reduce((sum, acc) => sum + acc.price, 0);
    return productPrice + requiredTotal + optionalTotal;
  }, [product.price, variantModifier, requiredAccessories, optionalAccessories, selectedOptionalIds]);

  // All accessories for checkout
  const allAccessories = useMemo(() => {
    const required = requiredAccessories.map((a) => ({
      id: a.id,
      name: a.name,
      price: a.price,
    }));
    const optional = optionalAccessories
      .filter((a) => selectedOptionalIds.has(a.id))
      .map((a) => ({
        id: a.id,
        name: a.name,
        price: a.price,
      }));
    return [...required, ...optional];
  }, [requiredAccessories, optionalAccessories, selectedOptionalIds]);

  const allAccessoryIds = allAccessories.map((a) => a.id);

  const hasAccessoriesOrVariants =
    requiredAccessories.length > 0 ||
    optionalAccessories.length > 0 ||
    (product.variants && product.variants.length > 0);

  function handleAddToCart() {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      productPrice: product.price,
      currency: product.currency,
      variantId: selectedVariantId || undefined,
      variantName: selectedVariantName,
      variantPriceModifier: variantModifier,
      accessories: allAccessories,
      vehicleContext: vehicleContext
        ? {
            brand: vehicleContext.brandName,
            model: vehicleContext.modelName,
            year: vehicleContext.year,
            config: vehicleContext.configId,
          }
        : undefined,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  async function handleDirectOrder() {
    setCheckoutLoading(true);
    try {
      // Build items array: current product + existing cart items
      const currentProductItem = {
        productId: product.id,
        variant: selectedVariantId || undefined,
        accessories: allAccessoryIds.length > 0 ? allAccessoryIds : undefined,
      };

      const existingCartItems = cartItems.map((item) => ({
        productId: item.productId,
        variant: item.variantId || undefined,
        accessories:
          item.accessories.length > 0
            ? item.accessories.map((a) => a.id)
            : undefined,
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [currentProductItem, ...existingCartItems],
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Vehicle context badge */}
      {vehicleContext && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">
            {vehicleContext.brandName} {vehicleContext.modelName} {vehicleContext.year}
          </Badge>
          {vehicleContext.configName && (
            <Badge variant="default">{vehicleContext.configName}</Badge>
          )}
        </div>
      )}

      {/* Variant Picker (startup logos) */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <label className="text-sm font-medium text-text-primary block mb-2">
            {tSelector("chooseVariant")}
          </label>
          <div className="space-y-2">
            {product.variants.map((variant) => (
              <label
                key={variant.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedVariantId === variant.id
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name="variant"
                  value={variant.id}
                  checked={selectedVariantId === variant.id}
                  onChange={() => setSelectedVariantId(variant.id)}
                  className="accent-accent"
                />
                <span className="text-sm text-text-primary">
                  {variant.name[locale] ?? variant.name.nl}
                </span>
                {variant.priceModifier !== 0 && (
                  <span className="text-sm text-text-secondary ml-auto">
                    {variant.priceModifier > 0 ? "+" : ""}
                    {formatPrice(variant.priceModifier, product.currency, locale)}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Required Accessories */}
      {requiredAccessories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            {tSelector("requiredAccessory")}
          </h3>
          <div className="space-y-3">
            {requiredAccessories.map((accessory) => (
              <div
                key={accessory.id}
                className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
              >
                {accessory.image && (
                  <div className="relative w-14 h-14 shrink-0">
                    <Image
                      src={accessory.image}
                      alt={accessory.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary text-sm">
                    {accessory.name}
                  </h4>
                  {accessory.shortDescription && (
                    <p className="text-xs text-text-secondary">
                      {accessory.shortDescription}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="font-semibold text-text-primary text-sm">
                    {formatPrice(accessory.price, accessory.currency, locale)}
                  </span>
                  <span className="block text-xs text-text-secondary">
                    {tSelector("included")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Accessories */}
      {optionalAccessories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            {tSelector("optionalAccessories")}
          </h3>
          <div className="space-y-3">
            {optionalAccessories.map((accessory) => (
              <label
                key={accessory.id}
                className={`block bg-card border rounded-xl p-4 cursor-pointer transition-colors ${
                  selectedOptionalIds.has(accessory.id)
                    ? "border-accent ring-1 ring-accent"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedOptionalIds.has(accessory.id)}
                    onChange={() => toggleOptionalAccessory(accessory.id)}
                    className="accent-accent w-4 h-4 shrink-0"
                  />
                  {accessory.image && (
                    <div className="relative w-12 h-12 shrink-0">
                      <Image
                        src={accessory.image}
                        alt={accessory.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text-primary text-sm">
                      {accessory.name}
                    </h4>
                    {accessory.shortDescription && (
                      <p className="text-xs text-text-secondary">
                        {accessory.shortDescription}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-semibold text-text-primary text-sm">
                      + {formatPrice(accessory.price, accessory.currency, locale)}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Total & Order */}
      <div className="bg-card border border-border rounded-xl p-6">
        {hasAccessoriesOrVariants && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-text-primary">
              {tCommon("price")}
            </span>
            <span className="text-2xl font-bold text-accent">
              {formatPrice(totalPrice, product.currency, locale)}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* Add to Cart */}
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
          >
            {addedToCart ? tCart("added") : tCommon("addToCart")}
          </Button>

          {/* Direct Order — includes cart items */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleDirectOrder}
            disabled={checkoutLoading}
          >
            {checkoutLoading
              ? tCommon("sending")
              : hasAccessoriesOrVariants
                ? `${tCommon("orderNow")} — ${formatPrice(totalPrice, product.currency, locale)}`
                : `${tCommon("orderNow")} — ${formatPrice(product.price, product.currency, locale)}`}
          </Button>
        </div>
      </div>

      <p className="text-xs text-text-secondary text-center">
        {tCommon("freeShipping")}
      </p>
    </div>
  );
}
