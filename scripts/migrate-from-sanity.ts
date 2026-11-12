/**
 * One-time content migration: Sanity → Payload.
 *
 *   npm run migrate:sanity
 *
 * Reads every published project from Sanity's HTTP API, copies each image and
 * video into Payload media (Vercel Blob), converts Portable Text to Lexical,
 * and creates or updates the matching Payload project by slug.
 *
 * Safe to re-run: media is matched on its Sanity asset id and projects on
 * their slug, so nothing is duplicated. Sanity itself is never written to.
 *
 * Env:
 *   SANITY_PROJECT_ID   default 4hlhry87
 *   SANITY_DATASET      default production
 *   SANITY_TOKEN        only needed if the dataset is private
 *   plus the usual Payload env (DATABASE_URL, PAYLOAD_SECRET, BLOB_READ_WRITE_TOKEN)
 */

import { getPayload, type Payload } from "payload";
import config from "../payload.config";
import {
  portableTextToLexical,
  type ConvertOptions,
  type PTValue,
  type SanityImage,
} from "./lib/portableTextToLexical";

const PROJECT_ID = process.env.SANITY_PROJECT_ID || "4hlhry87";
const DATASET = process.env.SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_TOKEN;

// ---------------------------------------------------------------------------
// Sanity
// ---------------------------------------------------------------------------

type SanityAsset = {
  _id: string;
  url: string;
  originalFilename?: string;
  mimeType?: string;
  extension?: string;
};

type SanityProject = {
  _id: string;
  title?: string;
  deliverableName?: string;
  slug?: string;
  heroImage?: SanityImage;
  hoverVideo?: { asset?: { _ref?: string } };
  cardTags?: string[];
  shortDescription?: string;
  cardColor?: { hex?: string } | null;
  brief?: PTValue;
  context?: PTValue;
  toolsAndMethods?: { category?: string; items?: string[] }[];
  team?: string[];
  timeline?: string;
  insights?: PTValue;
  deliverables?: PTValue;
  content?: PTValue;
};

async function sanityQuery<T>(query: string): Promise<T> {
  const url = new URL(
    `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}`,
  );
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");

  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
  });
  if (!res.ok) {
    throw new Error(
      `Sanity query failed (${res.status}). If the dataset is private, set SANITY_TOKEN.\n${await res.text()}`,
    );
  }
  const body = (await res.json()) as { result: T };
  return body.result;
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

