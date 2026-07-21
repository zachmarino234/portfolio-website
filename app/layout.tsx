import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SanityLive } from "@/sanity/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { DisableDraftMode } from "@/components/DisableDraftMode";

export const metadata: Metadata = {
  title: "Zach Marino",
  description: "Multi-hyphenate product designer and web developer focused on media and entertainment",
  openGraph: {
    title: 'Zach Marino',
    description: 'Product designer and web developer',
    url: 'https://www.zmarino.com',
    siteName: 'Zach Marino',
    images: [
      {
        url: '/images/OG_image.jpg',
        width: 1200,
        height: 630,
        alt: 'Zach Marino Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zach Marino',
    description: 'Multi-hyphenate product designer and web developer focused on media and entertainment',
    images: ['/images/OG_image.jpg'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a1e" />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <Analytics />
        <SanityLive />
        {(await draftMode()).isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  );
}