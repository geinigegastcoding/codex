using Spreek.Core;

namespace Spreek.Tests;

[TestClass]
public sealed class TransformerAndImporterTests
{
    private static readonly DateTimeOffset Now = new(2026, 9, 2, 18, 5, 0, TimeSpan.FromHours(2));

    [TestMethod]
    public void Transform_applies_corrections_then_snippets_and_trailing_enter()
    {
        var dictionary = new[] { Entry("MagisData", "magic data") };
        var snippets = new[] { Snippet("my sign off", "Groet,\nDaniel — {date}") };

        var result = TranscriptTransformer.Transform(
            "Email magic data. My sign off. Press enter.", dictionary, snippets, Now, true);

        Assert.AreEqual("Email MagisData. Groet,\nDaniel — 2026-09-02", result.Text);
        Assert.IsTrue(result.PressEnter);
        Assert.AreEqual(0, result.Warnings.Count);
    }

    [TestMethod]
    public void Transform_matches_whole_phrases_longest_first()
    {
        var dictionary = new[]
        {
            Entry("API", "a p i"),
            Entry("API key", "a p i key"),
        };

        var result = TranscriptTransformer.Transform(
            "The a p i key is not a p iary.", dictionary, [], Now, true);

        Assert.AreEqual("The API key is not a p iary.", result.Text);
    }

    [TestMethod]
    public void Transform_keeps_unknown_variables_and_reports_them()
    {
        var result = TranscriptTransformer.Transform(
            "my status", [], [Snippet("my status", "At {time} for {client}")], Now, true);

        Assert.AreEqual("At 18:05 for {client}", result.Text);
        CollectionAssert.Contains(result.Warnings.ToArray(), "Unknown snippet variable: {client}");
    }

    [TestMethod]
    public void Press_enter_only_triggers_at_the_end_when_enabled()
    {
        var middle = TranscriptTransformer.Transform("Press enter before continuing.", [], [], Now, true);
        var disabled = TranscriptTransformer.Transform("Done press enter", [], [], Now, false);

        Assert.IsFalse(middle.PressEnter);
        Assert.AreEqual("Press enter before continuing.", middle.Text);
        Assert.IsFalse(disabled.PressEnter);
        Assert.AreEqual("Done press enter", disabled.Text);
    }

    [TestMethod]
    public void Dictionary_csv_import_keeps_valid_rows_and_reports_bad_ones()
    {
        const string csv = "term\r\nMagisData\r\n\"Open, AI\"\r\nheard,Correct\r\ntoo,many,columns\r\nMagisData\r\n";

        var result = LibraryImporter.ImportDictionary(csv, [], [], Now);

        CollectionAssert.AreEquivalent(
            new[] { "MagisData", "Open, AI", "Correct" },
            result.Items.Select(item => item.Term).ToArray());
        Assert.AreEqual("heard", result.Items.Single(item => item.Term == "Correct").HeardAs);
        Assert.IsTrue(result.Issues.Any(issue => issue.Row == 5 && issue.Message.Contains("columns", StringComparison.OrdinalIgnoreCase)));
        Assert.IsTrue(result.Issues.Any(issue => issue.Row == 6 && issue.Message.Contains("duplicate", StringComparison.OrdinalIgnoreCase)));
    }

    [TestMethod]
    public void Snippet_json_import_validates_conflicts_without_losing_valid_items()
    {
        const string json = """
            [
              { "name": "my link", "text": "https://example.test" },
              { "name": "MagisData", "text": "conflict" },
              { "name": "", "text": "bad" }
            ]
            """;

        var result = LibraryImporter.ImportSnippets(json, [], [Entry("MagisData")], Now);

        Assert.AreEqual(1, result.Items.Count);
        Assert.AreEqual("my link", result.Items[0].Name);
        Assert.AreEqual(2, result.Issues.Count);
        Assert.IsTrue(result.Issues.Any(issue => issue.Row == 2));
        Assert.IsTrue(result.Issues.Any(issue => issue.Row == 3));
    }

    private static DictionaryEntry Entry(string term, string? heardAs = null) =>
        new(Guid.NewGuid(), term, heardAs, false, Now, Now);

    private static SnippetEntry Snippet(string name, string text) =>
        new(Guid.NewGuid(), name, text, Now, Now);
}
