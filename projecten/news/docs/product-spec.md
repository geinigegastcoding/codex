# Sift product specification

Status: working product decision, 8 August 2026.

## 1. Challenge the idea

### The exact problem

People with narrow, high-value information needs waste time scanning broad feeds. The failure is not lack of content. It is the cost of finding the small number of events that matter to a particular person, while avoiding repeated coverage and low-value noise.

The job is:

> Help me know what changed that is worth my attention, without making me become a full-time news editor.

### Who should use it first

The first audience should be information-heavy people with concrete watchlists:

- founders, developers, researchers, investors, policy professionals, and technically curious students;
- people who already open several sources because general news feels noisy;
- people who can name specific entities or triggers they care about: ECB, Nvidia, OpenAI models, a minister, an API, a market, or a company.

This is not initially a mass-market replacement for NOS or Google News. Broad audiences have lower willingness to configure a profile and are already served by general importance ranking.

### Is the problem strong enough?

Yes, for the narrow audience. It is a frequent pain with a measurable cost: time spent scanning, missed updates, and loss of trust in noisy feeds.

The business risk is that the pain is real but not urgent enough to create a daily habit. The product must therefore prove utility in a short session, not maximize session length. The first test is not retention. It is whether people say the feed gave them a better answer in five minutes than their normal news routine.

### Existing products and the gap

| Product | Already does well | Remaining gap for Sift |
| --- | --- | --- |
| Google News | Broad coverage, follows for topics/sources/locations, personalized ranking | Optimizes a general news surface; the user's fine-grained intent and recommendation reasoning are not the product's center of gravity |
| Feedly + Leo | Source aggregation, AI feeds, topic/entity filters, negative filters | Powerful but source-first and configuration-heavy; users still manage the firehose |
| Ground News | Groups coverage, compares headlines and media perspectives, blindspots | Excellent source perspective; less focused on the personal value of one event to one person |
| NewsBlur | Trained likes/dislikes, story clustering, notifications, RSS power-user controls | Very close on training, but oriented around feed management and advanced readers rather than a short event queue |
| Readwise Reader | RSS, newsletters, saved reading, highlights, filters, annotations | Strong reading library; not primarily a discovery and event-selection layer |
| Perplexity | Search, multi-source answers, citations, follow-up research | Excellent on demand; a persistent, inspectable interest model and calm daily queue are different jobs |
| Artifact-like apps | Validated interest in personalized news and summarization | The category is not defensible through summaries alone; Artifact's shutdown is a warning to prove a focused utility and distribution path |
| RSS readers | Ownership, control, low cost, predictable source subscriptions | Users must already know which sources to follow and still sort duplicates themselves |
| Social feeds | Discovery and speed | Engagement incentives, repetition, outrage, and weak provenance |

### What is genuinely differentiated

Sift is differentiated only if all of these are true together:

1. The system treats an event/story as the main object and keeps source coverage underneath it.
2. The user can inspect and edit the interest model that caused a recommendation.
3. The output is deliberately sparse: no filler stories are added to make the product look alive.
4. The ranking optimizes declared information value, not clicks, dwell time, or daily active minutes.
5. A recommendation explanation says both why it matched and what kind of source supports it.

Any one of these alone is already available elsewhere.

### Where the idea is overcomplicated

Cut these from the first product:

- scraping the whole internet;
- a universal taxonomy of every possible interest;
- a custom deep-learning recommender;
- automatic long-form summaries of every article;
- a bias score for every publisher;
- social comments, sharing, streaks, and gamified reading;
- live YouTube, Reddit, GitHub, finance, government, and mainstream news all at launch;
- a fully autonomous "important news" editor.

Start with a small, high-quality source set and a transparent heuristic ranker. The hard problem is selection quality, not feature count.

### Biggest risks

Product risks:

- cold start: users do not want to write a thesis during onboarding;
- value is episodic: some interests have no meaningful change today;
- users may prefer search when they have a concrete question;
- users may distrust a product that hides content behind a score;
- the product can become an engagement feed if success is measured incorrectly;
- a general-purpose audience may not pay for a narrow utility.

Technical risks:

- weak source coverage creates false confidence;
- event clustering can merge separate events or split one event into many;
- entity resolution is hard for names, tickers, people, and companies;
- source freshness and rate limits vary widely;
- LLM extraction can hallucinate importance or turn opinion into fact;
- storing or regenerating publisher text can create legal and cost exposure.

### Copyright and licensing position

The MVP stores source metadata, short feed-provided descriptions where permitted, extracted facts, and links back to the original source. It does not copy full publisher articles into the product or display a substitute article.

RSS availability is not a blanket commercial licence. Each feed's terms, API agreement, image rights, database rights, publisher contract, and applicable EU rules need review. Do not crawl paywalls, bypass bot protections, or treat `robots.txt` as permission to reproduce content. A commercial product that materially aggregates press publications should budget for licences.

This is product guidance, not legal advice.

## 2. Product definition

### Target user

An information-heavy builder who follows 5-15 precise topics, entities, or triggers and wants a short, trusted daily queue.

### Value proposition

> Sift turns your interests into a small, explainable list of what changed today, with the original sources still one click away.

### Main user journey

1. Describe what matters and what does not in plain language.
2. Confirm a small set of suggested topics, entities, triggers, and blocks.
3. Open a feed with 3-7 event-level recommendations, not a stream of articles.
4. Inspect why an event appeared and open the source coverage.
5. Give one-tap feedback or edit the profile directly.
6. Return for a short daily briefing or a notification only for explicit triggers.

