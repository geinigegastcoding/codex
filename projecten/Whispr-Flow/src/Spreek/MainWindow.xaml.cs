using System.ComponentModel;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;
using System.Windows.Threading;
using System.Windows.Interop;
using Spreek.Core;
using Brush = System.Windows.Media.Brush;
using Brushes = System.Windows.Media.Brushes;
using Button = System.Windows.Controls.Button;
using MessageBox = System.Windows.MessageBox;
using OpenFileDialog = Microsoft.Win32.OpenFileDialog;
using SaveFileDialog = Microsoft.Win32.SaveFileDialog;

namespace Spreek;

public partial class MainWindow : Window
{
    private const int UseImmersiveDarkMode = 20;
    private readonly AppRuntime runtime;
    private readonly DispatcherTimer toastTimer;
    private ICollectionView? historyView;
    private ICollectionView? dictionaryView;
    private ICollectionView? snippetView;
    private bool allowClose;

    public MainWindow(AppRuntime runtime)
    {
        this.runtime = runtime;
        InitializeComponent();
        toastTimer = new DispatcherTimer(TimeSpan.FromSeconds(4), DispatcherPriority.Background, OnToastTimer, Dispatcher);
        runtime.DataChanged += OnRuntimeDataChanged;
        runtime.Notice += OnRuntimeNotice;
        runtime.Coordinator.SnapshotChanged += OnCoordinatorSnapshotChanged;
    }

    public void ShowFirstRun()
    {
        Navigate("Settings");
        ApiSettingsCard.BorderBrush = (Brush)FindResource("AccentBrush");
        ApiSettingsCard.BorderThickness = new Thickness(2);
        ApiStatusText.Text = "Paste your Deepgram key, test Nova-3, then save settings.";
        ApiKeyBox.Focus();
    }

    public void RequestClose()
    {
        allowClose = true;
        Close();
    }

    private void OnSourceInitialized(object? sender, EventArgs e)
    {
        var enabled = 1;
        _ = DwmSetWindowAttribute(new WindowInteropHelper(this).Handle, UseImmersiveDarkMode, ref enabled, sizeof(int));
    }

    private async void OnLoaded(object sender, RoutedEventArgs e)
    {
        historyView = CollectionViewSource.GetDefaultView(runtime.History);
        historyView.Filter = FilterHistory;
        HistoryGrid.ItemsSource = historyView;
        dictionaryView = CollectionViewSource.GetDefaultView(runtime.Dictionary);
        dictionaryView.Filter = FilterDictionary;
        DictionaryList.ItemsSource = dictionaryView;
        snippetView = CollectionViewSource.GetDefaultView(runtime.Snippets);
        snippetView.Filter = FilterSnippet;
        SnippetList.ItemsSource = snippetView;
        PopulateSettings();
        RefreshMicrophones();
        RefreshAll();
        Navigate("Home");

        if (await runtime.HasApiKeyAsync())
        {
            ApiStatusText.Text = "Encrypted key saved. Leave this field blank to keep it.";
        }
    }

    private void OnClosing(object? sender, CancelEventArgs e)
    {
        if (!allowClose)
        {
            e.Cancel = true;
            Hide();
            ShowToast("Spreek is still running in the system tray.");
            return;
        }

        runtime.DataChanged -= OnRuntimeDataChanged;
        runtime.Notice -= OnRuntimeNotice;
        runtime.Coordinator.SnapshotChanged -= OnCoordinatorSnapshotChanged;
    }

    private void OnNavigate(object sender, RoutedEventArgs e)
    {
        if (sender is Button { Tag: string page })
        {
            Navigate(page);
        }
    }

