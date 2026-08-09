# Stage 1 Hints

## Hint A — idea

Create the video reader once, then repeatedly ask it for the next frame.

## Hint B — structure

Your program needs:

```text
create capture
check capture
while:
    read
    if no frame: stop
    display
    check key
cleanup
```

## Hint C — API names

Look up:

- `cv.VideoCapture(...)`
- `.isOpened()`
- `.read()`
- `cv.imshow(...)`
- `cv.waitKey(...)`
- `.release()`
- `cv.destroyAllWindows()`

Do not copy a full tutorial loop. Assemble it from the structure above.
