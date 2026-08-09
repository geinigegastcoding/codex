# Sift architecture

## 1. Pipeline

```text
source registry
    -> fetch adapter (RSS/API)
    -> normalize metadata
    -> extract entities, topics, event type, claim, importance
    -> canonicalize URL and publisher identity
    -> cluster documents into story/events
    -> calculate per-user relevance
    -> apply blocks, freshness, diversity, and item caps
    -> store recommendation + explanation
    -> serve feed, search, notifications, and audit views
```

The event/story is the durable object. A document is evidence attached to the story.

## 2. Practical ranking model

Start deterministic. Use an LLM or embedding model for extraction and semantic matching only where rules cannot decide. Do not train a large recommender until there is real interaction data and a baseline to beat.

### Candidate gate

1. Pull candidates from followed topics/entities, enabled sources, and a small important-news pool.
2. Canonicalize and cluster first so the user is scored against an event, not ten copies.
3. Suppress exact hard blocks unless the event meets the important-news override threshold.
4. Exclude stale, low-quality, already-dismissed, and near-duplicate stories.

### Feature values

`interest_match`

- 1.00: explicit entity or trigger match;
- 0.90: explicit topic match;
- 0.70: confirmed semantic neighbor;
- 0.35: repeated positive behavior only;
- 0.00: no meaningful profile match;
- -1.00: hard block.

`importance`

Editorial or rule-based score from official announcements, market-wide impact, cross-country scope, multi-source corroboration, and consequence. Never infer importance only from clicks.

`source_quality`

Direct official source > licensed reporting > specialist analysis > community discussion. A community link can still be useful, but it cannot silently become a fact source.

`freshness`

Decay by event type. A rate decision is useful for longer than a breaking headline; an analysis may remain useful longer than a duplicate report.

`novelty`

Reward a new event or a meaningful update. Penalize a fifth article that adds no new information.

`update_value`

Reward a change to an event the user saved or follows. Show what changed, not just that another article exists.

### Initial score

```text
score =
  0.42 * interest_match
  + 0.22 * importance
  + 0.12 * source_quality
  + 0.10 * freshness
  + 0.08 * novelty
  + 0.06 * update_value
  - repetition_penalty
```

The final score is not shown as false precision. The UI uses labels such as `Strong match`, `Worth a look`, and `Outside your profile` while the numeric breakdown remains inspectable in the recommendation audit.

### Important-news override

Use a separate lane, not a hidden score boost. An item qualifies only when a deterministic rule or an editorial threshold says it has broad consequence, such as a major emergency, public safety event, large market disruption, or fundamental change to a widely used service.

Safeguards:

- maximum three override items per day;
- clearly labelled `Outside your profile`;
- never let override content crowd out explicit high-priority triggers;
- do not use a user's political preferences to decide whether a public event is important;
- keep the rule and source evidence visible;
- allow the user to mute the lane separately from normal profile blocks.

### Learning without engagement bait

- explicit follow: strong positive weight;
- save: strong positive weight for the matched topic/entity;
- `more like this`: strong positive weight;
- `less like this`: negative weight, not a global block;
- `not interested`: block the selected topic/entity or open a confirmation;
- open: weak positive signal;
- read completion: weak, capped signal;
- ignore: only a small negative signal after repeated exposure;
- dwell time: never a direct optimization target.

Keep a user-visible profile change log: `Nvidia moved from medium to high because you saved three Nvidia infrastructure events.` Allow undo.

## 3. Deduplication and story identity

Use a layered approach:

1. exact canonical URL and publisher ID;
2. normalized title similarity within a time window;
3. named-entity overlap and date/location agreement;
4. semantic similarity for near-duplicates;
5. a human-review or low-confidence state when signals disagree.

The cluster receives a stable story ID anchored to the earliest reliable member. Later wording changes become aliases, not new stories. Store the alias mapping so the event keeps its identity when the original source disappears from a fetch cycle.

For each event, select the primary source using directness, authority, legal permission, and freshness. Keep other sources underneath for corroboration and perspective.

## 4. Data model

The MVP can use SQLite or a small Postgres schema. Production should use Postgres because full-text search, constraints, auditability, and future vector storage matter more than a document database here.

