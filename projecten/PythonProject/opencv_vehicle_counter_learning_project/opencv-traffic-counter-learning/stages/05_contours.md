# Stage 5 — Turn white blobs into candidates

## Goal

Find connected boundaries in the cleaned mask.

For each contour, inspect useful properties such as:

- area;
- bounding rectangle.

At first, print/draw **all** contour rectangles.

It will probably look terrible.

Good.

Now create filtering rules.

## Start with the simplest filter

Reject contours whose area is obviously tiny.

Then experiment with:

- minimum width;
- minimum height;
- maximum/implausible sizes.

## Important distinction

You are not proving:

```text
this is a car
```

You are saying:

```text
this moving blob is plausible enough to treat as a vehicle candidate
```

That difference matters.

## Failure cases to look for

- one car split into multiple contours;
- two nearby cars merged into one;
- shadows creating a contour;
- lane markings/noise surviving cleanup.

## If stuck

`hints/05_contours.md`

## Pass condition

Most visible moving vehicles receive plausible candidate boxes without hundreds of noise boxes.
