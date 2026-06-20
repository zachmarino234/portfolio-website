type MirrorTextProps = {
    /** The label. Rendered four times (decorative ghosts + face + the real
        white layer); pass plain text so the accessible name stays correct. */
    children: string;
    /** Extra classes for the stack wrapper: font, size, and
        `mirror-stack--block` for full-width/block layout. */
    className?: string;
};

/**
 * Layered "mirror" text: flat white at rest, with the gradient + stepped ghost
 * depth assembling on hover/focus of the nearest `.mirror-group` ancestor.
 *
 * The accessible name comes from the solid-white layer only; the gradient face
 * and the two ghosts are decorative (`aria-hidden`), so screen readers read the
 * label once. Mirror tokens (gradient, offsets, opacities) live in gradientbg.css.
 */
const MirrorText = ({ children, className }: MirrorTextProps) => {
    return (
        <span className={`mirror-stack${className ? ` ${className}` : ""}`}>
            <span aria-hidden="true" className="mirror-layer mirror-layer--back">{children}</span>
            <span aria-hidden="true" className="mirror-layer mirror-layer--mid">{children}</span>
            <span aria-hidden="true" className="mirror-layer mirror-layer--face">{children}</span>
            <span className="mirror-layer mirror-layer--white">{children}</span>
        </span>
    );
};

export default MirrorText;
