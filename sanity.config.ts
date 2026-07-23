import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { schemaTypes } from "./sanity/schemas";
import { presentationTool } from "sanity/presentation";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

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
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Content")
          .items([
            // Drag-and-drop ordered list of projects. Dragging a card here
            // rewrites only that card's rank string.
            orderableDocumentListDeskItem({
              type: "project",
              title: "Projects (ordered)",
              S,
              context,
            }),
            // Keep every other document type in the default list.
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "project",
            ),
          ]),
    }),
    visionTool(),
    colorInput(),
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
