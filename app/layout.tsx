import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/src/components/providers";
import { Toaster } from "react-hot-toast";
import PrelineScript from "@/src/components/PrelineScript";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "PUSCOM - Pusat Komputer Terpercaya di Yogyakarta",
    template: "%s | Jual Beli, Servis & Spare Part Komputer",
  },
  description: "PUSCOM - Solusi Lengkap untuk Komputer & Laptop. Jual Beli, Servis Professional, dan Spare Part Berkualitas di Yogyakarta.",
  keywords: ["jual beli komputer", "laptop yogyakarta", "servis komputer", "spare part komputer", "toko komputer terpercaya"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://puscom.vercel.app/",
    siteName: "PUSCOM",
    title: "PUSCOM - Pusat Komputer Terpercaya di Yogyakarta",
    description: "Solusi Lengkap untuk Komputer & Laptop di Yogyakarta",
    images: [
      {
        url: "https://ogcdn.net/e4b8c678-7bd5-445d-ba03-bfaad510c686/v4/puscom.vercel.app/Pusat%20Komputer%20Yogayakarta%20%7C%20PUSCOM/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F56188dc2-e3c3-4ce5-a8b1-1323953e37b9.jpg%3Ftoken%3DhOY-wLL-tV2Wb6eqlpzb3hUOqYMZbXQ3az2flBDqaSs%26height%3D800%26width%3D1200%26expires%3D33251249770/og.png",
        width: 1200,
        height: 630,
        alt: "PUSCOM - Pusat Komputer Yogyakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PUSCOM - Pusat Komputer Terpercaya",
    description: "Jual Beli, Servis & Spare Part Komputer di Yogyakarta",
    images: [
      "https://ogcdn.net/e4b8c678-7bd5-445d-ba03-bfaad510c686/v4/puscom.vercel.app/Pusat%20Komputer%20Yogayakarta%20%7C%20PUSCOM/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F56188dc2-e3c3-4ce5-a8b1-1323953e37b9.jpg%3Ftoken%3DhOY-wLL-tV2Wb6eqlpzb3hUOqYMZbXQ3az2flBDqaSs%26height%3D800%26width%3D1200%26expires%3D33251249770/og.png",
    ],
  },
  alternates: {
    canonical: "https://puscom.vercel.app",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://use.typekit.net/ins2wgm.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-scandia">
        <PrelineScript />
        <Toaster position="top-right" reverseOrder={false} />
        <Providers>{children}</Providers>
        <Script async src="https://kit.fontawesome.com/c7e6574aa8.js" crossOrigin="anonymous" />
      </body>
    </html>
  );
}
