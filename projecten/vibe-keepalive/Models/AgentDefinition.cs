namespace VibeKeepAlive.Models;

public sealed class AgentDefinition
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
    public List<string> ProcessNames { get; set; } = [];
    public List<string> CommandLineKeywords { get; set; } = [];

    public static List<AgentDefinition> Defaults() =>
    [
        new()
        {
            Id = "codex",
            Name = "Codex",
            Description = "OpenAI coding agent",
            ProcessNames = ["codex", "codex-desktop", "codex-cli"],
            CommandLineKeywords = ["codex"]
        },
        new()
        {
            Id = "claude-code",
            Name = "Claude Code",
            Description = "Anthropic coding agent",
            ProcessNames = ["claude", "claude-code"],
            CommandLineKeywords = ["claude", "@anthropic-ai/claude-code"]
        },
        new()
        {
            Id = "t3-code",
            Name = "T3 Code",
            Description = "T3 coding agent",
            ProcessNames = ["t3", "t3code", "t3-code", "t3 code"],
            CommandLineKeywords = ["t3", "t3-code", "t3 code"]
        }
    ];
}
