import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { defineQuery } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";

import PageMain from "@/components/PageMain";
import ProjectOnePager from "@/components/ProjectOnePager";
import { ContentRenderer } from "@/components/PortableTextRenderer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { ProjectSchema } from "@/schemas/ProjectSchema";
import { sanityFetch } from "@/sanity/live";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import './styles.css';

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

function getImageUrl(image?: ImageValue) {
	// Guard against images without a valid asset to avoid
	// `Cannot read properties of null (reading '_ref')` inside image-url.
	if (!image || !image.asset || !image.asset._ref) return undefined;

	try {
		return urlFor(image).url();
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

	const toolsAndMethodsLines: string[] = (project.toolsAndMethods || []).flatMap(
		(group) => {
			if (!group) return [];
			const category = group.category?.trim();
			const items = Array.isArray(group.items) ? group.items : [];
			if (category && items.length) {
				return [`${category}: ${items.join(", ")}`];
			}
			if (category) return [category];
			if (items.length) return [items.join(", ")];
			return [];
		},
	);

	return (
		<PageMain>
			<ScrollProgressBar />
			<ProjectSchema
				name={project.title}
				description={
					project.shortDescription ||
					"Project case study by Zach Marino"
				}
				url={`https://zmarino.com/projects/${project.slug}`}
				image={heroUrl}
			/>
			<div className="project-page relative w-full flex flex-col items-center gap-24">
				{heroUrl && (
					<div className="pointer-events-none absolute -top-34 left-1/2 -z-10 h-205 w-[min(1600px,120vw)] -translate-x-1/2">
						<Image
							src={heroUrl}
							alt={project.title}
							fill
							priority
							className="object-cover"
						/>
					</div>
				)}

				<ProjectOnePager
					title={project.title}
					brief={project.brief || []}
					context={project.context || []}
					toolsAndMethods={toolsAndMethodsLines}
					team={(project.team || []).join(", ")}
					timeline={project.timeline || ""}
					insights={project.insights || []}
					deliverables={project.deliverables || []}
				/>

				<div className="w-full flex flex-col items-center gap-16 mt-10">
					<ContentRenderer value={project.content || []} />
				</div>
			</div>
		</PageMain>
	);
}

