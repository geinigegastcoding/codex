# Stage 10 — Count a crossing exactly once

## This is the actual finish line

You now have:

- a line position;
- a track;
- the track's previous center;
- its current center.

Define **crossing** precisely.

For one-direction downward traffic, a useful conceptual condition is:

```text
previous point was on the upper side
AND
current point is now on the lower side
```

Do not copy that blindly. Decide exactly how equality with the line behaves.

## Prevent repeat counting

After a track has contributed to the counter, it must remember that fact.

Otherwise:

```text
frame A -> crossing -> +1
frame B -> still below line -> +1?
frame C -> still below line -> +1?
```

Your state should make that impossible.

## Test on synthetic clip

Expected final count:

**6**

If you get:

### Much too high

Likely tracking or repeat-counting problem.

### Slightly too high

Likely duplicate tracks or distractors.

### Too low

Likely missed detections, track expiry or line-crossing logic.

## If stuck

`hints/10_line_crossing.md`

## Pass condition

Synthetic video reliably finishes at **6**.
