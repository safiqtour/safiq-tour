import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Playfair_Display, Inter } from "next/font/google";
import { getGlobalJsonLd } from "@/lib/jsonld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://safiqtour.id"),
  title: {
    default: "Safiq Tour | Travel Umroh Resmi & Terpercaya",
    template: "%s | Safiq Tour",
  },
  description:
    "Safiq Tour adalah travel umroh resmi & terpercaya dengan paket umroh lengkap, hotel nyaman, pembimbing ibadah berpengalaman, dan pelayanan amanah.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Safiq Tour | Travel Umroh Resmi & Terpercaya",
    description:
      "Travel umroh resmi & terpercaya dengan paket umroh lengkap, hotel nyaman, pembimbing ibadah berpengalaman, dan pelayanan amanah.",
    url: "https://safiqtour.id/",
    siteName: "Safiq Tour",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Safiq Tour | Travel Umroh Resmi & Terpercaya",
    description:
      "Travel umroh resmi & terpercaya dengan paket umroh lengkap, hotel nyaman, pembimbing ibadah berpengalaman, dan pelayanan amanah.",
  },
  icons: {
    icon: "/images/logo-safiq.png",
    apple: "/images/logo-safiq.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getGlobalJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
