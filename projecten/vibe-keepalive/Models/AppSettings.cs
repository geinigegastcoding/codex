namespace VibeKeepAlive.Models;

public sealed class AppSettings
{
    public List<AgentDefinition> Agents { get; set; } = AgentDefinition.Defaults();
    public PowerAction PowerAction { get; set; } = PowerAction.Shutdown;
    public int GracePeriodSeconds { get; set; } = 90;
    public int ShutdownCountdownSeconds { get; set; } = 60;
    public bool KeepAwakeOnAc { get; set; } = true;
    public bool KeepAwakeOnBattery { get; set; } = true;
    public bool KeepLidClosed { get; set; } = true;
    public bool ShutdownOnlyOnAc { get; set; } = true;
    public bool ShowFinalNotificationBeforeAction { get; set; }
    public int MinimumBatteryPercent { get; set; } = 20;
    public bool StartWithWindows { get; set; }
    public bool IsPaused { get; set; }
    public int PollIntervalSeconds { get; set; } = 2;

    public void Normalize()
    {
        Agents ??= [];
        Agents = Agents
            .Where(agent => agent is not null && !string.IsNullOrWhiteSpace(agent.Id) && !string.IsNullOrWhiteSpace(agent.Name))
            .ToList();

        foreach (var agent in Agents)
        {
            agent.ProcessNames ??= [];
            agent.CommandLineKeywords ??= [];
        }

        if (Agents.Count == 0)
        {
            Agents = AgentDefinition.Defaults();
        }

        if (!Enum.IsDefined(PowerAction))
        {
            PowerAction = PowerAction.Shutdown;
        }

        GracePeriodSeconds = Math.Clamp(GracePeriodSeconds, 15, 900);
        ShutdownCountdownSeconds = Math.Clamp(ShutdownCountdownSeconds, 15, 900);
        MinimumBatteryPercent = Math.Clamp(MinimumBatteryPercent, 5, 80);
        PollIntervalSeconds = Math.Clamp(PollIntervalSeconds, 1, 10);
    }
}
