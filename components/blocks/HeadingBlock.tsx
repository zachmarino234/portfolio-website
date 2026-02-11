import React from "react";

export interface HeadingBlockProps {
  text: string;
  level?: "h2" | "h3";
  className?: string;
}

export default function HeadingBlock({
  text,
  level = "h2",
  className,
}: HeadingBlockProps) {
  const Component = level;

  const classes = [
    "font-semibold",
    "text-white",
    level === "h2" ? "text-2xl sm:text-[28px]" : "text-xl sm:text-2xl",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes}>{text}</Component>;
}
