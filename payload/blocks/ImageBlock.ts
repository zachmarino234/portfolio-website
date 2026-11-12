import type { Block, Field } from "payload";

/** Image + alt + caption. Reused by the carousel and the columns block. */
export const imageFields: Field[] = [
  {
    name: "image",
    type: "upload",
    relationTo: "media",
    required: true,
  },
  {
    name: "alt",
    type: "text",
    admin: { description: "Describe the image for screen readers." },
  },
  {
    name: "caption",
    type: "text",
  },
];

export const ImageBlock: Block = {
  slug: "image",
  interfaceName: "ImageBlock",
  labels: { singular: "Image", plural: "Images" },
  fields: [
    ...imageFields,
    {
      name: "hideCaption",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};
