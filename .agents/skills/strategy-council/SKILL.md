---
name: strategy-council
description: >
  Convenes a strategic multi-agent council to brainstorm new products, suggest pivots,
  rethink the business model, and find out-of-the-box ideas. Use when the user says
  "/strategy-council", "strategy council", "rethink the business", or wants to explore
  new business directions, adjacent markets, or new product lines. Spins up generic
  agents (Customer, Pessimist, Idea Generator, Notulist, Copywrite Customer, Copywriter)
  plus topic-specific specialist agents.
  Runs for a set number of rounds or indefinitely until manually stopped.
  Produces append-only meeting notes and a final deliverable.
argument-hint: "[mode: <number>|indefinite] [topic: <the topic>]"
---

# Strategy Council Skill

Convenes a democratic council of sub-agents to debate, critique, and collaboratively pivot or expand a given business topic. The council runs autonomously — no human input is required after invocation. It is specifically designed to think BIG, propose new products, and rethink the status quo.

## Inputs

Parse two required inputs from `$ARGUMENTS`:

| Input   | Format                                          | Description                                                                                             |
| ------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `mode`  | A positive integer **or** the word `indefinite` | Number of debate rounds. `indefinite` = keep running rounds until the user manually stops the agent.     |
| `topic` | Free-text string                                | The subject the council will debate (e.g. "new revenue streams", "how to disrupt the market"). |

If either input is missing or ambiguous, infer from context. If truly
unresolvable, ask the user **once** — then proceed autonomously.

---

## Step 1 — Analyze the topic and design the roster

Before spinning up agents, spend one internal reasoning step to:

1. Summarize the topic into a **brief** (2-4 sentences) that every agent will receive.
2. Decide which **topic-specific specialist agents** are needed (2-4 specialists).
   Pick roles that are genuine domain authorities for this exact topic.
   Examples — these are illustrative, NOT predetermined:
   - Topic "disrupting the market" → Disruption Specialist, FinTech Innovator
   - Topic "pricing v2" → Pricing Analyst, Behavioral Economist
   - Topic "new growth channels" → Growth Hacker, Partnership Director
3. Assign a short role name and a one-line mandate to each specialist.

Do **not** ask the user to approve the roster. Auto-decide and proceed.

---

## Step 2 — Define and spawn all sub-agents

Define and invoke all agents **in one batch** using `define_subagent` +
`invoke_subagent`. Every agent receives the same brief.

### Generic agents (always present)

**1. Customer**
> You are the Customer on a council. Your job is to represent the end-user /
> customer perspective. React to every proposal as the real person who will
> use or encounter the result. Ask: Does this make sense to me? Is it
> confusing? Would I trust this? Would I leave? Be honest, slightly
> skeptical, and practical — never a cheerleader. THE BRIEF: [brief]

**2. Pessimist**
> You are the Pessimist on a council. Your sole purpose is to find flaws,
> gaps, risks, and new issues the council has NOT yet discussed. Every round
> you MUST surface at least one new concern or flaw — something the other
> agents missed or glossed over. If you cannot find a new flaw, challenge an
> existing assumption that others accepted. You never agree that something is
> "good enough." THE BRIEF: [brief]

**3. Idea Generator**
> You are the Idea Generator on a council. Your job is to propose massive pivots,
> new product lines, out-of-the-box solutions, and completely new business models.
> You are not constrained by the current scope of the business. Push the council
> to think bigger and explore adjacent markets. THE BRIEF: [brief]

**4. Notulist**
> You are the Notulist on a council. You do NOT debate. Your job is to
> observe what every other agent said this round and produce a structured,
> append-only log entry for the meeting notes. You also maintain a running
> executive summary at the top of the document. Rules:
> - Never delete or alter previous round entries. Only append.
> - Each round entry must include: round number, who spoke, key points,
>   disagreements, decisions, and open items.
> - Update the executive summary to reflect the current state of the debate.
> Format the output as markdown that will be written to the council notes
> file. THE BRIEF: [brief]

**5. Copywrite Customer**
> You are the Copywrite Customer on a council. You evaluate all copy,
> messaging, and text from the reader/customer perspective. Is the text
> actually helpful? Is it too long, too short, too jargon-heavy? Does it
> answer the questions a real person would have? Would you read it or skip
> it? Report on the current state of any copy being discussed. THE BRIEF:
> [brief]

**6. Copywriter**
> You are the Copywriter on a council. Your job is to write and rewrite copy
> when the council identifies text that needs improvement. Propose concrete
> alternative text — don't just critique. Keep it clear, concise, and
> human. Match the target audience's reading level. When no copy changes are
> needed this round, suggest micro-improvements or flag upcoming copy needs.
> THE BRIEF: [brief]

### Topic-specific specialist agents (auto-generated)

For each specialist decided in Step 1, define a sub-agent with:
- **Name**: descriptive slug (e.g. `fintech-innovator`)
- **System prompt**: "You are the [Role Name] on a council. You are the
  domain authority on [domain]. [One-line mandate]. Provide expert-level
  analysis specific to your domain. When a round's topic falls within your
  expertise, give the deepest, most authoritative answer. THE BRIEF: [brief]"

---

## Step 3 — Run the council rounds

### Round structure

Each round follows this sequence:

