# Script style guide

## Voice

Clear, fast and technically credible. Natural spoken English. One idea per sentence most of the time. Mix short lines with occasional longer causal explanations.

## Required writing order

1. Write the exact promise.
2. List claims and primary sources.
3. Define the demonstration or proof.
4. Outline 3–5 ideas.
5. Write narration and visual purpose together.
6. Read aloud and split stacked clauses.

## Hook rules

- Start with a result, constraint, failure or contradiction.
- Make the promise understandable within 15 seconds.
- No greeting, biography, channel intro or generic setup.
- No fake suspense or “wait until the end.”

## Explanation rules

- Prefer concrete nouns and verbs.
- Define jargon only when needed for the decision.
- State evidence before opinion.
- Give the reason for every opinion.
- Mark uncertainty: “the public docs do not establish…”, “in this test…”, “likely…”.
- Never turn correlation into causation.
- Never invent a test, source, quote, metric or personal story.

## TTS rules

- Avoid dense parentheticals and stacked clauses.
- Put breathing points between scene ideas.
- Spell unusual pronunciation in `pronunciation` overrides.
- Keep acronyms consistent.
- Regenerate one scene, not a whole video, after a pronunciation fix.

## Forbidden filler

“In today’s fast-paced world,” “game changer,” “revolutionary,” “insane,” generic motivation, empty recaps, unsupported superlatives and fake urgency.

## Structured script

`script.json` is validated by Zod. Every scene requires `id`, `section`, `narration` and one visual type. Sources are attached to the scene whose claim they support. Optional fields stay optional.

## Templates

- **Tool review:** hook → task → test → limits → verdict.
- **AI news explained:** change → mechanism → practical impact → limits.
- **Technical concept:** concrete failure → model → example → decision.
- **Workflow build:** inputs → build → verification → failure handling → next action.
- **Model comparison:** criteria → controlled tasks → results → tradeoffs → choice.
