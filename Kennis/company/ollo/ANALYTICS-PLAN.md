> Current delta18October: RevenueCat10.28.1 core/UI is now integrated in the0.3.0source with authorized purchase-service network flows. All features stay free; Test Store/non-gating paywall only. Production key, Play/signing/catalog, privacy/contact,5Google SDK-terms reviews (all17previously missing POMs retrieved) and native acceptance remain open. No PostHog, Firebase service or ad network added; transitive Firebase encoder codecs are present. See [[REVENUECAT-INTEGRATION]] and the current [[DATA-SAFETY-WORKSHEET]]; historical no-SDK statements below no longer apply to this candidate.

# Analytics and diagnostics plan

Status date: 2026-10-16. This is a prospective, consent-first schema. It does not authorize SDK installation or data transmission. Ollo 0.2.0-review currently has no analytics, crash reporting, account, internet permission, or server. Its product promise is offline and local. Keep that as the shipped behavior unless the owner makes a deliberate product/privacy decision and updates user-facing disclosures.

## Purpose and decision rule

Measure only questions that could change onboarding or product reliability: (1) can users finish setup and enable protection, and (2) does the app remain technically reliable on supported device/API classes? Do not use analytics to infer whether users reduced their phone use or whether an individual is compliant. Existing local metrics already provide the user's own history. Before collecting remotely, specify the decision, minimum sample, responsible owner, retention and a sunset/review date.

Preferred order:

1. No remote telemetry: retain local user-facing metrics and issue diagnostics; gather support evidence only when users export it themselves.
2. Optional local diagnostics: user-initiated export of a bounded, redacted diagnostic bundle, with preview and cancellation. Keep it local until a separate explicit share action.
3. Optional remote aggregate events or crash reports: separate affirmative opt-in, disabled before consent, narrow allowlist, easy in-app off switch and locally queued data deletion. Treat this as a separate product/privacy variant that requires updated privacy policy and Google Play Data safety review before enablement.

## Minimal event schema (remote variant only)

Use lowercase `object_action` names. Events are one-shot milestones, never per-second timers, app foreground changes, or raw button taps. All events have a versioned schema. Ollo does not intentionally add email, phone, account ID, Android ID, advertising ID, IP-derived location, exact timestamp property, free text or user-generated content. A vendor may add its own identifiers and metadata; inspect the precise SDK behavior and payloads and document residual data before selecting it. Consent enables the disclosed collection; it does not make SDK-generated identifiers or metadata disappear.

The event properties listed below contain no Ollo-supplied identifier, but this alone does not make the events identifier-free. Stock PostHog Android generates and persists an anonymous `distinct_id` and session ID, and captures anonymous events by default; disabling person profiles does not remove those event identifiers. With a stock PostHog SDK, these milestones can support a person/install-linked setup-to-protection funnel, but they are pseudonymous linked events, not zero-identifier aggregates. If the product requires strictly unlinked aggregate counts, use a custom aggregation path that discards event/person/session identifiers before storage and verify the resulting requests; if the selected SDK cannot guarantee that property, do not use it for that variant. Aggregate-only counting can report total `setup_completed` and `protection_started` events, but cannot determine how many individuals completed both or form a person-level funnel without linkage.

| Event | Trigger | Allowlisted properties | Why it exists |
|---|---|---|---|
| `setup_completed` | First completed setup only | `schema_version`, `app_version`, `android_api_bucket` (29-32/33-35/36+), `locale_language` (language only, optional) | Find broad setup completion friction. Do not include chosen apps, selected rules, permission state detail or answers. |
| `protection_started` | First successful start after setup | Same common fields | Check whether setup produces actual core use. No package names, counts of chosen apps, duration, schedule or precise time. |
| `diagnostic_export_created` | User explicitly creates a local diagnostic export; send remotely only if remote consent is separately enabled | `schema_version`, `app_version`, `android_api_bucket`, `export_kind` (`support_minimal`) | Assess support demand without transferring the exported contents. Default plan is local only; this event is optional and can be omitted. |
| `app_crash` | Only if user has opted into diagnostics and a selected provider captures crash data | `app_version`, `android_api_bucket`, coarse `release_channel` | Reliability only. Stack trace can contain code paths and exception messages may include user data; review, redact and constrain before transmission. Provider-generated crash reports are a separate reviewed schema, not covered by event allowlisting alone. |

The explicitly allowlisted event properties are not direct user identifiers. App version and coarse API bucket are sufficient to bucket compatibility issues. Omit locale by default; if needed use language only and never region/country unless a concrete decision requires it. No event includes selected-app count because for a small sample it may reveal behavior and is not needed for activation.

## Explicitly prohibited by default

- Package names, app names/icons, installed-app inventory, chosen essentials/distraction apps, observed foreground package, URL or deep-link values.
- UsageStats, duration, open count, session limits, daily budget, schedules, streaks, baseline/history/chart data, quiz topic/answers/results, user goal or behavior outcome.
- Raw diagnostics, logs, exported CSV/JSON, screen text, accessibility event payloads, exception messages containing user data, UI screenshots, session replay or tap/autocapture streams.
- Exact event timestamps, location, Android/device/account/ad IDs, email, phone, contact data, free-text properties or identifiers shared with RevenueCat/another service.
- Third-party ads, cross-app attribution, fingerprinting, or SDK-generated lifecycle/screen/deep-link/exception events without a separate review and consent.

## Consent, control and failure behavior

