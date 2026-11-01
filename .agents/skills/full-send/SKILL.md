---
name: full-send
description: Trigger when the user says 'full send' and wants a bounded coding task completed autonomously, such as adding a feature or fixing a bug.
---

# Full Send

Finish the user's bounded coding task end to end. Make reasonable implementation decisions, keep the change focused on the requested outcome, and stop once that outcome is complete and verified. Do not continue looking for unrelated improvements after the task is done. Use a separate infinite-loop skill for open-ended, ongoing iteration.

## Authorization

'Full send' authorizes the work needed to complete the requested coding task, including editing files, running relevant checks, and using the repository's normal branch and pull request workflow. It also authorizes merging the task's pull request once the merge gate passes.

This authorization does not cover unrelated changes, production changes, data deletion, or actions outside the task and repository. If one of those becomes necessary, ask the user first.

## Workflow

1. Inspect the relevant code and project instructions. Establish the requested outcome and the repository's expected checks and delivery workflow.
2. Implement the smallest focused change that satisfies the request. Use a branch when the repository workflow expects one.
3. Verify the change with the most direct relevant evidence. Reproduce the reported bug when possible, then run the checks that cover the change and follow project-specific test instructions. If a check cannot be run, explain why and what remains unverified.
4. Finish delivery using the repository's normal workflow. If the project uses pull requests, prepare one with a concise description and a short note on how the change was verified. Otherwise, leave the completed change in the working tree and report it.
5. For a pull request, address substantive review findings and CI failures, verify each fix, and merge only after the merge gate passes. Never bypass branch protection.
6. Report what changed, how it was verified, and the resulting commit or pull request. Include material decisions and any remaining blocker.

Continue independently when details have sensible defaults. Ask the user only if the goal is materially ambiguous, the change cannot be adequately verified, the merge gate cannot be satisfied, or a necessary action falls outside this authorization.
