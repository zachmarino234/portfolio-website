import type { Block } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

// Text on the left, image on the right.
export const ColumnsBlock: Block = {
  slug: "columns",
  interfaceName: "ColumnsBlock",
  labels: { singular: "Two columns", plural: "Two columns" },
  fields: [
    {
      name: "leftHeading",
      type: "text",
      required: true,
    },
    {
      name: "leftBody",
      type: "richText",
      required: true,
      editor: lexicalEditor(),
    },
    {
      name: "leftQuote",
      type: "textarea",
      admin: { description: "Optional pull quote under the text." },
    },
    {
      name: "rightImage",
      type: "group",
      fields: [
        // Optional here, as it was in Sanity. Without an image the block
        // isn't rendered.
        { name: "image", type: "upload", relationTo: "media" },
        { name: "alt", type: "text" },
        { name: "caption", type: "text" },
      ],
    },
  ],
};
