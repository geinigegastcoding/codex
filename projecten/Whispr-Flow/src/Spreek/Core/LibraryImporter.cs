using System.IO;
using System.Text.Json;
using Microsoft.VisualBasic.FileIO;

namespace Spreek.Core;

public static class LibraryImporter
{
    public static ImportResult<DictionaryEntry> ImportDictionary(
        string csv,
        IEnumerable<DictionaryEntry> existing,
        IEnumerable<SnippetEntry> snippets,
        DateTimeOffset now)
    {
        var items = new List<DictionaryEntry>();
        var issues = new List<ImportIssue>();
        var terms = new HashSet<string>(existing.Select(entry => entry.Term), StringComparer.OrdinalIgnoreCase);
        var snippetNames = new HashSet<string>(snippets.Select(snippet => snippet.Name), StringComparer.OrdinalIgnoreCase);

        using var parser = new TextFieldParser(new StringReader(csv))
        {
            TextFieldType = FieldType.Delimited,
            HasFieldsEnclosedInQuotes = true,
            TrimWhiteSpace = true,
        };
        parser.SetDelimiters(",");

        var row = 0;
        while (!parser.EndOfData)
        {
            row++;
            string[] fields;
            try
            {
                fields = parser.ReadFields() ?? [];
            }
            catch (MalformedLineException error)
            {
                issues.Add(new ImportIssue(row, $"Malformed CSV: {error.Message}"));
                continue;
            }

            if (fields.All(string.IsNullOrWhiteSpace))
            {
                continue;
            }

            if (row == 1 && IsDictionaryHeader(fields))
            {
                continue;
            }

            if (fields.Length is < 1 or > 2)
            {
                issues.Add(new ImportIssue(row, "Expected one or two columns."));
                continue;
            }

            var heardAs = fields.Length == 2 ? fields[0].Trim() : null;
            var term = fields[^1].Trim();
            if (!ValidLength(term, 60) || (heardAs is not null && !ValidLength(heardAs, 60)))
            {
                issues.Add(new ImportIssue(row, "Terms must contain 1-60 characters."));
                continue;
            }

            if (!terms.Add(term))
            {
                issues.Add(new ImportIssue(row, $"Duplicate dictionary term: {term}"));
                continue;
            }

            if (snippetNames.Contains(term))
            {
                issues.Add(new ImportIssue(row, $"Dictionary term conflicts with snippet: {term}"));
                terms.Remove(term);
                continue;
            }

            items.Add(new DictionaryEntry(Guid.NewGuid(), term, heardAs, false, now, now));
        }

        return new ImportResult<DictionaryEntry>(items, issues);
    }

    public static ImportResult<SnippetEntry> ImportSnippets(
        string json,
        IEnumerable<SnippetEntry> existing,
        IEnumerable<DictionaryEntry> dictionary,
        DateTimeOffset now)
    {
        var items = new List<SnippetEntry>();
        var issues = new List<ImportIssue>();
        var names = new HashSet<string>(existing.Select(snippet => snippet.Name), StringComparer.OrdinalIgnoreCase);
        var dictionaryTerms = new HashSet<string>(dictionary.Select(entry => entry.Term), StringComparer.OrdinalIgnoreCase);

        JsonDocument document;
        try
        {
            document = JsonDocument.Parse(json);
        }
        catch (JsonException error)
        {
            return new ImportResult<SnippetEntry>(items, [new ImportIssue(1, $"Invalid JSON: {error.Message}")]);
        }

        using (document)
        {
            if (document.RootElement.ValueKind != JsonValueKind.Array)
            {
                return new ImportResult<SnippetEntry>(items, [new ImportIssue(1, "Snippet JSON must be an array.")]);
            }

            var row = 0;
            foreach (var element in document.RootElement.EnumerateArray())
            {
                row++;
                if (element.ValueKind != JsonValueKind.Object ||
                    !TryGetString(element, "name", out var name) ||
                    !TryGetString(element, "text", out var text) ||
                    !ValidLength(name, 60) ||
                    !ValidLength(text, 4000))
                {
                    issues.Add(new ImportIssue(row, "Each snippet needs string name/text values within 60/4,000 characters."));
                    continue;
                }

                name = name.Trim();
                if (!names.Add(name))
                {
                    issues.Add(new ImportIssue(row, $"Duplicate snippet trigger: {name}"));
                    continue;
                }

                if (dictionaryTerms.Contains(name))
                {
                    issues.Add(new ImportIssue(row, $"Snippet trigger conflicts with dictionary term: {name}"));
                    names.Remove(name);
                    continue;
                }

                items.Add(new SnippetEntry(Guid.NewGuid(), name, text, now, now));
            }
        }

        return new ImportResult<SnippetEntry>(items, issues);
    }

    private static bool IsDictionaryHeader(IReadOnlyList<string> fields) =>
        fields.Count == 1 && fields[0].Equals("term", StringComparison.OrdinalIgnoreCase) ||
        fields.Count == 2 &&
        fields[0].Equals("heard_as", StringComparison.OrdinalIgnoreCase) &&
        fields[1].Equals("term", StringComparison.OrdinalIgnoreCase);

    private static bool ValidLength(string value, int maximum) =>
        !string.IsNullOrWhiteSpace(value) && value.Trim().Length <= maximum;

    private static bool TryGetString(JsonElement element, string name, out string value)
    {
        foreach (var property in element.EnumerateObject())
        {
            if (property.Name.Equals(name, StringComparison.OrdinalIgnoreCase) &&
                property.Value.ValueKind == JsonValueKind.String)
            {
                value = property.Value.GetString() ?? string.Empty;
                return true;
            }
        }

        value = string.Empty;
        return false;
    }
}
