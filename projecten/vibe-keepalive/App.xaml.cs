using Forms = System.Windows.Forms;
using System.Drawing;
using System.Windows;
using VibeKeepAlive.Models;
using VibeKeepAlive.Services;
using VibeKeepAlive.ViewModels;

namespace VibeKeepAlive;

public partial class App : System.Windows.Application
{
    private SettingsStore? _settingsStore;
    private AgentMonitor? _monitor;
    private MainViewModel? _viewModel;
    private MainWindow? _window;
    private Forms.NotifyIcon? _trayIcon;
    private Forms.ToolStripMenuItem? _cancelActionMenuItem;
    private Mutex? _instanceMutex;

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        _instanceMutex = new Mutex(true, "VibeKeepAlive.SingleInstance", out var createdNew);
        if (!createdNew)
        {
            _instanceMutex.Dispose();
            _instanceMutex = null;
            Shutdown();
            return;
        }

        CompletionPolicySelfCheck.Run();

        _settingsStore = new SettingsStore();
        var settings = _settingsStore.Load();
        _settingsStore.SetStartWithWindows(settings.StartWithWindows);
        var powerController = new PowerController();
        var scheduler = new ShutdownScheduler();
        _monitor = new AgentMonitor(settings, new ProcessInspector(), powerController, scheduler);
        _monitor.ScheduledActionStarting += OnScheduledActionStarting;
        _viewModel = new MainViewModel(settings, _settingsStore, _monitor, Dispatcher);
        _window = new MainWindow(_viewModel);
        var startHidden = e.Args.Any(argument => string.Equals(argument, "--hidden", StringComparison.OrdinalIgnoreCase));
        if (!startHidden)
        {
            _window.Show();
        }

        _trayIcon = new Forms.NotifyIcon
        {
            Icon = SystemIcons.Application,
            Text = "Agentoff",
            Visible = true,
            ContextMenuStrip = BuildTrayMenu()
        };
        _trayIcon.DoubleClick += (_, _) => ShowDashboard();
        _monitor.SnapshotChanged += OnSnapshotChanged;
        _monitor.Start();
    }

    protected override void OnExit(ExitEventArgs e)
    {
        if (_monitor is not null)
        {
            _monitor.SnapshotChanged -= OnSnapshotChanged;
            _monitor.ScheduledActionStarting -= OnScheduledActionStarting;
        }

        _trayIcon?.Dispose();
        _viewModel?.Dispose();
        _instanceMutex?.Dispose();
        base.OnExit(e);
    }

    internal void ShowDashboard()
    {
        if (_window is null)
        {
            return;
        }

        _window.Show();
        _window.WindowState = WindowState.Normal;
        _window.Activate();
    }

    internal void ExitApplication()
    {
        _window?.AllowClose();
        Shutdown();
    }

    private Forms.ContextMenuStrip BuildTrayMenu()
    {
        var menu = new Forms.ContextMenuStrip();
        menu.Items.Add("Open dashboard", null, (_, _) => ShowDashboard());
        menu.Items.Add("Pause / resume automation", null, (_, _) => _viewModel?.TogglePause());
        _cancelActionMenuItem = new Forms.ToolStripMenuItem("Cancel scheduled action")
        {
            Enabled = false
        };
        _cancelActionMenuItem.Click += (_, _) =>
        {
            if (_viewModel?.CanCancelAction == true)
            {
                _viewModel.CancelAction();
            }
        };
        menu.Items.Add(_cancelActionMenuItem);
        menu.Items.Add(new Forms.ToolStripSeparator());
        menu.Items.Add("Exit Agentoff", null, (_, _) => ExitApplication());
        return menu;
    }

    private void OnScheduledActionStarting(PowerAction action)
    {
        Dispatcher.BeginInvoke(() => _trayIcon?.ShowBalloonTip(
            5000,
            "Agentoff",
            $"{ActionLabel(action)} begins in 5 seconds.",
            Forms.ToolTipIcon.Info));
    }

    private static string ActionLabel(PowerAction action) => action switch
    {
        PowerAction.Shutdown => "Shut down",
        PowerAction.Hibernate => "Hibernate",
        PowerAction.Sleep => "Sleep",
        PowerAction.Lock => "Lock",
        _ => "The power action"
    };

    private void OnSnapshotChanged(MonitorSnapshot snapshot)
    {
        Dispatcher.BeginInvoke(() =>
        {
            if (_trayIcon is not null)
            {
                _trayIcon.Text = $"Agentoff · {TrayStateLabel(snapshot.State)}";
            }

            if (_cancelActionMenuItem is not null)
            {
                _cancelActionMenuItem.Enabled = snapshot.State is MonitorState.Scheduled or MonitorState.GracePeriod;
                _cancelActionMenuItem.Text = snapshot.State == MonitorState.GracePeriod
                    ? "Cancel finish detection"
                    : "Cancel scheduled action";
            }
        });
    }

    private static string TrayStateLabel(MonitorState state) => state switch
    {
        MonitorState.Working => "Working",
        MonitorState.BatteryGuard => "Battery guard",
        MonitorState.GracePeriod => "Grace period",
        MonitorState.Scheduled => "Power action scheduled",
        MonitorState.Paused => "Paused",
        _ => "Ready"
    };
}
