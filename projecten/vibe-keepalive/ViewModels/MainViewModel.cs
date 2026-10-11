using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Media;
using System.Windows.Threading;
using VibeKeepAlive.Models;
using VibeKeepAlive.Services;

namespace VibeKeepAlive.ViewModels;

public sealed class MainViewModel : INotifyPropertyChanged, IDisposable
{
    private readonly AppSettings _settings;
    private readonly SettingsStore _settingsStore;
    private readonly AgentMonitor _monitor;
    private readonly Dispatcher _dispatcher;
    private MonitorSnapshot _snapshot = new();
    private string _lastActivityReason = string.Empty;
    private string _currentPage = "Overview";

    public MainViewModel(
        AppSettings settings,
        SettingsStore settingsStore,
        AgentMonitor monitor,
        Dispatcher dispatcher)
    {
        _settings = settings;
        _settingsStore = settingsStore;
        _monitor = monitor;
        _dispatcher = dispatcher;
        _monitor.SnapshotChanged += OnSnapshotChanged;
        Activity.Add(new ActivityEntry { Message = "Monitor ready. Waiting for agent work.", Tone = "neutral" });
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    public ObservableCollection<AgentStatus> Agents { get; } = [];
    public ObservableCollection<ActivityEntry> Activity { get; } = [];
    public AppSettings Settings => _settings;
    public string CurrentPage => _currentPage;
    public MonitorState State => _snapshot.State;
    public bool IsPaused => _settings.IsPaused;
    public bool IsScheduled => State == MonitorState.Scheduled;
    public bool IsWorking => State == MonitorState.Working || State == MonitorState.BatteryGuard;
    public bool CanCancelAction => IsScheduled || State == MonitorState.GracePeriod;
    public bool CanExecuteActionNow => IsScheduled && _settings.PowerAction != PowerAction.DoNothing;
    public bool IsShutdownSelected => _settings.PowerAction == PowerAction.Shutdown && _settings.ShutdownCountdownSeconds != 600;
    public bool IsSleepSelected => _settings.PowerAction == PowerAction.Sleep;
    public bool IsDelayedShutdownSelected => _settings.PowerAction == PowerAction.Shutdown && _settings.ShutdownCountdownSeconds == 600;
    public bool IsShutdownOnlyOnAcEnabled => _settings.PowerAction == PowerAction.Shutdown;
    public string CancelActionLabel => "Cancel";
    public string MonitoringStatusText => IsPaused ? "Monitoring paused" : "Monitoring active";
    public string MonitoringStatusColor => IsPaused ? "#8B8494" : "#91E5B2";
    public int ActiveAgentCount => _snapshot.ActiveAgentCount;
    public int TrackedAgentCount => Agents.Count;
    public string ActiveAgentSummary => ActiveAgentCount == 0
        ? "No active agents"
        : $"{ActiveAgentCount} active agent{(ActiveAgentCount == 1 ? string.Empty : "s")}";

    public string StatusPillText => State switch
    {
        MonitorState.Working => "ACTIVE",
        MonitorState.BatteryGuard => "BATTERY GUARD",
        MonitorState.GracePeriod => "GRACE PERIOD",
        MonitorState.Scheduled => "COUNTDOWN",
        MonitorState.Paused => "PAUSED",
        MonitorState.AwaitingAcPower => "WAITING FOR AC",
        _ => "STANDBY"
    };

    public string StatusTitle => State switch
    {
        MonitorState.Working => ActiveAgentCount == 1 ? "One agent is working." : "Agents are working.",
        MonitorState.BatteryGuard => "Battery protection is active.",
        MonitorState.GracePeriod or MonitorState.Scheduled or MonitorState.AwaitingAcPower => "All agents are complete.",
        MonitorState.Paused => "Automation is paused",
        _ => "All agents are complete."
    };

    public string StatusIcon => State switch
    {
        MonitorState.Working => "…",
        MonitorState.BatteryGuard => "!",
        MonitorState.Paused => "Ⅱ",
        MonitorState.AwaitingAcPower => "⌁",
        _ => "✓"
    };

    public string StatusSubtitle => State switch
    {
        MonitorState.Working => "Your computer stays awake while your agents work.",
        MonitorState.BatteryGuard => "Battery protection is keeping your remaining charge safe.",
        MonitorState.GracePeriod => $"Your computer will {ActionVerb} after the grace period.",
        MonitorState.Scheduled => $"Your computer will {ActionVerb} shortly.",
        MonitorState.AwaitingAcPower => "Shutdown will resume when AC power is connected.",
        MonitorState.Paused => "Automation is paused. No power action will be started.",
        _ when _settings.PowerAction == PowerAction.DoNothing => "Choose what happens after monitored work finishes.",
        _ => $"Your computer will {ActionVerb} after agent work finishes."
    };

    public string StatusDescription => State == MonitorState.Idle
        ? "No active tasks detected. The completion countdown starts after Agentoff sees an agent run finish."
        : _snapshot.Reason;
    public string PowerSourceLabel => _snapshot.Power.SourceLabel;
    public string KeepAwakeLabel => _snapshot.KeepAwakeActive ? "Machine held awake" : "Machine can sleep";
    public string ActionVerb => _settings.PowerAction switch
    {
        PowerAction.Shutdown => "shut down",
        PowerAction.Hibernate => "hibernate",
        PowerAction.Sleep => "go to sleep",
        PowerAction.Lock => "lock the session",
        _ => "take no action"
    };
    public string NextActionLabel => _settings.PowerAction switch
    {
        PowerAction.Shutdown => "Shut down",
        PowerAction.Hibernate => "Hibernate",
        PowerAction.Sleep => "Sleep",
        PowerAction.Lock => "Lock",
        _ => "Do nothing"
    };

    public string GraceLabel => State == MonitorState.GracePeriod && _snapshot.GraceRemaining.HasValue
        ? $"{Math.Ceiling(_snapshot.GraceRemaining.Value.TotalSeconds):0}s grace window"
        : $"{_settings.GracePeriodSeconds}s grace window";

    public string CountdownLabel => State == MonitorState.Scheduled && _snapshot.ActionRemainingSeconds.HasValue
        ? FormatDuration(_snapshot.ActionRemainingSeconds.Value)
        : State == MonitorState.GracePeriod && _snapshot.GraceRemaining.HasValue
            ? FormatDuration((int)Math.Ceiling(_snapshot.GraceRemaining.Value.TotalSeconds))
            : "Not scheduled";

    public string CountdownCaption => State switch
    {
        MonitorState.Scheduled => $"{NextActionLabel} in",
        MonitorState.GracePeriod => "Completion grace",
        MonitorState.AwaitingAcPower => "Waiting for",
        _ => "Next power action"
    };

    public string CountdownFootnote => State switch
    {
        MonitorState.Scheduled => "Cancel any time before it starts.",
        MonitorState.GracePeriod => "Waiting in case an agent restarts.",
        MonitorState.AwaitingAcPower => "Connect the charger to continue.",
        MonitorState.Working => "No power action is pending.",
        MonitorState.Paused => "Resume monitoring to continue.",
        _ => "Starts after all tracked work finishes."
    };

    public string ActionNowLabel => _settings.PowerAction switch
    {
        PowerAction.Shutdown => "Shut down now",
        PowerAction.Hibernate => "Hibernate now",
        PowerAction.Sleep => "Sleep now",
        PowerAction.Lock => "Lock now",
        _ => "Run now"
    };

    public string PauseButtonText => IsPaused ? "Resume automation" : "Pause automation";
    public string StatusColor => State switch
    {
        MonitorState.Working => "#7FE3B0",
        MonitorState.BatteryGuard => "#F4C66A",
        MonitorState.GracePeriod => "#A5B4FC",
        MonitorState.Scheduled => "#F4A7D7",
        MonitorState.Paused => "#9CA3AF",
        MonitorState.AwaitingAcPower => "#C9A3E6",
        _ => "#7DD3FC"
    };

    public double StatusProgressValue
    {
        get
        {
            if (State == MonitorState.GracePeriod && _snapshot.GraceRemaining.HasValue)
            {
                return Math.Clamp(100 - (_snapshot.GraceRemaining.Value.TotalSeconds / _settings.GracePeriodSeconds * 100), 0, 100);
            }

            if (State == MonitorState.Scheduled && _snapshot.ActionRemainingSeconds.HasValue)
            {
                return Math.Clamp(100 - (_snapshot.ActionRemainingSeconds.Value / (double)_settings.ShutdownCountdownSeconds * 100), 0, 100);
            }

            return State == MonitorState.Working ? 100 : 0;
        }
    }

    public void SetPage(string page)
    {
        _currentPage = page;
        NotifyAll();
    }

    public void TogglePause()
    {
        lock (_settings)
        {
            _settings.IsPaused = !_settings.IsPaused;
            _settingsStore.Save(_settings);
        }
        AddActivity(_settings.IsPaused ? "Automation paused from the dashboard." : "Automation resumed.", "neutral");
        NotifyAll();
    }

    public void CancelAction()
    {
        if (!CanCancelAction)
        {
            return;
        }

        var wasGracePeriod = State == MonitorState.GracePeriod;
        _monitor.CancelScheduledAction();
        AddActivity(
            wasGracePeriod
                ? "Finish detection cancelled; waiting for new agent work."
                : "Pending power action cancelled.",
            "warning");
        NotifyAll();
    }

    public bool ExecuteActionNow()
    {
        if (!CanExecuteActionNow || !_monitor.ExecuteScheduledActionNow())
        {
            return false;
        }

        AddActivity($"Started {NextActionLabel.ToLowerInvariant()} from the dashboard.", "warning");
        NotifyAll();
        return true;
    }

    public void SaveSettings(bool completionPolicyChanged = false)
    {
        lock (_settings)
        {
            if (completionPolicyChanged)
            {
                _monitor.CancelScheduledAction(preserveWorkSession: true);
            }
            _settingsStore.Save(_settings);
        }
        NotifyAll();
    }

    public void AddCustomAgent(string name, string processName)
    {
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(processName))
        {
            return;
        }

        lock (_settings)
        {
            _settings.Agents.Add(new AgentDefinition
            {
                Id = $"custom-{Guid.NewGuid():N}",
                Name = name.Trim(),
                Description = "Custom process profile",
                ProcessNames = [processName.Trim()]
            });
            _settingsStore.Save(_settings);
        }
        AddActivity($"Watching {name.Trim()}.", "positive");
        NotifyAll();
    }