function createMediaResolver(payload: Payload, assets: Map<string, SanityAsset>) {
  const cache = new Map<string, Promise<number | null>>();

  async function upload(
    ref: string,
    alt: string | null | undefined,
    hotspot: { x?: number; y?: number } | null | undefined,
  ): Promise<number | null> {
    const existing = await payload.find({
      collection: "media",
      where: { sanityAssetId: { equals: ref } },
      limit: 1,
      pagination: false,
    });
    if (existing.docs[0]) return existing.docs[0].id;

    const asset = assets.get(ref);
    if (!asset) {
      console.warn(`  ! Asset ${ref} not found in Sanity; skipping.`);
      return null;
    }

    const res = await fetch(asset.url);
    if (!res.ok) {
      console.warn(`  ! Download failed for ${asset.url} (${res.status}); skipping.`);
      return null;
    }
    const data = Buffer.from(await res.arrayBuffer());
    const name =
      asset.originalFilename ||
      `${asset._id}.${asset.extension || asset.url.split(".").pop() || "bin"}`;

    const doc = await payload.create({
      collection: "media",
      data: {
        alt: alt || undefined,
        sanityAssetId: ref,
        // Sanity hotspots are 0–1; Payload focal points are percentages.
        ...(hotspot?.x != null && hotspot?.y != null
          ? { focalX: hotspot.x * 100, focalY: hotspot.y * 100 }
          : {}),
      },
      file: {
        data,
        mimetype: asset.mimeType || res.headers.get("content-type") || "application/octet-stream",
        name,
        size: data.length,
      },
    });
    console.log(`  + media ${name}`);
    return doc.id;
  }

  return (
    image: SanityImage | { asset?: { _ref?: string } } | null | undefined,
    alt?: string | null,
  ): Promise<number | null> => {
    const ref = image?.asset?._ref;
    if (!ref) return Promise.resolve(null);
    if (!cache.has(ref)) {
      const hotspot = (image as SanityImage)?.hotspot;
      cache.set(ref, upload(ref, alt, hotspot));
    }
    return cache.get(ref)!;
  };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const isValidationError = (error: unknown) =>
  error instanceof Error && error.name === "ValidationError";

async function main() {
  const payload = await getPayload({ config });

  console.log(`Reading Sanity project ${PROJECT_ID} / ${DATASET}…`);
  const [projects, assetList] = await Promise.all([
    sanityQuery<SanityProject[]>(`
      *[_type == "project" && defined(slug.current)]
        | order(coalesce(orderRank, "zzzzzz") asc, title asc){
          ...,
          "slug": slug.current
        }
    `),
    sanityQuery<SanityAsset[]>(`
      *[_type in ["sanity.imageAsset", "sanity.fileAsset"]]{
        _id, url, originalFilename, mimeType, extension
      }
    `),
  ]);
  console.log(`Found ${projects.length} projects and ${assetList.length} assets.\n`);

  const assets = new Map(assetList.map((asset) => [asset._id, asset]));
  const resolveMedia = createMediaResolver(payload, assets);
  const summary: { slug: string; result: string }[] = [];

  for (const project of projects) {
    const slug = project.slug!;
    console.log(`→ ${project.title ?? slug}`);

    const warnings: string[] = [];
    const options: ConvertOptions = {
      resolveMedia,
      warn: (message) => {
        warnings.push(message);
        console.warn(`  ! ${message}`);
      },
    };
    const rich = (value: PTValue) => portableTextToLexical(value, options);

    const data = {
      title: project.title ?? slug,
      deliverableName: project.deliverableName ?? project.title ?? slug,
      slug,
      cardColor: project.cardColor?.hex ?? null,
      heroImage: await resolveMedia(project.heroImage),
      hoverVideo: await resolveMedia(project.hoverVideo),
      cardTags: (project.cardTags ?? []).filter(Boolean),
      shortDescription: project.shortDescription ?? null,
      timeline: project.timeline ?? "",
      team: (project.team ?? []).filter(Boolean),
      context: await rich(project.context),
      toolsAndMethods: (project.toolsAndMethods ?? []).map((group) => ({
        category: group.category ?? "",
        items: (group.items ?? []).filter(Boolean),
      })),
      brief: await rich(project.brief),
      insights: await rich(project.insights),
      deliverables: await rich(project.deliverables),
      content: await rich(project.content),
    };

    const existing = await payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
      draft: true,
      limit: 1,
      pagination: false,
    });
    const id = existing.docs[0]?.id;

    // Publish if the content passes validation. If it doesn't (e.g. a
    // required field was empty in Sanity), save it as a draft so nothing is
    // lost, and flag it to fix in the admin.
    const save = (status: "published" | "draft") => {
      // The data is built to match the schema; the generated types are
      // stricter about rich text node shapes than they need to be here.
      const payloadData = { ...data, _status: status } as never;
      const shared = {
        collection: "projects" as const,
        data: payloadData,
        draft: status === "draft",
        context: { disableRevalidate: true },
      };
      return id ? payload.update({ ...shared, id }) : payload.create(shared);
    };

    try {
      await save("published");
      summary.push({
        slug,
        result: `${id ? "updated" : "created"}, published${warnings.length ? ` (${warnings.length} warning(s))` : ""}`,
      });
    } catch (error) {
      if (!isValidationError(error)) throw error;
      console.warn(`  ! Failed validation, saving as draft: ${(error as Error).message}`);
      await save("draft");
      summary.push({ slug, result: "saved as DRAFT, fix and publish in the admin" });
    }
  }

  console.log("\nDone.");
  console.table(summary);
  process.exit(0);
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
