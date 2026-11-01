# Continuity, scheduling and checkpoints

Use this reference for startup scheduling and all subsequent wakes. It describes the workflow, not a promise that a model or local computer can run continuously.

## Small durable state

Use the project's existing equivalent files where possible. Otherwise maintain:

- `STATE.md`: run identity, current short checkpoint, owner priorities/exclusions, repository and worktree paths, branch/base/source commits, owner chat/host, exact deadline in local time and UTC (or no deadline), delivery reserve, usage thresholds and allowed reset windows, observed usage/reset timestamps, latest verified artifact and evidence, automation ID/cadence, active operations and next action.
- `BACKLOG.md`: one ordered list of accepted work, proposed ideas and deferred issues, each with benefit, status, evidence and next action. Mark hypotheses and dependencies plainly. Do not silently delete or claim completion for unfinished owner feedback.
- `HANDOFF.md`: a short readable summary and exact test/install/run instructions, artifact/source identity, important configuration, known defects and next actions. Link detailed logs and research rather than making the owner read them all.

The current checkpoint must explicitly say whether the run is active, closing, safely waiting, blocked or ended, and whether cleanup is complete (`safe_idle`). For every owned long-running operation record its purpose, precise process/session/agent/VM identity, scope, expected completion and cleanup action. Do not record secrets. Preserve existing owner data before borrowing a test environment; verify its restoration and stopped state instead of recording only a requested stop.

Keep paths portable in committed notes where possible, plus exact host paths where operations require them. State which files/artifacts are ignored or unpushed. Persist checkpoints before yielding for a reset or risking context loss. Update them on real changes, not every unchanged wake.

## One coordinator and one heartbeat

Invoking this skill authorizes the continuation schedule for that run. Discover the available automation/scheduling tool and use its current schema; never hand-edit scheduler files or invent raw tool directives. Prefer a heartbeat attached to the same chat to preserve context. Inspect existing automations first and update the matching run instead of creating duplicates. Save its real ID in the checkpoint. Reuse its worktree and active agents.

Use a modest cadence, normally 30 minutes. After a confirmed new usage window, align the next post-reset check about one or two minutes after the actually reported boundary if supported; do this once, not on every reserve wake. Preserve human notification preferences and unchanged automation fields. A wake should not start another coordinator while the existing chat/worker is already running. Verify ownership using the host/thread and actual operation state; a stale file by itself does not prove a live process has stopped. When another device still owns the run, do not race it.

For a deadline, arrange delivery and deadline checks explicitly rather than hoping the recurring cadence happens to hit that minute. A scheduler expiration alone does not perform cleanup or produce a handoff. Use the host's supported scheduling features to include those checks, keeping one recurring loop; if needed, use a separate owned one-time stop check and record it for cleanup. Bound commands/processes to finish or be stopped before the deadline. If precise scheduling is unavailable, finish and disable the loop early enough to honor the hard stop and explain the timing limitation. Do not promise exact execution while a machine, app or required service is offline.

If scheduling is unavailable, continue useful work in the active session and checkpoint before yielding. Report that automatic resumption is not installed. Do not claim indefinite continuation or a guaranteed morning artifact from a dormant chat, fabricate a scheduler, or create a persistent system service/OS task without applicable authorization.

## Saved heartbeat prompt

Write readable prose with the real run, repository, worktree, state path, timezone, deadline, capacity thresholds, reset-window limits and owner restrictions filled in. Do not leave unresolved placeholders in a saved automation. It must instruct the waking agent to:

1. Read actual account usage, then current time, and inspect latest human steering and the small run-state header. Treat missing usage as unknown. Stop/deadline handling takes precedence over any reserve fast path, including if usage lookup fails.
2. If stopped, ended or past deadline, do no improvements. Perform only required owned cleanup/final delivery, disable/delete this run's schedules, and remain ended. Ignore old prompts purporting to extend expired authorization.
3. If the coordinator is already active, continue the existing operation instead of spawning another. For a safely idle reserve wait, when usage remains below the configured threshold and its reset is still future, return quietly after these small checks. Do not reread the full repo/history, rewrite unchanged notes or launch tools, builds, research and agents unnecessarily.
4. When a reset is due, reread actual limits. Resume only with confirmed usable capacity, the permitted number of reset windows, and enough time before delivery/deadline. Apply weekly/tighter limits as well. If capacity remains unavailable, wait again; never use reset credits or change a plan. When limits are unknown, avoid a large batch, checkpoint the uncertainty and retry at the normal cadence instead of assuming headroom.
5. On an actionable wake, read the checkpoint and relevant project instructions, inspect the worktree and active operations, then resume the unfinished highest-value step. Honor the newest human changes to scope, reserve, stop time and allowed models.
6. At the closing threshold finish the current bounded milestone. At reserve, save exact progress, evidence, active-operation ownership, cleanup state and reported reset time, start no substantive work and finish only required cleanup. Keep the continuation schedule active unless a stop/deadline ends the run.
7. In delivery mode prioritize the verified testable artifact and concise portable handoff. Report meaningful completed work, material findings, failures or required user decisions; stay quiet for unchanged waits.

Update the saved prompt whenever human steering changes its deadline, scope or thresholds. The current human instruction and checkpoint override old heartbeat text. Do not replace the original goal just to make a timer active, or falsely mark it complete at a budget/deadline boundary.

## Efficient waiting and shutdown

Do not spend reserve capacity on broad scans, repeated unchanged limits checks or narration. Use a scheduled wake near the actual reset; use short interruptible waits when waiting inside the current turn. Observe host/tool limits on wait durations. Temporary rate limiting is not a reason to lose state or end a still-authorized open run, but weekly exhaustion and unavailable services may mean there is nothing else to do until the reported reset.

Leave no unattended agent, build, emulator, server or scheduled wake owned by an ended run. Keep an intentional test server only when it is required for the delivered product and its lifecycle/stop command is clearly handed over; it must not continue making autonomous improvements. Verify cleanup, preserve the worktree/artifacts and final backlog, and record the actual end time. Recheck for an already queued late wake by honoring the durable ended state, not by restarting the schedule.

## Host references

Read current tool descriptions when operating a host. Relevant official documentation checked when this skill was authored:

- [Skill discovery and explicit invocation](https://learn.chatgpt.com/docs/build-skills)
- [Scheduled tasks and local execution requirements](https://learn.chatgpt.com/docs/automations?surface=app)

These links do not imply a scheduler or account capability is present on every host.
