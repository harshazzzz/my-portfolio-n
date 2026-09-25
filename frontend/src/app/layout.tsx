import { site } from "@/lib/site";
import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import PortfolioEntrance from "@/components/animations/PortfolioEntrance";
import ScrollProgress from "@/components/layout/ScrollProgress";
import PageTransitions from "@/components/animations/PageTransitions";
import Assistant from "@/components/chatbot/Assistant";
import PortfolioProvider from "@/providers/PortfolioProvider";
import "./globals.css";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: "Harsha Portfolio",
  title: site.title,
  description: site.description,
  authors: [{ name: "Harshana Karunarathna" }],
  openGraph: {
    type: "website",
    siteName: "Harsha Portfolio",
    title: site.title,
    description: site.description,
    locale: "en_US",
    images: [
      { url: "/social-card.png", width: 1200, height: 630, alt: site.title },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/social-card.png"],
  },
  robots:
    process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: false }
      : undefined,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <PortfolioProvider>
          <ScrollProgress />
          <PageTransitions />
          <PortfolioEntrance />
          {children}
          <Assistant />
        </PortfolioProvider>
      </body>
    </html>
  );
}
