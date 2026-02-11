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
      .width(1800)      // 3x the old width for retina
      .height(840)      // keep the same aspect ratio
      .auto("format")   // optional: let Sanity choose WebP/AVIF where possible
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
        <section className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
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
        </section>
    );
};

export default ProjectGrid;