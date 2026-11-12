// Converts Sanity Portable Text (plus the portfolio's custom block objects)
// into Payload Lexical editor state. Pure apart from the `resolveMedia`
// callback, which uploads an asset and returns its Payload media id.

import { randomBytes } from "crypto";

// ---- Sanity shapes (only what we read) ------------------------------------

type SanityRef = { _ref?: string } | null | undefined;
export type SanityImage = {
  _type?: string;
  asset?: SanityRef;
  hotspot?: { x?: number; y?: number } | null;
} | null | undefined;

type Span = { _type: "span"; _key?: string; text?: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };
type PTBlock = {
  _type: "block";
  _key?: string;
  style?: string;
  listItem?: "bullet" | "number" | string;
  level?: number;
  children?: (Span | { _type: string })[];
  markDefs?: MarkDef[];
};
type SanityObject = { _type: string; _key?: string; [key: string]: unknown };
export type PTValue = (PTBlock | SanityObject)[] | null | undefined;

export type ResolveMedia = (
  image: SanityImage,
  alt?: string | null,
) => Promise<number | null>;

// ---- Lexical shapes --------------------------------------------------------

type LexicalNode = { type: string; version: number; [key: string]: unknown };
export type LexicalState = { root: LexicalNode & { children: LexicalNode[] } };

const element = (type: string, children: LexicalNode[], extra: object = {}): LexicalNode => ({
  type,
  version: 1,
  direction: "ltr",
  format: "",
  indent: 0,
  children,
  ...extra,
});

const objectId = () => randomBytes(12).toString("hex");

const FORMAT_BITS: Record<string, number> = {
  strong: 1,
  em: 2,
  "strike-through": 4,
  underline: 8,
  code: 16,
};

export const emptyState = (): LexicalState => ({
  root: element("root", []) as LexicalState["root"],
});

const stateOf = (children: LexicalNode[]): LexicalState => ({
  root: element("root", children) as LexicalState["root"],
});

// ---- Inline content --------------------------------------------------------

function textNodes(text: string, format: number): LexicalNode[] {
  // Soft line breaks inside a span become Lexical linebreak nodes.
  const nodes: LexicalNode[] = [];
  text.split("\n").forEach((part, index) => {
    if (index > 0) nodes.push({ type: "linebreak", version: 1 });
    if (part) {
      nodes.push({
        type: "text",
        version: 1,
        text: part,
        format,
        mode: "normal",
        style: "",
        detail: 0,
      });
    }
  });
  return nodes;
}

function inlineChildren(block: PTBlock): LexicalNode[] {
  const markDefs = new Map((block.markDefs ?? []).map((def) => [def._key, def]));
  const out: LexicalNode[] = [];
  let currentLink: { key: string; node: LexicalNode & { children: LexicalNode[] } } | null = null;

  for (const child of block.children ?? []) {
    if (child._type !== "span") continue;
    const span = child as Span;
    const marks = span.marks ?? [];
    const format = marks.reduce((bits, mark) => bits | (FORMAT_BITS[mark] ?? 0), 0);
    const linkKey = marks.find((mark) => markDefs.get(mark)?._type === "link");
    const nodes = textNodes(span.text ?? "", format);

    if (linkKey) {
      if (!currentLink || currentLink.key !== linkKey) {
        const href: string = markDefs.get(linkKey)?.href ?? "";
        currentLink = {
          key: linkKey,
          node: element("link", [], {
            version: 3,
            id: objectId(),
            fields: { linkType: "custom", url: href, newTab: true },
          }) as LexicalNode & { children: LexicalNode[] },
        };
        out.push(currentLink.node);
      }
      currentLink.node.children.push(...nodes);
    } else {
      currentLink = null;
      out.push(...nodes);
    }
  }
  return out;
}

const paragraph = (children: LexicalNode[]) =>
  element("paragraph", children, { textFormat: 0, textStyle: "" });

const plainText = (text: string) => textNodes(text, 0);

function textBlockNode(block: PTBlock): LexicalNode {
  const children = inlineChildren(block);
  switch (block.style) {
    case "h1":
    case "h2":
      return element("heading", children, { tag: "h2" });
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return element("heading", children, { tag: "h3" });
    case "blockquote":
      return element("quote", children);
    default:
      return paragraph(children);
  }
}

// ---- Custom objects --------------------------------------------------------

