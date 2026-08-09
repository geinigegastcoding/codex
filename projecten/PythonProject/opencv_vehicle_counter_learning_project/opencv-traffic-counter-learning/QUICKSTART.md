# Quick Start

## 1. Create the environment

Windows PowerShell:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

## 2. Start with the synthetic clip

The starter expects:

```text
assets/synthetic_traffic.mp4
```

Do **not** start with the YouTube traffic video.

The synthetic clip gives you a known result: **6 vehicles should eventually be counted**.

## 3. Open only these files first

1. `stages/00_setup.md`
2. `stages/01_video.md`
3. `main.py`

Ignore the later hints until you need them.

## 4. Run

```powershell
python main.py
```

At the beginning it will not do anything useful because **you have to implement Stage 1**.

That is intentional.