### Core entities

`users`

`id`, `locale`, `timezone`, `created_at`, `deleted_at`

`interest_rules`

`id`, `user_id`, `kind` (`topic|entity|trigger|scope`), `value`, `polarity`, `strength`, `confidence`, `source` (`explicit|confirmed|inferred`), `expires_at`, `created_at`, `updated_at`

`entities`

`id`, `canonical_name`, `type`, `aliases`, `external_ids`

`topics`

`id`, `canonical_name`, `parent_id`, `description`

`sources`

`id`, `name`, `domain`, `source_class`, `trust_tier`, `feed_url`, `api_name`, `licence_notes`, `attribution_required`, `retention_policy`, `enabled`

`documents`

`id`, `source_id`, `external_id`, `canonical_url`, `title`, `description`, `author`, `published_at`, `updated_at`, `language`, `content_type`, `rights_state`, `raw_metadata`, `fetched_at`

`stories`

`id`, `canonical_claim`, `story_type`, `first_seen_at`, `last_updated_at`, `importance_score`, `importance_reason`, `status`, `canonical_document_id`

`story_documents`

`story_id`, `document_id`, `relationship` (`primary|reporting|analysis|community`), `cluster_confidence`, `first_seen_at`

`story_entities` and `story_topics`

join tables with confidence and extraction method.

`story_aliases`

`alias_key`, `story_id`, `valid_until`, `reason`

`user_story_states`

`user_id`, `story_id`, `seen_at`, `opened_at`, `saved_at`, `feedback`, `read_bucket`, `dismissed_at`

`follows`

`user_id`, `target_type`, `target_id`, `notification_mode`, `created_at`

`recommendations`

`id`, `user_id`, `story_id`, `lane`, `score`, `score_breakdown`, `explanation`, `model_version`, `created_at`, `shown_at`, `withdrawn_at`

`notification_rules`

`user_id`, `rule_type`, `target_id`, `threshold`, `channel`, `schedule`, `enabled`

### Important constraints

- unique `(source_id, external_id)`;
- unique canonical URL after normalization;
- one active story identity per document;
- foreign keys for every join;
- append-only recommendation audit rows;
- deletion cascade for a user profile and interactions;
- retention jobs for raw source payloads.

## 5. Recommended implementation stack

### Prototype in this folder

- static HTML, CSS, and browser JavaScript;
- no framework or dependency required;
- demo data in a local JS module;
- Node's built-in HTTP server for preview.

This keeps the selection hypothesis visible and easy to change.

### Production MVP after validation

- Next.js + TypeScript for the app and API;
- Supabase Postgres for users, stories, search, and row-level access control;
- Postgres full-text search and trigram search first;
- scheduled Node/TypeScript ingestion worker using RSS/API adapters;
- Supabase Edge Functions or a small cron worker for scheduled jobs;
- an LLM provider only for structured extraction and low-confidence entity resolution;
- `pgvector` only after the deterministic baseline has measurable failures;
- object storage only for licensed assets or explicitly permitted source payloads.

Avoid Redis, Kafka, a vector database, and microservices until the ingestion rate or traffic makes the simpler stack fail.

## 6. Source ingestion plan

### Stage 1: curated public sources

- ECB RSS and Data Portal;
- official company blogs and release feeds for followed companies;
- a few licensed or explicitly permitted RSS publishers;
- Hacker News for developer links;
- GitHub releases for followed repositories.

### Stage 2: regulated/public data

- SEC EDGAR for US company filings;
- Dutch and EU government feeds;
- market data only through a provider whose terms permit the intended display and retention.

### Stage 3: licensed breadth

Add a paid news provider or direct publisher agreements only if the product earns enough value from coverage to justify the recurring cost and legal review.

## 7. Privacy and trust architecture

- store explicit profile rules separately from raw interaction events;
- make every ranking decision reproducible from `recommendations.score_breakdown`;
- do not send private user profiles to an LLM by default;
- send only the minimum normalized story features needed for extraction;
- record source rights and deletion status per document;
- support export/delete before public launch;
- show fact/analysis/opinion labels and source provenance at the story level.

%% ponytail: deterministic baseline before embeddings; shared event identity before article volume %%
