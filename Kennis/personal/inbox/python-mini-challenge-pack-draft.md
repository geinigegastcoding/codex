---
title: Python mini challenge pack draft
type: digital-product
status: draft
tags: [personal, income, python, tutoring, digital-product, guardian-review]
---

# Python mini challenge pack

Three short Python challenges for beginners. Each challenge has a clear contract, examples, and a hint ladder. Use it as a free sample for tutoring or as a small guardian-managed digital download after checking the wording and price.

## Guardian and buyer gate

This pack is not published. A parent or guardian must approve any storefront, account, price, payment method, customer contact, and final file before it is offered for sale. Do not promise grades or complete school assignments for a buyer.

## Challenge 1: Top words

Write `top_words(text, limit=3)`. Return `(word, count)` pairs sorted by count descending and then word alphabetically. Ignore punctuation and treat uppercase and lowercase as the same. Raise `ValueError` when `limit` is negative.

Starter code:

```python
def top_words(text, limit=3):
    pass
```

Check your work:

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

Hints:

1. Normalize the text before counting.
2. A dictionary can store each word's count.
3. Sort with a key containing `(-count, word)`.

## Challenge 2: Average positive numbers

Write `average_positive(numbers)`. Return the average of values strictly greater than zero. Ignore zero and negative values. Raise `ValueError` when there are no positive values.

Starter code:

```python
def average_positive(numbers):
    pass
```

Check your work:

```python
assert average_positive([2, 4, 6]) == 4
assert average_positive([-4, 0, 2, 4]) == 3
try:
    average_positive([-1, 0])
except ValueError:
    pass
else:
    raise AssertionError('no positive values should fail')
```

Hints:

1. The word strictly means `value > 0`.
2. Collect the accepted values before dividing.
3. Validate that the collection is not empty before calling `sum` and `len`.

## Challenge 3: Binary search

Write `binary_search(values, target)`. The input list is sorted. Return the index of `target`, or `-1` when it is absent. Do not use `list.index`.

Starter code:

```python
def binary_search(values, target):
    pass
```

Check your work:

```python
assert binary_search([1, 3, 5, 7, 9], 5) == 2
assert binary_search([1, 3, 5, 7, 9], 9) == 4
assert binary_search([1, 3, 5, 7, 9], 4) == -1
```

Hints:

1. Track the inclusive `low` and `high` boundaries.
2. Compare the middle value and discard the half that cannot contain the target.
3. Continue while `low <= high`; move a boundary past the middle after each comparison.

## Answer key

Keep this section for tutoring or the paid version. A free sample can omit it.

```python
def top_words(text, limit=3):
    if limit < 0:
        raise ValueError('limit cannot be negative')
    cleaned = ''.join(char for char in text.lower() if char.isalnum() or char.isspace())
    counts = {}
    for word in cleaned.split():
        counts[word] = counts.get(word, 0) + 1
    return sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:limit]

def average_positive(numbers):
    positives = [number for number in numbers if number > 0]
    if not positives:
        raise ValueError('no positive numbers')
    return sum(positives) / len(positives)

def binary_search(values, target):
    low, high = 0, len(values) - 1
    while low <= high:
        middle = (low + high) // 2
        if values[middle] == target:
            return middle
        if values[middle] < target:
            low = middle + 1
        else:
            high = middle - 1
    return -1
```

## Small demand test

Offer the free version to three guardian-approved contacts and ask one question: which challenge was most useful? Only create a paid listing if someone asks for the answer key, feedback, or another pack. Suggested test price: EUR 5-9, subject to guardian approval and platform rules.
