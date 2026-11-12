import type { ReactNode } from "react";
import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
} from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  RichText as LexicalRichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";

import ImageBlock from "@/components/blocks/ImageBlock";
import CarouselBlock from "@/components/blocks/CarouselBlock";
import ColumnsBlock from "@/components/blocks/ColumnsBlock";
import Blockquote from "@/components/blocks/Blockquote";
import IframeLoader from "@/components/IFrameLoader";
import { mediaUrl } from "@/lib/payload";
import type {
  CarouselBlock as CarouselBlockData,
  ColumnsBlock as ColumnsBlockData,
  EmbedBlock as EmbedBlockData,
  ImageBlock as ImageBlockData,
} from "@/payload-types";

// Replaces the old PortableTextRenderer. Same markup and classes, now driven by
// Payload's Lexical rich text. Two flavours:
//   - "content": the project page body, with full-width layout blocks
//   - "inline":  one-pager sections and the columns block, where images track
//                the width of their column

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      ImageBlockData | CarouselBlockData | ColumnsBlockData | EmbedBlockData
    >;

export type RichTextValue = SerializedEditorState | null | undefined;

const linkProps = (node: SerializedLinkNode) => {
  const url = node.fields?.url || "#";
  return {
    href: url,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "underline underline-offset-2 hover:opacity-80",
  };
};

// ---- Main content area ----------------------------------------------------

const contentConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => (
    <p className="w-full max-w-278 text-base leading-relaxed text-[#1e1e1e] sm:text-2xl sm:leading-9">
      {nodesToJSX({ nodes: node.children })}
    </p>
  ),
  heading: ({ node, nodesToJSX }) =>
    node.tag === "h3" || node.tag === "h4" ? (
      <h3 className="w-full max-w-278 font-bold uppercase text-[#1e1e1e] text-xl sm:text-2xl">
        {nodesToJSX({ nodes: node.children })}
      </h3>
    ) : (
      <h2 className="w-full max-w-278 font-bold uppercase text-[#1e1e1e] text-2xl sm:text-[28px]">
        {nodesToJSX({ nodes: node.children })}
      </h2>
    ),
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const className =
      "w-full max-w-278 pl-5 text-base leading-relaxed text-[#1e1e1e] space-y-1 sm:text-2xl sm:leading-9";
    return node.listType === "number" ? (
      <ol className={`${className} list-decimal`}>{children}</ol>
    ) : (
      <ul className={`${className} list-disc`}>{children}</ul>
    );
  },
  quote: ({ node, nodesToJSX }) => (
    <figure className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl mx-auto py-4">
      <div className="h-0.5 w-full bg-[#1e1e1e]" />
      <blockquote className="text-center text-[#1e1e1e] font-semibold text-md sm:text-xl">
        {nodesToJSX({ nodes: node.children })}
      </blockquote>
      <div className="h-0.5 w-full bg-[#1e1e1e]" />
    </figure>
  ),
  link: ({ node, nodesToJSX }) => (
    <a {...linkProps(node)}>{nodesToJSX({ nodes: node.children })}</a>
  ),
  blocks: {
    image: ({ node }) => {
      const { image, alt, caption, hideCaption } = node.fields;
      const src = mediaUrl(image, "xl");
      if (!src) return null;
      return (
        <ImageBlock
          src={src}
          zoomSrc={mediaUrl(image)}
          alt={alt ?? undefined}
          caption={caption ?? undefined}
          showCaption={!hideCaption}
          className="w-full max-w-278"
        />
      );
    },
    carousel: ({ node }) => {
      const images = (node.fields.images ?? []).flatMap((item) => {
        const src = mediaUrl(item.image, "xl");
        return src
          ? [{ src, zoomSrc: mediaUrl(item.image), alt: item.alt ?? undefined }]
          : [];
      });
      return images.length ? <CarouselBlock images={images} /> : null;
    },
    columns: ({ node }) => {
      const { leftHeading, leftBody, leftQuote, rightImage } = node.fields;
      const src = mediaUrl(rightImage?.image, "xl");
      if (!src) return null;
      return (
        <ColumnsBlock
          left={{
            heading: leftHeading ?? undefined,
            body: leftBody as RichTextValue,
            quote: leftQuote ?? undefined,
          }}
          rightImage={{
            src,
            zoomSrc: mediaUrl(rightImage?.image),
            alt: rightImage?.alt ?? undefined,
            caption: rightImage?.caption ?? undefined,
          }}
        />
      );
    },
    embed: ({ node }) => {
      const { title, url } = node.fields;
      if (!url) return null;
      return (
        <div className="w-full max-w-278 flex flex-col gap-4">
          {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
          <IframeLoader src={url} title={title || "Embedded content"} />
        </div>
      );
    },
  },
});

// ---- Inline (one-pager, columns) ------------------------------------------

const inlineConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => (
    <p className="text-base leading-relaxed sm:text-2xl sm:leading-9">
      {nodesToJSX({ nodes: node.children })}
    </p>
  ),
  heading: ({ node, nodesToJSX }) =>
    node.tag === "h3" || node.tag === "h4" ? (
      <h3 className="font-bold uppercase text-[#1e1e1e] text-xl sm:text-2xl">
        {nodesToJSX({ nodes: node.children })}
      </h3>
    ) : (
      <h2 className="font-bold uppercase text-[#1e1e1e] text-2xl sm:text-[28px]">
        {nodesToJSX({ nodes: node.children })}
      </h2>
    ),
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const className = "pl-5 space-y-1 text-base leading-relaxed sm:text-2xl sm:leading-9";
    return node.listType === "number" ? (
      <ol className={`${className} list-decimal`}>{children}</ol>
    ) : (
      <ul className={`${className} list-disc`}>{children}</ul>
    );
  },
  quote: ({ node, nodesToJSX }) => (
    <Blockquote className="w-full">{nodesToJSX({ nodes: node.children })}</Blockquote>
  ),
  link: ({ node, nodesToJSX }) => (
    <a {...linkProps(node)}>{nodesToJSX({ nodes: node.children })}</a>
  ),
  blocks: {
    image: ({ node }) => {
      const { image, alt, caption, hideCaption } = node.fields;
      const src = mediaUrl(image, "xl");
      if (!src) return null;
      return (
        <ImageBlock
          src={src}
          zoomSrc={mediaUrl(image)}
          alt={alt ?? undefined}
          caption={caption ?? undefined}
          showCaption={!hideCaption}
          // No max-width: the image tracks the width of its containing box.
          className="w-full"
          sizes="(max-width: 1024px) 100vw, 718px"
        />
      );
    },
  },
});

function render(
  data: RichTextValue,
  converters: JSXConvertersFunction<NodeTypes>,
): ReactNode {
  if (!data?.root?.children?.length) return null;
  return <LexicalRichText data={data} converters={converters} disableContainer />;
}

/** Project page body: headings, text, images, carousels, columns, embeds. */
export function ContentRenderer({ value }: { value: RichTextValue }) {
  return render(value, contentConverters);
}

/** One-pager sections and the columns block's text. */
export function InlineTextRenderer({ value }: { value: RichTextValue }) {
  return render(value, inlineConverters);
}
