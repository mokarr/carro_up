"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type OrderButtonProps = {
  productId: string;
  accessories?: string[];
  variant?: string;
  locale: string;
  label: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function OrderButton({
  productId,
  accessories,
  variant,
  locale,
  label,
  className,
  size = "lg",
}: OrderButtonProps) {
  const [loading, setLoading] = useState(false);
  const tCommon = useTranslations("common");

  async function handleCheckout() {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          accessories,
          variant,
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
      setLoading(false);
    }
  }

  return (
    <Button
      variant="primary"
      size={size}
      className={className}
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? tCommon("sending") : label}
    </Button>
  );
}
