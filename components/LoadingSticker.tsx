// Full-screen loading overlay used as the route-level Suspense fallback
// (Next.js `loading.tsx`). Matches ProjectTitleSticker's treatment — accent
// yellow, thick #eaeaea border, crumpled-poster texture — but all-caps and a
// touch larger, per Figma node 162:621. The `.loading-sticker-wobble` class
// (defined in globals.css) applies the shake keyframes from the design.

const ACCENT_YELLOW = "#ffd603";

export default function LoadingSticker() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf7f1] text-[#1e1e1e]">
			<div className="loading-sticker-wobble">
				<div
					className="relative inline-block overflow-hidden rounded-lg border-[5px] border-[#eaeaea] px-4 py-3 shadow-[0_1px_1px_0_rgba(0,0,0,0.25)]"
					style={{ backgroundColor: ACCENT_YELLOW }}
				>
					<span className="whitespace-nowrap font-bold tracking-[-0.02em] text-[#282828] text-3xl leading-tight sm:text-5xl">
						LOADING
					</span>

					{/* Crumpled-poster paper texture, matching ProjectTitleSticker. */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 bg-cover bg-center mix-blend-multiply"
						style={{
							backgroundImage:
								"url('/images/textures/paper-texture.jpg')",
						}}
					/>
				</div>
			</div>
		</div>
	);
}
