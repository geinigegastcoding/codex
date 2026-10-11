namespace VibeKeepAlive.Models;

public sealed class ActivityEntry
{
    public DateTimeOffset Time { get; init; } = DateTimeOffset.Now;
    public string Message { get; init; } = string.Empty;
    public string Tone { get; init; } = "neutral";
    public string TimeLabel => Time.ToLocalTime().ToString("HH:mm:ss");
}
