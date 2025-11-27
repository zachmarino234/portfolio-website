import { ProjectSchema } from "@/schemas/ProjectSchema";

export default function DowJones() {
    return (
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-10 py-12 sm:py-24">
            <ProjectSchema
                name="Dow Jones Product Design Internship"
                description="Product design work at Dow Jones focusing on the B2B Newswires team and B2B initiatives"
                url="https://zmarino.com/projects/dow-jones"
                keywords={['Product Design', 'UX Design', 'News Media', 'Dow Jones', 'Internship']}
                organization="Dow Jones"
                role="Product Designer"
            />
            <div className="flex flex-col w-full gap-10 items-center">

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">introduction</h2>
                <p>In the summer of 2025, I got the opportunity to join Dow Jones as a product designer on the B2B newswires team. Despite being on a B2B team, I sought out opportunities to interact with the B2C, specifically getting to know the Wall Street Journal design team and providing input on their current projects. I met so many incredible designers and fellow interns at Dow Jones, and I&apos;m grateful I got the opportunity to learn from them and grow as a young professional.</p>
                <p>Below are high-level explanations of several projects I got to work on during my time at Dow Jones (Note: I can&apos;t go into specific details on non-public projects):</p>

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">company information module</h2>
                <p>One of my major projects on the B2B side was bringing the company information module, a legacy feature that provided information and statistics about a company, to the newest version of NewsPlus. The biggest challenge of this project was the data density I had to work within. Financial-focused audiences prefer a more dense layout, and since this module had to work within the FDC3 standard, I had to design this to work as a standalone module at very small breakpoints. Essentially, I had to fit a large amount of information, at a high data density, in a small bounding box. I also designed an AI summary of each company, which was the first AI feature to be implemented in NewPlus, and I added news filters to drive users to editorial content in the newswire. I managed to design a user-friendly yet dense layout that included the new features. I handed the project over to developers, saving several weeks that would have been spent designing the module.</p>

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">intern project</h2>
                <p>Every year, our supervisors have the intern cohort on the Newswire team complete a project that we would present at the end of the internship. Since Dow Jones is essentially a data and information company, our goal was to create a solution or product offering that would drive Gen Z to our data and content. </p>
                <p>We created a product bundle that could be implemented in popular Gen Z personal finance apps like Robinhood, which included critical financial news notifications, AI sentiment analysis of news, and a walled garden of Dow Jones content that people could access. These features help users make more informed financial decisions.</p>
                <p>We adopted a B2B2C strategy because, in our user research and secondary research, we found that the best way to engage Gen Z was to meet them where they are. As well, since personal finance platforms like Robinhood make money on trade commissions, it is in their best interest that users are successful. By licensing our content to partners, the partners show that content to users, and users make (hopefully) better financial decisions. Everyone wins in this scenario.</p>

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">dow jones smart money</h2>
                <p>In addition to my usual work at Dow Jones, I was asked by a fellow intern to help him develop a redesign of Dow Jones Smart Money (DJSM), a repository of financial wellness information provided for free by Dow Jones. The current version of DJSM is just a series of articles that you could read. Frankly, this is not very engaging, no matter who you are. The other design interns and I prototyped a new version of DJSM, where we imagined it as a learning platform (akin to Khan Academy) that would guide you through different financial topics, as well as the potential for other topics like media literacy.
                </p>
            </div>

        </main>
    );
}
