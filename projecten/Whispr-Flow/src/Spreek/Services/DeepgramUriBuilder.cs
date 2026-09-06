using System.Text.RegularExpressions;
using Spreek.Core;

namespace Spreek.Services;

public static partial class DeepgramUriBuilder
{
    private const int MaximumTerms = 100;
    private const int MaximumTokens = 500;

    public static Uri BuildStreaming(
        DeepgramOptions options,
        IEnumerable<DictionaryEntry> entries,
        out KeytermSelection selection)
    {
        Validate(options);
        selection = SelectKeyterms(entries);
        var parameters = CommonParameters(options, selection.Terms);
        parameters.AddRange(
        [
            ("encoding", "linear16"),
            ("sample_rate", "16000"),
            ("channels", "1"),
            ("interim_results", "true"),
            ("endpointing", options.EndpointingMs.ToString(System.Globalization.CultureInfo.InvariantCulture)),
        ]);
        return Build("wss", options.RegionHost, parameters);
    }

    public static Uri BuildPrerecorded(
        DeepgramOptions options,
        IEnumerable<DictionaryEntry> entries,
        out KeytermSelection selection)
    {
        Validate(options);
        selection = SelectKeyterms(entries);
        return Build("https", options.RegionHost, CommonParameters(options, selection.Terms));
    }

    public static KeytermSelection SelectKeyterms(IEnumerable<DictionaryEntry> entries)
    {
        ArgumentNullException.ThrowIfNull(entries);
        var selected = new List<string>();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var tokens = 0;
        var total = 0;

        foreach (var entry in entries
                     .OrderByDescending(entry => entry.Starred)
                     .ThenByDescending(entry => entry.UpdatedAt))
        {
            total++;
            var term = entry.Term.Trim();
            if (term.Length == 0 || !seen.Add(term))
            {
                continue;
            }

            var termTokens = TokenRegex().Matches(term).Count;
            if (selected.Count >= MaximumTerms || termTokens == 0 || tokens + termTokens > MaximumTokens)
            {
                continue;
            }

            selected.Add(term);
            tokens += termTokens;
        }

        return new KeytermSelection(selected, Math.Max(0, total - selected.Count));
    }

    private static List<(string Name, string Value)> CommonParameters(
        DeepgramOptions options,
        IReadOnlyList<string> terms)
    {
        var values = new List<(string, string)>
        {
            ("model", "nova-3"),
            ("language", options.Language switch
            {
                LanguageMode.Multilingual => "multi",
                LanguageMode.Dutch => "nl",
                LanguageMode.English => "en-US",
                _ => throw new ArgumentOutOfRangeException(nameof(options), "Unsupported language mode."),
            }),
            ("smart_format", "true"),
            ("punctuate", "true"),
            ("numerals", "true"),
            ("mip_opt_out", options.PrivacyOptOut ? "true" : "false"),
        };
        values.AddRange(terms.Select(term => ("keyterm", term)));
        return values;
    }

    private static Uri Build(string scheme, string host, IEnumerable<(string Name, string Value)> values)
    {
        var query = string.Join(
            "&",
            values.Select(pair => $"{Uri.EscapeDataString(pair.Name)}={Uri.EscapeDataString(pair.Value)}"));
        return new UriBuilder(scheme, host)
        {
            Path = "/v1/listen",
            Query = query,
        }.Uri;
    }

    private static void Validate(DeepgramOptions options)
    {
        if (options.RegionHost is not ("api.deepgram.com" or "api.eu.deepgram.com"))
        {
            throw new ArgumentException("Choose the global or EU Deepgram endpoint.", nameof(options));
        }

        if (options.EndpointingMs is < 10 or > 5000)
        {
            throw new ArgumentOutOfRangeException(nameof(options), "Endpointing must be between 10 and 5,000 ms.");
        }
    }

    [GeneratedRegex(@"\S+")]
    private static partial Regex TokenRegex();
}
