import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import ImageBlock from "@/components/blocks/ImageBlock";
import CarouselBlock from "@/components/blocks/CarouselBlock";
import ColumnsBlock from "@/components/blocks/ColumnsBlock";
import Blockquote from "@/components/blocks/Blockquote";
import IframeLoader from "@/components/IFrameLoader";
import { urlFor } from "@/sanity/lib/image";

type ImageValue = {
  _type: "image";
  asset?: { _ref?: string } | null;
};

function getImageUrl(image?: ImageValue) {
  if (!image || !image.asset || !image.asset._ref) return undefined;
  try {
    // Cap the source resolution so Next's optimizer isn't pulling multi-MB
    // originals for in-content images. Content columns are narrower than the
    // hero, so 1600px is plenty even on retina; `auto("format")` serves
    // WebP/AVIF where supported.
    return urlFor(image).width(1600).auto("format").url();
  } catch {
    return undefined;
  }
}

function getZoomImageUrl(image?: ImageValue) {
  if (!image || !image.asset || !image.asset._ref) return undefined;
  try {
    // Source for the click-to-enlarge overlay: a much larger, lightly
    // compressed render so zooming in actually reveals detail the inline
    // version loses. Only fetched once the reader clicks, and Sanity never
    // upscales past the original, so this is a ceiling rather than a resize.
    return urlFor(image).width(3000).quality(95).auto("format").url();
  } catch {
    return undefined;
  }
}

/**
 * Portable Text component config for the main content area.
 * Handles both native block styles and custom object types.
 */
export const contentComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="w-full max-w-278 font-bold uppercase text-[#1e1e1e] text-2xl sm:text-[28px]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="w-full max-w-278 font-bold uppercase text-[#1e1e1e] text-xl sm:text-2xl">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="w-full max-w-278 text-base leading-relaxed text-[#1e1e1e] sm:text-2xl sm:leading-9">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <figure className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl mx-auto py-4">
        <div className="h-0.5 w-full bg-[#1e1e1e]" />
        <blockquote className="text-center text-[#1e1e1e] font-semibold text-md sm:text-xl">
          {children}
        </blockquote>
        <div className="h-0.5 w-full bg-[#1e1e1e]" />
      </figure>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="w-full max-w-278 list-disc pl-5 text-base leading-relaxed text-[#1e1e1e] space-y-1 sm:text-2xl sm:leading-9">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="w-full max-w-278 list-decimal pl-5 text-base leading-relaxed text-[#1e1e1e] space-y-1 sm:text-2xl sm:leading-9">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-80"
      >
        {children}
      </a>
    ),
  },
  types: {
    // Legacy custom block types (backward compat for existing content)
    headingBlock: ({ value }) => (
      <h2 className="w-full max-w-278 font-bold uppercase text-[#1e1e1e] text-2xl sm:text-[28px]">
        {value.heading}
      </h2>
    ),
    textBlock: ({ value }) => {
      const body = value.body as PortableTextBlock[] | undefined;
      return (
        <div className="w-full max-w-278">
          {value.title && (
            <h2 className="font-bold uppercase text-[#1e1e1e] text-2xl sm:text-[28px] mb-6">
              {value.title}
            </h2>
          )}
          {body && (
            <div className="text-base leading-relaxed text-[#1e1e1e] space-y-4 sm:text-2xl sm:leading-9">
              <PortableText value={body} components={inlineTextComponents} />
            </div>
          )}
        </div>
      );
    },
    blockquote: ({ value }) => (
      <Blockquote text={value.text || ""} className="w-full max-w-131" />
    ),
    imageBlock: ({ value }) => {
      const src = getImageUrl(value.image);
      if (!src) return null;
      return (
        <ImageBlock
          src={src}
          zoomSrc={getZoomImageUrl(value.image)}
          alt={value.alt}
          caption={value.caption}
          className="w-full max-w-278"
        />
      );
    },
    carouselBlock: ({ value }) => {
      const images = (value.images || []).reduce(
        (
          acc: { src: string; zoomSrc?: string; alt?: string }[],
          imageBlock: { image?: ImageValue; alt?: string },
        ) => {
          if (!imageBlock?.image) return acc;
          const src = getImageUrl(imageBlock.image);
          if (!src) return acc;
          acc.push({ src, zoomSrc: getZoomImageUrl(imageBlock.image), alt: imageBlock.alt });
          return acc;
        },
        [],
      );
      if (!images.length) return null;
      return <CarouselBlock images={images} />;
    },
    columnsBlock: ({ value }) => {
      const src = getImageUrl(value.rightImage?.image);
      if (!src) return null;
      const leftBody = value.leftBody as PortableTextBlock[] | undefined;
      return (
        <ColumnsBlock
          left={{
            heading: value.leftHeading,
            body: leftBody,
            quote: value.leftQuote?.text,
          }}
          rightImage={{
            src,
            zoomSrc: getZoomImageUrl(value.rightImage?.image),
            alt: value.rightImage?.alt,
            caption: value.rightImage?.caption,
          }}
        />
      );
    },
    embedBlock: ({ value }) => {
      if (!value.url) return null;
      return (
        <div className="w-full max-w-278 flex flex-col gap-4">
          {value.title && (
            <h2 className="text-lg font-semibold tracking-tight">{value.title}</h2>
          )}
          <IframeLoader src={value.url} title={value.title || "Embedded content"} />
        </div>
      );
    },
  },
};

/**
 * Simpler component config for inline rich text (inside textBlock body,
 * one-pager fields, columns left body, etc.)
 */
export const inlineTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-relaxed sm:text-2xl sm:leading-9">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-bold uppercase text-[#1e1e1e] text-2xl sm:text-[28px]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-bold uppercase text-[#1e1e1e] text-xl sm:text-2xl">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 space-y-1 text-base leading-relaxed sm:text-2xl sm:leading-9">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-1 text-base leading-relaxed sm:text-2xl sm:leading-9">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-80"
      >
        {children}
      </a>
    ),
  },
};

/**
 * Renders a Portable Text array for the main content area with full
 * block-level layout (headings, images, carousels, etc.)
 */
export function ContentRenderer({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={contentComponents} />;
}

/**
 * Renders a Portable Text array for inline rich text (paragraphs,
 * bold, italic, links — no block-level custom types).
 */
export function InlineTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={inlineTextComponents} />;
}
