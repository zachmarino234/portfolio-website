import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

import type { Media, Project } from "@/payload-types";

// All site data comes through Payload's Local API: no HTTP hop, no API token.
// Pages are statically rendered and re-rendered on publish by the
// revalidation hooks in payload/collections/Projects.ts.

export const getPayloadClient = () => getPayload({ config });

const published = { _status: { equals: "published" } } as const;

// ---------------------------------------------------------------------------
// Media helpers
// ---------------------------------------------------------------------------

type MediaRef = number | Media | null | undefined;

const asMedia = (value: MediaRef): Media | undefined =>
  value && typeof value === "object" ? value : undefined;

/**
 * URL for an uploaded file. Pass a size name to get a pre-cropped render; it
 * falls back to the original when that size wasn't generated (Payload skips
 * sizes larger than the source image).
 */
export function mediaUrl(
  value: MediaRef,
  size?: keyof NonNullable<Media["sizes"]>,
): string | undefined {
  const media = asMedia(value);
  if (!media) return undefined;
  const sized = size ? media.sizes?.[size]?.url : undefined;
  return sized || media.url || undefined;
}

/** Width / height of the original, so heroes can reserve their box. */
export function mediaAspectRatio(value: MediaRef): number | undefined {
  const media = asMedia(value);
  if (!media?.width || !media?.height) return undefined;
  return media.width / media.height;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Published projects in admin drag-and-drop order, for the grid + footer. */
export const getProjectList = cache(async (): Promise<Project[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    where: { and: [published, { heroImage: { exists: true } }] },
    sort: "_order",
    depth: 1,
    limit: 100,
    pagination: false,
  });
  return docs;
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "projects",
      where: { and: [published, { slug: { equals: slug } }] },
      // Rich text → block → group → upload needs a few levels to populate.
      depth: 3,
      limit: 1,
      pagination: false,
    });
    return docs[0] ?? null;
  },
);

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjectList();
  return projects.map((project) => project.slug).filter(Boolean);
}
