using VibeKeepAlive.Models;

namespace VibeKeepAlive.Services;

public sealed class AgentMonitor : IDisposable
{
    private readonly object _gate = new();
    private readonly AppSettings _settings;
    private readonly ProcessInspector _processInspector;
    private readonly PowerController _powerController;
    private readonly ShutdownScheduler _scheduler;
    private readonly CancellationTokenSource _cancellation = new();
    private Task? _loopTask;

    private IReadOnlyList<AgentStatus> _lastAgents = [];
    private PowerStatusSnapshot _lastPower = new();
    private MonitorState _lastState = MonitorState.Idle;
    private string _lastReason = "Waiting for agent work.";
    private DateTimeOffset? _lastActiveAt;
    private bool _workSessionSeen;
    private int? _actionRemainingSeconds;

    public event Action<MonitorSnapshot>? SnapshotChanged;
    public event Action<PowerAction>? ScheduledActionStarting;

    public AgentMonitor(
        AppSettings settings,
        ProcessInspector processInspector,
        PowerController powerController,
        ShutdownScheduler scheduler)
    {
        _settings = settings;
        _processInspector = processInspector;
        _powerController = powerController;
        _scheduler = scheduler;
        _scheduler.RemainingChanged += OnRemainingChanged;
        _scheduler.Completed += OnScheduleCompleted;
        _scheduler.Failed += OnScheduleFailed;
        _scheduler.ActionStarting += OnScheduledActionStarting;
    }

    public void Start()
    {
        _loopTask ??= Task.Run(MonitorLoopAsync);
    }

    public void CancelScheduledAction(bool preserveWorkSession = false)
    {
        lock (_gate)
        {
            if (preserveWorkSession && _lastState == MonitorState.Scheduled)
            {
                _lastState = MonitorState.GracePeriod;
                _lastReason = "Completion settings changed. Rechecking before the power action.";
            }

            _scheduler.Cancel();
            _actionRemainingSeconds = null;
            if (!preserveWorkSession)
            {
                _powerController.Release();
                _lastActiveAt = null;
                _workSessionSeen = false;
                _lastState = MonitorState.Idle;
                _lastReason = "Scheduled action cancelled.";
            }
            PublishLocked();
        }
    }

    public bool ExecuteScheduledActionNow() => _scheduler.ExecuteNow();

    public void Dispose()
    {
        _cancellation.Cancel();
        try
        {
            _loopTask?.Wait(TimeSpan.FromSeconds(2));
        }
        catch
        {
        }

        _scheduler.RemainingChanged -= OnRemainingChanged;
        _scheduler.Completed -= OnScheduleCompleted;
        _scheduler.Failed -= OnScheduleFailed;
        _scheduler.ActionStarting -= OnScheduledActionStarting;
        _scheduler.Dispose();
        _powerController.Dispose();
        _cancellation.Dispose();
    }

    private async Task MonitorLoopAsync()
    {
        try
        {
            while (!_cancellation.IsCancellationRequested)
            {
                try
                {
                    await ScanOnceAsync();
                    await Task.Delay(TimeSpan.FromSeconds(_settings.PollIntervalSeconds), _cancellation.Token);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception exception)
                {
                    lock (_gate)
                    {
                        _scheduler.Cancel();
                        _actionRemainingSeconds = null;
                        _lastActiveAt = null;
                        _workSessionSeen = false;
                        _powerController.Release();
                        _lastState = MonitorState.Idle;
                        _lastReason = $"Monitor warning: {exception.Message}";
                        PublishLocked();
                    }

                    await Task.Delay(TimeSpan.FromSeconds(3), _cancellation.Token);
                }
            }
        }
        finally
        {
            lock (_gate)
            {
                _scheduler.Cancel();
                _actionRemainingSeconds = null;
                _powerController.Release();
            }
        }
    }

