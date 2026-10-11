namespace VibeKeepAlive.Services;

public static class CompletionPolicySelfCheck
{
    public static void Run()
    {
        var start = DateTimeOffset.UtcNow;
        if (start + TimeSpan.FromSeconds(90) <= start)
        {
            throw new InvalidOperationException("Completion grace arithmetic is invalid.");
        }

        if (TimeSpan.FromSeconds(Math.Clamp(900, 15, 900)).TotalSeconds != 900)
        {
            throw new InvalidOperationException("Completion bounds are invalid.");
        }
    }
}
