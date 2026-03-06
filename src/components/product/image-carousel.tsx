"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

type ImageCarouselProps = {
  images: string[];
  alt: string;
};

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const t = useTranslations("product");

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <span className="text-text-secondary">{t("noImage")}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-card">
        <Image
          src={images[selectedIndex]}
          alt={`${alt} - ${selectedIndex + 1}`}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={selectedIndex === 0}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                index === selectedIndex
                  ? "border-accent"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <Image
                src={image}
                alt={`${alt} - thumbnail ${index + 1}`}
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
