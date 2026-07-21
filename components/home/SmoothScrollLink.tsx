"use client";

// An in-page anchor that smooth-scrolls to its target (matching the PROJECTS
// sticker's behavior) instead of jumping. Falls back to a normal anchor jump if
// JS hasn't loaded or the target is missing. Target sections set `scroll-mt-*`
// so they land below any sticky UI.
const SmoothScrollLink = ({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <a href={href} aria-label={label} onClick={onClick} className={className}>
      {children}
    </a>
  );
};

export default SmoothScrollLink;
