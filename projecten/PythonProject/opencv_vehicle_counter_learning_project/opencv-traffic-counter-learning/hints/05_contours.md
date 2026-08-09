# Stage 5 Hints

## Hint A — idea

Your clean binary mask already contains connected white shapes. You need their boundaries so each shape can become a candidate.

## Hint B — structure

For every detected contour:

```text
measure area
if too small: ignore
otherwise:
    get rectangle
    inspect/draw it
```

## Hint C — API names

Research:

- `cv.findContours`
- `cv.RETR_EXTERNAL`
- `cv.CHAIN_APPROX_SIMPLE`
- `cv.contourArea`
- `cv.boundingRect`
- `cv.rectangle`
