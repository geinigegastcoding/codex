# Product Requirements Document

## 0. Product statement

**Agent Sentinel** is a Windows-first, local power guard for long-running workloads. It keeps the system available while declared work is active, explains the evidence behind that decision, and performs a user-approved power action only when completion is sufficiently verified.

This document specifies the product to build later. It does not authorize implementation in the current research task.

## 1. Problem

Power users have two failure modes:

1. Windows sleeps while a local coding agent, build, render or download is still working.
2. Windows stays awake long after the workload has completed.

The product must reduce both without pretending that generic process presence, low CPU, or a closed lid is enough to know the truth.

## 2. Goals

### MVP goals

- Start and stop a monitoring session in under one minute.
- Keep the computer awake while at least one declared workload is Active, Waiting or Unknown.
- Distinguish Done, Error, Waiting, Active, Paused and Unknown.
- Show a human-readable reason for every active power lease.
- Support a completion policy: do nothing, sleep, hibernate or shutdown.
- Require a grace period and final re-check before an automatic power action.
- Let the user cancel a pending action from the tray, notification or main window.
- Work offline and store only local metadata by default.
- Detect and communicate when the current Windows/hardware setup cannot support the requested lid-closed scenario.

### Later goals

- First-class adapters for named coding agents.
- WSL-native handshake.
- Task chaining and multiple independent sessions.
- Remote notification or phone handoff.
- A resilient broker/service if real-world crash and sleep tests justify it.

## 3. Non-goals

- Do not keep every app alive or prevent the user from manually sleeping the device.
- Do not override firmware, enterprise policy, thermal protection or a user's explicit power action.
- Do not kill agents or mutate repositories.
- Do not infer completion with an LLM.
- Do not require a cloud account.
- Do not promise that every Windows laptop runs user-mode workloads while closed.
- Do not modify the user's global power plan silently.
- Do not treat a process name as a supported integration by itself.

## 4. Product model

### 4.1 Session

A user-created monitoring intent with:

- one or more workload definitions;
- a start time and optional deadline;
- a power lease;
- a completion policy;
- a safety mode;
- an event history.

### 4.2 Workload

A declared source of work. Examples:

- a command/process tree started by the app;
- a selected existing process tree;
- a wrapper/heartbeat contract;
- a watched folder or event file;
- a future agent adapter;
- a manual “I’m done” fallback.

### 4.3 Evidence

Timestamped facts, not a model guess:

- process started/exited and exit code;
- child-process presence;
- adapter heartbeat;
- structured status event;
- recent output/file activity;
- prompt or blocked marker;
- user override.

### 4.4 Power lease

The active request that asks Windows to remain in the working state. A lease has an owner, reason, start time, last renewal and release reason. It must be cleared when the session ends, the app is disarmed, or a hard safety condition occurs.

### 4.5 Completion policy

The action to take after all declared workloads meet the session’s completion rule:

- No action;
- Sleep;
- Hibernate;
- Shut down.

The MVP should default to Sleep or No action during first-run setup, not immediate shutdown.

## 5. State machine

| State | Meaning | Keep awake? | Auto power action? |
|---|---|---:|---:|
| Draft | Session is being configured. | No | No |
| Armed | Session is ready; no active evidence yet. | Yes once a workload starts, with short arm grace | No |
| Active | Recent evidence shows work is progressing. | Yes | No |
| Waiting | Agent/tool is waiting for user input or a known external condition. | Yes in Safe; configurable in Hands-off | No |
| Blocked | Work cannot progress or reported an actionable error. | Yes by default | No |
| Unknown | Evidence is stale, contradictory or unavailable. | Yes | No |
| Ready | All declared workloads are terminal and the quiet period passed. | Until action begins | Yes if policy permits |
| Countdown | A final power action is scheduled. | Not required, but maintain until action | Yes at timeout |
| Paused | User temporarily released the lease or monitoring. | No | No |
| Completed | Action executed or user chose no action. | No | No |
| Aborted | User or safety rule cancelled the pending action. | Depends on session mode | No |

Rule: Unknown must never silently collapse into Ready.

## 6. Functional requirements

### FR-01 — Create a session

The user can create a session from the tray or main window, choose a workload source, choose a completion policy and choose Safe or Hands-off mode.

Acceptance:

- no more than three setup steps for the common path;
- every selected workload is visible before arming;
- the default action is non-destructive;
- the user can exit without changing system settings.

### FR-02 — Detect workload activity

The engine can consume at least two evidence types in MVP:

1. process lifecycle/process tree;
2. explicit wrapper or heartbeat.

File activity and agent-specific adapters are planned extensions, not a reason to delay the core state model.

Acceptance:

- the UI identifies the evidence source;
- stale evidence has a timestamp;
- process matching alone cannot mark a session Ready without the configured quiet-period rule.

### FR-03 — Explain status

Every non-terminal state has a short reason and a “details” path to the event log.

Examples:

- Awake · build.exe child process active
- Waiting · terminal prompt detected
- Unknown · heartbeat stale for 90 seconds
- Ready · 2 of 2 workloads exited with code 0