    public void RemoveAgent(string agentId)
    {
        AgentDefinition? agent;
        lock (_settings)
        {
            agent = _settings.Agents.FirstOrDefault(candidate => candidate.Id == agentId);
        }

        if (agent is null)
        {
            return;
        }

        _monitor.CancelScheduledAction();
        lock (_settings)
        {
            _settings.Agents.Remove(agent);
            _settingsStore.Save(_settings);
        }
        AddActivity($"Stopped watching {agent.Name}.", "warning");
        NotifyAll();
    }

    public void SetAgentEnabled(string agentId, bool enabled)
    {
        AgentDefinition? agent;
        lock (_settings)
        {
            agent = _settings.Agents.FirstOrDefault(candidate => candidate.Id == agentId);
        }

        if (agent is null || agent.Enabled == enabled)
        {
            return;
        }

        _monitor.CancelScheduledAction();
        lock (_settings)
        {
            agent.Enabled = enabled;
            _settingsStore.Save(_settings);
        }
        AddActivity($"{(enabled ? "Watching" : "Ignoring")} {agent.Name}.", enabled ? "positive" : "warning");
        NotifyAll();
    }

    public void Dispose()
    {
        _monitor.SnapshotChanged -= OnSnapshotChanged;
        _monitor.Dispose();
    }

