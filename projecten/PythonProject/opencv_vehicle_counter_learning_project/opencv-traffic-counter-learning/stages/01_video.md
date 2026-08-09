# Stage 1 — Read the video

## Build

Make `main.py`:

1. open `VIDEO_PATH`;
2. check that it opened;
3. repeatedly read one frame;
4. display the frame;
5. stop when the video ends;
6. stop early when `q` is pressed;
7. release the capture and close windows.

Nothing else.

## What you are learning

A video is processed as a sequence of individual images.

Your loop is conceptually:

```text
get next frame
→ do something
→ display
→ repeat
```

Later every detection and tracking step will happen inside that loop.

## Questions

Before Stage 2, answer:

- Why does reading a frame need a success value?
- What should happen at end-of-video?
- Why should `VideoCapture` be created before the loop?
- What cleanup belongs after the loop?

## If stuck

Open:

`hints/01_video.md`

## Pass condition

The synthetic video plays and `q` exits.
