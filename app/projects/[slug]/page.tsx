import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { defineQuery } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";

import ProjectOnePager from "@/components/ProjectOnePager";
import { ContentRenderer } from "@/components/PortableTextRenderer";
import GoBackSticker from "@/components/GoBackSticker";
import ProjectHero from "@/components/project/ProjectHero";
import ProjectGradient from "@/components/project/ProjectGradient";
import { themeGradientColor } from "@/lib/projectTheme";
import HomeFooter from "@/components/home/HomeFooter";
import LightboxProvider from "@/components/Lightbox";
import { ProjectSchema } from "@/schemas/ProjectSchema";
import { sanityFetch } from "@/sanity/live";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import type { SanityHsl } from "@/lib/projectTheme";

type ImageValue = {
	_type: "image";
	asset?: {
		_ref?: string;
	} | null;
};

type Project = {
	_id: string;
	slug: string;
	title: string;
	shortDescription?: string;
	heroImage?: ImageValue;
	cardTags?: string[];
	brief?: PortableTextBlock[];
	context?: PortableTextBlock[];
	toolsAndMethods?: {
		category?: string;
		items?: string[];
	}[];
	team?: string[];
	timeline?: string;
	insights?: PortableTextBlock[];
	deliverables?: PortableTextBlock[];
	cardColorHsl?: SanityHsl | null;
	content?: PortableTextBlock[];
};

const projectQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    "slug": slug.current,
    title,
	"seoDescription": shortDescription,
	heroImage,
	cardTags,
	shortDescription,
	brief,
	context,
	toolsAndMethods,
	team,
	timeline,
	insights,
	deliverables,
	"cardColorHsl": cardColor.hsl,
    content[]{
	      ...,
	      image,
	      images[],
	      rightImage
    }
  }
`);

const projectSlugsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)]{
	"slug": slug.current
  }
`);

type ProjectSlugDoc = { slug: string };

export async function generateStaticParams() {
	const data = await client.fetch<ProjectSlugDoc[]>(projectSlugsQuery);

	return (data ?? []).map((project: ProjectSlugDoc) => ({
		slug: project.slug,
	}));
}

type PageParams = Promise<{
	slug: string;
}>;

export async function generateMetadata({
	params,
}: {
	params: PageParams;
}): Promise<Metadata> {
	const { slug } = await params;
	const { data } = await sanityFetch({
		query: projectQuery,
		params: { slug },
	});

	const project = data as Project | null;

	if (!project) {
		return {
			title: "Project",
		};
	}

	const description =
		project.shortDescription || undefined;

	let heroUrl: string | undefined;
	if (project.heroImage) {
		heroUrl = urlFor(project.heroImage).width(1600).url();
	}

	return {
		title: project.title,
		description,
		openGraph: {
			title: project.title,
			description: description,
			images: heroUrl
				? [
						{
							url: heroUrl,
							alt: project.title,
						},
					]
				: undefined,
		},
	};
}

function getImageAspectRatio(image?: ImageValue): number | undefined {
	// Sanity asset refs encode the source dimensions, e.g.
	// `image-<id>-2000x3000-jpg`. Parsing them here lets the hero reserve the
	// correct box up front (no layout shift) instead of waiting for onLoad.
	const ref = image?.asset?._ref;
	if (!ref) return undefined;
	const match = /-(\d+)x(\d+)-/.exec(ref);
	if (!match) return undefined;
	const width = Number(match[1]);
	const height = Number(match[2]);
	if (!width || !height) return undefined;
	return width / height;
}

function getImageUrl(image?: ImageValue) {
	// Guard against images without a valid asset to avoid
	// `Cannot read properties of null (reading '_ref')` inside image-url.
	if (!image || !image.asset || !image.asset._ref) return undefined;

	try {
		// Cap the source Sanity pulls into Next's image optimizer. Without this
		// the hero requests the full-resolution original (often several MB),
		// which makes the first (cold-cache) load noticeably slow. 2000px covers
		// a full-bleed hero on large/retina displays; `auto("format")` serves
		// WebP/AVIF where supported. Mirrors the home grid's treatment.
		return urlFor(image).width(2000).auto("format").url();
	} catch {
		return undefined;
	}
}

function getZoomImageUrl(image?: ImageValue) {
	if (!image || !image.asset || !image.asset._ref) return undefined;

	try {
		// Source for the click-to-enlarge overlay. Larger and less compressed
		// than the inline render, and only fetched once the reader clicks.
		// Sanity never upscales past the original, so this is a ceiling.
		return urlFor(image).width(3000).quality(95).auto("format").url();
	} catch {
		return undefined;
	}
}

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {

	const { data } = await sanityFetch({
		query: projectQuery,
		params,
	});

	const project = data as Project | null;

	if (!project) {
		notFound();
	}

	const heroUrl = getImageUrl(project.heroImage);
	const heroZoomUrl = getZoomImageUrl(project.heroImage);
	const heroAspectRatio = getImageAspectRatio(project.heroImage);

	// The design shows tools & methods as flat pills. Flatten each group to its
	// items; when a group has no items, fall back to its category as the pill
	// label (existing content stores the method name in `category`).
	const toolsAndMethods: string[] = (project.toolsAndMethods || []).flatMap(
		(group) => {
			if (!group) return [];
			const items = (Array.isArray(group.items) ? group.items : [])
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
				    bottom-left edge. The sticker is absolutely positioned so it does
				    not push the gradient down — the gradient butts directly against
				    the image with no gap. ProjectHero also shows the loading sticker
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
				<ProjectGradient hsl={project.cardColorHsl}>
					<ProjectOnePager
						brief={project.brief || []}
						context={project.context || []}
						toolsAndMethods={toolsAndMethods}
						team={project.team || []}
						timeline={project.timeline || ""}
						insights={project.insights || []}
						deliverables={project.deliverables || []}
					/>

					<div className="mx-auto mt-16 flex w-full max-w-6xl flex-col items-center gap-8 px-6 pb-24 sm:px-10">
						<ContentRenderer value={project.content || []} />
					</div>
				</ProjectGradient>
			</LightboxProvider>

			<HomeFooter bottomColor={themeGradientColor(project.cardColorHsl)} />
		</div>
	);
}

