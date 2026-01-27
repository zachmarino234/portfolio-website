import { ReactNode } from "react";

interface PageMainProps {
  children: ReactNode;
  /** Whether to apply min-h-screen. Defaults to true. */
  minHeight?: boolean;
  /** Whether to apply gap-10 between stacked children. Defaults to true. */
  withGap?: boolean;
}

export default function PageMain({
  children,
  minHeight = true,
  withGap = true,
}: PageMainProps) {
  const classes = [
    "flex",
    "w-full",
    "flex-col",
    "items-center",
    minHeight ? "min-h-screen" : "",
    withGap ? "gap-10" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <main className={classes}>{children}</main>;
}
