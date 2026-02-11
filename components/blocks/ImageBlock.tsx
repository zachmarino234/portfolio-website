import Image from "next/image";
import Caption from "./Caption";

export interface ImageBlockProps {
  /** Image URL – can come from Sanity or local /public */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Optional caption text coming from the CMS */
  caption?: string;
  /** Toggle for showing the caption overlay */
  showCaption?: boolean;
  /** Optional wrapper classes to control width/layout from parent */
  className?: string;
}

export default function ImageBlock({
  src,
  alt = "",
  caption,
  showCaption = true,
  className,
}: ImageBlockProps) {
  const wrapperClasses = [
    "relative",
    "flex",
    "flex-col",
    "items-start",
    "overflow-hidden",
    "rounded-2xl",
    "border",
    "border-white/10",
    "bg-[#0A0A1E]",
    className || "w-full max-w-xl",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure className={wrapperClasses} data-name="Image Block">
      {/* Image area */}
      <div className="relative w-full aspect-558/536">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>

      {/* Caption overlay */}
      {showCaption && caption && (
        <div className=" absolute left-1/2 bottom-0 -translate-x-1/2">
          <Caption text={caption} />
        </div>
      )}
    </figure>
  );
}
