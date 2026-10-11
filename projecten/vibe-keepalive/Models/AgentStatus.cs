namespace VibeKeepAlive.Models;

public sealed class AgentStatus
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public bool IsEnabled { get; init; }
    public bool IsActive { get; init; }
    public int ProcessCount { get; init; }
    public string Detail { get; init; } = string.Empty;
    public DateTimeOffset? LastSeen { get; init; }
    public string StatusLabel => !IsEnabled ? "Not watched" : IsActive ? "Active now" : "Not running";
    public string StatusColor => !IsEnabled ? "#4F5B69" : IsActive ? "#7FE3B0" : "#657180";
    public string? LogoPath => Id switch
    {
        "codex" => "pack://application:,,,/VibeKeepAlive;component/Assets/codex.png",
        "claude-code" => "pack://application:,,,/VibeKeepAlive;component/Assets/claude.ico",
        "t3-code" => "pack://application:,,,/VibeKeepAlive;component/Assets/t3.ico",
        _ => null
    };
}
