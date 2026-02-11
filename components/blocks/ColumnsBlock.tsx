import React from "react";
import Blockquote from "./Blockquote";
import ImageBlock from "./ImageBlock";

export interface ColumnsBlockLeft {
  heading?: string;
  text?: string;
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
  const paragraphs = (left.text ?? "").split(/\n\n+/).filter(Boolean);

  return (
    <div
      className="w-full max-w-[1112px] flex flex-wrap items-start justify-center gap-8 md:gap-8"
      data-name="Columns Block"
    >
      <div className="flex-1 min-w-[250px] flex flex-col gap-8">
        {left.heading && (
          <h2 className="text-[22px] font-semibold text-white">{left.heading}</h2>
        )}
        {paragraphs.length > 0 && (
          <div className="text-[16px] leading-relaxed text-white space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
        {left.quote && <Blockquote text={left.quote} className="w-full" />}
      </div>

      <div className="w-full md:w-[578px] shrink-0">
        <ImageBlock
          src={rightImage.src}
          alt={rightImage.alt ?? ""}
          caption={rightImage.caption}
        />
      </div>
    </div>
  );
}
