using System.ComponentModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using VibeKeepAlive.Models;
using VibeKeepAlive.ViewModels;

namespace VibeKeepAlive;

public partial class MainWindow : Window
{
    private readonly MainViewModel _viewModel;
    private bool _loadingSettings;
    private bool _allowClose;

    public MainWindow(MainViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        DataContext = viewModel;
        Loaded += (_, _) =>
        {
            ApplySettingsToControls();
            ShowPage("Overview");
        };
    }

    public void AllowClose() => _allowClose = true;

    private void TitleBar_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
    {
        if (e.ChangedButton == MouseButton.Left)
        {
            DragMove();
        }
    }

    private void Minimize_Click(object sender, RoutedEventArgs e) => WindowState = WindowState.Minimized;

    private void CloseToTray_Click(object sender, RoutedEventArgs e) => Hide();

    private void Nav_Click(object sender, RoutedEventArgs e)
    {
        if (sender is System.Windows.Controls.Button button && button.Tag is string page)
        {
            ShowPage(page);
        }
    }

    private void ShowPage(string page)
    {
        OverviewPanel.Visibility = page == "Overview" ? Visibility.Visible : Visibility.Collapsed;
        AgentsPanel.Visibility = page == "Agents" ? Visibility.Visible : Visibility.Collapsed;
        SettingsPanel.Visibility = page == "Settings" ? Visibility.Visible : Visibility.Collapsed;
        ActivityPanel.Visibility = page == "Activity" ? Visibility.Visible : Visibility.Collapsed;
        SetNavigationState(OverviewNav, page == "Overview");
        SetNavigationState(AgentsNav, page == "Agents");
        SetNavigationState(SettingsNav, page == "Settings");
        _viewModel.SetPage(page);
    }

    private void SetNavigationState(System.Windows.Controls.Button button, bool selected)
    {
        button.Background = selected ? (System.Windows.Media.Brush)FindResource("AccentSoftBrush") : System.Windows.Media.Brushes.Transparent;
        button.BorderBrush = selected ? (System.Windows.Media.Brush)FindResource("BorderBrush") : System.Windows.Media.Brushes.Transparent;
        button.Foreground = selected ? (System.Windows.Media.Brush)FindResource("TextBrush") : (System.Windows.Media.Brush)FindResource("MutedBrush");
    }

    private void OpenSettings_Click(object sender, RoutedEventArgs e) => ShowPage("Settings");

    private void OpenActivity_Click(object sender, RoutedEventArgs e) => ShowPage("Activity");

    private void MonitoringMenu_Click(object sender, RoutedEventArgs e)
    {
        if (sender is System.Windows.Controls.Button button && button.ContextMenu is ContextMenu menu)
        {
            menu.PlacementTarget = button;
            menu.IsOpen = true;
        }
    }

    private void Pause_Click(object sender, RoutedEventArgs e) => _viewModel.TogglePause();

    private void CancelAction_Click(object sender, RoutedEventArgs e) => _viewModel.CancelAction();

    private void ActionNow_Click(object sender, RoutedEventArgs e)
    {
        if (!_viewModel.CanExecuteActionNow)
        {
            return;
        }

        var result = System.Windows.MessageBox.Show(
            this,
            $"Start {_viewModel.NextActionLabel.ToLowerInvariant()} now? This cannot be undone once Windows begins the action.",
            "Confirm power action",
            MessageBoxButton.YesNo,
            MessageBoxImage.Warning);
        if (result == MessageBoxResult.Yes)
        {
            _viewModel.ExecuteActionNow();
        }
    }

    private void CompletionBehavior_Click(object sender, RoutedEventArgs e)
    {
        if (_loadingSettings || sender is not System.Windows.Controls.RadioButton radioButton || radioButton.Tag is not string choice)
        {
            return;
        }

        switch (choice)
        {
            case "Shutdown":
                _viewModel.Settings.PowerAction = PowerAction.Shutdown;
                _viewModel.Settings.ShutdownCountdownSeconds = 60;
                break;
            case "Sleep":
                _viewModel.Settings.PowerAction = PowerAction.Sleep;
                break;
            case "Delay":
                _viewModel.Settings.PowerAction = PowerAction.Shutdown;
                _viewModel.Settings.ShutdownCountdownSeconds = 600;
                break;
            default:
                return;
        }

        _loadingSettings = true;
        PowerActionComboBox.SelectedValue = _viewModel.Settings.PowerAction.ToString();
        CountdownComboBox.SelectedValue = _viewModel.Settings.ShutdownCountdownSeconds.ToString();
        _loadingSettings = false;
        _viewModel.SaveSettings(completionPolicyChanged: true);
    }