### Onboarding

One screen, three inputs:

- a natural-language prompt: `What do you want to stay ahead of?`;
- a few suggested chips: `AI model releases`, `ECB`, `Nvidia`, `Dutch policy`, `Startups`;
- a quick `not for me` row: `Football`, `Celebrity news`, `Local crime`, `Lifestyle`.

The system converts the prompt into draft rules and shows the user the interpretation before saving it. No hidden profile is created from the prompt without confirmation.

### Interest model

The model is a small, editable set of rules, not a mysterious vector:

- `topic`: AI infrastructure, monetary policy;
- `entity`: OpenAI, Anthropic, Nvidia, ECB;
- `event trigger`: model release, rate decision, earnings, acquisition;
- `scope`: global, EU, Netherlands, company, product;
- `polarity`: follow, avoid, hard block;
- `strength`: low, medium, high, very high;
- `source preference`: official, reporting, analysis, community;
- `confidence`: explicit, confirmed suggestion, inferred;
- `expiry`: optional date for temporary interests.

Behavior changes confidence slowly. It cannot silently override a hard block or explicit follow.

### Feed

The home screen has four bounded lanes:

- `For you`: high-match events.
- `Important`: a small override lane for globally significant events outside the profile.
- `Deep dives`: lower-frequency analysis about a strong interest.
- `Updates`: follow-ups to events or entities the user previously saved/followed.

If a lane has no good items, it stays empty with a sentence explaining that no strong match was found. No infinite scroll in the MVP.

Every story shows:

- event title and one-sentence claim;
- event type: fact, analysis, opinion, or announcement;
- time and freshness;
- `Why this is here` with matching interests;
- source count and a preferred source;
- save, follow, more like this, less like this, and not interested actions.

### Story/event model

The user sees one event. The event page exposes:

- canonical event statement;
- first seen and last updated timestamps;
- source timeline;
- primary/official source, reporting sources, analysis, and community discussion;
- uncertainty and disagreement indicators;
- what changed since the previous update;
- the recommendation explanation and score components.

Article pages are supporting evidence, not the primary product object.

### Search and following

Search is first-class and should work before a user has a large history. Search across:

- events;
- entities;
- topics;
- sources.

Results have `Follow`, `Mute`, and `See latest` actions. A follow is a durable explicit rule, not a one-time search query.

### Feedback

Use explicit, low-friction actions:

- save;
- more like this;
- less like this;
- not interested;
- follow topic/entity;
- correct the reason.

Opened and read completion are weak signals. Time spent is not a target and should be capped or bucketed to avoid turning the product into a dwell-time optimiser.

### Notifications and daily briefing

Notifications are opt-in and trigger-based:

- explicit entity or event trigger;
- important override;
- scheduled briefing.

Do not notify for generic relevance. The daily briefing should be a finite email or in-app digest with a maximum of five events and a `nothing important matched` result when appropriate.

### Source policy

Source classes:

- primary: official institutions, filings, company announcements;
- reporting: licensed or permitted news publications;
- analysis: research, explainers, expert commentary;
- community: Reddit, Hacker News, GitHub discussions, YouTube.

Primary sources are preferred for factual claims. Community sources are discovery and context, not automatic proof.

### Recommendation and deduplication principles

- hard blocks suppress ordinary matches;
- explicit follows beat inferred preferences;
- importance can override a block only in a clearly labelled, limited lane;
- one event may have many sources but appears once;
- the system prefers a source by directness and quality, not simply popularity;
- ranking explanations are stored with each recommendation so they can be audited later.

### Privacy

- store only the profile and interaction data needed for personalization;
- do not infer sensitive political or health traits from reading behavior;
- allow export, edit, and delete;
- make behavioral learning opt-in or plainly controllable;
- keep source accounts and personal browsing history separate from the interest profile;
- retain interaction history for a short default period and aggregate older data;
- disclose the ranking signals and which external models receive content.

## 3. Scope cuts

### MVP

- one demo user profile;
- natural-language onboarding mock and editable interests;
- curated event-level feed;
- why-this-is-here explanations;
- story detail with source groups;
- save and feedback interactions;
- search over demo events/entities/topics;
- profile, notification, and source settings screens;
- responsive desktop/mobile interface;
- deterministic ranking logic documented in the architecture;
- a small ingestion proof with RSS plus one primary API after the UI hypothesis passes.

### V2

- real accounts and sync;
- RSS/Atom ingestion for a curated source registry;
- ECB, Hacker News, GitHub, and SEC adapters;
- event clustering with embeddings plus deterministic guards;
- daily email digest;
- user-visible recommendation history and corrections;
- Dutch/English language support;
- licensed news provider integration.

### Later ideas

- Reddit and YouTube integrations;
- mobile push notifications;
- collaborative source lists;
- richer bias/coverage comparison;
- local on-device profile embedding;
- personal briefing questions and article chat;
- paid publisher feeds and enterprise watchlists.

## Core hypothesis

For a person with specific interests, a feed of 3-7 explainable events will produce higher self-reported information value and fewer irrelevant reads than a normal top-stories feed, even when the personalized feed contains fewer items.

The product should not proceed to broad crawling or paid licensing until a small controlled test shows that users prefer the event queue and can explain why the recommendations were useful.
