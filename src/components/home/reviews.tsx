import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-warning" : "text-border"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const reviews = [
  { nameKey: "review1Name", textKey: "review1Text", carKey: "review1Car", rating: 5 },
  { nameKey: "review2Name", textKey: "review2Text", carKey: "review2Car", rating: 5 },
  { nameKey: "review3Name", textKey: "review3Text", carKey: "review3Car", rating: 4 },
] as const;

export function Reviews() {
  const t = useTranslations("home");

  return (
    <section className="py-16 sm:py-20 bg-card">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {t("reviewsTitle")}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.nameKey} className="bg-background p-6">
              <StarRating rating={review.rating} />
              <p className="mt-4 text-text-secondary leading-relaxed">
                &ldquo;{t(review.textKey)}&rdquo;
              </p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-text-primary">
                  {t(review.nameKey)}
                </p>
                <p className="text-xs text-text-secondary">
                  {t(review.carKey)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
