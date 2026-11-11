import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";

import { ImageBlock } from "./blocks/ImageBlock";
import { CarouselBlock } from "./blocks/CarouselBlock";
import { ColumnsBlock } from "./blocks/ColumnsBlock";
import { EmbedBlock } from "./blocks/EmbedBlock";

// Features the old Sanity Portable Text didn't have and the site doesn't
// render. Dropping them keeps the toolbar honest.
const UNUSED_FEATURES = new Set([
  "upload", // images go through the Image block so they get captions + lightbox
  "relationship",
  "checklist",
  "indent",
  "align",
  "subscript",
  "superscript",
  "inlineCode",
]);

const baseFeatures = <T extends { key: string }>(defaultFeatures: T[]) =>
  defaultFeatures.filter((feature) => !UNUSED_FEATURES.has(feature.key));

/** Plain rich text: paragraphs, headings, lists, quotes, bold/italic, links. */
export const defaultEditor = lexicalEditor({
  features: ({ defaultFeatures }) => baseFeatures(defaultFeatures),
});

/** One-pager sections (brief / insights / deliverables): text plus images. */
export const onePagerEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...baseFeatures(defaultFeatures),
    BlocksFeature({ blocks: [ImageBlock] }),
  ],
});

/** Project page body: text plus every layout block. */
export const contentEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...baseFeatures(defaultFeatures),
    BlocksFeature({
      blocks: [ImageBlock, CarouselBlock, ColumnsBlock, EmbedBlock],
    }),
  ],
});
