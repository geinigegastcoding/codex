# Stage 12 — Move to the real traffic video

## Setup

Place a local copy you are allowed to use at:

```text
assets/traffic.mp4
```

Switch your configured video path.

Do not rewrite your algorithm immediately.

## Calibrate in this order

### 1. ROI

Remove irrelevant scene regions.

### 2. Count line

Put it somewhere vehicles are visible and reasonably separated.

### 3. Foreground mask

Make sure vehicles become useful blobs.

### 4. Candidate filters

Tune area/width/height.

### 5. Tracker distance/lifetime

Only after detection is reasonably stable.

## Evaluate manually

Pick a short segment.

Count vehicles yourself.

Compare:

```text
manual count
program count
```

Then categorize mistakes:

```text
false positive
missed vehicle
double count
ID switch
merged vehicles
split vehicle
```

## Final reflection

Write down:

1. Why did background subtraction work for this camera?
2. What scene changes would break it?
3. What caused your biggest counting error?
4. Which part was hardest: detection, tracking or counting?
5. What would a pretrained object detector improve?
6. What problems would still remain even with a better detector?

You are finished when you understand those trade-offs, not when the counter is magically perfect.
