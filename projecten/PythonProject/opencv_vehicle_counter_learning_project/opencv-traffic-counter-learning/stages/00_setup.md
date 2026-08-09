# Stage 0 — Setup

## Goal

Install the two libraries you need and verify the practice video exists.

## Do

From the project directory:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Verify OpenCV:

```powershell
python -c "import cv2 as cv; print(cv.__version__)"
```

Verify:

```text
assets/synthetic_traffic.mp4
```

exists.

## Understand

For the core project you need:

- OpenCV: video/image processing;
- NumPy: kernels/array operations.

Pytest is included only for later logic tests.

## Pass condition

You can import `cv2` without an error.
