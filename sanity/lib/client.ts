import { createClient } from "next-sanity";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID;

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET;

const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ||
  process.env.SANITY_STUDIO_URL;

const visualEditingEnabled =
  process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING === "true";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  stega: {
    enabled: visualEditingEnabled,
    studioUrl,
  },
});