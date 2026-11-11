import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "filename",
  },
  upload: {
    mimeTypes: ["image/*", "video/*"],
    // Replaces Sanity's hotspot: drag the focal point in the admin and the
    // cropped sizes below (and the card's object-position) follow it.
    focalPoint: true,
    imageSizes: [
      // Home page card. Same 1800×840 crop the Sanity query asked for.
      { name: "card", width: 1800, height: 840 },
      // Capped renders so the hero / in-content images never pull a
      // multi-MB original into the optimizer. The original is kept for zoom.
      { name: "xl", width: 2000 },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      admin: {
        description:
          "Default alt text. Image blocks can override it where they're used.",
      },
    },
    {
      // Set by scripts/migrate-from-sanity.ts so re-running it doesn't
      // upload the same file twice.
      name: "sanityAssetId",
      type: "text",
      index: true,
      admin: { hidden: true },
    },
  ],
};
