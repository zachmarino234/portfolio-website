import { notFound } from "next/navigation";
import type { Metadata } from "next";

import ProjectOnePager from "@/components/ProjectOnePager";
import { ContentRenderer } from "@/components/RichText";
import GoBackSticker from "@/components/GoBackSticker";
import ProjectHero from "@/components/project/ProjectHero";
import ProjectGradient from "@/components/project/ProjectGradient";
import { themeGradientColor } from "@/lib/projectTheme";
import HomeFooter from "@/components/home/HomeFooter";
import LightboxProvider from "@/components/Lightbox";
import { ProjectSchema } from "@/schemas/ProjectSchema";
import {
	getProjectBySlug,
	getProjectSlugs,
	mediaAspectRatio,
	mediaUrl,
} from "@/lib/payload";

type PageParams = Promise<{
	slug: string;
}>;

// Published projects are prerendered at build time. A project published later
// renders on its first request and is cached after that; editing it in the
// admin re-renders it (see the revalidation hooks on the Projects collection).
export async function generateStaticParams() {
	const slugs = await getProjectSlugs();
	return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: {
	params: PageParams;
}): Promise<Metadata> {
	const { slug } = await params;
	const project = await getProjectBySlug(slug);

	if (!project) {
		return {
			title: "Project",
		};
	}

	const description = project.shortDescription || undefined;
	const heroUrl = mediaUrl(project.heroImage, "xl");

	return {
		title: project.title,
		description,
		openGraph: {
			title: project.title,
			description,
			images: heroUrl ? [{ url: heroUrl, alt: project.title }] : undefined,
		},
	};
}

export default async function ProjectPage({ params }: { params: PageParams }) {
	const { slug } = await params;
	const project = await getProjectBySlug(slug);

	if (!project) {
		notFound();
	}

	// `xl` is capped at 2000px wide so the optimizer never pulls a multi-MB
	// original for the full-bleed hero; the original is kept for the zoom.
	const heroUrl = mediaUrl(project.heroImage, "xl");
	const heroZoomUrl = mediaUrl(project.heroImage);
	const heroAspectRatio = mediaAspectRatio(project.heroImage);

	// The design shows tools & methods as flat pills. Flatten each group to its
	// items; when a group has no items, fall back to its category as the pill
	// label (existing content stores the method name in `category`).
	const toolsAndMethods: string[] = (project.toolsAndMethods || []).flatMap(
		(group) => {
			const items = (group.items || [])
				.map((item) => item?.trim())
				.filter(Boolean) as string[];
			if (items.length) return items;
			const category = group.category?.trim();
			return category ? [category] : [];
		},
	);

	return (
		<div className="project-page relative w-full bg-[#faf7f1] text-[#1e1e1e]">
			<ProjectSchema
				name={project.title}
				description={
					project.shortDescription ||
					"Project case study by Zach Marino"
				}
				url={`https://zmarino.com/projects/${project.slug}`}
				image={heroUrl}
			/>

			{/* Images inside here are click-to-enlarge: the provider owns the
			    darkened overlay that shows a higher-resolution render. */}
			<LightboxProvider>
				{/* Full-bleed hero image with the title sticker straddling its
				    bottom-left edge. ProjectHero also shows the loading sticker
				    until the hero image has painted. */}
				{heroUrl && (
					<ProjectHero
						src={heroUrl}
						zoomSrc={heroZoomUrl}
						title={project.title}
						aspectRatio={heroAspectRatio}
					/>
				)}

				{/* Sticky "GO BACK" sticker overlays the whole page from the top-left. */}
				<GoBackSticker />

				{/* Tinted, hue-derived band behind the one-pager and content. */}
				<ProjectGradient cardColor={project.cardColor}>
					<ProjectOnePager
						brief={project.brief}
						context={project.context}
						toolsAndMethods={toolsAndMethods}
						team={project.team || []}
						timeline={project.timeline || ""}
						insights={project.insights}
						deliverables={project.deliverables}
					/>

					<div className="mx-auto mt-16 flex w-full max-w-6xl flex-col items-center gap-8 px-6 pb-24 sm:px-10">
						<ContentRenderer value={project.content} />
					</div>
				</ProjectGradient>
			</LightboxProvider>

			<HomeFooter bottomColor={themeGradientColor(project.cardColor)} />
		</div>
	);
}