    private void AddAgent_Click(object sender, RoutedEventArgs e)
    {
        _viewModel.AddCustomAgent(NewAgentNameTextBox.Text, NewAgentProcessTextBox.Text);
        NewAgentNameTextBox.Clear();
        NewAgentProcessTextBox.Clear();
    }

    private void RemoveAgent_Click(object sender, RoutedEventArgs e)
    {
        if (sender is System.Windows.Controls.Button button && button.Tag is string agentId)
        {
            _viewModel.RemoveAgent(agentId);
        }
    }

    private void AgentEnabled_Click(object sender, RoutedEventArgs e)
    {
        if (sender is System.Windows.Controls.CheckBox checkBox && checkBox.Tag is string agentId)
        {
            _viewModel.SetAgentEnabled(agentId, checkBox.IsChecked == true);
        }
    }

    private void SettingSelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (_loadingSettings)
        {
            return;
        }

        if (PowerActionComboBox.SelectedValue is string powerAction && Enum.TryParse<PowerAction>(powerAction, out var action))
        {
            _viewModel.Settings.PowerAction = action;
        }

        if (GraceComboBox.SelectedValue is string grace && int.TryParse(grace, out var graceSeconds))
        {
            _viewModel.Settings.GracePeriodSeconds = graceSeconds;
        }

        if (CountdownComboBox.SelectedValue is string countdown && int.TryParse(countdown, out var countdownSeconds))
        {
            _viewModel.Settings.ShutdownCountdownSeconds = countdownSeconds;
        }

        _viewModel.SaveSettings(completionPolicyChanged: true);
    }

    private void SettingChanged(object sender, RoutedEventArgs e)
    {
        if (_loadingSettings)
        {
            return;
        }

        _viewModel.Settings.KeepAwakeOnAc = KeepAwakeAcCheckBox.IsChecked == true;
        _viewModel.Settings.KeepAwakeOnBattery = KeepAwakeBatteryCheckBox.IsChecked == true;
        _viewModel.Settings.KeepLidClosed = KeepLidClosedCheckBox.IsChecked == true;
        _viewModel.Settings.ShutdownOnlyOnAc = ShutdownOnlyOnAcCheckBox.IsChecked == true;
        _viewModel.Settings.ShowFinalNotificationBeforeAction = FinalNotificationCheckBox.IsChecked == true;
        _viewModel.Settings.StartWithWindows = StartupCheckBox.IsChecked == true;
        _viewModel.SaveSettings();
    }

    private void SettingTextChanged(object sender, TextChangedEventArgs e)
    {
        if (_loadingSettings || !int.TryParse(BatteryGuardTextBox.Text, out var threshold))
        {
            return;
        }

        _viewModel.Settings.MinimumBatteryPercent = threshold;
        _viewModel.SaveSettings();
    }

    private void ApplySettingsToControls()
    {
        _loadingSettings = true;
        PowerActionComboBox.SelectedValue = _viewModel.Settings.PowerAction.ToString();
        GraceComboBox.SelectedValue = _viewModel.Settings.GracePeriodSeconds.ToString();
        CountdownComboBox.SelectedValue = _viewModel.Settings.ShutdownCountdownSeconds.ToString();
        KeepAwakeAcCheckBox.IsChecked = _viewModel.Settings.KeepAwakeOnAc;
        KeepAwakeBatteryCheckBox.IsChecked = _viewModel.Settings.KeepAwakeOnBattery;
        KeepLidClosedCheckBox.IsChecked = _viewModel.Settings.KeepLidClosed;
        ShutdownOnlyOnAcCheckBox.IsChecked = _viewModel.Settings.ShutdownOnlyOnAc;
        FinalNotificationCheckBox.IsChecked = _viewModel.Settings.ShowFinalNotificationBeforeAction;
        BatteryGuardTextBox.Text = _viewModel.Settings.MinimumBatteryPercent.ToString();
        StartupCheckBox.IsChecked = _viewModel.Settings.StartWithWindows;
        _loadingSettings = false;
    }

    protected override void OnClosing(CancelEventArgs e)
    {
        if (!_allowClose)
        {
            e.Cancel = true;
            Hide();
        }

        base.OnClosing(e);
    }
}
