import Link from "next/link";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/live";
import EmailCopy from "./EmailCopy";
import SocialIcons from "../SocialIcons"

type FooterProject = {
  slug: string;
  title: string;
  deliverableName?: string;
};

const footerProjectsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current) && heroImage.asset != null]
    | order(coalesce(orderRank, "zzzzzz") asc, title asc){
    "slug": slug.current,
    title,
    deliverableName,
  }
`);

const linkClass =
  "flex transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e1e1e]";

// The color the gradient fades into at the bottom. Defaults to the home page's
// lilac; project pages pass their hue-derived theme color so the footer matches
// the gradient at the top of the page.
const DEFAULT_BOTTOM_COLOR = "#dfb3ff";

const HomeFooter = async ({
  bottomColor = DEFAULT_BOTTOM_COLOR,
}: {
  bottomColor?: string;
} = {}) => {
  const { data } = await sanityFetch({ query: footerProjectsQuery });
  const projects: FooterProject[] = data ?? [];

  return (
    <footer
      className="relative w-full overflow-hidden px-6 pt-28 pb-16 text-[#1e1e1e] sm:px-10"
      style={{
        background: `linear-gradient(to bottom, #faf7f1, ${bottomColor})`,
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <div className="flex flex-col gap-12 sm:flex-row sm:gap-24">
          {/* HOME column */}
          <nav aria-label="Home" className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold sm:text-3xl">HOME</h2>
            <ul className="flex flex-col gap-4 text-xl font-bold sm:text-2xl">
              <li>
                <Link href="#about" className={linkClass}>
                  About Me
                </Link>
              </li>
              <li>
                <Link
                  href="/Public Resume - Zach Marino.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <div>
                    Resume
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 42 42" fill="none">
                    <path d="M32.6683 26.7286L28.4363 26.6544L28.4363 16.1114L10.3945 34.1533L7.42462 31.1834L25.4665 13.1416L14.9235 13.1416L14.8492 8.90954L32.6683 8.90955L32.6683 26.7286Z" fill="#1E1E1E" />
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>

          {/* PROJECTS column */}
          <nav aria-label="Projects" className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold sm:text-3xl">PROJECTS</h2>
            <ul className="flex flex-col gap-4 text-xl font-bold sm:text-2xl">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}`} className={linkClass}>
                    {project.deliverableName || project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-6 sm:ml-auto sm:items-end sm:self-center sm:text-right">
            <h2 className="text-3xl font-bold sm:text-5xl">LET&apos;S CONNECT</h2>
            <EmailCopy email="hello@zmarino.com" />
            <SocialIcons />
          </div>
        </div>

        <p className="text-base font-bold sm:text-lg">
          Website designed and developed by Zach Marino
        </p>
      </div>
    </footer>
  );
};

export default HomeFooter;
