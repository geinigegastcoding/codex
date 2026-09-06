using System.Globalization;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Interop;
using System.Windows.Media;
using Spreek.Core;
using Brush = System.Windows.Media.Brush;

namespace Spreek;

public partial class FlowBarWindow : Window
{
    private const int ExtendedStyleIndex = -20;
    private const long ToolWindowStyle = 0x00000080L;
    private const long NoActivateStyle = 0x08000000L;
    private readonly AppRuntime runtime;
    private DictationSnapshot snapshot = DictationSnapshot.Idle;

    public FlowBarWindow(AppRuntime runtime)
    {
        this.runtime = runtime;
        InitializeComponent();
        runtime.Coordinator.SnapshotChanged += OnSnapshotChanged;
        runtime.DataChanged += OnRuntimeDataChanged;
    }

    public void CloseForExit()
    {
        runtime.Coordinator.SnapshotChanged -= OnSnapshotChanged;
        runtime.DataChanged -= OnRuntimeDataChanged;
        Close();
    }

    private void OnSourceInitialized(object? sender, EventArgs e)
    {
        var handle = new WindowInteropHelper(this).Handle;
        var style = GetWindowLongPtr(handle, ExtendedStyleIndex).ToInt64();
        _ = SetWindowLongPtr(handle, ExtendedStyleIndex, new nint(style | ToolWindowStyle | NoActivateStyle));
    }

    private void OnLoaded(object sender, RoutedEventArgs e)
    {
        Update(snapshot);
        Position();
    }

    private void OnSnapshotChanged(object? sender, DictationSnapshot next) =>
        _ = Dispatcher.BeginInvoke(() => Update(next));

    private void OnRuntimeDataChanged(object? sender, EventArgs e) =>
        _ = Dispatcher.BeginInvoke(() => Update(snapshot));

    private void Update(DictationSnapshot next)
    {
        snapshot = next;
        var active = next.State is not (DictationState.Idle or DictationState.RecoverableError or DictationState.FatalError);
        var error = next.State is DictationState.RecoverableError or DictationState.FatalError;
        Width = active || error ? 560 : 420;
        Height = active || error ? 82 : 58;
        Shell.CornerRadius = new CornerRadius(active || error ? 22 : 24);
        StatusText.Text = next.Message;
        ElapsedText.Text = active ? next.Elapsed.ToString("m\\:ss", CultureInfo.InvariantCulture) : string.Empty;
        InterimText.Text = !string.IsNullOrWhiteSpace(next.InterimText)
            ? next.InterimText
            : active
                ? "Speak naturally - release when finished"
                : error
                    ? "Your words are safe locally"
                    : $"Hold {runtime.Settings.PushToTalkShortcut} to dictate";

        var stateBrush = (Brush)FindResource(error ? "DangerBrush" : active ? "AccentBrush" : "SuccessBrush");
        StateDot.Fill = stateBrush;
        StateRing.Stroke = stateBrush;
        foreach (var bar in new[] { Level1, Level2, Level3, Level4, Level5 })
        {
            bar.Background = stateBrush;
        }

        SetLevels(next.Level, active);
        RetryButton.Visibility = next.CanRetry && runtime.Coordinator.LastRetryableId.HasValue ? Visibility.Visible : Visibility.Collapsed;
        CopyButton.Visibility = error ? Visibility.Visible : Visibility.Collapsed;
        StopButton.Visibility = active && runtime.Coordinator.IsHandsFree ? Visibility.Visible : Visibility.Collapsed;
        CancelButton.Visibility = active ? Visibility.Visible : Visibility.Collapsed;
        ActionPanel.Visibility = RetryButton.Visibility == Visibility.Visible ||
                                 CopyButton.Visibility == Visibility.Visible ||
                                 StopButton.Visibility == Visibility.Visible ||
                                 CancelButton.Visibility == Visibility.Visible
            ? Visibility.Visible
            : Visibility.Collapsed;
        Position();

        if (next.State == DictationState.Idle && !runtime.Settings.ShowFlowBarWhenIdle)
        {
            Hide();
        }
        else if (!IsVisible)
        {
            Show();
        }
    }

    private void SetLevels(double level, bool active)
    {
        var baseLevel = active ? Math.Max(level, 0.05) : 0.02;
        var factors = new[] { 0.48, 0.78, 1.0, 0.72, 0.42 };
        var bars = new[] { Level1, Level2, Level3, Level4, Level5 };
        for (var index = 0; index < bars.Length; index++)
        {
            bars[index].Height = Math.Clamp(5 + baseLevel * 27 * factors[index], 5, 30);
        }
    }

    private void Position()
    {
        var workArea = SystemParameters.WorkArea;
        Left = workArea.Left + (workArea.Width - Width) / 2;
        Top = workArea.Bottom - Height - 26;
    }

    private async void OnStop(object sender, RoutedEventArgs e) =>
        await runtime.RunUserOperationAsync(runtime.Coordinator.ToggleHandsFreeAsync);

    private async void OnCancel(object sender, RoutedEventArgs e) =>
        await runtime.RunUserOperationAsync(runtime.Coordinator.CancelAsync);

    private async void OnRetry(object sender, RoutedEventArgs e)
    {
        if (runtime.Coordinator.LastRetryableId is { } id)
        {
            await runtime.RunUserOperationAsync(() => runtime.Coordinator.RetryAsync(id));
        }
    }

    private async void OnCopy(object sender, RoutedEventArgs e) =>
        await runtime.RunUserOperationAsync(runtime.CopyLastAsync);

    private static nint GetWindowLongPtr(nint window, int index) => IntPtr.Size == 8
        ? GetWindowLongPtr64(window, index)
        : new nint(GetWindowLong32(window, index));

    private static nint SetWindowLongPtr(nint window, int index, nint value) => IntPtr.Size == 8
        ? SetWindowLongPtr64(window, index, value)
        : new nint(SetWindowLong32(window, index, value.ToInt32()));

    [DllImport("user32.dll", EntryPoint = "GetWindowLong")]
    private static extern int GetWindowLong32(nint window, int index);

    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtr")]
    private static extern nint GetWindowLongPtr64(nint window, int index);

    [DllImport("user32.dll", EntryPoint = "SetWindowLong")]
    private static extern int SetWindowLong32(nint window, int index, int value);

    [DllImport("user32.dll", EntryPoint = "SetWindowLongPtr")]
    private static extern nint SetWindowLongPtr64(nint window, int index, nint value);
}
