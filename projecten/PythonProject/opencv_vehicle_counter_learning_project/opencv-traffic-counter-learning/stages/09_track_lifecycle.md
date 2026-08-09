# Stage 9 — Make tracks survive imperfect detection

## Problem 1

A vehicle may disappear from detection for one or two frames.

If you delete its track instantly:

```text
track 4 disappears
next frame -> "new" track 9
```

That can cause double counting.

## Problem 2

If you never delete tracks, your stored state grows forever.

## Goal

Give tracks a small missing-frame lifetime.

Conceptually:

```text
matched this frame -> reset missed counter
not matched -> missed += 1
missed too long -> delete track
```

## Think first

Decide a reasonable initial expiration value in frames.

Then test.

## Pass condition

Short detection gaps do not instantly create a new identity, while old departed tracks eventually disappear.
