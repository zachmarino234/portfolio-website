import Image from "next/image";
import ProjectCard from "./ProjectCard";
import nopool from "@/public/images/NPP_logo_wordmark_bluebg.png";
import dowjones from "@/public/images/dowjones_logo.png";
import catalog from "@/public/images/8h_logo.png";
import pitch from "@/public/images/pitch_logo.png";
import abacus from "@/public/images/abacus_logo.png";

const ProjectGrid = () => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 w-full gap-5">
            <ProjectCard bgColor="#0396FF" link={"no-pool-productions"} ariaLabel={"No Pool Productions"} videoSrc="videos/npp_video.mp4">
                <Image src={nopool} alt="No Pool Productions logo" className="w-1/2" />
            </ProjectCard>
            <ProjectCard bgColor="#F0F0F0" link={"dow-jones"} ariaLabel={"Dow Jones"} videoSrc="">
                <Image src={dowjones} alt="No Pool Productions logo" className="w-1/2" />
            </ProjectCard>
            <ProjectCard bgColor="#141B1F" link={"catalog8h"} ariaLabel={"Catalog8H"} videoSrc="">
                <Image src={catalog} alt="Catalog8H logo" className="w-3/4" />
            </ProjectCard>
            <ProjectCard bgColor="#F75612" link={"pitch"} ariaLabel={"Pitch"} videoSrc="">
                <Image src={pitch} alt="Catalog8H logo" className="w-3/4" />
            </ProjectCard>
            <ProjectCard bgColor="#F0F0F0" link={"abacus"} ariaLabel={"Abacus"} videoSrc="">
                <Image src={abacus} alt="Abacus logo" className="w-3/4" />
            </ProjectCard>
        </section>
    );
}

export default ProjectGrid;