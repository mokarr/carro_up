"use client";

import { useCart } from "@/components/cart/cart-provider";

export function CartIcon() {
  const { count, openSidebar } = useCart();

  return (
    <button
      onClick={openSidebar}
      className="relative p-2 text-dark-text-secondary hover:text-dark-text transition-colors duration-200 cursor-pointer"
      aria-label="Cart"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
