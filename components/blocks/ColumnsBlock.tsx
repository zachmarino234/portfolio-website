import React from "react";
import type { PortableTextBlock } from "@portabletext/types";
import Blockquote from "./Blockquote";
import ImageBlock from "./ImageBlock";
import { InlineTextRenderer } from "@/components/PortableTextRenderer";

export interface ColumnsBlockLeft {
  heading?: string;
  body?: PortableTextBlock[];
  quote?: string;
}

export interface ColumnsBlockRightImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface ColumnsBlockProps {
  left: ColumnsBlockLeft;
  rightImage: ColumnsBlockRightImage;
}

export default function ColumnsBlock({ left, rightImage }: ColumnsBlockProps) {
  return (
    <div
      className="w-full max-w-[1112px] flex flex-wrap items-start justify-center gap-8 md:gap-8"
      data-name="Columns Block"
    >
      <div className="flex-1 min-w-[250px] flex flex-col gap-8">
        {left.heading && (
          <h2 className="text-[22px] font-bold uppercase text-[#1e1e1e]">{left.heading}</h2>
        )}
        {left.body && left.body.length > 0 && (
          <div className="text-[16px] leading-relaxed text-[#1e1e1e] space-y-4 sm:text-2xl sm:leading-9">
            <InlineTextRenderer value={left.body} />
          </div>
        )}
        {left.quote && <Blockquote text={left.quote} className="w-full" />}
      </div>

      <div className="w-full md:w-[578px] shrink-0">
        <ImageBlock
          src={rightImage.src}
          alt={rightImage.alt ?? ""}
          caption={rightImage.caption}
          aspect="square"
          fit="cover"
        />
      </div>
    </div>
  );
}
