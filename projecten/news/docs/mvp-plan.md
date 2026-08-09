# Sift MVP plan

## The smallest useful product

The first MVP is a single-user, event-level information queue with a manually curated corpus. It proves one thing:

> Does a person get more information value from a short, explainable personal queue than from opening a normal news app?

No account system, broad crawler, social layer, or autonomous publisher summary is needed to answer that.

## Exact MVP feature list

1. Responsive web app with a desktop rail and mobile bottom navigation.
2. Sample onboarding that converts a plain-language description into editable interest rules.
3. Home feed with `For you`, `Important`, `Deep dives`, and `Updates` lanes.
4. Maximum visible item budget per lane; no filler items.
5. Story/event rows with source count, event type, why-it-is-here explanation, and freshness.
6. Story detail drawer with a source timeline and primary/reporting/analysis labels.
7. Save, follow, more-like-this, less-like-this, and not-interested interactions.
8. Search over demo events, entities, topics, and sources.
9. Interest profile with editable strengths and blocked topics.
10. Notification settings with explicit trigger controls.
11. Source settings with source class, trust tier, and enable/disable state.
12. Local persistence for demo profile, saved items, and feedback.
13. A clearly marked demo-data state so no illustrative claim looks like live reporting.

## Cut from MVP

- live publisher crawling;
- article full-text extraction;
- real authentication;
- multi-user sync;
- mobile native app;
- LLM-generated article summaries;
- comments, sharing, and social profiles;
- streaks, points, or engagement badges;
- algorithmic political-bias scores;
- market price charts;
- email and push delivery;
- multilingual translation;
- a general chatbot.

## Main pages

| Page | Purpose | Must prove |
| --- | --- | --- |
| Onboarding | Make precise preferences quickly | Users can express intent without building filters |
| Home / For you | Show a finite signal queue | The queue feels better than a general news homepage |
| Story detail | Explain the event and provenance | Users trust the event object and source grouping |
| Explore | Browse topics and sources | Discovery does not need an infinite feed |
| Search | Find a precise event/entity/topic | Search and following are first-class |
| Followed topics | Review explicit watchlist | Users can see what the system is watching |
| Saved | Keep high-value items | Saving is useful without turning into a backlog |
| Interest profile | Inspect and edit personalization | The algorithm is legible and correctable |
| Notifications | Define meaningful triggers | Alerts are scarce and intentional |
| Source settings | Control source classes and rights | Users understand where information comes from |

## Front-end component structure

The prototype intentionally uses a small set of vanilla components:

```text
index.html
styles.css
app.js
  state
  demoData
  renderShell()
  renderHome()
  renderExplore()
  renderSaved()
  renderProfile()
  renderNotifications()
  renderSources()
  renderStoryDrawer()
  renderOnboarding()
  event handlers
server.mjs
```

The production version can move the same boundaries into React components later. Do not introduce a component library until the interaction model is stable.

## Implementation order

1. Build the shell, navigation, and responsive layout.
2. Render the finite event queue from one local data object.
3. Add story detail and source grouping.
4. Add local profile state, saved state, and feedback.
5. Add search and follow actions.
6. Add profile, notification, and source settings.
7. Test at desktop, tablet, and 390px mobile widths.
8. Run a five-user qualitative test before adding ingestion.
9. Add one RSS adapter and ECB as the first live source experiment.
10. Compare the live event clustering baseline against manually curated clusters.

## Key experiments before committing to a backend

### Experiment A: value comparison

Give users a normal news homepage and the Sift queue on separate days. Ask:

- Which session gave you more useful information?
- How many items were irrelevant?
- What important thing, if any, did you miss?
- Would you open this again tomorrow?

Success signal: a clear preference for the event queue and fewer irrelevant items without a meaningful increase in missed important events.

### Experiment B: onboarding burden

Compare natural-language onboarding with a chip-only flow. Measure completion and whether the resulting profile is accurate after the user inspects it.

Success signal: users can correct the draft in under two minutes.

### Experiment C: explanation trust

Show the same event with and without `why this is here` and source grouping.

Success signal: users can predict why the item appeared and report higher trust when the explanation is present.

### Experiment D: empty feed tolerance

Show a three-item day honestly versus a ten-item feed padded with weak matches.

Success signal: users prefer the short feed and do not interpret emptiness as a broken product.

## Major unknowns

- how many people have a frequent enough set of narrow interests;
- whether users prefer daily briefings, a live feed, or search;
- whether a strong profile can be built in one natural-language prompt;
- how much source diversity is necessary before trust improves;
- how often clustering needs semantic models instead of title/entity rules;
- whether users will pay for personal information value;
- which Dutch and international publishers will permit commercial metadata use;
- whether important-news overrides improve awareness or simply reintroduce noise.

## Definition of done

The prototype is done when:

- all ten core screens are reachable;
- the default feed contains only a small set of illustrative events;
- every story has an explanation and source section;
- save, feedback, search, follow, and profile edits visibly change the interface;
- navigation works on desktop and mobile;
- no demo claim is presented as live reporting;
- the app runs without a build step or external API key;
- a smoke test confirms the key user journey from onboarding to feedback;
- product docs and research are stored beside the prototype.

The backend is not done until the value experiments pass. That is an intentional gate, not missing polish.
