using System.Threading;
using System.Windows;
using MessageBox = System.Windows.MessageBox;

namespace InsideySpeak;

public partial class App : System.Windows.Application
{
    private Mutex? _singleInstance;

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        _singleInstance = new Mutex(true, "InsideySpeak.SingleInstance", out var createdNew);
        if (!createdNew)
        {
            MessageBox.Show("Insidey Speak is already running.", "Insidey Speak", MessageBoxButton.OK, MessageBoxImage.Information);
            Shutdown();
            return;
        }

        MainWindow = new MainWindow();
        MainWindow.Show();
        if (e.Args.Any(argument => string.Equals(argument, "--background", StringComparison.OrdinalIgnoreCase)))
        {
            MainWindow.Hide();
        }
    }

    protected override void OnExit(ExitEventArgs e)
    {
        _singleInstance?.ReleaseMutex();
        _singleInstance?.Dispose();
        base.OnExit(e);
    }
}