    private void Navigate(string page)
    {
        HomePage.Visibility = page == "Home" ? Visibility.Visible : Visibility.Collapsed;
        HistoryPage.Visibility = page == "History" ? Visibility.Visible : Visibility.Collapsed;
        DictionaryPage.Visibility = page == "Dictionary" ? Visibility.Visible : Visibility.Collapsed;
        SnippetsPage.Visibility = page == "Snippets" ? Visibility.Visible : Visibility.Collapsed;
        SettingsPage.Visibility = page == "Settings" ? Visibility.Visible : Visibility.Collapsed;

        var selectedBrush = (Brush)FindResource("AccentDarkBrush");
        var selectedBorder = (Brush)FindResource("AccentBrush");
        foreach (var button in new[] { HomeNavButton, HistoryNavButton, DictionaryNavButton, SnippetsNavButton, SettingsNavButton })
        {
            var selected = Equals(button.Tag, page);
            button.Background = selected ? selectedBrush : Brushes.Transparent;
            button.BorderBrush = selected ? selectedBorder : Brushes.Transparent;
        }

        if (page == "Settings")
        {
            PopulateSettings();
            RefreshMicrophones();
        }

        RefreshAll();
    }

    private async void OnHomeRecord(object sender, RoutedEventArgs e)
    {
        if (runtime.Coordinator.CurrentState == DictationState.Idle)
        {
            Hide();
            await Task.Delay(180);
        }

        await ExecuteAsync(runtime.Coordinator.ToggleHandsFreeAsync, null);
    }

    private void OnOpenHistory(object sender, RoutedEventArgs e) => Navigate("History");

    private void OnHistoryFilterChanged(object sender, EventArgs e)
    {
        historyView?.Refresh();
        RefreshEmptyStates();
    }

    private bool FilterHistory(object item)
    {
        if (item is not HistoryEntry entry)
        {
            return false;
        }

        var query = HistorySearchBox?.Text?.Trim();
        if (!string.IsNullOrWhiteSpace(query) &&
            !entry.Text.Contains(query, StringComparison.CurrentCultureIgnoreCase) &&
            !entry.TargetProcess.Contains(query, StringComparison.CurrentCultureIgnoreCase))
        {
            return false;
        }

        var tag = (HistoryStatusCombo?.SelectedItem as ComboBoxItem)?.Tag?.ToString() ?? "All";
        return tag switch
        {
            "Completed" => entry.Status == TranscriptStatus.Completed,
            "Copied" => entry.Status == TranscriptStatus.Copied,
            "NeedsRetry" => entry.Status == TranscriptStatus.NeedsRetry,
            "QuickNote" => entry.IsQuickNote,
            _ => true,
        };
    }

    private void OnHistorySelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (HistoryGrid.SelectedItem is not HistoryEntry entry)
        {
            HistoryDetailCard.Visibility = Visibility.Collapsed;
            return;
        }

