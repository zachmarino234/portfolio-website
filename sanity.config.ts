import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { presentationTool } from "sanity/presentation";

// The standalone studio runs at a different origin than the Next site, so the
// presentation tool must be told where the site is rendered. Defaults to the
// local dev server; set SANITY_STUDIO_PREVIEW_URL in the deployed studio's env.
const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_URL || "https://www.zmarino.com";

export default defineConfig({
  name: "default",
  title: "Portfolio Website",
  projectId: "4hlhry87",
  dataset: "production",
  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
});
