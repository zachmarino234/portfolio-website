import Image from "next/image";

export default function Abacus() {
    return (
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-10 py-12 sm:py-24">
            <div className="flex flex-col w-full gap-10 items-center">
                <iframe className="max-w-3xl max-h-2xl w-full h-[650px]" src="https://embed.figma.com/design/7fK9op1Ncvsx2v1PE3g8RF/Spreadsheet-Application-Prototype?node-id=92-9&embed-host=share"></iframe>
                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">introduction</h2>
                <p>Abacus is a full-stack spreadsheet application coded in Typescript, using Express for the API and React for the frontend. It was created for my software engineering class in a group of 3. The other two worked on the backend logic, and I handled the API and frontend. We had to include a set of core requirements and 3 additional features. Our additional features were cell styling, undo/redo, and import/export functions.</p>

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">code snippets</h2>
                <p>We were free to create the frontend whichever way we wanted, so long as it rendered what the backend did. Most other teams decided to re-render their spreadsheet whenever a change occurred, but we decided to take a different approach. Since our project had a large emphasis on individual cell customization, we wanted to make sure it was possible to re-render an individual cell when that was the only change. The whole spreadsheet would still need to be re-rendered when cell locations changed, but if the only change was the property of a single cell, then there was no need to re-render everything else.</p>
                <p className="self-start">We implemented this by creating two React contexts, SelectedCellContext and GridContext.</p>
                <p>SelectedCellContext would track the currently selected cell and handle updates. Specifically, I had a function called updateSelectedCellProperty(), which would take in a property and a value and pass that into a POST request, which would update the property in the backend. updateSelectedCellProperty() would then increment a useState hook called setUpdateTrigger, which would trigger the context to fetch the updated cell data via another function. That function would set the cell data in a useState hook, and that hook is then passed into the instance of the cell.</p>
                <Image src={"/images/abacus_snippet_1.svg"} alt={"Abacus Code Snippet 1"} width={500} height={500} />
                <p>Entire spreadsheet re-rendering is actually handled in the spreadsheet component itself using useMemo hooks, but we needed a way to track when to re-render. This was especially the case when the number of rows and columns would change. GridContext would track this, and GridDataProvider would support it too. The custom hook below would handle the initial render of rows and columns.</p>
                <Image src={"/images/abacus_snippet_2.svg"} alt={"Abacus Code Snippet 2"} width={500} height={500} />
                <p>Our API was a pretty straightforward Express router setup. My partners created public-facing methods to access the Spreadsheet Model and the API calls those getter and setter methods. This separation between the backend and frontend lets us sanitize inputs and outputs, preventing errors in the backend or frontend from affecting each other. updateSelectedCellProperty() (from SelectedCellContext) would send POST requests to a large route that had a switch case for each possible cell property.</p>
                <Image src={"/images/abacus_snippet_3.svg"} alt={"Abacus Code Snippet 3"} width={500} height={500} />

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">layout</h2>
                <Image src={"/images/resize.gif"} alt={"Resizing"} width={1000} height={500} />
                <p>I added breakpoints to the header so that if the screen got smaller, all of the functions would adapt. We were only making a desktop application, so I added minimum width to the breakpoint and moved on. To position the header above the actual spreadsheet, I created a split-screen layout component that structured the page using flexboxes. Besides being the easiest approach, I did this with a dedicated layout component because it is best practice to have position logic separated from component logic to retain the reusable nature of components.</p>

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">takeaways</h2>
                <ol type="1" className="flex flex-col gap-2 self-start">
                    <li>
                        1. With Figma dev mode, spending time polishing a Figma prototype can not only reveal interface issues, but also save you time coding, as a polished prototype will have a lot of the layout and responsiveness ready to go via the provided CSS.
                    </li>
                    <li>
                        2. When developing the frontend for dynamic applications, there is much more involved than just the layout and styling. How you render the dynamic elements can make or break the efficiency of your system.
                    </li>
                    <li>
                        3. I believe that when designers know how to code, they can significantly improve the coding experience for developers by designing with the implementation in mind.
                    </li>
                </ol>

            </div>

        </main>
    );
}
