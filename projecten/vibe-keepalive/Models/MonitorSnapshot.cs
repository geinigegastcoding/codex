namespace VibeKeepAlive.Models;

public sealed class MonitorSnapshot
{
    public MonitorState State { get; init; }
    public IReadOnlyList<AgentStatus> Agents { get; init; } = [];
    public int ActiveAgentCount { get; init; }
    public TimeSpan? GraceRemaining { get; init; }
    public int? ActionRemainingSeconds { get; init; }
    public PowerStatusSnapshot Power { get; init; } = new();
    public bool KeepAwakeActive { get; init; }
    public string Reason { get; init; } = string.Empty;
    public DateTimeOffset ObservedAt { get; init; } = DateTimeOffset.Now;
}
