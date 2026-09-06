import unittest

from galgje_tree import (
    DEFAULT_MAX_MISSES,
    DEFAULT_MODEL,
    letter_metrics,
    load_bundle,
    solve_secret,
    teacher_guess,
)


class CommonWordRegressionTest(unittest.TestCase):
    def test_solver_wins_on_common_five_letter_word(self) -> None:
        result = solve_secret(load_bundle(DEFAULT_MODEL), "water")

        self.assertTrue(result.won, result)
        self.assertLessEqual(result.misses, DEFAULT_MAX_MISSES)

    def test_frequency_prior_breaks_ties_towards_likely_word(self) -> None:
        alphabet = list("abcdefghijklmnopqrstuvwxyz")
        metrics = letter_metrics(
            ["water", "later"],
            "_ater",
            alphabet,
            weights={"water": 100.0, "later": 1.0},
            default_weight=0.01,
        )

        self.assertEqual(teacher_guess(metrics, set("ater"), alphabet), "w")


if __name__ == "__main__":
    unittest.main()
