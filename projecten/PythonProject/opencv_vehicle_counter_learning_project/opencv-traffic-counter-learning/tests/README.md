# Tests

Do not start here.

Most early stages are visual and are better debugged by displaying:

- original frame;
- raw foreground mask;
- cleaned mask;
- boxes / center points.

Once you reach tracking and counting, extract small pure helper functions and test those.

Good later test targets:

```text
distance(point_a, point_b)
crossed_line(previous_y, current_y, line_y)
choose_nearest_track(...)
remove_stale_tracks(...)
```

## Test cases you should eventually write yourself

### Crossing

```text
previous above, current below -> crossing
previous below, current above -> depends on your chosen direction rule
both above -> no crossing
both below -> no crossing
touches line only -> you must decide the exact rule
```

### Distance

```text
same point -> 0
(0,0) to (3,4) -> 5
```

### Track expiration

Create fake tracks with different missed-frame counts and verify only stale tracks are removed.

There are intentionally no finished tests here because designing the function contracts is part of the exercise.
