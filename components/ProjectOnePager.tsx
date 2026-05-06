import type { PortableTextBlock } from "@portabletext/types";
import { InlineTextRenderer } from "@/components/PortableTextRenderer";

export interface ProjectOnePagerProps {
    title: string;
    brief: PortableTextBlock[];
    context: PortableTextBlock[];
    toolsAndMethods: string[];
    team: string;
    timeline: string;
    insights: PortableTextBlock[];
    deliverables: PortableTextBlock[];
}

export default function ProjectOnePager({
    title,
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
            className="w-full max-w-[1112px] rounded-2xl border border-white/10 bg-[rgba(10,10,30,0.85)] backdrop-blur-sm p-4 flex flex-col gap-4 sm:gap-5"
            data-name="Project One Pager"
        >
            <h1 className="text-2xl md:text-[28px] font-semibold text-white">
                {title}
            </h1>

            <div className="h-px w-full bg-white" />

            <div className="flex flex-wrap gap-4 sm:gap-5 items-start">
                <div className="flex-1 min-w-[260px] flex flex-col gap-2">
                    <h2 className="font-semibold">brief</h2>
                    <div className="leading-relaxed space-y-2">
                        <InlineTextRenderer value={brief} />
                    </div>
                </div>

                <div className="h-px w-full bg-white sm:hidden" />


                <div className="flex-1 min-w-[320px] grid grid-cols-2 gap-x-4 sm:gap-x-5 gap-y-6 sm:gap-y-8">
                    <div className="flex flex-col gap-2">
                        <h3>context</h3>
                        <div className="leading-relaxed space-y-2">
                            <InlineTextRenderer value={context} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3>tools and methods</h3>
                        <ul className="space-y-1">
                            {toolsAndMethods.map((tool) => (
                                <li key={tool}>{tool}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3>team</h3>
                        <p className="leading-relaxed">{team}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3>timeline</h3>
                        <p className="leading-relaxed">{timeline}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-8 items-start text-white">
                <div className="flex-1 min-w-[260px] flex flex-col gap-2">
                    <h2 className="font-semibold">insights</h2>
                    <div className="leading-relaxed space-y-2">
                        <InlineTextRenderer value={insights} />
                    </div>
                </div>
                <div className="flex-1 min-w-[260px] flex flex-col gap-2">
                    <h2 className="font-semibold">deliverables</h2>
                    <div className="leading-relaxed space-y-2">
                        <InlineTextRenderer value={deliverables} />
                    </div>
                </div>
            </div>
        </section>
    );
}
