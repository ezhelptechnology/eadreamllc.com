import type { Metadata } from "next";
import "./globals.css";
import { cormorant, jost } from "@/lib/fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingExperienceBot from "@/components/FloatingExperienceBot";
import ClientOptimizations from "@/components/ClientOptimizations";

export const metadata: Metadata = {
  title: "EA Dream LLC | Charlotte Catering & Private Dinner Events",
  description: "Charlotte's premier catering and private dinner experience. From intimate chef-hosted dinners to large-scale corporate events, weddings, and AAU athlete meal prep. Classic ($25) & Premium ($30) per plate. Licensed & insured.",
  keywords: ["Charlotte catering", "private dinner events Charlotte NC", "corporate catering Charlotte", "AAU meal prep", "wedding catering Charlotte", "EA Dream LLC"],
  openGraph: {
    title: "EA Dream LLC | Charlotte Catering & Private Dinner Events",
    description: "Charlotte's premier catering and private dinner experience. Chef-hosted dinners, corporate events, weddings, and athlete meal prep.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <ClientOptimizations />
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <FloatingExperienceBot />
      </body>
    </html>
  );
}
