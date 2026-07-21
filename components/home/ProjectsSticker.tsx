"use client";

// The "PROJECTS" hero sticker: a dark pill with a thick light border and three
// downward arrows that "march" through a greyscale ramp (animation defined in
// globals.css). Clicking it smooth-scrolls to the projects section. The arrow
// path is taken verbatim from the Figma asset (node 27:446).
const ARROW_PATH =
  "M32.25 69.875L0 37.625L7.525 30.1L26.875 49.45V0H37.625V49.45L56.975 30.1L64.5 37.625L32.25 69.875Z";

const Arrow = ({ variant, restFill }: { variant: 1 | 2 | 3; restFill: string }) => (
  <svg
    viewBox="0 0 64.5 69.875"
    className="h-[5.7cqw] w-auto"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path className={`hero-arrow hero-arrow--${variant}`} d={ARROW_PATH} fill={restFill} />
  </svg>
);

const ProjectsSticker = () => {
  const scrollToProjects = () => {
    document
      .getElementById("projects")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      onClick={scrollToProjects}
      aria-label="Scroll to projects"
      className="inline-flex cursor-pointer items-center gap-[2.4cqw] rounded-[1.6cqw] border-[0.8cqw] border-[#eaeaea] bg-[#1e1e1e] px-[2.5cqw] py-[1.2cqw] shadow-[0_3px_3px_0_rgba(0,0,0,0.25)] transition duration-300 hover:scale-[1.02]"
    >
      <span className="text-[7cqw] font-bold text-white">PROJECTS</span>
      <span className="flex items-center gap-[1.7cqw]">
        <Arrow variant={1} restFill="#D7D7D7" />
        <Arrow variant={2} restFill="#7D7D7D" />
        <Arrow variant={3} restFill="#3D3D3D" />
      </span>
    </button>
  );
};

export default ProjectsSticker;