    private void OnSnapshotChanged(MonitorSnapshot snapshot)
    {
        if (_dispatcher.CheckAccess())
        {
            ApplySnapshot(snapshot);
        }
        else
        {
            _dispatcher.BeginInvoke(() => ApplySnapshot(snapshot));
        }
    }

    private void ApplySnapshot(MonitorSnapshot snapshot)
    {
        _snapshot = snapshot;
        Agents.Clear();
        foreach (var agent in snapshot.Agents)
        {
            Agents.Add(agent);
        }

        if (!string.Equals(_lastActivityReason, snapshot.Reason, StringComparison.Ordinal))
        {
            _lastActivityReason = snapshot.Reason;
            AddActivity(snapshot.Reason, snapshot.State is MonitorState.BatteryGuard or MonitorState.Scheduled ? "warning" : "neutral");
        }

        NotifyAll();
    }

    private void AddActivity(string message, string tone)
    {
        Activity.Insert(0, new ActivityEntry { Message = message, Tone = tone });
        while (Activity.Count > 30)
        {
            Activity.RemoveAt(Activity.Count - 1);
        }
    }

    private void NotifyAll([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(null));
    }

    private static string FormatDuration(int seconds)
    {
        var span = TimeSpan.FromSeconds(Math.Max(0, seconds));
        return $"{(int)span.TotalMinutes:00}:{span.Seconds:00}";
    }
}
