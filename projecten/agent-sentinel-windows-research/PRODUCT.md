# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

Target platform is Windows desktop (Windows 10/11), with a tray-first utility window and a background monitoring component. `adaptive` is used here because the available design context schema has no Windows-native value; it does not imply a cross-platform launch target.

## Stack

Research only; implementation is intentionally out of scope. The recommended future path is a native WinUI 3 + Windows App SDK desktop UI with a small background worker/service boundary. The exact runtime, packaging and service model remain open until a proof-of-concept validates lid-closed behavior on target hardware.

## Users

Primary: power users who run long local or hybrid workloads on Windows, including AI coding agents, builds, tests, renders, downloads and automations. The first product story is agent-aware, but the core job is broader: leave a workload running without leaving the machine awake forever.

## Product Purpose

The product watches declared workloads, keeps Windows available while meaningful work is active, and returns the machine to a chosen power state when work is safely finished. Success means the user can start a run, close the lid or walk away, and trust that the machine will neither sleep too early nor remain on indefinitely after completion.

## Positioning

An agent-aware Windows power guard: it combines workload evidence, transparent confidence and reversible power actions instead of treating “a process exists” as proof that useful work is happening.

## Operating Context

Users start work from terminals, IDEs, WSL, remote shells or agent tools, then minimize or close the lid. The app must remain understandable from the system tray and Windows notifications, while the full window explains why the system is being kept awake and what will happen next.

## Capabilities and Constraints

- Monitor one or more declared workloads through adapters, process trees, heartbeats, file activity or explicit agent hooks.
- Hold a Windows power request only while a session is active and release it when completion is sufficiently evidenced.
- Offer safe and hands-off operating modes; safe is the default.
- Execute shutdown, sleep or hibernate only after an explicit policy, a visible grace period and a final re-check.
- Treat laptop lid behavior, Modern Standby, battery state, thermal state and enterprise policy as hardware/OS constraints, not promises the app can override universally.
- Keep data local by default; no account or cloud backend is required for the MVP.
- The app itself is not an AI agent and must not infer completion from generic CPU idleness alone.

## Brand Commitments

The user wants a beautiful Windows app inspired by the simplicity of a small macOS keep-awake utility. No final product name, logo, paid model or existing brand system is confirmed. The future visual system must therefore be original, Windows-native and restrained rather than copying macOS chrome.

## Evidence on Hand

- User brief: build research/PRD/design only; do not build the app in this task.
- Microsoft documentation confirms the relevant power, shutdown, Modern Standby, process and Windows App SDK primitives; see `references/sources.md`.
- Mobbin MCP references were searched and inspected for monitoring dashboards, settings, onboarding and destructive confirmations; see `references/mobbin.md`.
- No user interviews, telemetry, target-device matrix or validated agent protocol are available yet. Future documents must label assumptions and must not invent adoption, reliability or energy claims.

## Product Principles

1. Keep the machine awake only for evidence-backed work.
2. Make every power decision visible, reversible and explainable.
3. Prefer a small, quiet tray utility over a dashboard that demands attention.
4. Fail safe when state is unknown, stale or contradictory.
5. Respect Windows power policy, hardware limits and user control.

## Accessibility & Inclusion

Use keyboard-complete navigation, visible focus, text equivalents for color/status, Windows high-contrast compatibility, reduced-motion support, readable status copy and a non-color-only distinction between working, waiting, blocked, complete and unknown.
