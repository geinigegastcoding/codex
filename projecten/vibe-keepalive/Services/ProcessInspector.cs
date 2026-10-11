using System.Diagnostics;
using System.IO;
using System.Management;
using VibeKeepAlive.Models;

namespace VibeKeepAlive.Services;

public sealed class ProcessInspector
{
    public IReadOnlyList<AgentStatus> Scan(IReadOnlyList<AgentDefinition> definitions)
    {
        var processes = ReadProcesses();
        return definitions
            .Select(definition =>
            {
                var matches = definition.Enabled
                    ? processes.Where(process => Matches(definition, process)).ToList()
                    : [];
                return new AgentStatus
                {
                    Id = definition.Id,
                    Name = definition.Name,
                    Description = definition.Description,
                    IsEnabled = definition.Enabled,
                    IsActive = matches.Count > 0,
                    ProcessCount = matches.Count,
                    Detail = !definition.Enabled
                        ? "Profile disabled"
                        : matches.Count > 0
                        ? $"{matches.Count} process{(matches.Count == 1 ? string.Empty : "es")} active"
                        : "Waiting for activity",
                    LastSeen = matches.Count > 0 ? DateTimeOffset.Now : null
                };
            })
            .ToList();
    }

    private static bool Matches(AgentDefinition definition, ProcessInfo process)
    {
        var processName = Normalize(Path.GetFileNameWithoutExtension(process.Name));
        var exactName = definition.ProcessNames.Any(candidate => Normalize(candidate) == processName);
        if (exactName)
        {
            return true;
        }

        var hostProcess = processName is "node" or "bun" or "deno" or "electron";
        return hostProcess && definition.CommandLineKeywords.Any(keyword =>
            !string.IsNullOrWhiteSpace(keyword) &&
            process.CommandLine.Contains(keyword, StringComparison.OrdinalIgnoreCase));
    }

    private static string Normalize(string value) =>
        value.Trim().Replace(".exe", string.Empty, StringComparison.OrdinalIgnoreCase).ToLowerInvariant();

    private static IReadOnlyList<ProcessInfo> ReadProcesses()
    {
        try
        {
            using var searcher = new ManagementObjectSearcher(
                "SELECT Name, ProcessId, CommandLine FROM Win32_Process");
            using var results = searcher.Get();
            return results
                .Cast<ManagementObject>()
                .Select(item => new ProcessInfo(
                    item["Name"]?.ToString() ?? string.Empty,
                    item["CommandLine"]?.ToString() ?? string.Empty,
                    Convert.ToInt32(item["ProcessId"] ?? 0)))
                .ToList();
        }
        catch
        {
            return Process.GetProcesses()
                .Select(process =>
                {
                    try
                    {
                        return new ProcessInfo(process.ProcessName + ".exe", string.Empty, process.Id);
                    }
                    catch
                    {
                        return null;
                    }
                    finally
                    {
                        process.Dispose();
                    }
                })
                .Where(process => process is not null)
                .Cast<ProcessInfo>()
                .ToList();
        }
    }

    private sealed record ProcessInfo(string Name, string CommandLine, int ProcessId);
}
