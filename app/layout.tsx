import type { Metadata } from "next";
import "./globals.css";
import "./gradientbg.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Zach Marino",
  description: "Multi-hyphenate experience designer and web developer focused on media and entertainment",
  openGraph: {
    title: 'Zach Marino',
    description: 'Multi-hyphenate experience designer and web developer focused on media and entertainment',
    url: 'https://www.zmarino.com',
    siteName: 'Zach Marino',
    images: [
      {
        url: '/images/site_preview.png',
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
    description: 'Multi-hyphenate experience designer and web developer focused on media and entertainment',
    images: ['/images/site_preview.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/ehz4rpp.css" />
        <script>
          {`(function(d) {
      var config = {
        kitId: 'ehz4rpp',
        scriptTimeout: 3000,
        async: true
      },
      h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
    })(document);`}
        </script>
      </head>
      <body>
        <div className="gradient-background-fixed" />
        <div className="relative z-10 flex min-w-screen flex-col items-center py-14 sm:py-28 px-8 sm:px-16">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}