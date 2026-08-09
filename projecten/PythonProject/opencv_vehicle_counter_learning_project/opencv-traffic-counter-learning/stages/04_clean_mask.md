# Stage 4 — Clean the foreground mask

## Problem

Your foreground mask is probably ugly.

You may see:

- isolated white dots;
- holes inside vehicles;
- broken vehicle blobs;
- shadows.

That is normal.

## Goal

Turn the raw foreground mask into a cleaner binary mask that is easier to process.

## Explore these ideas

### Thresholding

Force uncertain gray values into a clearer binary decision.

### Opening

Useful for removing small isolated foreground noise.

### Closing

Useful for filling small gaps/holes.

### Dilation

Can make fragmented foreground regions connect.

Do not use all operations just because they exist.

## Your workflow

Save or display:

```text
RAW MASK
CLEAN MASK
```

side by side.

Change one operation or kernel at a time.

## Key question

Are you improving the actual vehicle shapes, or only making the mask visually prettier?

The first matters.

## If stuck

`hints/04_clean_mask.md`

## Pass condition

Most obvious moving vehicles form reasonably coherent white regions and tiny noise is reduced.