const blockNode = (blockType: string, fields: object): LexicalNode => ({
  type: "block",
  version: 2,
  format: "",
  fields: { id: objectId(), blockName: "", blockType, ...fields },
});

type ImageBlockValue = {
  image?: SanityImage;
  alt?: string | null;
  caption?: string | null;
  hideCaption?: boolean | null;
};

export type ConvertOptions = {
  resolveMedia: ResolveMedia;
  /** Called for anything that can't be carried over. */
  warn: (message: string) => void;
};

async function convertObject(
  value: SanityObject,
  options: ConvertOptions,
): Promise<LexicalNode[]> {
  const { resolveMedia, warn } = options;

  switch (value._type) {
    case "imageBlock": {
      const v = value as unknown as ImageBlockValue;
      const media = await resolveMedia(v.image, v.alt);
      if (!media) {
        warn("Skipped an image block with no image.");
        return [];
      }
      return [
        blockNode("image", {
          image: media,
          alt: v.alt ?? null,
          caption: v.caption ?? null,
          hideCaption: Boolean(v.hideCaption),
        }),
      ];
    }

    case "carouselBlock": {
      const items = (value.images as ImageBlockValue[] | undefined) ?? [];
      const images = [];
      for (const item of items) {
        const media = await resolveMedia(item?.image, item?.alt);
        if (media) {
          images.push({
            id: objectId(),
            image: media,
            alt: item.alt ?? null,
            caption: item.caption ?? null,
          });
        }
      }
      if (!images.length) {
        warn("Skipped a carousel with no images.");
        return [];
      }
      return [blockNode("carousel", { images })];
    }

    case "columnsBlock": {
      const right = (value.rightImage as ImageBlockValue | undefined) ?? {};
      const media = await resolveMedia(right.image, right.alt);
      const quote = value.leftQuote as { text?: string } | undefined;
      return [
        blockNode("columns", {
          leftHeading: (value.leftHeading as string) ?? "",
          leftBody: await portableTextToLexical(value.leftBody as PTValue, options),
          leftQuote: quote?.text ?? null,
          rightImage: {
            image: media,
            alt: right.alt ?? null,
            caption: right.caption ?? null,
          },
        }),
      ];
    }

    case "embedBlock":
      if (!value.url) {
        warn("Skipped an embed with no URL.");
        return [];
      }
      return [blockNode("embed", { title: value.title ?? null, url: value.url })];

    // Legacy types the old renderer still supported.
    case "headingBlock":
      return [element("heading", plainText(String(value.heading ?? "")), { tag: "h2" })];

    case "textBlock": {
      const nodes: LexicalNode[] = [];
      if (value.title) {
        nodes.push(element("heading", plainText(String(value.title)), { tag: "h2" }));
      }
      const body = await portableTextToLexical(value.body as PTValue, options);
      nodes.push(...body.root.children);
      return nodes;
    }

    case "blockquote":
      return value.text ? [element("quote", plainText(String(value.text)))] : [];

    default:
      warn(`Skipped an unknown block type "${value._type}".`);
      return [];
  }
}

// ---- Entry point -------------------------------------------------------------

export async function portableTextToLexical(
  value: PTValue,
  options: ConvertOptions,
): Promise<LexicalState> {
  const children: LexicalNode[] = [];
  // The list being built, if the previous block was a list item of the same type.
  let openList: { listType: string; node: LexicalNode & { children: LexicalNode[] } } | null =
    null;

  for (const item of value ?? []) {
    if (item._type === "block") {
      const block = item as PTBlock;

      if (block.listItem) {
        const listType = block.listItem === "number" ? "number" : "bullet";
        if (!openList || openList.listType !== listType) {
          openList = {
            listType,
            node: element("list", [], {
              listType,
              tag: listType === "number" ? "ol" : "ul",
              start: 1,
            }) as LexicalNode & { children: LexicalNode[] },
          };
          children.push(openList.node);
        }
        openList.node.children.push(
          element("listitem", inlineChildren(block), {
            value: openList.node.children.length + 1,
            // Nested Portable Text lists are flattened and indented.
            indent: Math.max(0, (block.level ?? 1) - 1),
          }),
        );
        continue;
      }

      openList = null;
      children.push(textBlockNode(block));
      continue;
    }

    openList = null;
    children.push(...(await convertObject(item as SanityObject, options)));
  }

  return stateOf(children);
}
