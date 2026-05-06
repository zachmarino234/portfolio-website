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
    return urlFor(image).url();
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
      <h2 className="w-full max-w-278 font-semibold text-white text-2xl sm:text-[28px]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="w-full max-w-278 font-semibold text-white text-xl sm:text-2xl">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="w-full max-w-278 text-[12px] leading-relaxed text-white">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <figure className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl mx-auto py-4">
        <div className="h-0.5 w-full bg-white" />
        <blockquote className="text-center text-white font-semibold text-md sm:text-xl">
          {children}
        </blockquote>
        <div className="h-0.5 w-full bg-white" />
      </figure>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="w-full max-w-278 list-disc pl-5 text-[12px] leading-relaxed text-white space-y-1">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="w-full max-w-278 list-decimal pl-5 text-[12px] leading-relaxed text-white space-y-1">
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
      <h2 className="w-full max-w-278 font-semibold text-white text-2xl sm:text-[28px]">
        {value.heading}
      </h2>
    ),
    textBlock: ({ value }) => {
      const body = value.body as PortableTextBlock[] | undefined;
      return (
        <div className="w-full max-w-278">
          {value.title && (
            <h2 className="font-semibold text-white text-2xl sm:text-[28px] mb-6">
              {value.title}
            </h2>
          )}
          {body && (
            <div className="text-[12px] leading-relaxed text-white space-y-4">
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
          alt={value.alt}
          caption={value.caption}
          className="w-full max-w-278"
        />
      );
    },
    carouselBlock: ({ value }) => {
      const images = (value.images || []).reduce(
        (acc: { src: string; alt?: string }[], imageBlock: { image?: ImageValue; alt?: string }) => {
          if (!imageBlock?.image) return acc;
          const src = getImageUrl(imageBlock.image);
          if (!src) return acc;
          acc.push({ src, alt: imageBlock.alt });
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
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="font-semibold text-white text-2xl sm:text-[28px]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-semibold text-white text-xl sm:text-2xl">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
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
