---
name: device-switch-handoff
description: Prepare current Codex work for continuation on another device by publishing intended repository changes and verifying their remote state. Use with device-switch-recieve when handing off a shared workspace.
---

# Device Switch Handoff

Use this when the user wants current work available from another device. The companion [`device-switch-recieve`](../device-switch-recieve/SKILL.md) skill covers receiving and setting up that workspace.

## Preserve the current workspace

- Read the workspace `AGENTS.md` and each target repository's local instructions before changing or publishing files. Respect project-specific boundaries, including instructions that prohibit reading external personal context.
- Inventory the root repository, nested Git repositories, submodules, linked worktrees, and detached checkouts. Check both `.git` directories and `.git` files.
- For each checkout, record its remote, current branch or detached commit, upstream, working-tree status, and local branches. Separate user-owned repositories from third-party research or vendor clones.
- Review diffs before staging. Preserve dirty and untracked work; do not reset, stash, overwrite, or stage the whole workspace indiscriminately. Exclude secrets, caches, build output, temporary sync data, and validation clones unless the user identifies them as source files.

## Publish intended work

- Commit and push only when the user asks for a handoff or otherwise authorizes those actions. Stage the files that belong to the requested change and include existing user work only when it is part of that handoff.
- Fetch before publishing when the expected transfer is within the workspace's download limit. Fast-forward clean branches with known upstreams; preserve dirty branches and detached submodules. Never force-push or rewrite published history unless the user explicitly requests it.
- Push local branches to the repository's configured remote only when the user owns it or has explicitly authorized contributing there. Do not create forks or public pull requests to third-party projects by inference.
- Open pull requests when requested or required by the repository workflow. Merge only when the user authorizes a merge and the project's checks and review requirements are satisfied.
- Update a parent repository's submodule pointer only after the child commit is available remotely and the user wants the parent checkout to pin it. Do not include unrelated pointer changes.

## Dependencies and skills

- Inspect dependency manifests, lockfiles, installed packages, and cache coverage before upgrades. Prefer compatible updates that match the user's request; preserve intentional pins and avoid broad major upgrades without a clear reason.
- Check the expected size before downloading. Follow the user's storage limit and ask first when a file or batch may exceed it.
- When the user asks to bundle global Codex skills, copy the skill folders and their supporting files into the repository's `.agents/skills/` directory. Resolve local junctions or symlinks to their contents, verify each `SKILL.md` is present, and confirm the target files are not ignored. Include the receive skill when requested; do not modify the user's global skill installations.
- If a VPS or other file-transfer workflow is active, coordinate its final incremental sync with the user and leave its scripts untouched unless asked to change them.

## Verify and hand off

- Verify each intended commit exists on the configured remote at the expected branch and SHA. Confirm each requested pull request is open or merged, and link it when the connected workflow supports PR linking.
- Report repository, branch, commit SHA, remote publication state, dependency updates, pull-request links, blockers, and any local-only work that remains. Be explicit about checks that were not run and checkouts that were intentionally left untouched.
