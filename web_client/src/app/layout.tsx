import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Commerce",
    template: "%s | Commerce",
  },
  description: "Commerce - online store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-20 pt-4 md:px-6 md:pb-10 md:pt-6">
              {children}
            </main>
            <Footer />
            <MobileNav />
          </div>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