        HistoryDetailCard.Visibility = Visibility.Visible;
        HistoryEditor.Text = entry.Text;
        HistoryRetryButton.IsEnabled = entry.Status == TranscriptStatus.NeedsRetry &&
                                       entry.AudioPath is { Length: > 0 } &&
                                       File.Exists(entry.AudioPath);
    }

    private async void OnCopyHistory(object sender, RoutedEventArgs e)
    {
        if (HistoryGrid.SelectedItem is not HistoryEntry entry || string.IsNullOrWhiteSpace(entry.Text))
        {
            ShowToast("Select a completed transcript first.");
            return;
        }

        await ExecuteAsync(
            () => runtime.Insertion.CopyAsync(entry.Text, CancellationToken.None),
            "Transcript copied.");
    }

    private async void OnSaveHistoryEdit(object sender, RoutedEventArgs e)
    {
        if (HistoryGrid.SelectedItem is not HistoryEntry entry)
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(HistoryEditor.Text))
        {
            ShowToast("A saved transcript cannot be empty.");
            return;
        }

        if (await ExecuteAsync(() => runtime.UpdateHistoryTextAsync(entry, HistoryEditor.Text), "Transcript updated."))
        {
            historyView?.Refresh();
        }
    }

    private async void OnRetryHistory(object sender, RoutedEventArgs e)
    {
        if (HistoryGrid.SelectedItem is HistoryEntry entry)
        {
            await ExecuteAsync(() => runtime.Coordinator.RetryAsync(entry.Id), null);
        }
    }

    private async void OnDeleteHistory(object sender, RoutedEventArgs e)
    {
        if (HistoryGrid.SelectedItem is not HistoryEntry entry ||
            MessageBox.Show(this, "Delete this transcript and its recovery audio?", "Delete transcript", MessageBoxButton.YesNo, MessageBoxImage.Warning) != MessageBoxResult.Yes)
        {
            return;
        }

        if (await ExecuteAsync(() => runtime.DeleteHistoryAsync(entry), "Transcript deleted."))
        {
            HistoryDetailCard.Visibility = Visibility.Collapsed;
            RefreshAll();
        }
    }

    private async void OnExportHistory(object sender, RoutedEventArgs e)
    {
        var dialog = new SaveFileDialog
        {
            Title = "Export Spreek history",
            Filter = "Markdown file (*.md)|*.md",
            FileName = $"spreek-history-{DateTime.Now:yyyy-MM-dd}.md",
        };
        if (dialog.ShowDialog(this) == true)
        {
            await ExecuteAsync(() => runtime.ExportHistoryAsync(dialog.FileName), "History exported.");
        }
    }

    private void OnDictionaryFilterChanged(object sender, TextChangedEventArgs e)
    {
        dictionaryView?.Refresh();
        RefreshEmptyStates();
    }

    private bool FilterDictionary(object item)
    {
        if (item is not DictionaryEntry entry)
        {
            return false;
        }

        var query = DictionarySearchBox?.Text?.Trim();
        return string.IsNullOrWhiteSpace(query) ||
               entry.Term.Contains(query, StringComparison.CurrentCultureIgnoreCase) ||
               entry.HeardAs?.Contains(query, StringComparison.CurrentCultureIgnoreCase) == true;
    }

    private void OnDictionarySelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (DictionaryList.SelectedItem is not DictionaryEntry entry)
        {
            return;
        }

        DictionaryEditorTitle.Text = "Edit word";
        DictionaryTermBox.Text = entry.Term;
        DictionaryHeardAsBox.Text = entry.HeardAs ?? string.Empty;
        DictionaryStarBox.IsChecked = entry.Starred;
        DictionaryDeleteButton.IsEnabled = true;
        DictionaryStatusText.Text = string.Empty;
    }

    private void OnNewDictionary(object sender, RoutedEventArgs e)
    {
        DictionaryList.SelectedItem = null;
        DictionaryEditorTitle.Text = "Add a word";
        DictionaryTermBox.Clear();
        DictionaryHeardAsBox.Clear();
        DictionaryStarBox.IsChecked = false;
        DictionaryDeleteButton.IsEnabled = false;
        DictionaryStatusText.Text = string.Empty;
        DictionaryTermBox.Focus();
    }

    private async void OnSaveDictionary(object sender, RoutedEventArgs e)
    {
        var selected = DictionaryList.SelectedItem as DictionaryEntry;
        var success = await ExecuteAsync(
            () => runtime.AddOrUpdateDictionaryAsync(selected?.Id, DictionaryTermBox.Text, DictionaryHeardAsBox.Text, DictionaryStarBox.IsChecked == true),
            selected is null ? "Word added." : "Word updated.");
        if (success)
        {
            DictionaryStatusText.Text = "Saved. Nova-3 will use it on the next recording.";
            OnNewDictionary(sender, e);
            RefreshAll();
        }
    }

    private async void OnDeleteDictionary(object sender, RoutedEventArgs e)
    {
        if (DictionaryList.SelectedItem is DictionaryEntry entry &&
            await ExecuteAsync(() => runtime.DeleteDictionaryAsync(entry), "Word deleted."))
        {
            OnNewDictionary(sender, e);
            RefreshAll();
        }
    }

    private async void OnImportDictionary(object sender, RoutedEventArgs e)
    {
        var dialog = new OpenFileDialog { Title = "Import Spreek dictionary", Filter = "CSV file (*.csv)|*.csv" };
        if (dialog.ShowDialog(this) != true)
        {
            return;
        }

        ImportResult<DictionaryEntry>? result = null;
        if (await ExecuteAsync(async () => result = await runtime.ImportDictionaryAsync(dialog.FileName), null) && result is { } imported)
        {
            var suffix = imported.Issues.Count == 0 ? string.Empty : $" {imported.Issues.Count} row(s) skipped.";
            ShowToast($"Imported {imported.Items.Count} word(s).{suffix}");
            RefreshAll();
        }
    }

    private async void OnExportDictionary(object sender, RoutedEventArgs e)
    {
        var dialog = new SaveFileDialog { Title = "Export Spreek dictionary", Filter = "CSV file (*.csv)|*.csv", FileName = "spreek-dictionary.csv" };
        if (dialog.ShowDialog(this) == true)
        {
            await ExecuteAsync(() => runtime.ExportDictionaryAsync(dialog.FileName), "Dictionary exported.");
        }
    }

    private void OnSnippetFilterChanged(object sender, TextChangedEventArgs e)
    {
        snippetView?.Refresh();
        RefreshEmptyStates();
    }

    private bool FilterSnippet(object item)
    {
        if (item is not SnippetEntry entry)
        {
            return false;
        }

        var query = SnippetSearchBox?.Text?.Trim();
        return string.IsNullOrWhiteSpace(query) ||
               entry.Name.Contains(query, StringComparison.CurrentCultureIgnoreCase) ||
               entry.Text.Contains(query, StringComparison.CurrentCultureIgnoreCase);
    }

    private void OnSnippetSelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (SnippetList.SelectedItem is not SnippetEntry entry)
        {
            return;
        }

        SnippetEditorTitle.Text = "Edit snippet";
        SnippetNameBox.Text = entry.Name;
        SnippetTextBox.Text = entry.Text;
        SnippetDeleteButton.IsEnabled = true;
        SnippetStatusText.Text = string.Empty;
    }

    private void OnNewSnippet(object sender, RoutedEventArgs e)
    {
        SnippetList.SelectedItem = null;
        SnippetEditorTitle.Text = "Add a snippet";
        SnippetNameBox.Clear();
        SnippetTextBox.Clear();
        SnippetDeleteButton.IsEnabled = false;
        SnippetStatusText.Text = string.Empty;
        SnippetNameBox.Focus();
    }

    private async void OnSaveSnippet(object sender, RoutedEventArgs e)
    {
        var selected = SnippetList.SelectedItem as SnippetEntry;
        var success = await ExecuteAsync(
            () => runtime.AddOrUpdateSnippetAsync(selected?.Id, SnippetNameBox.Text, SnippetTextBox.Text),
            selected is null ? "Snippet added." : "Snippet updated.");
        if (success)
        {
            SnippetStatusText.Text = "Saved. Speak the trigger exactly as written.";
            OnNewSnippet(sender, e);
            RefreshAll();
        }
    }

    private async void OnDeleteSnippet(object sender, RoutedEventArgs e)
    {
        if (SnippetList.SelectedItem is SnippetEntry entry &&
            await ExecuteAsync(() => runtime.DeleteSnippetAsync(entry), "Snippet deleted."))
        {
            OnNewSnippet(sender, e);
            RefreshAll();
        }
    }

    private async void OnImportSnippets(object sender, RoutedEventArgs e)
    {
        var dialog = new OpenFileDialog { Title = "Import Spreek snippets", Filter = "JSON file (*.json)|*.json" };
        if (dialog.ShowDialog(this) != true)
        {
            return;
        }

        ImportResult<SnippetEntry>? result = null;
        if (await ExecuteAsync(async () => result = await runtime.ImportSnippetsAsync(dialog.FileName), null) && result is { } imported)
        {
            var suffix = imported.Issues.Count == 0 ? string.Empty : $" {imported.Issues.Count} item(s) skipped.";
            ShowToast($"Imported {imported.Items.Count} snippet(s).{suffix}");
            RefreshAll();
        }
    }

    private async void OnExportSnippets(object sender, RoutedEventArgs e)
    {
        var dialog = new SaveFileDialog { Title = "Export Spreek snippets", Filter = "JSON file (*.json)|*.json", FileName = "spreek-snippets.json" };
        if (dialog.ShowDialog(this) == true)
        {
            await ExecuteAsync(() => runtime.ExportSnippetsAsync(dialog.FileName), "Snippets exported.");
        }
    }

    private async void OnTestApiKey(object sender, RoutedEventArgs e)
    {
        ApiStatusText.Text = "Testing Nova-3...";
        var result = await runtime.TestApiKeyAsync(ApiKeyBox.Password);
        ApiStatusText.Text = result.Message;
        ApiStatusText.Foreground = (Brush)FindResource(result.Success ? "SuccessBrush" : "DangerBrush");
    }

    private async void OnSaveSettings(object sender, RoutedEventArgs e)
    {
        try
        {
            ReadSettingsControls();
        }
        catch (Exception error)
        {
            SettingsStatusText.Text = error.Message;
            SettingsStatusText.Foreground = (Brush)FindResource("DangerBrush");
            return;
        }

        if (await ExecuteAsync(() => runtime.SaveSettingsAsync(ApiKeyBox.Password), "Settings saved."))
        {
            ApiKeyBox.Clear();
            SettingsStatusText.Text = "Saved. Shortcuts and privacy choices are active now.";
            SettingsStatusText.Foreground = (Brush)FindResource("SuccessBrush");
            ApiSettingsCard.BorderBrush = (Brush)FindResource("BorderBrush");
            ApiSettingsCard.BorderThickness = new Thickness(1);
            RefreshAll();
        }
    }

    private void OnRefreshMicrophones(object sender, RoutedEventArgs e) => RefreshMicrophones();

    private void RefreshMicrophones()
    {
        try
        {
            var devices = runtime.Microphones;
            MicrophoneCombo.ItemsSource = devices;
            MicrophoneCombo.SelectedValue = devices.Any(device => device.DeviceNumber == runtime.Settings.MicrophoneDeviceNumber)
                ? runtime.Settings.MicrophoneDeviceNumber
                : devices.FirstOrDefault()?.DeviceNumber;
            MicrophoneStatusText.Text = devices.Count == 0
                ? "Windows reports no recording devices."
                : $"{devices.Count} device(s) available.";
            MicrophoneStatusText.Foreground = (Brush)FindResource(devices.Count == 0 ? "DangerBrush" : "SuccessBrush");
        }
        catch (Exception error)
        {
            MicrophoneStatusText.Text = error.Message;
            MicrophoneStatusText.Foreground = (Brush)FindResource("DangerBrush");
        }
    }

    private void OnBrowseQuickNoteFolder(object sender, RoutedEventArgs e)
    {
        using var dialog = new System.Windows.Forms.FolderBrowserDialog
        {
            Description = "Choose where Spreek saves Quick Notes",
            SelectedPath = QuickNoteFolderBox.Text,
            ShowNewFolderButton = true,
        };
        if (dialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
        {
            QuickNoteFolderBox.Text = dialog.SelectedPath;
        }
    }

    private void OnOpenDataFolder(object sender, RoutedEventArgs e)
    {
        _ = Process.Start(new ProcessStartInfo(runtime.Paths.Root) { UseShellExecute = true });
    }

    private async void OnClearHistory(object sender, RoutedEventArgs e)
    {
        if (MessageBox.Show(this, "Delete all transcript history and all saved recovery audio?", "Clear Spreek history", MessageBoxButton.YesNo, MessageBoxImage.Warning) != MessageBoxResult.Yes)
        {
            return;
        }

        await ExecuteAsync(runtime.ClearHistoryAsync, "History and audio cleared.");
        RefreshAll();
    }

    private void PopulateSettings()
    {
        var settings = runtime.Settings;
        SelectByTag(RegionCombo, settings.RegionHost);
        SelectByTag(LanguageCombo, settings.Language.ToString());
        EndpointingBox.Text = settings.EndpointingMs.ToString(CultureInfo.InvariantCulture);
        PushShortcutBox.Text = settings.PushToTalkShortcut;
        HandsFreeShortcutBox.Text = settings.HandsFreeShortcut;
        PasteLastShortcutBox.Text = settings.PasteLastShortcut;
        QuickNoteShortcutBox.Text = settings.QuickNoteShortcut;
        SelectByTag(InsertionModeCombo, settings.InsertionMode.ToString());
        PressEnterCheckBox.IsChecked = settings.EnablePressEnterCommand;
        ShowFlowBarCheckBox.IsChecked = settings.ShowFlowBarWhenIdle;
        PrivacyOptOutCheckBox.IsChecked = settings.PrivacyOptOut;
        RetainAudioCheckBox.IsChecked = settings.RetainSuccessfulAudio;
        StartWithWindowsCheckBox.IsChecked = settings.StartWithWindows;
        QuickNoteFolderBox.Text = settings.QuickNoteFolder ?? string.Empty;
        DataFolderText.Text = runtime.Paths.Root;
    }

    private void ReadSettingsControls()
    {
        var settings = runtime.Settings;
        settings.RegionHost = SelectedTag(RegionCombo);
        settings.Language = Enum.Parse<LanguageMode>(SelectedTag(LanguageCombo));
        if (!int.TryParse(EndpointingBox.Text, NumberStyles.Integer, CultureInfo.InvariantCulture, out var endpointing))
        {
            throw new InvalidDataException("Endpointing must be a whole number of milliseconds.");
        }

        settings.EndpointingMs = endpointing;
        settings.MicrophoneDeviceNumber = MicrophoneCombo.SelectedValue is int deviceNumber ? deviceNumber : 0;
        settings.PushToTalkShortcut = PushShortcutBox.Text.Trim();
        settings.HandsFreeShortcut = HandsFreeShortcutBox.Text.Trim();
        settings.PasteLastShortcut = PasteLastShortcutBox.Text.Trim();
        settings.QuickNoteShortcut = QuickNoteShortcutBox.Text.Trim();
        settings.InsertionMode = Enum.Parse<InsertionMode>(SelectedTag(InsertionModeCombo));
        settings.EnablePressEnterCommand = PressEnterCheckBox.IsChecked == true;
        settings.ShowFlowBarWhenIdle = ShowFlowBarCheckBox.IsChecked == true;
        settings.PrivacyOptOut = PrivacyOptOutCheckBox.IsChecked == true;
        settings.RetainSuccessfulAudio = RetainAudioCheckBox.IsChecked == true;
        settings.StartWithWindows = StartWithWindowsCheckBox.IsChecked == true;
        settings.QuickNoteFolder = QuickNoteFolderBox.Text.Trim();
    }

    private static void SelectByTag(System.Windows.Controls.ComboBox comboBox, string tag)
    {
        comboBox.SelectedItem = comboBox.Items
            .OfType<ComboBoxItem>()
            .FirstOrDefault(item => string.Equals(item.Tag?.ToString(), tag, StringComparison.OrdinalIgnoreCase));
        if (comboBox.SelectedItem is null && comboBox.Items.Count > 0)
        {
            comboBox.SelectedIndex = 0;
        }
    }

    private static string SelectedTag(System.Windows.Controls.ComboBox comboBox) =>
        (comboBox.SelectedItem as ComboBoxItem)?.Tag?.ToString()
        ?? throw new InvalidDataException("Choose a value for every settings field.");

    private void OnRuntimeDataChanged(object? sender, EventArgs e) =>
        _ = Dispatcher.BeginInvoke(RefreshAll);

    private void OnRuntimeNotice(object? sender, string message) =>
        _ = Dispatcher.BeginInvoke(() => ShowToast(message));

    private void OnCoordinatorSnapshotChanged(object? sender, DictationSnapshot snapshot) =>
        _ = Dispatcher.BeginInvoke(() =>
        {
            var active = snapshot.State is not (DictationState.Idle or DictationState.RecoverableError or DictationState.FatalError);
            HomeConnectionText.Text = snapshot.Message;
            SidebarStatusText.Text = snapshot.Message;
            HomeStatusDot.Fill = (Brush)FindResource(snapshot.State == DictationState.RecoverableError ? "DangerBrush" : active ? "AccentBrush" : "SuccessBrush");
            SidebarStatusDot.Fill = HomeStatusDot.Fill;
            HomeRecordButton.Background = (Brush)FindResource(active ? "DangerBrush" : "AccentBrush");
            HomeRecordTitle.Text = active ? "STOP" : "START";
            HomeRecordSubtitle.Text = active ? snapshot.Elapsed.ToString("m\\:ss", CultureInfo.InvariantCulture) : "hands-free";
            if (snapshot.State is DictationState.RecoverableError or DictationState.FatalError)
            {
                ShowToast(snapshot.Message);
            }
        });

    private void RefreshAll()
    {
        historyView?.Refresh();
        dictionaryView?.Refresh();
        snippetView?.Refresh();
        var duration = TimeSpan.FromSeconds(runtime.TodayDurationSeconds);
        TodayDurationText.Text = duration.TotalHours >= 1
            ? $"{(int)duration.TotalHours}h {duration.Minutes:00}m"
            : $"{duration.Minutes}m {duration.Seconds:00}s";
        TodayCostText.Text = runtime.TodayEstimatedCost.ToString("$0.0000", CultureInfo.InvariantCulture);
        TodayCapturesText.Text = runtime.History.Count(entry => entry.CreatedAt.ToLocalTime().Date == DateTime.Today).ToString(CultureInfo.InvariantCulture);
        RecentTranscriptText.Text = runtime.History.FirstOrDefault(entry => !string.IsNullOrWhiteSpace(entry.Text))?.Text
                                    ?? "Your first transcript will appear here.";
        HomeMicText.Text = runtime.Microphones.Count > 0 ? "Microphone ready" : "No microphone detected";
        HomeHotkeyText.Text = runtime.HotkeysAvailable ? "Global shortcuts ready" : "Shortcuts unavailable - restart Spreek";
        HomePushShortcutText.Text = runtime.Settings.PushToTalkShortcut.ToUpperInvariant();
        SidebarShortcutText.Text = $"Hold {runtime.Settings.PushToTalkShortcut}";
        RefreshEmptyStates();
    }

    private void RefreshEmptyStates()
    {
        if (HistoryEmptyState is null || DictionaryEmptyState is null || SnippetEmptyState is null)
        {
            return;
        }

        HistoryEmptyState.Visibility = historyView is null || historyView.Cast<object>().Any() ? Visibility.Collapsed : Visibility.Visible;
        DictionaryEmptyState.Visibility = dictionaryView is null || dictionaryView.Cast<object>().Any() ? Visibility.Collapsed : Visibility.Visible;
        SnippetEmptyState.Visibility = snippetView is null || snippetView.Cast<object>().Any() ? Visibility.Collapsed : Visibility.Visible;
    }

    private async Task<bool> ExecuteAsync(Func<Task> operation, string? successMessage)
    {
        var completed = false;
        await runtime.RunUserOperationAsync(async () =>
        {
            await operation();
            completed = true;
        });
        if (completed && !string.IsNullOrWhiteSpace(successMessage))
        {
            ShowToast(successMessage);
        }

        return completed;
    }

    private void ShowToast(string message)
    {
        ToastText.Text = message;
        Toast.Visibility = Visibility.Visible;
        toastTimer.Stop();
        toastTimer.Start();
    }

    private void OnToastTimer(object? sender, EventArgs e)
    {
        toastTimer.Stop();
        Toast.Visibility = Visibility.Collapsed;
    }

    [DllImport("dwmapi.dll")]
    private static extern int DwmSetWindowAttribute(nint window, int attribute, ref int value, int valueSize);
}
