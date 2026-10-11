# VibeKeep design

## Goal

VibeKeep is a Windows tray app for developers running local coding agents. It watches mainstream agent processes such as Codex, Claude Code, and T3 Code, keeps the machine awake while work is active, and performs a user-configured power action after all tracked work has stopped.

## Product shape

- Tray-first WPF app with a dark, compact dashboard.
- Overview: current work state, active agents, grace period, and scheduled action.
- Agents: built-in mainstream profiles plus custom process profiles.
- Settings: completion grace period, shutdown countdown, power action, lid behavior, battery guard, and Windows startup.
- Activity: a plain-language explanation of why the app is holding the machine awake or scheduling an action.

## Behavior

The first release treats “done” as all tracked agent processes disappearing from the process list. It uses a grace period to absorb short process restarts and exposes cancel/pause controls before any power action. A new agent process cancels an in-progress countdown and re-enables the keep-awake request.

While work is active, the app requests system execution time and temporarily changes the active power plan’s lid-close action to Do nothing for the selected power sources. The original lid settings are restored when work ends, monitoring is paused, or the app exits.

Default action is Shut down, with Sleep, Hibernate, Lock, and Do nothing available in Settings. The default countdown is 60 seconds. A battery guard prevents lid override below 20% charge unless the user changes the setting.

## Implementation

- .NET 8 WPF, no UI framework dependency.
- System.Management for process command-line matching when agents run through `node`, `bun`, or similar hosts.
- Native `PowrProf.dll` APIs for lid settings and execution-state requests.
- JSON settings in `%LOCALAPPDATA%\\VibeKeepAlive`.
- `shutdown.exe` for the Windows shutdown countdown; cancellation uses `shutdown.exe /a`.
- `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run` for optional startup.

## Safety and verification

- Never schedule a power action until an active work session has been observed and then ends.
- Cancel scheduling when any tracked agent reappears.
- Restore power-plan values on every normal stop path.
- Keep a visible countdown and a tray cancel action.
- Build, unit-test the state machine, launch the WPF app, and manually verify the dashboard and tray menu.
