# Stage 6 — Give each candidate a center

## Goal

For every accepted vehicle candidate, calculate one representative point.

A simple choice is the center of its bounding rectangle.

For a rectangle:

```text
x, y, width, height
```

reason about how to calculate:

```text
center_x
center_y
```

yourself.

Do not search for a special OpenCV function unless you need one.

## Draw

Draw a small circle at each candidate center.

## Why center points?

Comparing entire contour shapes across frames is complicated.

For this learning project, a center point gives you a simple thing to compare:

```text
previous center
vs
new center
```

## Alternative

OpenCV contour moments can also calculate a centroid. Read about that only after your rectangle-center version works.

## Pass condition

Each useful candidate box has a sensible center point.
