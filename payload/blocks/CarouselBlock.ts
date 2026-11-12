import type { Block } from "payload";
import { imageFields } from "./ImageBlock";

export const CarouselBlock: Block = {
  slug: "carousel",
  interfaceName: "CarouselBlock",
  labels: { singular: "Carousel", plural: "Carousels" },
  fields: [
    {
      name: "images",
      type: "array",
      minRows: 1,
      required: true,
      fields: imageFields,
    },
  ],
};
