# Stage 7 — Understand the tracking problem before coding it

## Do not write tracking code immediately

First watch one car for several frames.

Your detector sees something like:

```text
frame 101 -> center (310, 170)
frame 102 -> center (311, 175)
frame 103 -> center (312, 180)
frame 104 -> center (313, 186)
```

Those are four detections.

But conceptually they are **one vehicle**.

If you increment your counter whenever a box appears, one car might be counted dozens of times.

## Your design task

On paper or in `EXPERIMENT_LOG.md`, define what one track should remember.

Think about:

- unique track ID;
- current center;
- previous center;
- how many frames since it was last matched;
- whether it has already been counted.

Do not implement until you can explain why each field exists.

## Pass condition

You can describe the difference between detection, tracking and counting without looking at `README.md`.
