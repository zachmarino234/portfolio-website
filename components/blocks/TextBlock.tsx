import React from "react";
import HeadingBlock from "./HeadingBlock";

export interface TextBlockProps {
  text?: string;
  heading?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
}

export default function TextBlock({
  text = "",
  heading,
  headingLevel = "h2",
  className,
}: TextBlockProps) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);

  const wrapperClasses = ["w-full", className ?? ""].filter(Boolean).join(" ");

  const bodyClasses = [
    "text-[12px]",
    "leading-relaxed",
    "text-white",
    "space-y-4",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      {heading && (
        <HeadingBlock text={heading} level={headingLevel} className="mb-6" />
      )}

      {paragraphs.length > 0 && (
        <div className={bodyClasses}>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
}
