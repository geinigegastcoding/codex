# Stage 8 Hints

## Hint A — idea

Represent a track with a point. Compare each new detection point with existing track points.

## Hint B — structure

You need something conceptually like:

```text
for each new detection:
    calculate distance to candidate old tracks
    choose closest valid one
    if close enough:
        update that track
    else:
        create a new ID
```

Also think about preventing two detections in the same frame from both claiming the same old track.

## Hint C — Python tools

Useful building blocks:

- dictionary keyed by track ID;
- `math.hypot(dx, dy)` or equivalent distance math;
- `min(...)` with a key function;
- a set of already-matched track IDs for the current frame.

Do not jump to a tracking package.
