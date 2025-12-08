import { ProjectSchema } from "@/schemas/ProjectSchema";
import Image from "next/image";
import hero from "@/public/images/fantasy_sportsball/hero.webp";
import experience from "@/public/images/fantasy_sportsball/experience_map.webp";
import instructions from "@/public/images/fantasy_sportsball/instructions.webp";
import storyboard from "@/public/images/fantasy_sportsball/storyboard.jpeg";
import card_test from "@/public/images/fantasy_sportsball/card_test.jpeg";
import card_gif from "@/public/images/fantasy_sportsball/fantasy_sportsball.gif";
import testing from "@/public/images/fantasy_sportsball/testing.jpeg";
import card_front from "@/public/images/fantasy_sportsball/iteration_1_card_front.webp";
import card_back from "@/public/images/fantasy_sportsball/iteration_1_card_back.webp";
import card_front_2 from "@/public/images/fantasy_sportsball/iteration_2_card_front.webp";
import card_back_2 from "@/public/images/fantasy_sportsball/iteration_2_card_back.webp";
import card_all from "@/public/images/fantasy_sportsball/all_cards.webp";

export default function FantasySportsball() {
    return (
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-10 py-12 sm:py-24">
            <ProjectSchema
                name="Fantasy Sportsball"
                description="A new card game for your friends who don't like football"
                url="https://zmarino.com/projects/fantasy-sportsball"
                keywords={['Experience Design', 'Game Design', 'Sports', 'Football']}
                organization="Northeastern University"
                role="Creator"
            />
            <div className="flex flex-col w-full gap-10 items-center">
                <Image src={hero} alt={"Fantasy Sportball Hero Image"} className="border-2 border-white"></Image>
                <Image src={card_all} alt={"All Cards"}></Image>
                <p className="self-start">Fantasy Sportsball is a new card game where you compete with your friends to see who can best predict what will happen this upcoming Super Bowl — commercials and all.</p>
                <p>
                    At the beginning of the game, each player drafts four cards. Whenever that card happens on screen, you get points. Whoever gets the fewest points loses and has to do a punishment decided beforehand.
                    There are four card categories: Football, Broadcast, Commercials, and Halftime. Each corresponds to a different aspect of the Super Bowl experience, keeping everyone engaged, even if they couldn’t care less about football.
                </p>

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">rationale</h2>
                <p>
                    I created this game because I wanted others to experience sports in the way I do, which is much more involved than just what is happening on the field. For example, Mets Broadcast Director John DeMarsico uses shots from movies as inspiration for transitions throughout the Mets broadcast, creating what he calls #Baseballiscinema. This has nothing to do with the actual sport of Baseball, yet it makes me love the game even more. I want others to appreciate what I appreciate in different sports they may not be familiar with.
                </p>

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">defining the experience</h2>
                <p>I started this project by trying to understand a slightly nebulous question: Why do people care about and watch sports? Thinking about it cynically, sports have no impact on our day-to-day lives besides the value we place upon them. I did five semi-structured interviews where I asked respondents: “Why do you engage with sports?”</p>
                <p>Of my five interviews, four directly said it was because of the sense of community it created. The fifth respondent acknowledged it was a major factor as well. My respondents ranged in their enthusiasm about sports, from casual watchers to people who interact with sports for their job. Using this and other insights from my interviews, I created an experience map of how people get into sports.</p>

                <div>
                    <Image src={experience} alt={"Experience Map of the Sports Watching Experience"} className="bg-[#6cc17e] p-5 rounded-md" />
                    <p>Experience Map</p>
                </div>

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">ideation</h2>
                <p className="self-start">With my user research in hand, I created a prompt that would guide my ideas:</p>
                <p><strong>How might we strengthen the experiences people share around sporting events, making them feel meaningful and leaving people with a sense of community?</strong></p>
                <p>I wrote down 22 ideas total in a rapid prototyping session, where I honed in on two. <strong>A major struggle I had with this project was moving away from thing-based design, and trying to keep an open mind about the form this project takes.</strong> When I conceived the sports idea for this project, I already had a form in mind — An app that explains to the user what is happening during a sports game, giving them the background needed to appreciate what is happening on the field. When I started ideating on my research, I couldn’t shake the idea, so for the sake of it, I fleshed it out to satisfy past me. While I do think there is some use in this idea, thinking about it further, I realized that the idea actually ran counter to the social aspect I unearthed in my user research. Checking your phone for information would take away from the experience compared to just asking a friend what is happening.</p>
                <p><strong>The idea I pursued is a game that is a mix of bingo and a football draft.</strong> Players would draft different cards with events that can happen during the broadcast and get points for how many times they occur. As I was telling people about my project, they kept mentioning to me how, despite not caring about football, they were still participating in fantasy football leagues with their parents. I combined that comment with bingo to create my concept.</p>

                <div>
                    <Image src={instructions} alt={"Fantasy Sportsball Instructions"} className="rounded-md" />
                    <p>Instructions</p>
                </div>


                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">development</h2>
                <p>Starting off my process, I sketched out a storyboard to flesh out the experience around my project, and I cut out different sizes of cards using paper to get an idea of what size card I should make.</p>
                <div className="w-full flex flex-row gap-5">
                    <div className="h-full flex flex-col">
                        <Image src={storyboard} alt="Storyboard" className="border border-white rounded-md" />
                        <p>Storyboard</p>
                    </div>
                    <div className="h-full flex flex-col">
                        <Image src={card_test} alt="Card Test" className="border border-white rounded-md" />
                        <p>Card Size Test</p>
                    </div>
                </div>
                <p>I used my storyboard to flesh out my prototype instructions and drafted some card topics with arbitrary point values for the game.</p>
                <div className="w-full flex flex-row gap-5">
                    <div className="h-full flex flex-col">
                        <Image src={card_front} alt="1st Iteration Card Front" className="border border-white rounded-md" />
                        <p>1st Iteration Card Front</p>
                    </div>
                    <div className="h-full flex flex-col">
                        <Image src={card_back} alt="1st Iteration Card Back" className="border border-white rounded-md" />
                        <p>1st Iteration Card Back</p>
                    </div>
                </div>

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">testing</h2>
                <p>To test the game, I developed an evaluation plan. I had two major unknowns with my project, besides the obligatory “is it fun to play?”:</p>
                <ol type="1" className="flex flex-col gap-2 self-start">
                    <li>
                        1. <strong>Point Balance:</strong> What is the ideal point balance for the cards, such that the game is interesting without one or two cards that steamroll the others?
                    </li>
                    <li>
                        2. <strong>Attention Balance:</strong> What is the correct balance of monitoring your cards while still watching the game, spending time with your friends, eating, going to the bathroom, etc.?
                    </li>
                </ol>
                <p>The ideal time and place to test this would be the Super Bowl (as that is what this game is for), but that isn’t an option until February. Thankfully, I could reasonably test the football, broadcast, and commercial categories during a regular-season game.</p>
                <p>I got two friends and I together over Thanksgiving break, and we watched two regular-season football games: Bears at Eagles on the 28th, and Bills at Steelers on the 30th. One tester was a frequent football watcher, while the other tester and I were infrequent watchers. Besides playing the game together, I also tracked the occurrences of many different events during the game, like flags, replays, and even when the commentators would draw yellow circles on screen.</p>
                <div>
                    <Image src={testing} alt="Testing Session Notes" className="border border-white rounded-md" />
                    <p>Testing Session Notes</p>
                </div>
                <p><strong>Both participants found that the game made watching football more engaging.</strong> Paying attention to the cards was manageable, as there were only two cards that could appear at a time. After the first game, we realized that cards like first down and coach close-up happened way too often, so that even 1 point per instance was too much compared to the rest of the point values. For the second game, I scaled up the point values, which were much more balanced, though I over-corrected the player close-up card. This is because the broadcast provider changed between games (Prime Video to CBS), and CBS was much more keen on doing close-ups on players rather than coaches.</p>

                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">refinement</h2>
                <p>My user testing primarily revealed that I needed to rebalance my cards, but users enjoyed the game. To rebalance them, I used the data I gathered to determine which cards happened the most. For each game, they averaged to about 25 points, so I left them as 1 point per instance, and I determined what point value was needed for other cards to hit an average of 25 points per game.</p>
                <p><strong>While the data I gathered was useful to solve my problem in terms of the product, I realized that tracking that data while trying to user test made for a week user test on the experience side. Next time, I would split up data gathering and user testing so that I can focus on each individually.</strong></p>
                <p>I also did another iteration on the visual design of my cards. The backs of the cards were a little too basic for my tastes, and I wanted a clearer way of differentiating between them besides color. I added decals in a shade of the original color to each card. The football cards have a football helmet, the broadcast cards have a football play with circles and crosses overlaid, the commercial cards have key lights, and the halftime card has Left Shark, from the XLIX halftime show. These also give my cards a more cohesive personality.</p>
                <div className="w-full flex flex-row gap-5">
                    <div className=" w-1/3 h-full flex flex-col">
                        <Image src={card_front_2} alt="1st Iteration Card Back" className="border border-white rounded-md" />
                        <p>2nd Iteration Card Front</p>
                    </div>
                    <div className="w-1/3 flex flex-col">
                        <Image src={card_back_2} alt="1st Iteration Card Back" className="border border-white rounded-md" />
                        <p>2nd Iteration Card Back</p>
                    </div>
                    <div className="w-1/3 h-full flex flex-col">
                        <Image src={card_gif} alt={"New card back designs"} className="border border-white rounded-md" />
                        <p>New Card Back Designs</p>
                    </div>
                </div>
                <h2 className="self-start text-xl sm:text-2xl font-bold -mb-5">takeaways</h2>
                <p><strong>This project tested my skills as an experience designer, but I came out on the other side as a much better designer.</strong> Up to this point, I have learned thing-based design as an interaction designer. While this form of design is still useful in many contexts, if I am to focus on the experiential forms of design, I need to remove myself from the thing-based paradigm. I am still learning as an experience designer, but being able to consider experience before form will improve all of the design work I do in the future.</p>
                <p>If I took this project further, I would do another iteration on the visual design and create a 21+ expansion deck. The visual design is good considering the context, but I think it could feel more polished and brighter. Since this game is to be played during the Super Bowl, that intrinsically makes it a drinking game. I want the game to be (relatively) family-friendly, so an optional expansion gives me that flexibility. This expansion would introduce a new category of card that makes people take a sip of alcohol whenever the chosen instance occurs during the game.</p>
            </div>

        </main>
    );
}
