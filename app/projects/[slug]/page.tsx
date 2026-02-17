import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { defineQuery } from "next-sanity";
import { draftMode } from "next/headers";

import PageMain from "@/components/PageMain";
import Blockquote from "@/components/blocks/Blockquote";
import ImageBlock from "@/components/blocks/ImageBlock";
import HeadingBlock from "@/components/blocks/HeadingBlock";
import TextBlock from "@/components/blocks/TextBlock";
import CarouselBlock from "@/components/blocks/CarouselBlock";
import ColumnsBlock from "@/components/blocks/ColumnsBlock";
import ProjectOnePager from "@/components/ProjectOnePager";
import IframeLoader from "@/components/IFrameLoader";
import { ProjectSchema } from "@/schemas/ProjectSchema";
import { sanityFetch } from "@/sanity/live";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import './styles.css';

type OnePager = {
	title: string;
	brief: string;
	context: string;
	toolsAndMethods: string[];
	team: string;
	timeline: string;
	insights: string;
	deliverables: string;
};

type HeadingBlockData = {
	_key: string;
	_type: "headingBlock";
	heading?: string;
	level?: "h2" | "h3";
};

type TextBlockData = {
	_key: string;
	_type: "textBlock";
	title?: string;
	body?: unknown[];
};

type QuoteBlockData = {
	_key: string;
	_type: "blockquote";
	text?: string;
};

type ImageValue = {
	_type: "image";
	asset?: {
		_ref?: string;
	} | null;
};

type ImageBlockData = {
	_key: string;
	_type: "imageBlock";
	image?: ImageValue;
	alt?: string;
	caption?: string;
	hideCaption?: boolean;
};

type CarouselImageBlock = {
	_key: string;
	_type: "imageBlock";
	image?: ImageValue;
	alt?: string;
	caption?: string;
	hideCaption?: boolean;
};

type CarouselBlockData = {
	_key: string;
	_type: "carouselBlock";
	images?: CarouselImageBlock[];
};

type EmbedBlockData = {
	_key: string;
	_type: "embedBlock";
	title?: string;
	url?: string;
};

type ColumnsBlockData = {
	_key: string;
	_type: "columnsBlock";
	leftHeading?: string;
	leftBody?: unknown[];
	leftQuote?: {
		text?: string;
	} | null;
	rightImage?: ImageBlockData;
};

type ProjectBlock =
	| HeadingBlockData
	| TextBlockData
	| QuoteBlockData
	| ImageBlockData
	| CarouselBlockData
	| ColumnsBlockData
	| EmbedBlockData;

type Project = {
	_id: string;
	slug: string;
	title: string;
	shortDescription?: string;
	heroImage?: ImageValue;
	cardTags?: string[];
	brief?: unknown[];
	context?: unknown[];
	toolsAndMethods?: {
		category?: string;
		items?: string[];
	}[];
	team?: string[];
	timeline?: string;
	insights?: unknown[];
	deliverables?: unknown[];
	content?: ProjectBlock[];
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

function normalizeBlockType(_type: string) {
	return _type;
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

	// Derive one-pager fields from the flat project schema
	const blocksToPlainText = (blocks?: unknown[]): string => {
		if (!blocks || !Array.isArray(blocks)) return "";
		return blocks
			.map((block) => {
				const blockWithChildren = block as { children?: unknown[] };
				const children = Array.isArray(blockWithChildren.children)
					? blockWithChildren.children
					: [];
				return children
					.map((child) => {
						const childWithText = child as { text?: unknown };
						return typeof childWithText.text === "string"
							? childWithText.text
							: "";
					})
					.join("");
			})
			.filter(Boolean)
			.join("\n\n")
			.trim();
	};

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

	const onePager: OnePager = {
		title: project.title,
		brief: blocksToPlainText(project.brief),
		context: blocksToPlainText(project.context),
		toolsAndMethods: toolsAndMethodsLines,
		team: (project.team || []).join(", "),
		timeline: project.timeline || "",
		insights: blocksToPlainText(project.insights),
		deliverables: blocksToPlainText(project.deliverables),
	};

	return (
		<PageMain>
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
					title={onePager.title || project.title}
					brief={onePager.brief}
					context={onePager.context}
					toolsAndMethods={onePager.toolsAndMethods}
					team={onePager.team}
					timeline={onePager.timeline}
					insights={onePager.insights}
					deliverables={onePager.deliverables}
				/>

				<div className="w-full flex flex-col items-center gap-16 mt-10">
					{(project.content ?? []).map((block: ProjectBlock) => {
						const baseType = normalizeBlockType(block._type);
						switch (baseType) {
							case "headingBlock": {
								const heading = block as HeadingBlockData;
								return (
									<HeadingBlock
										key={heading._key}
										text={heading.heading || ""}
										level={heading.level}
										className="w-full max-w-278"
									/>
								);
							}
							case "textBlock": {
								const textBlock = block as TextBlockData;
								const bodyText = blocksToPlainText(
									textBlock.body as unknown[],
								);
								const fullText = [textBlock.title, bodyText]
									.filter(Boolean)
									.join("\n\n");
								return (
									<TextBlock
										key={textBlock._key}
										text={fullText}
										className="w-full max-w-278"
									/>
								);
							}
							case "blockquote": {
								const quote = block as QuoteBlockData;
								return (
									<Blockquote
										key={quote._key}
										text={quote.text || ""}
										className="w-full max-w-131"
									/>
								);
							}
							case "imageBlock": {
								const imageBlock = block as ImageBlockData;
								const src = getImageUrl(imageBlock.image);
								if (!src) return null;
								return (
									<ImageBlock
										key={imageBlock._key}
										src={src}
										alt={imageBlock.alt}
										caption={imageBlock.caption}
										className="w-full max-w-278"
									/>
								);
							}
							case "carouselBlock": {
								const carousel = block as CarouselBlockData;
								const images = (carousel.images || [])
									.reduce<{ src: string; alt?: string }[]>((acc, imageBlock) => {
										if (!imageBlock?.image) return acc;
										const src = getImageUrl(imageBlock.image);
										if (!src) return acc;
										acc.push({ src, alt: imageBlock.alt });
										return acc;
									}, []);

								if (!images.length) return null;

								return (
									<CarouselBlock
										key={carousel._key}
										images={images}
									/>
								);
							}
							case "columnsBlock": {
								const columns = block as ColumnsBlockData;
								const src = getImageUrl(columns.rightImage?.image);
								if (!src) return null;
								const leftBodyText = blocksToPlainText(
									columns.leftBody as unknown[],
								);
								return (
									<ColumnsBlock
										key={columns._key}
										left={{
											heading: columns.leftHeading,
											text: leftBodyText,
											quote: columns.leftQuote?.text,
										}}
										rightImage={{
											src,
											alt: columns.rightImage?.alt,
											caption: columns.rightImage?.caption,
										}}
									/>
								);
							}
							case "embedBlock": {
								const embed = block as EmbedBlockData;
								if (!embed.url) return null;
								return (
									<div
										key={embed._key}
										className="w-full max-w-278 flex flex-col gap-4"
									>
										{embed.title && (
											<h2 className="text-lg font-semibold tracking-tight">
												{embed.title}
											</h2>
										)}
										<IframeLoader
											src={embed.url}
											title={embed.title || "Embedded content"}
										/>
									</div>
								);
							}
							default:
								return null;
						}
					})}
				</div>
			</div>
		</PageMain>
	);
}

