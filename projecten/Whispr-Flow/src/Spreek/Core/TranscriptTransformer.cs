using System.Globalization;
using System.Text.RegularExpressions;

namespace Spreek.Core;

public static partial class TranscriptTransformer
{
    private static readonly IReadOnlyDictionary<string, Func<DateTimeOffset, string>> Variables =
        new Dictionary<string, Func<DateTimeOffset, string>>(StringComparer.OrdinalIgnoreCase)
        {
            ["date"] = now => now.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            ["time"] = now => now.ToString("HH:mm", CultureInfo.InvariantCulture),
        };

    public static TransformResult Transform(
        string text,
        IEnumerable<DictionaryEntry> dictionary,
        IEnumerable<SnippetEntry> snippets,
        DateTimeOffset now,
        bool enablePressEnter)
    {
        ArgumentNullException.ThrowIfNull(text);
        var warnings = new HashSet<string>(StringComparer.Ordinal);
        var result = NormalizeWhitespace(text);

        foreach (var entry in dictionary
                     .Where(entry => !string.IsNullOrWhiteSpace(entry.HeardAs))
                     .OrderByDescending(entry => entry.HeardAs!.Length))
        {
            result = ReplacePhrase(result, entry.HeardAs!, entry.Term, false);
        }

        foreach (var snippet in snippets.OrderByDescending(snippet => snippet.Name.Length))
        {
            var expansion = ExpandVariables(snippet.Text, now, warnings);
            result = ReplacePhrase(result, snippet.Name, expansion, true);
        }

        var pressEnter = false;
        if (enablePressEnter && TrailingPressEnterRegex().IsMatch(result))
        {
            pressEnter = true;
            result = TrailingPressEnterRegex().Replace(result, string.Empty);
        }

        return new TransformResult(NormalizeWhitespace(result), pressEnter, warnings.ToArray());
    }

    private static string ReplacePhrase(string input, string phrase, string replacement, bool consumeTerminalPunctuation)
    {
        var words = Regex.Split(phrase.Trim(), @"\s+")
            .Where(word => word.Length > 0)
            .Select(Regex.Escape);
        var body = string.Join(@"\s+", words);
        if (body.Length == 0)
        {
            return input;
        }

        var punctuation = consumeTerminalPunctuation ? @"(?:[.!?])?" : string.Empty;
        var pattern = $@"(?<![\p{{L}}\p{{N}}_]){body}{punctuation}(?![\p{{L}}\p{{N}}_])";
        return Regex.Replace(input, pattern, _ => replacement, RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);
    }

    private static string ExpandVariables(string input, DateTimeOffset now, ISet<string> warnings) =>
        VariableRegex().Replace(input, match =>
        {
            var name = match.Groups["name"].Value;
            if (Variables.TryGetValue(name, out var factory))
            {
                return factory(now);
            }

            warnings.Add($"Unknown snippet variable: {{{name}}}");
            return match.Value;
        });

    private static string NormalizeWhitespace(string input)
    {
        var text = input.Replace("\r\n", "\n", StringComparison.Ordinal).Replace('\r', '\n').Trim();
        text = HorizontalWhitespaceRegex().Replace(text, " ");
        text = AroundNewlineRegex().Replace(text, "\n");
        text = ExtraNewlinesRegex().Replace(text, "\n\n");
        text = BeforePunctuationRegex().Replace(text, "$1");
        return text.Trim();
    }

    [GeneratedRegex(@"\{(?<name>[A-Za-z][A-Za-z0-9_-]*)\}")]
    private static partial Regex VariableRegex();

    [GeneratedRegex(@"(?i)(?:^|\s+)press\s+enter[.!?]?\s*$", RegexOptions.CultureInvariant)]
    private static partial Regex TrailingPressEnterRegex();

    [GeneratedRegex(@"[ \t]+")]
    private static partial Regex HorizontalWhitespaceRegex();

    [GeneratedRegex(@"[ \t]*\n[ \t]*")]
    private static partial Regex AroundNewlineRegex();

    [GeneratedRegex(@"\n{3,}")]
    private static partial Regex ExtraNewlinesRegex();

    [GeneratedRegex(@"[ \t]+([,.!?;:])")]
    private static partial Regex BeforePunctuationRegex();
}
