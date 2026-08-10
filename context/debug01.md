Some more bugs i found dureing debugging: 
Learn from the fixed ones (find out if there are any other such mistaked and fix those too, and fix the flagged ones)
1.<Fixed> C59 Porcupine question: Question and answer were too revealing of each other. redacted information so that people have to use brains instead of just reading and answering.
2.<Flagged> In locked questions, also dont let the users change the option after locking, it may confuse them. For example, right now , what happens after locking a question, is that after a brief delay, the locked option clears out (all options are cleared of the blue circle of toggle), and now the user can toggle any option, but cannot select it truly. this is correct as it fulfills the purpose, but it might be confusing to the test taker. So, after a user locks an option, also lock the toggle at that option, so the user cannot play around and get confused. (This will only be useful at Q10.4 however, but still a good feature to have)
3A.<Fixed>In part A, the worflow III has to be garbles because currently it is too revealing and for a human it is easy to jusge in the current state that it must be the correct option. so i have redacted parts of it.
3B.<Fixed> In part A again, the stem has also been redacted as i had to make it less revealing.
4.<Flagged>In part A, the workflow written at the first position is workflow III, but the worflow written at the third position is Workflow I. So fix this, as when i toggles the first option, i had to write justifications for why worklows I,II,IV,V were wrong, which might be confusing to a test taker.
5.<Fixed>Made options to luciferase assay questions trickier.
6A.<Flagged>Make a seperate page for data analysis part 2. the current page works like this: Lock DA Part 1, then the page loads, and you go to the top of the page, and now the test taker is confused as to why nothing happened. Better yet, as they can already not do anything with DA Part 1, just make a new page for DA PART 2. like transition from Part A to DA part 1.This will also be better For the results to take away (the confirmed takeaway and all correct answer), A part that you forgot. You will put this as context from the DA part 1 into this new DA Part 2 page:
"Summary of the Regulatory Circuit
The data presented establishes a clear feedback and modulation loop:
RNF43 and ZNRF3 act on the system by reducing the surface expression of Wnt receptors.
Ligand-Independent Activation: The loss of these brakes (R/ZdKO) leads to a state where the cell is hyper-responsive to any available Wnt ligand.
6B.<Flagged> The featrure i explained in 6A should also be followed in 6B. Each context should also be given its own page. Just no summary to write in these pages.
RSPO Mechanism: RSPO1 acts as a "natural knockout" of these ligases. By sequestering RNF43/ZNRF3, RSPO1 mimics the 
R/ZdKO phenotype, which explains why RSPO1 is ineffective in cells where the ligases are already deleted.
Pathway Breadth: Because DVL2 is a downstream component for multiple Wnt pathways, the regulation by RNF43/ZNRF3 is shown to be a broad-spectrum control mechanism affecting both canonical (β-catenin) and non-canonical signaling."
7.<Fixed> In question 9(i), we have to restate the workflow II as people cannot remember it nor can they see it.
8.<Fixed> In question 9(ii), i have redacted the table's expected outputs and brought them down to minimum data needed to solve.
9.<Flagged> Redesign of study context needed. The study context is laying out a clean sheet for people to walk on. It is too simple and even directly revealing. (For example pulse chase analysis and western blot have been directly revealed)
We will insert some graphs instead of just speaking out results loud. And also redact for lesser revealing. Give me prompts for any graphs you need out of the study result graphs and images already saved in /static/MB-01PICS . Also, before you write this straight into the website, get it approved by me by writing it out into the output.
10.<Flagged> Hence, also redesign the workflow III provided after Data analysis part I ends. This is toooooo revealing. Get it approved in the output.
11.<Flagged> After submitting DA, we directly land at page 7/7. What is this. we should land at page 3/7 (according to the current numbering).
12.<Flagged> You have still not reformatted the questions. Let me explain by an example, of the Golden Gate assembly question:
The final gRNA cassette is assembled from the RNF43-targeting Spacer (S) and tracrRNA Scaffold (T) into a vector backbone using BsaI (Type IIS, cuts outside its recognition sequence leaving a custom 4-nt overhang). Overhangs after BsaI digestion: Vector — left end AACG, right end TTGC. Spacer (S) — 5′ overhang AACG, 3′ overhang CCGA. Scaffold (T) — 5′ overhang CCGA, 3′ overhang TTGC. Each overhang pairs with only one other overhang. State TRUE if the candidate outcome below can be observed after BsaI + DNA ligase treatment, FALSE if it cannot. (a)
There is no way a human can visualize this, even if they are really good, the sentences should atleast be spaced properly:
The final gRNA cassette is assembled from the RNF43-targeting Spacer (S) and tracrRNA Scaffold (T) into a vector backbone using BsaI (Type IIS, cuts outside its recognition sequence leaving a custom 4-nt overhang).
Overhangs after BsaI digestion: Vector — left end AACG, right end TTGC.
Spacer (S) — 5′ overhang AACG, 3′ overhang CCGA. Scaffold (T) — 5′ overhang CCGA, 3′ overhang TTGC.
Each overhang pairs with only one other overhang. 
State TRUE if the candidate outcome below can be observed after BsaI + DNA ligase treatment, FALSE if it cannot. (a)
Also attach an image of the golden gate assembly that i have in the directory /static/MB-01PICS/goldengate.png which has the  question visualized for reference of the test taker.
YOUR TASK IS TO IDENTIFY SUCH CASES AND FLAG THEN AND ASK ME FOR IMAGES/GRAPHS/Debugging.