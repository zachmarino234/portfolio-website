import React from "react";

export interface CaptionProps {
  /** Caption text coming from the CMS */
  text: string;
  /** Optional additional classes to adjust layout/position */
  className?: string;
}

export default function Caption({ text, className }: CaptionProps) {
  const classes = [
    "inline-flex",
    "items-end",
    "px-3",
    "py-2.5",
    "rounded-t-lg",
    "border",
    "border-white/10",
    "bg-[rgba(10,10,30,0.85)]",
    "backdrop-blur-sm",
    "text-sm",
    "text-white",
    "max-w-full",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} data-name="Caption">
      <p className="leading-[18px] whitespace-pre-wrap">{text}</p>
    </div>
  );
}
