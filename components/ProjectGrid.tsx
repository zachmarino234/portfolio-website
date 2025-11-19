import Image from "next/image";
import ProjectCard from "./ProjectCard";
import nopool from "@/public/images/NPP_logo_wordmark_bluebg.png";

const ProjectGrid = () => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 w-full gap-5">
            <ProjectCard bgColor="#0396FF" link={"no-pool-productions"} ariaLabel={"No Pool Productions"}>
                <Image src={nopool} alt="No Pool Productions logo" className="w-1/2" />
            </ProjectCard>
            <ProjectCard bgColor="#0396FF" link={"no-pool-productions"} ariaLabel={"No Pool Productions"}>
                <Image src={nopool} alt="No Pool Productions logo" className="w-1/2" />
            </ProjectCard>
            <div className="bg-amber-200">
                sff
            </div>
            <div className="bg-zinc-500">
                sfeefs
            </div>
            <div className="bg-teal-500">
                fsef
            </div>
        </section>
    );
}

export default ProjectGrid;