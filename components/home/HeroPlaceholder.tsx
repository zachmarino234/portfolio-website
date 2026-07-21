import Link from "next/link";
import { ArrowDown } from "lucide-react";
import HeroStickerContent from "./HeroStickerContent";
import { heroLayout, stickerStyle } from "./heroLayout";

// Hero collage. The stage is a CSS container with the same aspect ratio as the
// Figma "Hero" frame (~2.6:1). Each sticker is placed by its CENTER as a
// percentage of the frame (rotation-invariant) and sized in `%`/`cqw`, so the
// collage scales as one rigid unit. Positions come from `heroLayout` — edit them
// visually in development at `/?edit` (see HeroEditor) and paste the result back.
const HeroPlaceholder = () => {
  return (
    <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#dfb3ff] to-[#faf7f1] to-[60%] px-6 py-24">
      <div className="@container relative mx-auto aspect-[2.6/1] w-full max-w-5xl">
        {heroLayout.map((item) => (
          <div key={item.id} style={stickerStyle(item)}>
            <HeroStickerContent item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroPlaceholder;
