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
  /** Controls the image frame shape for different layouts */
  aspect?: "video" | "square";
  /** Controls how the image scales inside the frame */
  fit?: "contain" | "cover" | "width";
}

export default function ImageBlock({
  src,
  alt = "",
  caption,
  showCaption = true,
  className,
  aspect = "video",
  fit = "width",
}: ImageBlockProps) {
  const wrapperClasses = [
    "relative",
    "flex",
    "flex-col",
    "items-start",
    fit === "width" ? "overflow-visible" : "overflow-hidden",
    "rounded-2xl",
    "border",
    "border-white/10",
    "bg-[#0A0A1E]",
    className || "w-full max-w-xl",
  ]
    .filter(Boolean)
    .join(" ");

  const imageAreaClasses = [
    "relative",
    "w-full",
    "overflow-hidden",
    "rounded-[inherit]",
    fit === "width" ? "" : aspect === "square" ? "aspect-square" : "aspect-video",
    fit === "width" ? "" : "bg-[#060616]",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure className={wrapperClasses} data-name="Image Block">
      {/* Image area */}
      <div className={imageAreaClasses}>
        {fit === "width" ? (
          <Image
            src={src}
            alt={alt}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 1112px"
            className="block h-auto w-full"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 1112px"
            className={fit === "cover" ? "object-cover" : "object-contain"}
          />
        )}
      </div>

      {/* Caption overlay */}
      {showCaption && caption && (
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
          <Caption text={caption} />
        </div>
      )}
    </figure>
  );
}
