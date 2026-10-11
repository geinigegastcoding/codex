using System.Diagnostics;
using System.Reflection;
using VibeKeepAlive.Models;
using VibeKeepAlive.Services;

if (args.Length != 1 || !File.Exists(args[0]))
{
    Console.Error.WriteLine("Usage: VibeKeepAlive.SmokeTests.exe <agent-shaped-executable>");
    return 2;
}

var invalidSettings = new AppSettings
{
    Agents = [null!],
    PowerAction = (PowerAction)999
};
invalidSettings.Normalize();
if (invalidSettings.Agents.Count == 0 || invalidSettings.PowerAction != PowerAction.Shutdown)
{
    Console.Error.WriteLine("FAIL: settings normalization did not restore safe defaults.");
    return 1;
}

var defaults = new AppSettings();
if (!defaults.ShutdownOnlyOnAc || defaults.ShowFinalNotificationBeforeAction)
{
    Console.Error.WriteLine("FAIL: completion safety defaults do not match the dashboard policy.");
    return 1;
}

using (var powercfg = Process.Start(new ProcessStartInfo
{
    FileName = Path.Combine(Environment.SystemDirectory, "powercfg.exe"),
    UseShellExecute = false,
    RedirectStandardOutput = true,
    CreateNoWindow = true,
    ArgumentList = { "/qh", "SCHEME_CURRENT", "SUB_BUTTONS", "LIDACTION" }
}))
{
    if (powercfg is null)
    {
        Console.Error.WriteLine("FAIL: Windows powercfg could not be started.");
        return 1;
    }

    var output = powercfg.StandardOutput.ReadToEnd();
    powercfg.WaitForExit();
    var settingLine = output.Split(["\r\n", "\n"], StringSplitOptions.RemoveEmptyEntries)
        .FirstOrDefault(line => line.TrimStart().StartsWith("Power Setting GUID:", StringComparison.OrdinalIgnoreCase));
    var settingIdText = settingLine?.Split('(', 2)[0].Split(':', 2).Last().Trim();
    var configuredSettingId = typeof(PowerController)
        .GetField("LidActionSetting", BindingFlags.NonPublic | BindingFlags.Static)?.GetValue(null);
    if (powercfg.ExitCode != 0 || !Guid.TryParse(settingIdText, out var windowsSettingId) ||
        configuredSettingId is not Guid appSettingId || appSettingId != windowsSettingId)
    {
        Console.Error.WriteLine($"FAIL: the app's lid-action setting ID does not match Windows (app: {configuredSettingId}, Windows: {settingIdText}).");
        return 1;
    }
}

var unknownPower = new PowerStatusSnapshot();
using (var isolatedPowerController = new PowerController(Path.Combine(Path.GetTempPath(), $"Agentoff.SmokeTests.{Guid.NewGuid():N}.json")))
{
    isolatedPowerController.Update(unknownPower, new AppSettings());
    if (unknownPower.SourceLabel != "Power source unknown" ||
        isolatedPowerController.IsActive ||
        !isolatedPowerController.LastWarning.Contains("unknown", StringComparison.OrdinalIgnoreCase))
    {
        Console.Error.WriteLine("FAIL: unknown power status was treated as safe AC power.");
        return 1;
    }
}

var immediateStartedCount = 0;
var immediateCompletedCount = 0;
using (var immediateScheduler = new ShutdownScheduler())
{
    immediateScheduler.ActionStarting += _ => immediateStartedCount++;
    immediateScheduler.Completed += () => immediateCompletedCount++;
    immediateScheduler.Schedule(PowerAction.DoNothing, 15, showFinalNotification: true);
    if (!immediateScheduler.ExecuteNow() || immediateStartedCount != 1 || immediateCompletedCount != 1 || immediateScheduler.IsScheduled)
    {
        Console.Error.WriteLine("FAIL: immediate scheduled-action execution did not complete exactly once.");
        return 1;
    }
}

