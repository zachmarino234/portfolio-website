import { defineQuery } from "next-sanity";
import ProjectCard from "./ProjectCard";
import { sanityFetch } from "@/sanity/live";
import { urlFor } from "@/sanity/lib/image";

type ImageValue = {
    _type: "image";
    asset?: {
        _ref?: string;
    } | null;
};

type ProjectForGrid = {
    _id: string;
    slug: string;
    title: string;
    shortDescription?: string;
    heroImage?: ImageValue;
    cardTags?: string[];
    displayOrder?: number;
};

const projectsForGridQuery = defineQuery(`
  *[_type == "project" && defined(slug.current) && heroImage.asset != null]{
    _id,
    "slug": slug.current,
    title,
    shortDescription,
    heroImage,
    cardTags,
        "displayOrder": orderRank
    } | order(coalesce(displayOrder, 999) asc, title asc)
`);

function getImageUrl(image?: ImageValue) {
  if (!image || !image.asset || !image.asset._ref) return undefined;

  try {
    return urlFor(image)
      .width(1800)
      .height(840)
      .auto("format")
      .url();
  } catch {
    return undefined;
  }
}

const ProjectGrid = async () => {
    const { data } = await sanityFetch({
        query: projectsForGridQuery,
    });

    const projects = (data || []).filter((project: ProjectForGrid) => getImageUrl(project.heroImage));

    return (
        /* Win2000 Explorer window wrapping the grid */
        <section className="win-window w-full" aria-label="Projects">
            {/* Title bar */}
            <div className="win-titlebar">
                <div className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <rect x="1" y="3" width="14" height="10" fill="#ffffc0" stroke="#fff" strokeWidth="0.5" />
                        <rect x="1" y="3" width="5" height="2" fill="#ffff00" />
                    </svg>
                    <span style={{ fontSize: "11px", fontFamily: "var(--font-body)" }}>
                        My Work — {projects.length} project(s)
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="win-titlebar-btn" aria-hidden="true">_</span>
                    <span className="win-titlebar-btn" aria-hidden="true">&#9633;</span>
                    <span className="win-titlebar-btn" aria-hidden="true">&#x2715;</span>
                </div>
            </div>

            {/* Explorer toolbar */}
            <div className="win-menubar">
                <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>F</u>ile</span>
                <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>E</u>dit</span>
                <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>V</u>iew</span>
                <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>F</u>avorites</span>
                <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>T</u>ools</span>
                <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>H</u>elp</span>
            </div>

            {/* Toolbar separator */}
            <div style={{ height: "1px", background: "var(--win-btn-shadow)", margin: "0 2px" }} />
            <div style={{ height: "1px", background: "var(--win-btn-highlight)", margin: "0 2px" }} />

            {/* Address bar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "3px 6px",
                    background: "var(--win-btn-face)",
                    borderBottom: "1px solid var(--win-btn-shadow)",
                    fontSize: "11px",
                    fontFamily: "var(--font-body)",
                }}
            >
                <span style={{ flexShrink: 0, color: "var(--foreground)" }}>Address</span>
                <div className="win-inset flex-1" style={{ padding: "1px 4px", height: "20px", display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "11px" }}>C:\Users\Visitor\My Documents\Portfolio\Work</span>
                </div>
                <button className="win-btn" style={{ fontSize: "11px", padding: "1px 8px", height: "20px" }}>Go</button>
            </div>

            {/* Grid content */}
            <div
                style={{
                    background: "var(--win-btn-face)",
                    padding: "8px",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "10px",
                    }}
                >
                    {projects.map((project: ProjectForGrid, index: number) => {
                        const heroUrl = getImageUrl(project.heroImage)!;
                        const orderLabel = project.displayOrder ?? index + 1;

                        return (
                            <ProjectCard
                                key={project._id}
                                slug={project.slug}
                                title={project.title}
                                shortDescription={project.shortDescription}
                                tags={project.cardTags}
                                heroImageUrl={heroUrl}
                                orderLabel={orderLabel}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Status bar */}
            <div className="win-statusbar">
                <div className="win-statusbar-panel flex-1" style={{ fontSize: "11px" }}>
                    {projects.length} object(s)
                </div>
                <div className="win-statusbar-panel" style={{ fontSize: "11px" }}>
                    Local intranet
                </div>
            </div>
        </section>
    );
};

export default ProjectGrid;
