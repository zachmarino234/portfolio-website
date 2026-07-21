import React from "react";

export interface BlockquoteProps {
  /** Quote text, expected to come from the CMS */
  text: string;
  /** Optional extra classes so layouts can control width/spacing */
  className?: string;
}

export default function Blockquote({ text, className }: BlockquoteProps) {
  const wrapperClasses = [
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "gap-4",
    "w-full",
    "max-w-2xl",
    "mx-auto",
    "py-4",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure className={wrapperClasses} data-name="Blockquote">
      <div className="h-0.5 w-full bg-[#1e1e1e]" />
      <blockquote className="text-center text-[#1e1e1e] font-semibold text-md sm:text-xl">
        {text}
      </blockquote>
      <div className="h-0.5 w-full bg-[#1e1e1e]" />
    </figure>
  );
}
