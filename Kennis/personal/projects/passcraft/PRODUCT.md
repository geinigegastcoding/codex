# Passcraft

<!-- impeccable:product-schema 1 -->

## Platform
android

## Stack
Native Kotlin with Jetpack Compose, selected by the user on 2026-10-15. Android 9+. Direct implementation; no mockups or other projects' design systems.

## Users and purpose
The user explicitly wants a local personal app for their own picture designs, without distributing passes or creating an issuer account. Import an image, customize a pass, save it on the phone, and optionally continue through Google Wallet's photo import. Provide basic NFC tools and leave unspecified future custom features for later.

## Capabilities and constraints
System image picker, private local pass library, name/subtitle/notes/color, optional QR code and website link, local PNG export. No server, login, Wallet issuer, API keys, analytics, or Internet permission. Use an image share intent addressed only to Google Wallet when that installed version accepts it. Otherwise save the image and show Google's Photo/Everything else import steps. Google Wallet requires its own Google account, confirmation, supported region/features, and controls layout and security. Passcraft cannot set Wallet sign-in/unlock behavior or verify a completed photo import.

Basic NFC scope is physical NDEF tags: read records, write URL/text, check writable capacity, ask before overwriting. The user was asked whether they instead meant phone-as-pass; no answer yet, so tag tools are a stated assumption. Smart Tap and protected-card emulation are not implemented.

## Brand commitments
Passcraft is the approved working name. The app should be simple and effective. Work directly in the real app without unsolicited design mockups.

## Product principles
- Keep the personal app offline and useful without an account.
- Preserve the user's artwork and explicitly report storage/export errors.
- Use native Android controls and content URI permissions.
- Describe Wallet handoff honestly; do not claim a successful Wallet save from a share intent.

## Evidence
The user's explicit local-only correction supersedes the earlier issuer/API approach. Google Wallet photo import: https://support.google.com/wallet/answer/14188766?hl=en and https://support.google.com/wallet/answer/12060038?hl=en, reviewed 2026-10-15.
