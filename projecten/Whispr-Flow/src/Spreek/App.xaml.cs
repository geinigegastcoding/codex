using System.Drawing;
using System.Threading;
using System.Windows;
using Spreek.Services;

namespace Spreek;

public partial class App : System.Windows.Application
{
    private Mutex? instanceMutex;
    private AppRuntime? runtime;
    private MainWindow? shell;
    private FlowBarWindow? flowBar;
    private System.Windows.Forms.NotifyIcon? trayIcon;

    public bool IsExiting { get; private set; }

    protected override async void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);
        instanceMutex = new Mutex(true, "Local\\Spreek.Desktop.Singleton", out var isFirstInstance);
        if (!isFirstInstance)
        {
            System.Windows.MessageBox.Show("Spreek is already running in the system tray.", "Spreek", MessageBoxButton.OK, MessageBoxImage.Information);
            Shutdown();
            return;
        }

        try
        {
            runtime = await AppRuntime.CreateAsync(Dispatcher);
            shell = new MainWindow(runtime);
            MainWindow = shell;
            flowBar = new FlowBarWindow(runtime);
            CreateTrayIcon();

            var configured = await runtime.HasApiKeyAsync();
            var background = e.Args.Any(argument => argument.Equals("--background", StringComparison.OrdinalIgnoreCase));
            if (!configured)
            {
                shell.Show();
                shell.ShowFirstRun();
            }
            else if (!background)
            {
                shell.Show();
            }

            if (runtime.Settings.ShowFlowBarWhenIdle)
            {
                flowBar.Show();
            }
        }
        catch (Exception error)
        {
            try
            {
                await new DiagnosticLog(AppPaths.ForCurrentUser()).WriteAsync("fatal", error.ToString());
            }
            catch
            {
            }

            System.Windows.MessageBox.Show(
                $"Spreek could not start.\n\n{error.Message}",
                "Spreek startup error",
                MessageBoxButton.OK,
                MessageBoxImage.Error);
            Shutdown(1);
        }
    }

    protected override void OnExit(ExitEventArgs e)
    {
        trayIcon?.Dispose();
        runtime?.Dispose();
        instanceMutex?.Dispose();
        base.OnExit(e);
    }

    private void CreateTrayIcon()
    {
        trayIcon = new System.Windows.Forms.NotifyIcon
        {
            Icon = SystemIcons.Application,
            Text = "Spreek - voice anywhere",
            Visible = true,
            ContextMenuStrip = new System.Windows.Forms.ContextMenuStrip(),
        };
        trayIcon.DoubleClick += (_, _) => Dispatcher.Invoke(ShowShell);
        trayIcon.ContextMenuStrip.Items.Add("Open Spreek", null, (_, _) => Dispatcher.Invoke(ShowShell));
        trayIcon.ContextMenuStrip.Items.Add(new System.Windows.Forms.ToolStripSeparator());
        trayIcon.ContextMenuStrip.Items.Add("Start / stop hands-free", null, (_, _) => RunFromTray(runtime!.Coordinator.ToggleHandsFreeAsync));
        trayIcon.ContextMenuStrip.Items.Add("Quick Note", null, (_, _) => RunFromTray(runtime!.Coordinator.QuickNoteAsync));
        trayIcon.ContextMenuStrip.Items.Add("Paste last", null, (_, _) => RunFromTray(runtime!.Coordinator.PasteLastAsync));
        trayIcon.ContextMenuStrip.Items.Add(new System.Windows.Forms.ToolStripSeparator());
        trayIcon.ContextMenuStrip.Items.Add("Exit", null, async (_, _) => await ExitAsync());
    }

    private void ShowShell()
    {
        if (shell is null)
        {
            return;
        }

        if (!shell.IsVisible)
        {
            shell.Show();
        }

        if (shell.WindowState == WindowState.Minimized)
        {
            shell.WindowState = WindowState.Normal;
        }

        shell.Activate();
    }

    private void RunFromTray(Func<Task> operation)
    {
        if (runtime is not null)
        {
            _ = runtime.RunUserOperationAsync(operation);
        }
    }

    private async Task ExitAsync()
    {
        if (IsExiting)
        {
            return;
        }

        IsExiting = true;
        if (runtime?.Coordinator.CurrentState is not (null or Core.DictationState.Idle))
        {
            await runtime.RunUserOperationAsync(runtime.Coordinator.CancelAsync);
        }

        if (trayIcon is not null)
        {
            trayIcon.Visible = false;
            trayIcon.Dispose();
            trayIcon = null;
        }

        flowBar?.CloseForExit();
        flowBar = null;
        shell?.RequestClose();
        shell = null;
        runtime?.Dispose();
        runtime = null;
        Shutdown();
    }
}
