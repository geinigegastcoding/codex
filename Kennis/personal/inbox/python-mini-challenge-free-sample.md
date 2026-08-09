---
title: Python mini challenge free sample
created: 2026-08-09
type: free-sample
status: guardian-review
tags: [personal, income, python, tutoring, digital-product]
---

# Python mini challenge - free sample

One short exercise for beginners. Try it before looking for help. This sample intentionally omits the answer key; the paid pack contains three challenges, full hint ladders, and answer key for self-review.

## Top words

Write `top_words(text, limit=3)`. Return `(word, count)` pairs sorted by count descending and then word alphabetically. Ignore punctuation and treat uppercase and lowercase as the same. Raise `ValueError` when `limit` is negative.

### Starter code

```python
def top_words(text, limit=3):
    pass
```

### Check your work

```python
assert top_words('Cat dog cat bird dog cat', 2) == [('cat', 3), ('dog', 2)]
assert top_words('zebra ant zebra ant', 2) == [('ant', 2), ('zebra', 2)]
try:
    top_words('hello', -1)
except ValueError:
    pass
else:
    raise AssertionError('negative limit should fail')
```

### Three hints

1. Normalize the text before counting.
2. A dictionary can store each word's count.
3. Sort with a key containing `(-count, word)`.

## Optional feedback request

After trying it, tell the guardian-approved tutor which part was most useful or confusing. Do not send passwords, private files, or school submissions.

## Guardian sharing gate

- [ ] Guardian approves the recipient and sharing method.
- [ ] The sample contains no personal contact details.
- [ ] Any paid follow-up, feedback, or tutoring is agreed by the guardian before it is offered.
