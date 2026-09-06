using Spreek.Core;
using Spreek.Services;

namespace Spreek.Tests;

[TestClass]
public sealed class DeepgramConfigurationTests
{
    [TestMethod]
    public void Streaming_uri_uses_nova3_multilingual_eu_and_privacy_defaults()
    {
        var dictionary = new[]
        {
            Entry("MagisData", true, 2),
            Entry("Nova three", false, 1),
        };

        var uri = DeepgramUriBuilder.BuildStreaming(
            new DeepgramOptions("api.eu.deepgram.com", LanguageMode.Multilingual, 300, true),
            dictionary,
            out var selection);
        var query = Uri.UnescapeDataString(uri.Query);

        Assert.AreEqual("wss", uri.Scheme);
        Assert.AreEqual("api.eu.deepgram.com", uri.Host);
        StringAssert.Contains(query, "model=nova-3");
        StringAssert.Contains(query, "language=multi");
        StringAssert.Contains(query, "encoding=linear16");
        StringAssert.Contains(query, "sample_rate=16000");
        StringAssert.Contains(query, "channels=1");
        StringAssert.Contains(query, "smart_format=true");
        StringAssert.Contains(query, "punctuate=true");
        StringAssert.Contains(query, "interim_results=true");
        StringAssert.Contains(query, "endpointing=300");
        StringAssert.Contains(query, "numerals=true");
        StringAssert.Contains(query, "mip_opt_out=true");
        StringAssert.Contains(query, "keyterm=MagisData");
        StringAssert.Contains(query, "keyterm=Nova three");
        CollectionAssert.AreEqual(new[] { "MagisData", "Nova three" }, selection.Terms.ToArray());
        Assert.AreEqual(0, selection.OmittedCount);
    }

    [TestMethod]
    public void Keyterm_selection_prioritizes_starred_then_recent_and_reports_omissions()
    {
        var entries = Enumerable.Range(0, 105)
            .Select(index => Entry($"term{index}", index == 104, index))
            .ToArray();

        _ = DeepgramUriBuilder.BuildStreaming(
            new DeepgramOptions("api.deepgram.com", LanguageMode.English, 450, false),
            entries,
            out var selection);

        Assert.AreEqual(100, selection.Terms.Count);
        Assert.AreEqual("term104", selection.Terms[0]);
        Assert.AreEqual(5, selection.OmittedCount);
    }

    [TestMethod]
    public void Keyterm_selection_stays_within_500_tokens()
    {
        var entries = Enumerable.Range(0, 60)
            .Select(index => Entry(string.Join(' ', Enumerable.Repeat($"word{index}", 10)), false, index))
            .ToArray();

        _ = DeepgramUriBuilder.BuildStreaming(
            new DeepgramOptions("api.deepgram.com", LanguageMode.Dutch, 300, true),
            entries,
            out var selection);

        Assert.AreEqual(50, selection.Terms.Count);
        Assert.AreEqual(10, selection.OmittedCount);
        Assert.AreEqual(500, selection.Terms.Sum(term => term.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length));
    }

    [TestMethod]
    public void Unsupported_host_is_rejected_before_network_access()
    {
        Assert.ThrowsException<ArgumentException>(() => DeepgramUriBuilder.BuildStreaming(
            new DeepgramOptions("attacker.example", LanguageMode.English, 300, true),
            [],
            out _));
    }

    [TestMethod]
    public void Response_parser_distinguishes_interim_final_and_metadata()
    {
        const string finalJson = """
            {"type":"Results","start":1.5,"duration":0.8,"is_final":true,"from_finalize":true,
             "channel":{"alternatives":[{"transcript":"Hello Daniel.","confidence":0.97,"languages":["en"]}]},
             "metadata":{"request_id":"req-1"}}
            """;
        const string metadataJson = "{" + "\"type\":\"Metadata\",\"request_id\":\"req-1\"}";

        var final = DeepgramResponseParser.Parse(finalJson);
        var metadata = DeepgramResponseParser.Parse(metadataJson);

        Assert.AreEqual(DeepgramMessageKind.Result, final.Kind);
        Assert.IsNotNull(final.Segment);
        Assert.IsTrue(final.Segment.IsFinal);
        Assert.IsTrue(final.Segment.FromFinalize);
        Assert.AreEqual("Hello Daniel.", final.Segment.Text);
        Assert.AreEqual("en", final.Language);
        Assert.AreEqual("req-1", final.RequestId);
        Assert.AreEqual(DeepgramMessageKind.Metadata, metadata.Kind);
        Assert.AreEqual("req-1", metadata.RequestId);
    }

    private static DictionaryEntry Entry(string term, bool starred, int minutes) => new(
        Guid.NewGuid(), term, null, starred, DateTimeOffset.UtcNow.AddMinutes(-minutes), DateTimeOffset.UtcNow.AddMinutes(minutes));
}