var notificationStartedCount = 0;
var notificationTimer = Stopwatch.StartNew();
var notificationCompleted = new TaskCompletionSource<double>(TaskCreationOptions.RunContinuationsAsynchronously);
using var notificationScheduler = new ShutdownScheduler();
notificationScheduler.ActionStarting += _ => notificationStartedCount++;
notificationScheduler.Completed += () => notificationCompleted.TrySetResult(notificationTimer.Elapsed.TotalSeconds);
notificationScheduler.Failed += exception => notificationCompleted.TrySetException(exception);
notificationScheduler.Schedule(PowerAction.DoNothing, 15, showFinalNotification: true);

var inspector = new ProcessInspector();
var disabledStatus = inspector.Scan(
    [
        new AgentDefinition
        {
            Id = "disabled-agent",
            Name = "Disabled agent",
            Enabled = false,
            ProcessNames = ["definitely-not-running.exe"]
        }
    ]).Single();
if (disabledStatus.IsEnabled ||
    disabledStatus.IsActive ||
    disabledStatus.StatusLabel != "Not watched" ||
    disabledStatus.Detail != "Profile disabled")
{
    Console.Error.WriteLine("FAIL: disabled agent profiles are still treated as active.");
    return 1;
}

var settings = new AppSettings
{
    Agents =
    [
        new AgentDefinition
        {
            Id = "smoke-agent",
            Name = "Smoke agent",
            ProcessNames = [Path.GetFileName(args[0])]
        }
    ],
    PowerAction = PowerAction.Shutdown,
    ShutdownCountdownSeconds = 15,
    GracePeriodSeconds = 2,
    PollIntervalSeconds = 1,
    KeepAwakeOnAc = false,
    KeepAwakeOnBattery = false,
    KeepLidClosed = false
};
settings.Normalize();

using var monitor = new AgentMonitor(
    settings,
    inspector,
    new PowerController(Path.Combine(Path.GetTempPath(), $"Agentoff.SmokeTests.{Guid.NewGuid():N}.json")),
    new ShutdownScheduler());
var reachedScheduled = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);
var reachedPostWork = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);
var sawWorking = false;
var sawGracePeriod = false;
monitor.SnapshotChanged += snapshot =>
{
    Console.WriteLine($"{snapshot.State}: {snapshot.Reason}");
    if (snapshot.State is MonitorState.Working or MonitorState.BatteryGuard)
    {
        sawWorking = true;
    }
    else if (snapshot.State == MonitorState.GracePeriod && sawWorking)
    {
        sawGracePeriod = true;
    }
    else if (snapshot.State == MonitorState.Scheduled && sawGracePeriod)
    {
        reachedScheduled.TrySetResult(true);
    }
    else if (snapshot.State == MonitorState.Idle &&
        sawGracePeriod &&
        snapshot.Reason == "All agents stopped. No automatic power action is selected.")
    {
        reachedPostWork.TrySetResult(true);
    }
};

monitor.Start();
using var agent = Process.Start(new ProcessStartInfo
{
    FileName = args[0],
    Arguments = "/t 4 /nobreak",
    UseShellExecute = false,
    CreateNoWindow = true
});

var scheduled = await Task.WhenAny(
    reachedScheduled.Task,
    Task.Delay(TimeSpan.FromSeconds(settings.GracePeriodSeconds + 15)));
if (scheduled == reachedScheduled.Task)
{
    settings.PowerAction = PowerAction.DoNothing;
    monitor.CancelScheduledAction(preserveWorkSession: true);
}

var completed = scheduled == reachedScheduled.Task
    ? await Task.WhenAny(reachedPostWork.Task, Task.Delay(TimeSpan.FromSeconds(5)))
    : null;
var passed = completed == reachedPostWork.Task;
var notificationResult = await Task.WhenAny(notificationCompleted.Task, Task.Delay(TimeSpan.FromSeconds(22)));
var notificationPassed = notificationResult == notificationCompleted.Task &&
    notificationStartedCount == 1 &&
    await notificationCompleted.Task >= 19;
Console.WriteLine(passed && notificationPassed
    ? "PASS: agent lifecycle, immediate execution, and the final-notification grace were observed."
    : "FAIL: agent lifecycle or scheduled-action notification behavior was not observed.");
return passed && notificationPassed ? 0 : 1;
