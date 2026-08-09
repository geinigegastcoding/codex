# Stage 4 Hints

## Hint A — idea

Treat the mask as shapes, not as a normal photograph.

You want to remove tiny foreground islands and/or connect small gaps in useful foreground blobs.

## Hint B — structure

Try a sequence such as:

```text
raw mask
→ threshold
→ one morphology operation
→ inspect
```

Only add another operation if you can explain what defect it targets.

## Hint C — API names

Research:

- `cv.threshold`
- `cv.getStructuringElement`
- `cv.morphologyEx`
- `cv.MORPH_OPEN`
- `cv.MORPH_CLOSE`
- `cv.dilate`

Do not use all of them automatically.