    private async Task ScanOnceAsync()
    {
        IReadOnlyList<AgentDefinition> definitions;
        lock (_settings)
        {
            definitions = _settings.Agents.ToList();
        }

        var agents = await Task.Run(() => _processInspector.Scan(definitions), _cancellation.Token);
        var power = PowerStatusReader.Read();
        var activeCount = agents.Count(agent => agent.IsActive);
        var now = DateTimeOffset.Now;

        lock (_gate)
        {
            _lastAgents = agents;
            _lastPower = power;

            if (_settings.IsPaused)
            {
                _scheduler.Cancel();
                _actionRemainingSeconds = null;
                _powerController.Release();
                _lastState = MonitorState.Paused;
                _lastReason = "Automation is paused from the tray or dashboard.";
                PublishLocked();
                return;
            }

            if (activeCount > 0)
            {
                _workSessionSeen = true;
                _lastActiveAt = null;
                if (_scheduler.IsScheduled)
                {
                    _scheduler.Cancel();
                    _actionRemainingSeconds = null;
                }

                _powerController.Update(power, _settings);
                _lastState = power.IsOnBattery && power.BatteryPercent < _settings.MinimumBatteryPercent
                    ? MonitorState.BatteryGuard
                    : MonitorState.Working;
                _lastReason = string.IsNullOrWhiteSpace(_powerController.LastWarning)
                    ? $"Keeping the machine awake for {activeCount} active agent{(activeCount == 1 ? string.Empty : "s")}."
                    : _powerController.LastWarning;
                PublishLocked();
                return;
            }

            if (!_workSessionSeen)
            {
                _powerController.Release();
                _lastState = MonitorState.Idle;
                _lastReason = "Waiting for agent work.";
                PublishLocked();
                return;
            }

            _lastActiveAt ??= now;
            var elapsed = now - _lastActiveAt.Value;
            var grace = TimeSpan.FromSeconds(_settings.GracePeriodSeconds);
            _powerController.Update(power, _settings);

            if (elapsed < grace)
            {
                _lastState = MonitorState.GracePeriod;
                _lastReason = "All tracked agents stopped. Waiting in case one restarts.";
                PublishLocked();
                return;
            }

            if (_settings.PowerAction == PowerAction.DoNothing)
            {
                _powerController.Release();
                _workSessionSeen = false;
                _lastActiveAt = null;
                _lastState = MonitorState.Idle;
                _lastReason = "All agents stopped. No automatic power action is selected.";
                PublishLocked();
                return;
            }

            if (_settings.PowerAction == PowerAction.Shutdown && _settings.ShutdownOnlyOnAc && !power.IsOnAcPower)
            {
                if (_scheduler.IsScheduled)
                {
                    _scheduler.Cancel();
                    _actionRemainingSeconds = null;
                }

                _powerController.Release();
                _lastState = MonitorState.AwaitingAcPower;
                _lastReason = "All agents are finished. Waiting for AC power before shutting down.";
                PublishLocked();
                return;
            }

            if (!_scheduler.IsScheduled)
            {
                _scheduler.Schedule(
                    _settings.PowerAction,
                    _settings.ShutdownCountdownSeconds,
                    _settings.ShowFinalNotificationBeforeAction);
                _actionRemainingSeconds = _settings.ShutdownCountdownSeconds;
            }

            _lastState = MonitorState.Scheduled;
            _lastReason = $"No tracked agents are running. {_settings.PowerAction} is scheduled.";
            PublishLocked();
        }
    }

    private void OnRemainingChanged(int? remaining)
    {
        lock (_gate)
        {
            _actionRemainingSeconds = remaining;
            PublishLocked();
        }
    }

    private void OnScheduleCompleted()
    {
        lock (_gate)
        {
            _actionRemainingSeconds = null;
            _lastActiveAt = null;
            _workSessionSeen = false;
            _lastState = MonitorState.Idle;
            _lastReason = "Power action started.";
            PublishLocked();
        }
    }

    private void OnScheduleFailed(Exception exception)
    {
        lock (_gate)
        {
            _actionRemainingSeconds = null;
            _lastActiveAt = null;
            _workSessionSeen = false;
            _powerController.Release();
            _lastState = MonitorState.Idle;
            _lastReason = $"Power action failed: {exception.Message}";
            PublishLocked();
        }
    }

    private void OnScheduledActionStarting(PowerAction action) => ScheduledActionStarting?.Invoke(action);

    private void PublishLocked()
    {
        var snapshot = new MonitorSnapshot
        {
            State = _lastState,
            Agents = _lastAgents,
            ActiveAgentCount = _lastAgents.Count(agent => agent.IsActive),
            GraceRemaining = _lastState == MonitorState.GracePeriod && _lastActiveAt.HasValue
                ? TimeSpan.FromSeconds(Math.Max(0, _settings.GracePeriodSeconds - (DateTimeOffset.Now - _lastActiveAt.Value).TotalSeconds))
                : null,
            ActionRemainingSeconds = _actionRemainingSeconds,
            Power = _lastPower,
            KeepAwakeActive = _powerController.IsActive,
            Reason = _lastReason,
            ObservedAt = DateTimeOffset.Now
        };

        SnapshotChanged?.Invoke(snapshot);
    }
}
