---
title: "My AI Journey So Far: Speed and Review"
slug: "ai-journey"
translationKey: "ai-journey"
date: 2026-10-06
author: "Skittz"
description: "Arriving a bit late to the AI hype, and how the journey has been so far."
lang: "en"
---

We're in the era of **AI**, and more and more people are impressed by how popular it has become over the last few years. It's curious to think about how quickly end users took to this tool. As a developer, I got on board when the boat was already moving, and moving fast.

## Arriving late: a year fishing for tools

Until not long ago, I was still trying to figure out which tool would fit best into my workflow. It took me a while to start using AI tools because I had other priorities ahead of them.

When I got the chance to really start studying, I went fishing through several tools: Cursor, Trae, Copilot (before the pause on new individual subscriptions in 2026), until I got to Claude and Codex, which, in my opinion, are the most mainstream ones right now. I also tried Kimi for a month, after being selected to subscribe.

I spent about a year testing the new tools, and 2025 into 2026 was the period when I explored the most, even if I was late to it. When I used Cursor for the first time, it was already quite mature: I didn't go through the autocomplete phase and then the agent mode phase, I got everything at once.

After that I started studying specs and AI architecture, getting to know frameworks like LangChain and Pydantic AI, and learning about tokenization, cost, RAG and MCP. And I know there's still a lot I don't know. I've never used OpenClaw or anything like it. I also never got around to using n8n, another thing that had its hype for a while: I could see it was useful in the projects some coworkers showed me, it just didn't make much sense for me.

## From 0 to 90: the missing 10

I want to make it clear that I don't agree with some of the things Fabio Akita, a well-known Brazilian developer, stands for. Still, I see him as that strict kung fu master, you know? He's tough, but he's the kind you learn from. One of my favorite quotes of his from this period, one he repeats a lot, is this:

> "Your excitement about AI is inversely proportional to your knowledge of AI."
>
> Fabio Akita, in [RANT: IA acabou com os programadores?](https://akitaonrails.com/2026/02/08/rant-ia-acabou-com-programadores/) (post in Portuguese, my translation)

That sums it up. AI makes work a lot easier today, and it really does take you from **0 to 90** very fast. But the **missing 10** are something I've been paying attention to. I came across this 0-to-90 idea in a video I couldn't find again, but it was already something I felt.

Models are "smarter," and that ends up creating an error in the dark: if the AI is smarter, the errors are also more **silent**. You won't see the AI making silly mistakes that are obvious, but it can get something wrong that gets worse down the road.

A [preprint from January 2026](https://arxiv.org/abs/2601.01490) points in the same direction. It compared GPT-5.2 and Gemini 3 Flash with and without reasoning, asking them to recommend only articles published in peer-reviewed journals. Without reasoning, the models broke the constraint in 66% to 75% of their recommendations: they suggested conference papers and preprints, but work that actually existed. With reasoning, the violations dropped to 13% to 26%, but distortion nearly doubled: the models would take a real conference paper and present it as if it were a journal article, with made-up volume and page numbers, to look like they were doing what was asked. It's not a study about code, but the pattern looks the same to me: the error that used to be obvious became an error that's hard to detect.

On top of that, there's the human factor. In the end, AI is like a rocket, but the ones pressing the button are humans, with their instructions. If those instructions aren't clear, you can end up building things with a lot of flaws.

## Clear instructions: specs, skills and harness

If we're the ones pressing the button, a good part of the work becomes making the instructions clear. That's where three things come in that are part of my workflow today.

The first is **spec-driven development**: I use specs to define the technical side before generating any code, and the AI implements on top of what was defined. The second is **skills**, reusable instructions that the agent loads for a given kind of task. I have skills for structured commits, skills for planning, and so on.

The third is the **harness**, which is everything that sits around the model: the code that decides what it stores, what it retrieves and what it sees. The [Meta-Harness paper](https://arxiv.org/abs/2603.28052), from March 2026, opens by citing that changing only the harness, while keeping the same model, can produce a performance gap of up to 6x on the same benchmark. In other words, the result doesn't depend on the model alone: it also depends on what you put around it.

And even with instructions that are clear enough, I think it's still worth looking at the result. But that's a skeptical opinion of mine :D

## Review isn't a bottleneck: it's validation

Delegating everything to AI still isn't part of my day-to-day. That said, it has clearly become part of it when it comes to coding the beginning of a structure and refining it, until it's time for review. This is where people today say that the bottleneck is review. For me, **review isn't a bottleneck**: it's a way of validating things. I don't see the point in rushing so much and risking more rework.

It's true that, even with review, something might slip through. But if I catch something earlier, that's one less thing to fix later.

Some people say AI-written code has to be reviewed by AI, and I believe that too. But the AI's code was also built from our code. When I don't understand what it delivers and also can't find a single problem, it's usually a sign that I didn't look closely enough.

AI still doesn't deliver 100% of the code following good practices unless it gets good instructions. And what counts as good practice depends on each person and, at the same time, on the team's standards. But that would be a whole other conversation.

## To wrap up: don't lose your mind

In this crazy world where a new tool comes out every hour and something new comes out every day, the only tip I have is: **don't lose your mind**. And it's worth starting to look at the pain points of the people around you, in your everyday life. Since it got easier to build things, we can put into practice ideas that would have taken months to build before. That's why **short-term validation** has been one of the best things about this era.

In the end, what will set your app apart from another one, when both teams have the same technical level, is the **feel** a person can have for those pain points and for how to solve them in the best way. We've always been heading in this direction. At first, software was made to work. Then came the wave of making it work while also improving the experience and usability. Now, I believe the strongest point of software will be exactly that usability side. With the technical barrier getting lower, what will really make the difference, and already did even before AI took off, is the **experience** and whether the problem is being solved.

Honestly, to this day end users couldn't care less whether a request takes 300 ms or 800 ms, as long as it solves the problem and isn't a 10-second thing. Of course I'm not saying to neglect that, but you get the idea :)
