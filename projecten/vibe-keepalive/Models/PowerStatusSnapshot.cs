namespace VibeKeepAlive.Models;

public sealed class PowerStatusSnapshot
{
    public bool IsOnBattery { get; init; }
    public bool IsOnAcPower { get; init; }
    public int BatteryPercent { get; init; }
    public string SourceLabel => IsOnAcPower
        ? "Plugged in"
        : IsOnBattery
            ? $"Battery · {BatteryPercent}%"
            : "Power source unknown";
}
