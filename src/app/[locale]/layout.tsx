import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { getOrganizationJsonLd } from "@/lib/seo";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const organizationJsonLd = getOrganizationJsonLd();

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-background text-text-primary min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartSidebar />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
