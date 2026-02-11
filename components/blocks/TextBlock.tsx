import React from "react";

export interface TextBlockProps {
  text: string;
  className?: string;
}

export default function TextBlock({ text, className }: TextBlockProps) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);

  const classes = [
    "text-[12px]",
    "leading-relaxed",
    "text-white",
    "space-y-4",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