### FR-04 — Hold and release the power lease

When the session requires it, the app creates/renews a Windows power request. When the session no longer requires it, the request is released and the event is logged.

Acceptance:

- no hidden forever-loop;
- a lease exposes start, last renewal and release reason;
- app restart does not leave the user unable to disarm;
- a failed lease call is shown as an error, not treated as success.

### FR-05 — Preflight device capability

Before an armed session starts, the app checks:

- desktop vs laptop;
- AC/DC power;
- battery percentage and configured threshold;
- lid-close action;
- Modern Standby/S3 signal where available;
- permission/privilege needed for the planned action;
- whether the app can stay running in its selected mode.

Acceptance:

- warnings are actionable and link to the relevant Windows setting;
- “closed lid supported” is a conditional state, not a marketing promise;
- the app refuses Hands-off shutdown when a critical preflight check is unknown.

### FR-06 — Completion arbitration

The engine marks a session Ready only if all declared workloads satisfy the configured completion rule.

Default rule:

1. each workload is terminal or explicitly user-completed;
2. no workload is Waiting, Blocked or Unknown;
3. a quiet period has passed;
4. no new evidence arrived during the final re-check;
5. battery/thermal/policy guards allow the action.

### FR-07 — Countdown and abort

The user sees the planned action, target time, reason and cancel control. The countdown is visible in the tray and main window; notification action “Cancel” must be available where Windows allows it.

Safe default: 60 seconds. The value must be configurable and tested with shorter values in QA.

### FR-08 — Notifications

Notify on:

- session armed;
- capability warning;
- waiting/blocked state;
- evidence became unknown;
- completion detected;
- countdown started;
- action cancelled or failed.

Do not notify on every heartbeat or polling tick.

### FR-09 — History and diagnostics

Keep a local rolling history of session events:

- timestamp;
- state transition;
- evidence source;
- power lease action;
- user action;
- system result/error.

MVP history can be seven days and text-first. Export is later.

### FR-10 — Recovery

On app restart, the user sees the last session’s unresolved state. The app must not resume destructive automation silently after an unclean exit.

Acceptance:

- after crash/restart, session is Recovery required or Unknown;
- the user must re-arm a destructive action;
- stale power leases are cleared or surfaced with remediation;
- a failed shutdown is visible.

## 7. Safety rules

### Safe mode

- Unknown, Waiting and Blocked block automatic power actions.
- any new evidence during countdown aborts the countdown;
- battery below threshold changes action to a safer configured fallback or stops the lease with a warning;
- thermal alert stops hands-off behavior;
- first session uses a non-destructive default;
- force-close of other apps is never used.

### Hands-off mode

- opt-in with an explicit warning;
- user chooses the allowed power action and max session duration;
- Unknown may remain awake but never becomes Ready without the chosen rule;
- hard max duration always wins;
- countdown and abort remain visible;
- no forced shutdown flag in the default implementation.

## 8. Tray-first UX requirements

The tray surface must answer in one glance:

1. Is the machine protected from idle sleep?
2. What is the app watching?
3. What will happen next?
4. Can I stop it?

Target tray actions:

- Open Agent Sentinel;
- Pause protection;
- Cancel countdown;
- End session;
- Start a new session;
- Quit.

Closing the main window minimizes to tray while an armed session exists. The app must state this in first run.

## 9. Metrics and research targets

These are proposed validation targets, not current performance claims:

- first-run completion without help;
- percentage of test participants who can explain why the machine is awake;
- percentage who can correctly cancel a countdown;
- false-shutdown rate in controlled scenario tests: target zero before pilot;
- missed-completion rate in controlled scenario tests;
- rate of sessions ending in Unknown;
- median time to recover from a blocked or stale session;
- battery/thermal delta for representative AC and DC runs.

Do not optimize for “hours kept awake” or raw session count; those metrics reward the wrong behavior.

## 10. Release plan

### Phase 0 — proof of reality

- WinUI/tray shell;
- manual session;
- one process-tree adapter;
- power request;
- countdown and abort;
- diagnostics;
- hardware test matrix.

Exit only after no data-loss path is found in controlled tests.

### Phase 1 — useful MVP

- wrapper/heartbeat contract;
- Safe/Hands-off modes;
- preflight capability UI;
- notifications;
- seven-day history;
- packaged installer and startup option.

### Phase 2 — agent quality

- named adapters;
- WSL bridge;
- better waiting/blocked detection;
- session templates;
- richer recovery.

### Phase 3 — ecosystem

- optional MCP/CLI integration;
- remote notification;
- scheduled sessions;
- team policy only if user research proves the need.

## 11. Definition of done for an implementation

The implementation is not done when the PC stays awake once. It is done when:

- an active workload prevents idle sleep;
- a completed workload releases the lease;
- unknown/blocked/waiting never cause an unintended shutdown;
- countdown can be cancelled from every visible surface;
- lid-closed limitations are communicated and tested;
- crash, restart, unplug and lid transitions are logged;
- the same behavior is explainable from the event history.
