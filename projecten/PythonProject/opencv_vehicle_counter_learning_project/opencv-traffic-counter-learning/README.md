# OpenCV Learning Project — Vehicle Counter

## The project

Build a **vehicle counter from a fixed traffic video** using Python and classical OpenCV.

Your final program should watch a traffic video, locate moving vehicle-sized objects, keep enough state to follow them for a short time, and increase a counter when a vehicle crosses a chosen counting line.

The intended real video is:

`https://youtube.com/watch?v=wqctLW0Hb_0`

The ZIP also contains `assets/synthetic_traffic.mp4`, a small practice video generated specifically for this course. It contains **6 vehicles that cross the intended horizontal count line** plus distractors. Use it to debug your logic before moving to the real traffic clip.

---

# What you are NOT building

Keep the scope strict.

Do **not** add:

- YOLO or another neural object detector;
- license-plate recognition;
- vehicle make/model recognition;
- a web dashboard;
- a database;
- a GUI;
- cloud APIs;
- multi-camera support;
- perfect industrial tracking.

Those would turn a focused OpenCV project into five different projects.

Your target is:

```text
video
→ moving foreground
→ clean mask
→ vehicle candidates
→ center points
→ short-term tracking
→ line crossing
→ count
```

---

# Why this is a good learning project

This project forces normal Python and computer vision to work together.

You will practice Python concepts you already know:

- loops;
- `if` statements;
- lists and dictionaries;
- functions;
- tuples;
- state;
- filtering;
- error handling;
- simple algorithms.

You will learn OpenCV concepts in context:

- `VideoCapture`;
- frames;
- foreground masks;
- background subtraction;
- morphology;
- contours;
- bounding rectangles;
- centroids;
- drawing;
- frame-to-frame state.

The important part is that OpenCV does **not** give you a complete `count_cars()` function. You have to combine smaller pieces into the behavior you want.

---

# Learning rules

## 1. There is intentionally no final solution

This project pack contains **no completed vehicle-counter implementation**.

You cannot accidentally open a solution and ruin the exercise.

## 2. Use the three-level hint ladder

Every important stage has a matching file in `hints/`.

Use:

1. **Hint A** only when you do not know what idea to try.
2. **Hint B** when you understand the idea but cannot structure it.
3. **Hint C** when you mainly need the OpenCV/Python API name.

Try your own implementation before reading the next level.

## 3. Ask AI for diagnosis, not replacement code

Good:

> My foreground mask contains a lot of shadows. Explain why and give me two experiments to try. Do not write my stage for me.

Good:

> Here is my tracking code. Tell me where my reasoning breaks and give me one hint.

Bad:

> Implement the vehicle tracker.

## 4. Make one change at a time

Computer-vision debugging becomes useless when you simultaneously change:

- threshold;
- kernel;
- minimum area;
- count line;
- tracker distance.

Change one variable, rerun the same part of the video, observe.

---

# Folder structure

```text
opencv-traffic-counter-learning/
├─ README.md
├─ main.py
├─ requirements.txt
├─ QUICKSTART.md
├─ CHECKPOINTS.md
├─ EXPERIMENT_LOG.md
├─ MENTOR_PROMPT.md
├─ slideshow.html
│
├─ assets/
│  ├─ synthetic_traffic.mp4
│  ├─ synthetic_preview.png
│  ├─ SYNTHETIC_VIDEO.md
│  └─ REAL_VIDEO.md
│
├─ stages/
│  ├─ 00_setup.md
│  ├─ 01_video.md
│  ├─ ...
│  └─ 12_finish.md
│
├─ hints/
│  ├─ 03_background_subtraction.md
│  ├─ ...
│  └─ 10_line_crossing.md
│
├─ tests/
│  └─ README.md
│
└─ output/
```

---

# Recommended workflow

Do not read all twelve stages and then start programming.

Use this loop:

```text
read one stage
↓
close the guide
↓
implement it
↓
run the video
↓
write what went wrong
↓
debug
↓
check checkpoint
↓
next stage
```

---

# Course map

## Phase 1 — Video fundamentals

### Stage 0
Environment and project setup.

### Stage 1
Open a video file, read frames, display them and exit cleanly.

### Stage 2
Understand frame dimensions, frame rate, frame numbers and regions of interest.

## Phase 2 — Turn motion into objects

### Stage 3
Create a foreground mask with background subtraction.

### Stage 4
Clean that mask with thresholding and morphology.

### Stage 5
Find contours and filter out obviously bad candidates.

### Stage 6
Draw vehicle candidate boxes and calculate their center points.

## Phase 3 — Turn detections into a count

### Stage 7
Understand why frame-by-frame detections are not yet tracking.

### Stage 8
Build a deliberately simple nearest-center tracker.

### Stage 9
Manage track state and remove stale tracks.

### Stage 10
Detect a line crossing exactly once.

## Phase 4 — Make it a usable program

### Stage 11
Draw the count, line, IDs and debug information.

### Stage 12
Calibrate on the real traffic video and evaluate where your approach fails.

---

# Definition of done

The core project is complete when:

- [ ] a local video opens;
- [ ] frames play in sequence;
- [ ] you can isolate the useful road region;
- [ ] a background subtractor creates a usable foreground mask;
- [ ] morphology removes enough noise for contours to be useful;
- [ ] obvious tiny contours are rejected;
- [ ] likely vehicles have bounding boxes;
- [ ] each candidate has a center point;
- [ ] centers are associated across nearby frames;
- [ ] a track remembers its previous position;
- [ ] a vehicle crossing the line increments the count once;
- [ ] the synthetic practice clip ends at **6**;
- [ ] you can explain at least three cases where the method fails;
- [ ] you can run the same code on the real traffic clip after adjusting only configuration/calibration values.

---

# The most important mental distinction

There are three separate problems:

## Detection

> Where are the moving blobs in **this frame**?

Output might be:

```text
vehicle candidate at (x, y, w, h)
vehicle candidate at (x, y, w, h)
```

## Tracking

> Which candidate now belongs to the same object I saw in the previous frame?

Output might become:

```text
track 4 -> center (315, 220)
track 7 -> center (510, 280)
```

## Counting

> Did a tracked object transition from one side of my count line to the other?

Do not mix these into one giant block of code.

If counting is wrong, first determine whether:

1. detection was wrong;
2. tracking was wrong;
3. crossing logic was wrong.

That debugging habit matters more than any specific OpenCV function.

---

# After this project

The natural next project is **not** immediately a giant AI detector.

A useful progression would be:

1. this classical vehicle counter;
2. improve tracking;
3. compare your detector with a pretrained vehicle detector;
4. understand which weaknesses the trained detector actually solves.

That lets you understand the abstraction instead of only calling it.
