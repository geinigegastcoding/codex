# Stage 11 — Make the debug output useful

## Goal

Draw only information that helps you understand the system.

Useful overlays:

- counting line;
- total count;
- candidate boxes;
- track IDs;
- center points.

## Add a debug mode

A clean final view might show only:

```text
line + count
```

A debug view can show everything.

That teaches an important engineering habit:

> Observability belongs in the tool, but it does not have to clutter normal output.

## Optional

Display:

- frame number;
- foreground mask in a second window;
- number of active tracks.

## Pass condition

You can diagnose detection/tracking problems visually without adding print statements everywhere.
