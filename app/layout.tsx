import type { Metadata } from "next";
import "./globals.css";
import "./gradientbg.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SanityLive, sanityFetch } from "@/sanity/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { defineQuery } from "next-sanity";

export const metadata: Metadata = {
  title: "Zach Marino",
  description: "Multi-hyphenate UX designer and web developer focused on media and entertainment",
  openGraph: {
    title: 'Zach Marino',
    description: 'Multi-hyphenate UX designer and web developer focused on media and entertainment',
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
    description: 'Multi-hyphenate UX designer and web developer focused on media and entertainment',
    images: ['/images/site_preview.png'],
  },
};

type ProjectForMenu = {
  slug: string;
  title: string;
  deliverableName?: string;
  displayOrder?: number;
};

const projectsForMenuQuery = defineQuery(`
  *[_type == "project" && defined(slug.current) && heroImage.asset != null]{
    "slug": slug.current,
    title,
    deliverableName,
    "displayOrder": orderRank
  } | order(coalesce(displayOrder, 999) asc, title asc)
`);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await sanityFetch({
    query: projectsForMenuQuery,
  });

  interface ProjectDataForMenu {
    slug: string;
    title: string;
    deliverableName?: string;
  }

  const projectsForMenu: ProjectForMenu[] = (data ?? []).map((project: ProjectDataForMenu) => ({
    slug: project.slug,
    title: project.title,
    deliverableName: project.deliverableName,
  }));

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
      <meta name="theme-color" content="#0a0a1e"/>
      </head>
      <body className="bg-[#0a0a1e] overflow-x-hidden">
        <div className="gradient-background-fixed" />
        <div className="relative z-10 flex min-h-screen w-full justify-center">
          <div className="w-full max-w-6xl gap-10 px-4 sm:px-6 lg:px-8 py-7 sm:py-14 flex flex-col items-center">
            <Header projects={projectsForMenu} />
            {children}
            <Analytics />
            <Footer />
          </div>
        </div>
        <SanityLive />
        <VisualEditing />
      </body>
    </html>
  );
}