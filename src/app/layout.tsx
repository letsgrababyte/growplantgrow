import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import SignInPromptWrapper from "@/components/SignInPromptWrapper";
import { AdminModeProvider } from "@/components/admin/AdminModeProvider";
import CategoryScroller from "@/components/CategoryScroller";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "GrowPlantGrow - Botanical Digital Printables & Ebooks",
  description: "Beautiful botanical digital printables and ebooks for plant lovers. Guides, workbooks, and printable resources for your plant journey.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-botanical-cream-50`}>
        <CartProvider>
          <FavoritesProvider>
            <AdminModeProvider>
              <SignInPromptWrapper />
              <Suspense fallback={<div className="h-16 bg-botanical-green-800"></div>}>
                <Header />
              </Suspense>
              <Suspense fallback={null}>
                <CategoryScroller />
              </Suspense>
              <main className="flex-grow pb-16">
                {children}
              </main>
              <Footer />
            </AdminModeProvider>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}

