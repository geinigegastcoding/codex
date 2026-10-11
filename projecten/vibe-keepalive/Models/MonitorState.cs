namespace VibeKeepAlive.Models;

public enum MonitorState
{
    Idle,
    Working,
    GracePeriod,
    Scheduled,
    Paused,
    BatteryGuard,
    AwaitingAcPower
}
