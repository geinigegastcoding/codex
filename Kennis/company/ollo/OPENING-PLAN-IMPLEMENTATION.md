---
title: Ollo optional purpose and finish cue
created: 2026-10-18
updated: 2026-10-18
type: project
status: verified-local
tags: [ollo, implementation, opening-plan]
---

# Optional purpose and finish cue

- **Built:** the opening prompt and completed quiz offer **Kies doel en eindmoment**. Choose finishing a message, looking something up, or a short browse, then 5, 10 or 20 minutes. Default: 5 minutes. Opening without a purpose remains available.
- **Built:** when the chosen time is due and that app is foreground, Ollo offers **Afgerond, naar startscherm**, **Herinner me over N minuten**, or **Verder zonder herinnering**. It explicitly says it cannot know whether the task is finished. No notification appears over another app or Home.
- **Rules preserved:** wait/quiz requirements, session limits, hard blocks, essentials and existing two-minute return grace still apply. Continuing the cue reschedules only the reminder; it cannot extend access or override a block.
- **Local and temporary:** one preset-purpose plan exists in memory. Screen-off, service disconnect/process restart, expired access, a fresh prompt or hard block clears it. It is absent from settings, the database and exports. No free text, notification permission, network, billing or telemetry added.
- **Verified:** 83 unit tests, lint with 0 errors/18 existing warnings, and 12 review packaging checks. The 150 native checks comprise 100 full-flow checks at normal/200% text, then two focused 25-check confirmations of optional opening and named 48dp purpose rows after label-resource changes. Exact artifact hashes and scope are retained.
- **Real release follow-up:** the unchanged minified release passed 34 native checks at normal text, including an actual five-minute cue (300,122ms after opening), visible math answers, purpose selection and finish/Home. Continue/dismiss were reachable; their executed behavior retains earlier debug coverage. Ten/twenty-minute runtime, other release flows, TalkBack, physical/OEM and Android 16 remain unverified. [Exact scope](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-18-opening-plan-release/results.json).
- **Later copy refinement:** the cue now names the reminder action explicitly and repeats the existing-time-rules hint. Current minified release passed 35 native checks with a real five-minute cue; normal/200% full-flow fixtures passed 40/62 checks. [[CUE-ACTION-CLARITY]] separates exact artifacts, failed attempts and limits.
- **Product limit:** this implements a small research experiment, not automatic task detection or proof of demand, effectiveness or uniqueness. A user-defined finish condition, multiple plans and persistent reminders remain unbuilt.
- **Review device:** original APK and 19 files were restored, synced and verified across a cold VM restart before app launch; emulator stopped. A prior next-boot data-loss finding is preserved, with cause unknown. No user phone changed.

[Evidence](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-18-opening-plan/results.json) · [Native gallery](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/screenshots/index.html)

Current development-signed release SHA256:`1d97d94cb98aed48c351e92913899c061227555914db1fafcd2acab510c9a776`. Earlier f26ecf… evidence above remains historical. Local source candidate only; unpublished.
