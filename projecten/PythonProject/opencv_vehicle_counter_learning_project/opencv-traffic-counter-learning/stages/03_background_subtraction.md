# Stage 3 — Separate moving foreground from background

## Goal

Create a second window that displays a **foreground mask**.

Do not detect vehicles yet.

## The idea

The camera viewpoint is mostly fixed.

That means much of the frame is background:

- road;
- pavement;
- static objects.

Vehicles change position.

A background subtractor learns what is normally present and outputs a mask representing pixels that currently look like foreground.

## Your experiment

Run the first seconds and watch the mask.

Notice:

- the model needs time to learn;
- moving objects become bright;
- shadows/noise may also appear;
- the mask is not a vehicle detector.

## Important

Do not immediately tune ten constructor parameters.

Start with a default background subtractor and understand the output.

## Questions

- Why are the first frames often messy?
- What happens if an object stops moving for a long time?
- Why can a shadow become foreground?

## If stuck

`hints/03_background_subtraction.md`

## Pass condition

You can display the original video and a foreground mask simultaneously.
