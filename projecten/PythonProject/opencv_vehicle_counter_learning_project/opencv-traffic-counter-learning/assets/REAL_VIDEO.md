# Real Traffic Video

Target video:

`https://youtube.com/watch?v=wqctLW0Hb_0`

The course is designed around a fixed traffic-camera-style video.

## Important

The actual YouTube video is **not redistributed inside this ZIP**.

Use a local copy that you are allowed to use and save it as:

```text
assets/traffic.mp4
```

Do not switch to the real clip until your core pipeline works on:

```text
assets/synthetic_traffic.mp4
```

## Why local video?

For learning, a local file keeps the first OpenCV problem simple:

```text
VideoCapture -> frames
```

Direct YouTube streaming adds unrelated issues such as stream URLs, dependencies, network failures and expiring links.

## When you move to the real clip

Expect to recalibrate:

- region of interest;
- count-line position;
- contour area;
- bounding-box size filters;
- morphology;
- tracker matching distance.

That is calibration, not failure.
