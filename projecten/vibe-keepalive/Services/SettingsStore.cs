using System.Text.Json;
using System.IO;
using Microsoft.Win32;
using VibeKeepAlive.Models;

namespace VibeKeepAlive.Services;

public sealed class SettingsStore
{
    private const string RunKeyPath = @"Software\Microsoft\Windows\CurrentVersion\Run";
    private const string RunValueName = "VibeKeepAlive";

    private readonly string _settingsPath = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "VibeKeepAlive",
        "settings.json");

    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        WriteIndented = true,
        PropertyNameCaseInsensitive = true
    };

    public AppSettings Load()
    {
        try
        {
            if (File.Exists(_settingsPath))
            {
                var saved = JsonSerializer.Deserialize<AppSettings>(File.ReadAllText(_settingsPath), _jsonOptions);
                if (saved is not null)
                {
                    saved.Normalize();
                    return saved;
                }
            }
        }
        catch
        {
            // A broken settings file should not prevent the tray app from starting.
        }

        var defaults = new AppSettings();
        defaults.Normalize();
        return defaults;
    }

    public void Save(AppSettings settings)
    {
        settings.Normalize();
        var directory = Path.GetDirectoryName(_settingsPath)!;
        Directory.CreateDirectory(directory);
        var temporaryPath = _settingsPath + ".tmp";
        File.WriteAllText(temporaryPath, JsonSerializer.Serialize(settings, _jsonOptions));
        File.Move(temporaryPath, _settingsPath, true);
        SetStartWithWindows(settings.StartWithWindows);
    }

    public void SetStartWithWindows(bool enabled)
    {
        using var runKey = Registry.CurrentUser.CreateSubKey(RunKeyPath, true);
        if (runKey is null)
        {
            return;
        }

        if (enabled && !string.IsNullOrWhiteSpace(Environment.ProcessPath))
        {
            runKey.SetValue(RunValueName, $"\"{Environment.ProcessPath}\" --hidden");
        }
        else
        {
            runKey.DeleteValue(RunValueName, false);
        }
    }
}
