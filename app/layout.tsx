import type { Metadata } from "next";
import "./globals.css";
import "./gradientbg.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Zach Marino",
  description: "Multi-hyphenate experience designer and web developer focused on media and entertainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ehz4rpp.css" />
      </head>
      <body>
        <div className="gradient-background-fixed" />
        <div className="relative z-10 flex min-w-screen flex-col items-center py-14 sm:py-28 px-8 sm:px-16">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}