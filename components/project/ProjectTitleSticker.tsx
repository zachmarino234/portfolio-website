// The project headline rendered as a yellow "sticker" (Figma node 88:335).
// The accent yellow is a fixed brand color across all projects, matching the
// home page name sticker. The sticker straddles the hero image / gradient
// boundary (positioning handled by the parent). The PNG paint-stroke texture
// from the design is intentionally deferred (added later) — see the hook below.

const ACCENT_YELLOW = "#ffd603";

export default function ProjectTitleSticker({ title }: { title: string }) {
  return (
    <div
      className="relative inline-block overflow-hidden rounded-lg border-[5px] border-[#eaeaea] px-3 py-3 shadow-[0_1px_1px_0_rgba(0,0,0,0.25)]"
      style={{ backgroundColor: ACCENT_YELLOW }}
    >
      <h1 className="whitespace-nowrap font-bold tracking-[-0.02em] text-[#282828] text-2xl leading-tight sm:text-4xl">
        {title}
      </h1>

      {/* Crumpled-poster paper texture. Sits on top with mix-blend-multiply so
          the creases cross the whole sticker; the texture is mostly white, so it
          only subtly darkens the yellow and barely touches the dark text. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center mix-blend-multiply"
        style={{ backgroundImage: "url('/images/textures/paper-texture.jpg')" }}
      />
    </div>
  );
}
