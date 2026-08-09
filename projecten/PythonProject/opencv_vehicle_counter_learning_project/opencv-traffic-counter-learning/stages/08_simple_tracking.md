# Stage 8 — Associate detections across frames

## Goal

Build a deliberately simple tracker.

You do **not** need Kalman filters or a tracking library.

## Core idea

At frame N you have old tracked centers.

At frame N+1 you have new detected centers.

For each new center, ask:

> Which existing center is nearby enough that this could plausibly be the same vehicle?

## You need a distance measure

For two points:

```text
(x1, y1)
(x2, y2)
```

use straight-line distance.

If you do not remember the formula, derive/research Euclidean distance.

## Matching rule

Start with something simple:

```text
nearest existing track within maximum distance
```

If no track is close enough:

```text
create a new track
```

## Do not optimize yet

This matching strategy is imperfect.

It can swap identities when vehicles are close.

That is acceptable for this project.

## Debug visualization

Draw:

- track ID;
- current center;
- maybe a short line from previous to current center.

This lets you **see** ID switches.

## If stuck

`hints/08_tracking.md`

## Pass condition

A vehicle usually keeps the same ID across nearby frames in the synthetic video.
