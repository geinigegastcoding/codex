using VibeKeepAlive.Models;

namespace VibeKeepAlive.Services;

public sealed class ShutdownScheduler : IDisposable
{
    private readonly object _gate = new();
    private CancellationTokenSource? _cancellation;
    private PowerAction? _scheduledAction;
    private bool _showFinalNotification;
    private bool _notificationShown;
    private bool _actionCommitted;

    public event Action<int?>? RemainingChanged;
    public event Action<PowerAction>? ActionStarting;
    public event Action? Completed;
    public event Action<Exception>? Failed;
    public bool IsScheduled { get; private set; }

    public void Schedule(PowerAction action, int seconds, bool showFinalNotification = false)
    {
        Cancel();
        seconds = Math.Clamp(seconds, 15, 900);
        var cancellation = new CancellationTokenSource();
        lock (_gate)
        {
            _cancellation = cancellation;
            _scheduledAction = action;
            _showFinalNotification = showFinalNotification;
            _notificationShown = false;
            _actionCommitted = false;
            IsScheduled = true;
        }

        _ = RunAsync(action, seconds, showFinalNotification, cancellation.Token);
    }

    public void Cancel()
    {
        CancellationTokenSource? cancellation;
        lock (_gate)
        {
            if (_actionCommitted)
            {
                return;
            }

            cancellation = _cancellation;
            _cancellation = null;
            _scheduledAction = null;
            _showFinalNotification = false;
            _notificationShown = false;
            IsScheduled = false;
        }

        cancellation?.Cancel();
        cancellation?.Dispose();
        RemainingChanged?.Invoke(null);
    }

    public bool ExecuteNow()
    {
        CancellationTokenSource? cancellation;
        PowerAction action;
        bool showNotification;
        lock (_gate)
        {
            if (_cancellation is null || !_scheduledAction.HasValue || _actionCommitted)
            {
                return false;
            }

            cancellation = _cancellation;
            _cancellation = null;
            _actionCommitted = true;
            action = _scheduledAction.Value;
            showNotification = _showFinalNotification && !_notificationShown;
        }

        cancellation.Cancel();
        cancellation.Dispose();
        RemainingChanged?.Invoke(null);
        try
        {
            if (showNotification)
            {
                ActionStarting?.Invoke(action);
            }

            PowerActions.Execute(action);
            Completed?.Invoke();
        }
        catch (Exception exception)
        {
            Failed?.Invoke(exception);
        }
        finally
        {
            lock (_gate)
            {
                _scheduledAction = null;
                _showFinalNotification = false;
                _notificationShown = false;
                _actionCommitted = false;
                IsScheduled = false;
            }
        }

        return true;
    }

    public void Dispose() => Cancel();

    private async Task RunAsync(PowerAction action, int seconds, bool showFinalNotification, CancellationToken cancellationToken)
    {
        CancellationTokenSource? completedSource = null;
        try
        {
            for (var remaining = seconds; remaining > 0; remaining--)
            {
                RemainingChanged?.Invoke(remaining);
                await Task.Delay(1000, cancellationToken);
            }

            RemainingChanged?.Invoke(0);
            if (showFinalNotification && TryBeginFinalNotification(cancellationToken))
            {
                ActionStarting?.Invoke(action);
                await Task.Delay(TimeSpan.FromSeconds(5), cancellationToken);
            }

            lock (_gate)
            {
                if (_cancellation?.Token != cancellationToken || _actionCommitted)
                {
                    return;
                }

                _actionCommitted = true;
            }

            PowerActions.Execute(action);
            Completed?.Invoke();
        }
        catch (OperationCanceledException)
        {
        }
        catch (Exception exception)
        {
            Failed?.Invoke(exception);
        }
        finally
        {
            lock (_gate)
            {
                if (_cancellation?.Token == cancellationToken)
                {
                    completedSource = _cancellation;
                    _cancellation = null;
                    _scheduledAction = null;
                    _showFinalNotification = false;
                    _notificationShown = false;
                    _actionCommitted = false;
                    IsScheduled = false;
                }
            }

            completedSource?.Dispose();
        }
    }

    private bool TryBeginFinalNotification(CancellationToken cancellationToken)
    {
        lock (_gate)
        {
            if (_cancellation?.Token != cancellationToken || _actionCommitted || !_showFinalNotification || _notificationShown)
            {
                return false;
            }

            _notificationShown = true;
            return true;
        }
    }
}
