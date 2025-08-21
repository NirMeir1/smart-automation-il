import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { ClientProvider } from "@/components/providers/client-provider";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ToastContainer } from "@/components/ui/toast";
import { MobileCTA } from "@/components/layout/mobile-cta";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "אוטומציה חכמה - פתרונות אוטומציה מתקדמים",
  description: "מומחה באוטומציה עסקית, בוטים חכמים ופתרונות טכנולוגיים מתקדמים לעסקים",
  keywords: "אוטומציה, בוטים, מערכות ניהול, ישראל, עסקים",
  authors: [{ name: "Smart Automation IL" }],
  openGraph: {
    title: "אוטומציה חכמה - פתרונות אוטומציה מתקדמים",
    description: "מומחה באוטומציה עסקית, בוטים חכמים ופתרונות טכנולוגיים מתקדמים לעסקים",
    type: "website",
    locale: "he_IL"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <ClientProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
              {children}
            </main>
            <MobileCTA />
            <Footer />
          </div>
          <ToastContainer />
        </ClientProvider>
      </body>
    </html>
  );
}
