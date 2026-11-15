---
name: device-switch-recieve
description: Prepare this shared Codex workspace on another device by safely syncing repositories, registering priority T3 Code projects, preserving Kennis access, and setting up compatible dependencies within download limits.
---

# Device Switch Receive

Use this when receiving the shared Codex workspace on a laptop or desktop, or when preparing it for a device switch.

## Find the workspace and Kennis

- Use the currently opened Codex checkout as the workspace root. Resolve paths on this device instead of trusting paths recorded on another computer.
- On the laptop checkout at `C:\Users\Daniël\Desktop\Codex`, the shared vault is `Kennis` below that root. Use `E:\MData\Kennis` only when the active checkout is on E: and that path exists.
- Verify that each T3 Code project can read the same shared `Kennis` directory. Projects nested under this workspace can reach it through their parent directories; do not copy the vault into individual repos.
- Search relevant Kennis files before work. Before changing the MagisData website, read `Kennis/company/website.md` and that checkout's `AGENTS.md`. For Luna, Ollo, and the dad website, use their matching company context notes.

## Update repositories safely

- Include the Codex root, nested Git repositories, and submodules. Check `.git` files as well as `.git` directories, and use `git submodule status --recursive` to find nested checkouts.
- Inspect each repository's branch, upstream, and working-tree status before updating it. Fetch remotes, then fast-forward only a clean branch with a known upstream.
- If a checkout is dirty, fetch but leave its working tree and branch untouched. If it is detached, fetch but do not guess a branch or move a submodule away from its pinned commit.
- Do not reset, stash, overwrite, or initialize into an existing non-empty folder. Report any checkout that could not be advanced and why.

## Register priority T3 projects

- Check the current project registry first and avoid registering a workspace twice. Keep the Codex root project if it already exists.
- Register the important workspaces, not every repository: Luna at `projecten/calorie-tracker-android`, Ollo at `projecten/Ollo`, the main MagisData site at `Website`, N-Lang at `projecten/N-Lang`, and the dad website at `klanten/WebsitePapa2` when those paths exist.
- Verify each registered workspace resolves to the shared Kennis directory and can read `Kennis/01-navigation.md`. Leave automatic pulling disabled unless the user asks for it.

## Set up dependencies within the download limit

- Inspect manifests, lockfiles, existing dependency folders, and local caches first. Use the project's locked package manager and avoid reinstalling dependencies that are already present and usable.
- Estimate the download size of each dependency batch from lockfile tarballs or cache coverage before downloading. Ask before any file or batch expected to exceed 100 MB, and ask before installing any dependency tool or environment larger than 500 MB. If the size is unknown and could cross either limit, check it when possible or ask first.
- Use the Android Studio SDK and its existing universal emulator. Do not install another emulator. If the phone or required USB cable is unavailable, finish software setup and leave physical-device checks for later.
- Before Android Gradle setup, compare the Gradle, Android Gradle Plugin, and Kotlin versions with the installed JDK; select a supported JDK for the Gradle invocation instead of assuming Android Studio's bundled JDK is compatible.
- If Android Gradle Plugin rejects a Windows workspace path containing non-ASCII characters, follow its specific recommended override and verify dependency resolution.
- Summarize what was synced, what was installed or already available, any approvals still needed, and any skipped worktrees or hardware checks.
