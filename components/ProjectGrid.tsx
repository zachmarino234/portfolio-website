import ProjectCard from "./ProjectCard";
import { getProjectList, mediaUrl } from "@/lib/payload";

const ProjectGrid = async () => {
    const projects = await getProjectList();

    return (
        <section className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
            {projects.map((project) => {
                // `card` is the 1800×840 crop around the image's focal point.
                const heroUrl = mediaUrl(project.heroImage, "card");
                if (!heroUrl) return null;

                return (
                    <ProjectCard
                        key={project.id}
                        slug={project.slug}
                        title={project.title}
                        shortDescription={project.shortDescription ?? undefined}
                        tags={project.cardTags ?? undefined}
                        heroImageUrl={heroUrl}
                        hoverVideoUrl={mediaUrl(project.hoverVideo)}
                        cardColor={project.cardColor ?? undefined}
                    />
                );
            })}
        </section>
    );
};

export default ProjectGrid;
