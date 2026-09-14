import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LEXORA — Berita, Analisis & Edukasi Hukum",
    template: "%s | LEXORA",
  },
  description: "Portal berita dan edukasi hukum terpercaya. Berita, analisis, opini, dan edukasi hukum terkini dari Indonesia dan dunia.",
  keywords: ["hukum", "berita hukum", "analisis hukum", "edukasi hukum", "peradilan", "regulasi", "kriminal", "pidana", "perdata", "tata negara"],
  authors: [{ name: "LEXORA" }],
  creator: "LEXORA",
  publisher: "LEXORA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "LEXORA",
    title: "LEXORA — Berita, Analisis & Edukasi Hukum",
    description: "Portal berita dan edukasi hukum terpercaya. Berita, analisis, opini, dan edukasi hukum terkini dari Indonesia dan dunia.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LEXORA - Berita, Analisis & Edukasi Hukum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LEXORA — Berita, Analisis & Edukasi Hukum",
    description: "Portal berita dan edukasi hukum terpercaya.",
    images: ["/og-image.png"],
    creator: "@lexora",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#08080D" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-[#08080D] text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}