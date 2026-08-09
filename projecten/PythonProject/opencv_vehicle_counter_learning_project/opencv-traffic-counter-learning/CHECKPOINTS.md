# Checkpoints

Tick these only when you can both **make it work** and **explain why it works**.

## Stage 1 — Video
- [ ] I can open the video.
- [ ] I know what the two outputs of `read()` represent.
- [ ] The loop stops at end-of-video.
- [ ] `q` exits early.
- [ ] Resources are released.

## Stage 2 — Frames / ROI
- [ ] I know the frame's width and height.
- [ ] I can explain `frame[y1:y2, x1:x2]`.
- [ ] I understand why an ROI can improve detection.
- [ ] I can draw my intended counting line.

## Stage 3 — Foreground
- [ ] I can display a foreground mask beside the original.
- [ ] I understand why the first frames may look bad.
- [ ] I can explain the basic idea of a learned background.
- [ ] I have observed shadows/noise rather than pretending the mask is perfect.

## Stage 4 — Cleanup
- [ ] I inspected the mask before cleaning.
- [ ] I inspected it after cleaning.
- [ ] I understand the role of thresholding.
- [ ] I understand the rough purpose of opening/closing/dilation.
- [ ] I tuned one variable at a time.

## Stage 5 — Contours
- [ ] I can find contours from my binary mask.
- [ ] I can measure contour area.
- [ ] I reject obviously tiny regions.
- [ ] I know that "moving blob" is not necessarily "vehicle".

## Stage 6 — Candidates
- [ ] I can draw candidate boxes.
- [ ] I calculate a center point for each candidate.
- [ ] I can explain why width/height filters may help.
- [ ] I can name at least one case where two cars become one blob.

## Stage 7 — Tracking concept
- [ ] I understand why the same car gets newly detected every frame.
- [ ] I can explain why counting detections would massively overcount.
- [ ] I can describe the track state I need before coding it.

## Stage 8 — Association
- [ ] I associate a new center with a nearby old track.
- [ ] I have a maximum matching distance.
- [ ] Unmatched detections can become new tracks.
- [ ] I can explain one failure of nearest-center matching.

## Stage 9 — Track lifecycle
- [ ] Tracks store current/previous positions.
- [ ] Missing tracks are not deleted instantly.
- [ ] Old tracks eventually expire.
- [ ] My track dictionary/list does not grow forever.

## Stage 10 — Counting
- [ ] I define precisely what "crossed the line" means.
- [ ] A vehicle must move from one side to the other.
- [ ] A track has a `counted`-style state or equivalent.
- [ ] One vehicle cannot increment the count every frame.
- [ ] Synthetic video finishes at **6**.

## Stage 11 — Overlay
- [ ] Count is visible.
- [ ] Count line is visible.
- [ ] Candidate/track centers can be shown in debug mode.
- [ ] I can turn noisy debugging visuals off.

## Stage 12 — Real video
- [ ] I tried the real traffic clip locally.
- [ ] I calibrated ROI/line/size thresholds rather than rewriting everything.
- [ ] I manually checked a short segment.
- [ ] I wrote down false positives.
- [ ] I wrote down missed vehicles.
- [ ] I can explain the major limitations of classical motion-based counting.
