import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
    slug: string;
    title: string;
    shortDescription?: string;
    tags?: string[];
    heroImageUrl: string;
    orderLabel?: number;
}

const ProjectCard = ({
    slug,
    title,
    shortDescription,
    tags,
    heroImageUrl,
    orderLabel,
}: ProjectCardProps) => {
    const tagsString = (tags || []).join(", ");
    const displayOrder = typeof orderLabel === "number" ? orderLabel : undefined;

    return (
        <Link
            href={`/projects/${slug}`}
            aria-label={title}
            className="group block w-full max-w-[650px]"
            style={{ textDecoration: "none" }}
        >
            {/* Win2000 window chrome */}
            <div
                className="win-window"
                style={{
                    transition: "box-shadow 0.1s",
                }}
            >
                {/* Title bar */}
                <div
                    className="win-titlebar"
                    style={{
                        background: "linear-gradient(to right, #000080, #1084d0)",
                    }}
                >
                    <div className="flex items-center gap-1" style={{ minWidth: 0, overflow: "hidden" }}>
                        {/* Tiny folder icon */}
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                            <rect x="1" y="4" width="14" height="10" fill="#ffffc0" stroke="#000" strokeWidth="0.5" />
                            <rect x="1" y="4" width="5" height="2" fill="#ffff00" />
                        </svg>
                        <span
                            style={{
                                fontSize: "11px",
                                fontFamily: "var(--font-body)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {displayOrder !== undefined
                                ? `${String(displayOrder).padStart(2, "0")} - ${title}`
                                : title}
                        </span>
                    </div>
                    <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
                        <span className="win-titlebar-btn" aria-hidden="true">_</span>
                        <span className="win-titlebar-btn" aria-hidden="true">&#9633;</span>
                        <span className="win-titlebar-btn" aria-hidden="true">&#x2715;</span>
                    </div>
                </div>

                {/* Menu bar */}
                <div className="win-menubar">
                    <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>F</u>ile</span>
                    <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>V</u>iew</span>
                    <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>G</u>o</span>
                </div>

                {/* Separator */}
                <div style={{ height: "1px", background: "var(--win-btn-shadow)", margin: "0 2px" }} />
                <div style={{ height: "1px", background: "var(--win-btn-highlight)", margin: "0 2px" }} />

                {/* Image — as if it's a file viewer */}
                <div
                    className="win-inset"
                    style={{
                        margin: "4px",
                        padding: "0",
                        height: "200px",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <Image
                        src={heroImageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-150 group-hover:brightness-90"
                        sizes="(min-width: 768px) 50vw, 100vw"
                    />
                </div>

                {/* Content area */}
                <div style={{ padding: "6px 8px 4px 8px", background: "var(--win-btn-face)" }}>
                    {tagsString && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {(tags || []).map((tag) => (
                                <span key={tag} className="win-tag">{tag}</span>
                            ))}
                        </div>
                    )}

                    <div style={{ fontFamily: "var(--font-body)", color: "var(--foreground)" }}>
                        <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "2px" }}>
                            {title}
                        </div>
                        {shortDescription && (
                            <div style={{ fontSize: "11px", lineHeight: "1.4", color: "#000" }}>
                                {shortDescription}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status bar */}
                <div className="win-statusbar">
                    <div className="win-statusbar-panel" style={{ fontSize: "11px" }}>
                        View project
                    </div>
                    <div className="win-statusbar-panel" style={{ fontSize: "11px", marginLeft: "auto" }}>
                        {displayOrder !== undefined ? `Item ${displayOrder}` : ""}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
