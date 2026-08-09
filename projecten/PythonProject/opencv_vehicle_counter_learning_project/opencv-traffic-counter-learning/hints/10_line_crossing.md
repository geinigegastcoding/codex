# Stage 10 Hints

## Hint A — idea

A point being near the line is not enough.

A crossing is a **transition between sides** across time.

## Hint B — structure

For downward motion, compare:

```text
previous_y
current_y
line_y
```

Then combine this with whether the track was already counted.

## Hint C — logic skeleton

Think in boolean conditions:

```text
was_above = ...
is_below = ...
should_count = was_above and is_below and not already_counted
```

You still need to decide `<` versus `<=` and exactly when track state updates.
