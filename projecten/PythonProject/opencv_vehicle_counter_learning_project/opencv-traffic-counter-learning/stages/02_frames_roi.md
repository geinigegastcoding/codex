# Stage 2 — Understand frames and choose an ROI

## Part A — inspect the video

Temporarily print:

- frame shape;
- width;
- height;
- FPS;
- current frame number.

Do not print all of them every frame forever.

## Part B — draw a count line

On a copy/display frame, draw a horizontal line roughly around:

```text
y = 320
```

for the synthetic clip.

Do **not** count anything yet.

## Part C — region of interest

Learn how NumPy slicing can isolate only part of the road.

Conceptually:

```text
full frame
┌──────────────────────────┐
│ irrelevant               │
│    ┌───────────────┐     │
│    │ useful road   │     │
│    └───────────────┘     │
│ irrelevant               │
└──────────────────────────┘
```

Try displaying a cropped road region in a second window.

## Why ROI matters

Anything outside the road can create motion:

- trees;
- signs;
- people;
- camera overlays.

Removing irrelevant pixels makes later stages easier.

## Question

Why is the slicing order usually:

```text
[y1:y2, x1:x2]
```

rather than x first?

## Pass condition

You can draw the line and display an ROI.
