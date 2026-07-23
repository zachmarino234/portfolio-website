import type { PortableTextBlock } from "@portabletext/types";
import { InlineTextRenderer } from "@/components/PortableTextRenderer";

export interface ProjectOnePagerProps {
    brief: PortableTextBlock[];
    context: PortableTextBlock[];
    toolsAndMethods: string[];
    team: string[];
    timeline: string;
    insights: PortableTextBlock[];
    deliverables: PortableTextBlock[];
}

// A labelled block in the sticky left rail: a bold uppercase label above a value.
function RailBlock({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full flex-col gap-2.5 p-2.5 backdrop-blur-[4px]">
            <p className="text-lg font-bold uppercase text-[#1e1e1e]">{label}</p>
            {children}
        </div>
    );
}

// A labelled block in the right column: a bold uppercase label above rich text.
function ProseBlock({
    label,
    value,
}: {
    label: string;
    value: PortableTextBlock[];
}) {
    return (
        <div className="flex w-full flex-col gap-2.5 p-2.5 backdrop-blur-[4px]">
            <p className="text-lg font-bold uppercase text-[#1e1e1e]">{label}</p>
            <div className="space-y-4 leading-relaxed text-[#1e1e1e]">
                <InlineTextRenderer value={value} />
            </div>
        </div>
    );
}

// The fixed-structure "one-pager" shown at the top of every project page
// (Figma node 89:341). Two columns: a sticky left rail with at-a-glance facts
// (context / timeline / team / tools) and a wider right column with the written
// brief, insights, and deliverables.
export default function ProjectOnePager({
    brief,
    context,
    toolsAndMethods,
    team,
    timeline,
    insights,
    deliverables,
}: ProjectOnePagerProps) {
    return (
        <section
            className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-10 px-6 pt-24 sm:px-10 lg:flex-row lg:gap-16"
            data-name="Project One Pager"
        >
            {/* Left rail — sticks to the top as the one-pager scrolls past. */}
            <div className="flex w-full flex-col gap-5 self-start lg:sticky lg:top-6 lg:w-[38%] lg:max-w-[457px]">
                <RailBlock label="Context">
                    <div className="text-base leading-relaxed text-[#1e1e1e] sm:text-2xl sm:leading-9">
                        <InlineTextRenderer value={context} />
                    </div>
                </RailBlock>

                <RailBlock label="Timeline">
                    <p className="text-base leading-relaxed text-[#1e1e1e] sm:text-2xl sm:leading-9">{timeline}</p>
                </RailBlock>

                {team.length > 0 && (
                    <RailBlock label="Team">
                        <ul className="flex list-none flex-col gap-1 text-base leading-relaxed text-[#1e1e1e] sm:text-2xl sm:leading-9">
                            {team.map((member) => (
                                <li key={member}>{member}</li>
                            ))}
                        </ul>
                    </RailBlock>
                )}

                {toolsAndMethods.length > 0 && (
                    <RailBlock label="Tools and Methods">
                        <div className="flex flex-wrap gap-2.5">
                            {toolsAndMethods.map((tool) => (
                                <span
                                    key={tool}
                                    className="rounded-full bg-black/10 px-2.5 py-[7px] text-base text-[#1e1e1e]"
                                >
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </RailBlock>
                )}
            </div>

            {/* Right column — the written narrative. */}
            <div className="flex w-full flex-col gap-6 lg:w-[58%] lg:max-w-[718px]">
                <ProseBlock label="Brief" value={brief} />
                <ProseBlock label="Insights" value={insights} />
                <ProseBlock label="Deliverables" value={deliverables} />
            </div>
        </section>
    );
}
