import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Etheleen & Alma's Dream | Premier Catering Services",
  description: "Exquisite catering for your most precious moments. Bespoke menus and premium service for gala dinners, weddings, and corporate events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
