# Stage 3 Hints

## Hint A — idea

You need a model that learns which pixels normally belong to the stationary scene and marks unusual/moving pixels as foreground.

## Hint B — structure

Create the background subtractor **before** the frame loop.

Inside the loop:

```text
frame -> subtractor -> foreground mask
```

Display the mask.

## Hint C — API names

Start by researching one of:

- `cv.createBackgroundSubtractorMOG2()`
- `cv.createBackgroundSubtractorKNN()`

Then look at the object's `.apply(frame)` method.

Use one algorithm first. Comparing both can be an optional experiment.