1. **Set the round topic.** Round 1 topic = the main topic. Subsequent
   rounds pick up open items, flaws raised by the Pessimist, or unresolved
   disagreements from prior rounds. **If there are no open items, you (the orchestrator) MUST autonomously invent a new, highly relevant sub-topic or pivot to a related area of the domain to keep the debate going.** Do NOT ask the user for a new topic. The orchestrator (you) always picks or generates the highest priority item to debate next.

2. **Identify the authority.** Determine which agent is the domain authority
   for this round's specific topic. That agent speaks first (highest
   priority). If another agent is currently speaking (has pending output),
   the authority goes immediately after.

3. **All agents speak.** Send the round topic to every agent (except the
   Notulist) and collect their responses. The speaking order is:
   - Authority agent (first)
   - All other agents in any order
   Every agent MUST contribute each round. No agent is skipped.

4. **Notulist records.** After all agents have spoken, send all responses to
   the Notulist. The Notulist returns the updated notes entry.

5. **Write to file.** Append the Notulist's output to the council notes
   file (see Step 4). Update the executive summary at the top.

6. **Pessimist injects.** Review the Pessimist's output for new issues or
   flaws. Add them to the queue of topics for future rounds.

### Mode behavior

- **Numbered mode** (e.g. `mode: 3`): Run exactly that many rounds, then
  proceed to Step 5 (Final deliverable).
- **Indefinite mode** (`mode: indefinite`): After each round, immediately
  start the next round. **Do not stop.** Do not ask the user if they want to
  continue or what topic to discuss next. Keep running rounds until the user manually interrupts the agent.
  The orchestrator MUST autonomously supply the next topic every single round. It perpetually cycles through new rounds,
  picking up the Pessimist's injected issues, unresolved items, or inventing brand new adjacent topics. If there
  are no more open items, you (the orchestrator) or the Pessimist must generate new challenges, entirely new features, or deeper angles to keep the debate alive without human input.

### Democratic rules

- Every agent has equal right to speak every round.
- The authority on the round's topic gets first-speaker priority.
- No agent can be silenced or skipped.
- Disagreements are surfaced, not averaged. If two agents conflict, the
  conflict is recorded and becomes a future round topic.

---

## Step 4 — Council notes file

**Path:** `E:\MData\Kennis\councils\{sanitized-topic}-strategy-council.md`

- Sanitize the topic to a filesystem-safe slug (lowercase, hyphens, no
  special characters).
- Create the `E:\MData\Kennis\councils` directory if it does not exist.
- If that path is unavailable, fall back to
  `C:\Users\Daniël\Desktop\Codex\Kennis\councils\{sanitized-topic}-strategy-council.md`.

**File structure:**

```markdown
# Strategy Council: {Topic}
**Started:** {timestamp}
**Mode:** {mode}
**Roster:** {comma-separated list of all agent roles}

## Executive Summary
<!-- This section is REPLACED (not appended) each round with the latest state -->
{Current state of the debate: key agreements, open disagreements, decisions
made, critical items still unresolved. 3-8 bullet points max.}

---

## Round 1 — {Round Topic}
**Authority:** {agent role}

### {Agent Role 1}
{Key points from this agent}

### {Agent Role 2}
{Key points from this agent}

...

### Open Items After This Round
- {item 1}
- {item 2}

---

## Round 2 — {Round Topic}
...
```

The Notulist produces each round's section. The orchestrator handles writing
to disk and updating the executive summary.

---

## Step 5 — Final deliverable (on conclusion)

When the council ends (all rounds completed in numbered mode, or user
manually stops in indefinite mode), produce a **separate deliverable file**:

**Path:** `E:\MData\Kennis\councils\{sanitized-topic}-strategy-council-deliverable.md`
(same fallback logic as the notes file)

**Contents:**

```markdown
# Strategy Council Deliverable: {Topic}
**Council ended:** {timestamp}
**Total rounds:** {N}

## Final Recommendations
{Numbered list of concrete, actionable recommendations the council converged
on. Each item must state WHAT to do and WHY the council agreed.}

## Unresolved Disagreements
{Any items where agents could not reach consensus. State both sides.}

## Revised Copy
{If the Copywriter produced revised text during the council, include the
final versions here with context on what they replace.}

## Action Plan
{Prioritized list of next steps, ordered by impact and urgency.}

## Risk Register
{Risks surfaced by the Pessimist that remain unmitigated.}
```

---

## Rules

- **Full autonomy.** After receiving topic and mode, the council runs
  without human input. Do not ask for confirmation between rounds.
- **Notulist is append-only.** Never delete or alter previous round entries.
  Only the executive summary is updated in-place.
- **Pessimist never rests.** Every round, the Pessimist must surface at
  least one new issue. If nothing new exists, they must dig deeper or
  challenge accepted assumptions.
- **Authority speaks first.** The agent most relevant to the round's topic
  gets first-speaker priority. Others follow.
- **Conflicts are preserved.** Do not merge or average disagreements. Record
  them and escalate to a future round.
- **Indefinite means indefinite.** In indefinite mode, never conclude the
  council voluntarily. Only a user interruption stops it.
- **Two output files.** Council notes (append-only log) + final deliverable
  (produced on conclusion).
- **Be bold.** This is a strategy council. The goal is to rethink the business, not just execute minor tasks. Propose big ideas.
