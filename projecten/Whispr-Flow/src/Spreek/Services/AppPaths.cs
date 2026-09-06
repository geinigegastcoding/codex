using System.IO;

namespace Spreek.Services;

public sealed class AppPaths
{
    public AppPaths(string root)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(root);
        Root = Path.GetFullPath(root);
        Recordings = Path.Combine(Root, "recordings");
        Logs = Path.Combine(Root, "logs");
        SettingsFile = Path.Combine(Root, "settings.json");
        SecretFile = Path.Combine(Root, "secret.dat");
        DictionaryFile = Path.Combine(Root, "dictionary.json");
        SnippetsFile = Path.Combine(Root, "snippets.json");
        HistoryFile = Path.Combine(Root, "history.jsonl");
        LogFile = Path.Combine(Logs, "spreek.log");

        Directory.CreateDirectory(Root);
        Directory.CreateDirectory(Recordings);
        Directory.CreateDirectory(Logs);
    }

    public string Root { get; }
    public string Recordings { get; }
    public string Logs { get; }
    public string SettingsFile { get; }
    public string SecretFile { get; }
    public string DictionaryFile { get; }
    public string SnippetsFile { get; }
    public string HistoryFile { get; }
    public string LogFile { get; }

    public static AppPaths ForCurrentUser() => new(Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "Spreek"));

    public string NewRecordingPath(Guid id) => Path.Combine(Recordings, $"{id:N}.wav");
}