For an approved remote-telemetry variant, display a separate plain-language choice before initializing any collection. Default off; do not bundle consent with required Accessibility permission or setup completion. Explain event categories, recipient/provider, purpose, retention, whether diagnostics may include stack traces and how to revoke. Decline must leave core app behavior fully usable. Persist choice locally. An always-visible settings toggle stops future capture promptly and deletes unsent queued events locally without uploading them; provide a delete-unsent-data action. Do not silently upload previously collected local diagnostic files when consent is later enabled. Queue size/time are bounded; local buffers and consent state must not be restored from backup. Respect airplane mode and do not prompt-loop. Consent governs the disclosed collection; it does not make a chosen vendor's identifiers, timestamps or device metadata absent. Where those are incompatible with the product promise, choose a vendor/configuration that can meet the constraint or keep telemetry off.

For the current no-telemetry build, do not request INTERNET or initialize an SDK. Local issue evidence stays on device until user exports/shares. Ensure deleting measurements does not accidentally preserve analytics copies of the same usage data.

## Provider configuration guardrails

If PostHog is chosen, use only manual `capture` calls via a narrow adapter. Disable Android lifecycle, screen and deep-link capture, autocapture, error/exception auto capture, session replay, surveys and feature flag evaluation unless a separately approved purpose requires one. Android lifecycle/screen/deep-link capture can be automatic by default; a screen title can fall back to Activity/application labels. Do not treat disabling UI tap autocapture as disabling all automatic events. `personProfiles = NEVER` or `IDENTIFIED_ONLY` concerns person-profile processing; it does not mean an event has no `distinct_id` or session ID. PostHog's Android SDK normally creates an anonymous `distinct_id`, and session IDs are also created automatically. If that is unacceptable, do not describe PostHog capture as identifier-free or use it for a strict aggregate-only variant unless a custom path is proven to remove linkage before persistence.

If Firebase is chosen, set Crashlytics collection disabled in manifest before initialization. Enable only after the distinct opt-in; keep Analytics SDK and automatic breadcrumbs absent unless separately reviewed. Crashlytics still uses installation/session identifiers and device/app metadata in reports; Firebase documents Crashlytics Installation UUID, Firebase Installation ID, session ID and event time among collected information. Firebase Sessions may also add an installation ID/session telemetry. Audit exact SDK versions and transitive dependencies against the Play Data safety disclosure. Do not add custom keys/logs/user IDs. On opt-out, disable collection and delete retained unsent reports. Opt-in is permission for the explained data flow, not an identifier-free mode. Crash reporting itself is remote data collection even if no product analytics events are sent. If a zero-install-identifier requirement applies, Firebase Crashlytics is not suitable unless a specific supported configuration is verified to meet it; otherwise keep diagnostics local or use a different implementation.

## Validation, retention and removal

Before any rollout, validate from a fresh install: network capture remains off before consent and after decline; no SDK network traffic is emitted; opt-in emits only the schema allowlist plus explicitly documented vendor metadata; no package/data content appears in payloads; airplane mode queues nothing beyond bounded local events; opt-out stops sends and deletes pending events without transmitting them; reinstall does not silently regain consent; clear-app-data resets consent. Use debug-only test tokens/endpoints and inspect raw payloads, including `distinct_id`, session/installation identifiers, timestamps, device fields and SDK-generated events. Verify release build dependency/manifest/permission diffs and reproduce Data safety answers from the exact SDK build. Do not verify by uploading real user data.

Proposed starting retention for an approved variant: 90 days for aggregate activation/reliability events, with shorter retention preferred if decision cadence permits; crash reports 30 days unless the provider's minimum/controls require a different disclosed period. Confirm provider plan controls and deletion semantics before promising these limits. Review at 30 days after release and quarterly; delete stale datasets and provider project on sunset. No release should depend on analytics availability.

## Rollout and evidence gates

1. Owner chooses the product/privacy variant and the decision this telemetry will inform.
2. Owner reviews privacy notice, consent copy, provider DPA/region/subprocessors, retention and Play disclosures. Confirm applicable EU/locale requirements with qualified counsel/privacy owner; this document is not legal advice.
3. Agent implements a small adapter, local default-off consent state, explicit manual event calls and deletion/opt-out behavior only after gate 1-2.
4. QA validates payloads, no-consent/no-network state, opt-out, storage bounds and release manifest; attach test evidence and update Data safety/privacy text.
5. Owner authorizes the specific provider project/region and staged release; monitor schema and deletion during a limited rollout.

Current state: steps 1-5 not completed. No analytics SDK, project, credentials, network permission, remote event, consent audit or retention configuration was created for this plan.

## Primary sources for identifier and cache behavior

Accessed 2026-10-16. Recheck the selected SDK versions and current docs before implementation.

- [PostHog: Identify users](https://posthog.com/docs/getting-started/identify-users) — client SDK creates an anonymous `distinct_id` automatically.
- [PostHog: Anonymous vs identified events](https://posthog.com/docs/data/anonymous-vs-identified-events) — Android SDK captures anonymous events by default; person-profile modes do not mean no event identity.
- [PostHog: Sessions](https://posthog.com/docs/data/sessions) — mobile SDKs automatically create session IDs.
- [Firebase: Privacy and security](https://firebase.google.com/support/privacy) — identifiers collected by Crashlytics.
- [Firebase: Crashlytics Cloud Logging schema](https://firebase.google.com/docs/crashlytics/cloud-logging-schema) — installation UUID/session ID fields.

Owner decision18October: RevenueCat dashboard/catalog/entitlement/offering/hosted-paywall configuration will be completed later. No further web sign-in is requested now. Local code/build verification can continue; live store configuration and end-to-end purchases are not claimed verified. See [[REVENUECAT-INTEGRATION]] for the exact later checklist.
