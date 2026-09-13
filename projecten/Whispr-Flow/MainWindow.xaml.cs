using System.Diagnostics;
using System.ComponentModel;
using System.IO;
using System.Text.RegularExpressions;
using Microsoft.Win32;
using Forms = System.Windows.Forms;
using System.Windows;
using System.Windows.Interop;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;
using System.Windows.Threading;
using Rectangle = System.Windows.Shapes.Rectangle;
using Color = System.Windows.Media.Color;
using MessageBox = System.Windows.MessageBox;
using OpenFileDialog = Microsoft.Win32.OpenFileDialog;
using SaveFileDialog = Microsoft.Win32.SaveFileDialog;

namespace InsideySpeak;

public partial class MainWindow : Window
{
    private readonly SettingsStore _settingsStore = new();
    private readonly HistoryStore _historyStore = new();
    private readonly AudioPlayback _playback = new();
    private readonly StartupService _startupService = new();
    private readonly AudioRecorder _recorder = new();
    private readonly DeepgramClient _deepgram = new();
    private readonly GlobalHotkey _hotkey = new();
    private readonly DispatcherTimer _waveformTimer;
    private readonly Stopwatch _stopwatch = new();
    private readonly List<Rectangle> _waveformBars = new();
    private AppSettings _settings = new();
    private IReadOnlyList<SnippetEntry> _snippets = Array.Empty<SnippetEntry>();
    private IntPtr _pasteTarget;
    private IntPtr _lastExternalWindow;
    private DeepgramStreamingSession? _streaming;
    private CancellationTokenSource? _operationCts;
    private float _audioLevel;
    private double _wavePhase;
    private bool _isTranscribing;
    private bool _cancelRequested;
    private bool _quickNoteMode;
    private bool _allowClose;
    private Forms.NotifyIcon? _trayIcon;
    private HistoryEntry? _selectedHistoryEntry;

    public MainWindow()
    {
        InitializeComponent();
        InitializeTrayIcon();

        for (var i = 0; i < 24; i++)
        {
            var bar = new Rectangle
            {
                Width = 3,
                Height = 4,
                RadiusX = 1.5,
                RadiusY = 1.5,
                Fill = new SolidColorBrush(Color.FromRgb(116, 119, 255)),
                Margin = new Thickness(1, 0, 1, 0),
                VerticalAlignment = VerticalAlignment.Center,
                Opacity = 0.9
        };
        _waveformBars.Add(bar);
        Waveform.Children.Add(bar);
        }

        _waveformTimer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(70) };
        _waveformTimer.Tick += WaveformTimer_Tick;
        _recorder.LevelChanged += level => Dispatcher.BeginInvoke(() => _audioLevel = level);

        SourceInitialized += MainWindow_SourceInitialized;
        Loaded += MainWindow_Loaded;
        Deactivated += MainWindow_Deactivated;
        Closing += MainWindow_Closing;
        Closed += MainWindow_Closed;
    }

    private void MainWindow_Loaded(object sender, RoutedEventArgs e)
    {
        try
        {
            RefreshMicrophones();
            _settings = _settingsStore.Load();
            ApplySettings(_settings);
            RefreshHistory();
        }
        catch (Exception ex)
        {
            SetStatus($"Settings unavailable — {ex.Message}", true);
        }

        try
        {
            RefreshHistory();
        }
        catch (Exception ex)
        {
            SetStatus($"History unavailable — {ex.Message}", true);
        }

        UpdateTranscriptMeta();
        SetReadyState();
    }

    private void MainWindow_SourceInitialized(object? sender, EventArgs e)
    {
        try
        {
            _hotkey.Register(this);
            _hotkey.Pressed += Hotkey_Pressed;
            _hotkey.QuickNotePressed += Hotkey_QuickNotePressed;
            _hotkey.PasteLastPressed += Hotkey_PasteLastPressed;
        }
        catch (Exception ex)
        {
            SetStatus($"Shortcut unavailable — {ex.Message}", true);
        }
    }

    private void MainWindow_Closed(object? sender, EventArgs e)
    {
        _waveformTimer.Stop();
        _hotkey.Dispose();
        _recorder.PcmDataAvailable -= Recorder_PcmDataAvailable;
        _recorder.Dispose();
        _operationCts?.Cancel();
        _streaming?.DisposeAsync().AsTask().GetAwaiter().GetResult();
        _deepgram.Dispose();
        _playback.Dispose();
        if (_trayIcon is not null)
        {
            _trayIcon.Visible = false;
            _trayIcon.Dispose();
        }
    }

    private void InitializeTrayIcon()
    {
        _trayIcon = new Forms.NotifyIcon
        {
            Icon = System.Drawing.SystemIcons.Application,
            Text = "Insidey Speak",
            Visible = true
        };
        _trayIcon.DoubleClick += (_, _) => ShowFromTray();
        var menu = new Forms.ContextMenuStrip();
        var openItem = new Forms.ToolStripMenuItem("Open Insidey Speak");
        openItem.Click += (_, _) => ShowFromTray();
        var exitItem = new Forms.ToolStripMenuItem("Exit");
        exitItem.Click += (_, _) => ExitFromTray();
        menu.Items.Add(openItem);
        menu.Items.Add(new Forms.ToolStripSeparator());
        menu.Items.Add(exitItem);
        _trayIcon.ContextMenuStrip = menu;
    }

    private void ShowFromTray()
    {
        Show();
        if (WindowState == WindowState.Minimized)
        {
            WindowState = WindowState.Normal;
        }
        Activate();
    }

    private void ExitFromTray()
    {
        _allowClose = true;
        Close();
    }

    private void MainWindow_Closing(object? sender, CancelEventArgs e)
    {
        if (_allowClose)
        {
            return;
        }

        e.Cancel = true;
        Hide();
    }

    private void Hotkey_Pressed()
    {
        Dispatcher.BeginInvoke(ToggleRecording);
    }

    private void Hotkey_QuickNotePressed()
    {
        Dispatcher.BeginInvoke(() =>
        {
            if (_recorder.IsRecording || _isTranscribing)
            {
                return;
            }

            StartRecording(isQuickNote: true);
        });
    }

    private void Hotkey_PasteLastPressed()
    {
        Dispatcher.BeginInvoke(() => PasteLastTranscript());
    }

    private void MainWindow_Deactivated(object? sender, EventArgs e)
    {
        var foreground = NativeMethods.GetForegroundWindow();
        var ownHandle = new WindowInteropHelper(this).Handle;
        if (foreground != IntPtr.Zero && foreground != ownHandle)
        {
            _lastExternalWindow = foreground;
        }
    }

    private void ToggleRecording()
    {
        if (_isTranscribing)
        {
            return;
        }

        if (_recorder.IsRecording)
        {
            _ = FinishRecordingAsync();
        }
        else
        {
            StartRecording();
        }
    }

    private void StartRecording(bool isQuickNote = false)
    {
        try
        {
            _settings = ReadSettingsFromUi();
            _ = TranscriptCleaner.ParseDictionary(_settings.Dictionary);
            _ = SnippetParser.Parse(_settings.Snippets);
            if (string.IsNullOrWhiteSpace(_settings.ApiKey))
            {
                throw new InvalidOperationException("Add a Deepgram API key in the right panel before dictating.");
            }

            _pasteTarget = ResolvePasteTarget();
            if (_settings.AutoPaste && TextPaster.IsPasswordTarget(_pasteTarget))
            {
                throw new InvalidOperationException("Password fields are protected. Focus a normal text field before dictating.");
            }

            _cancelRequested = false;
            _quickNoteMode = isQuickNote;
            _streaming = _deepgram.CreateStreamingSession(_settings);
            _streaming.TranscriptUpdated += Streaming_TranscriptUpdated;
            _recorder.PcmDataAvailable += Recorder_PcmDataAvailable;
            _recorder.Start(_settings.MicrophoneDeviceNumber);
            _stopwatch.Restart();
            _audioLevel = 0;
            _waveformTimer.Start();
            SetRecordingState();
            _operationCts?.Dispose();
            _operationCts = new CancellationTokenSource();
            _ = ConnectStreamingAsync(_streaming, _operationCts.Token);
        }
        catch (Exception ex)
        {
            _recorder.PcmDataAvailable -= Recorder_PcmDataAvailable;
            if (_streaming is not null)
            {
                _streaming.TranscriptUpdated -= Streaming_TranscriptUpdated;
                _ = _streaming.DisposeAsync();
                _streaming = null;
            }
            SetStatus($"Could not start recording — {ex.Message}", true);
        }
    }

    private async Task FinishRecordingAsync()
    {
        _isTranscribing = true;
        SetTranscribingState();
        _waveformTimer.Stop();
        _stopwatch.Stop();
        _operationCts ??= new CancellationTokenSource();
        byte[]? audio = null;
        HistoryEntry? savedEntry = null;

        try
        {
            audio = await _recorder.StopAsync();
            _recorder.PcmDataAvailable -= Recorder_PcmDataAvailable;
            if (audio.Length < 1_600)
            {
                throw new InvalidOperationException("The recording was too short. Hold the shortcut while you speak.");
            }

            _settings = ReadSettingsFromUi();
            var rawTranscript = await StopStreamingAsync(_operationCts.Token);
            if (_cancelRequested)
            {
                throw new OperationCanceledException(_operationCts.Token);
            }
            if (string.IsNullOrWhiteSpace(rawTranscript))
            {
                rawTranscript = await _deepgram.TranscribeAsync(audio, _settings, _operationCts.Token);
            }

            var cleanResult = TranscriptCleaner.CleanForFlow(rawTranscript, _settings);
            var cleanedTranscript = cleanResult.Text;
            if (string.IsNullOrWhiteSpace(cleanedTranscript))
            {
                throw new InvalidOperationException("The cleaned transcript is empty. Try speaking a little longer.");
            }

            TranscriptBox.Text = cleanedTranscript;
            DocumentStatus.Text = "Saved just now";

            try
            {
                // Save before touching the foreground window so a paste failure never loses the transcript.
                savedEntry = _historyStore.Add(cleanedTranscript, isQuickNote: _quickNoteMode, audio: audio);
                RefreshHistory();
            }
            catch (Exception storageException)
            {
                TextPaster.CopyToClipboard(cleanedTranscript);
                SetStatus($"History unavailable — copied transcript instead ({storageException.Message})", true);
                return;
            }

            if (_quickNoteMode)
            {
                var notePath = QuickNoteStore.Save(cleanedTranscript);
                savedEntry.Status = "Quick note";
                _historyStore.Update(savedEntry);
                RefreshHistory();
                SetStatus($"Quick note saved — {System.IO.Path.GetFileName(notePath)}");
            }
            else if (_settings.AutoPaste)
            {
                await Task.Delay(120);
                var outcome = TextPaster.Paste(cleanedTranscript, _pasteTarget);
                if (outcome == PasteOutcome.Pasted && cleanResult.PressEnter)
                {
                    TextPaster.PressEnter();
                }
                savedEntry.Inserted = outcome == PasteOutcome.Pasted;
                savedEntry.Status = outcome == PasteOutcome.Pasted ? "Pasted" : "Copied";
                _historyStore.Update(savedEntry);
                RefreshHistory();
                SetStatus(DescribePasteOutcome(outcome, "Pasted into the active app", "Copied transcript to clipboard"));
            }
            else
            {
                savedEntry.Status = "Saved";
                _historyStore.Update(savedEntry);
                RefreshHistory();
                SetStatus("Transcript ready");
            }
        }
        catch (OperationCanceledException) when (_cancelRequested)
        {
            SetStatus("Dictation cancelled");
        }
        catch (Exception ex)
        {
            if (savedEntry is not null)
            {
                if (_quickNoteMode)
                {
                    SetStatus($"Quick note export failed — transcript remains saved ({ex.Message})", true);
                }
                else
                {
                    try
                    {
                        TextPaster.CopyToClipboard(savedEntry.Text);
                        savedEntry.Status = "Copied";
                        savedEntry.Inserted = false;
                        _historyStore.Update(savedEntry);
                        SetStatus($"Insertion failed — copied safely; transcript remains saved ({ex.Message})", true);
                    }
                    catch (Exception copyException)
                    {
                        SetStatus($"Insertion failed — transcript remains saved, but copy failed: {copyException.Message}", true);
                    }
                }
                RefreshHistory();
            }
            else if (audio is { Length: >= 1_600 } && !_cancelRequested)
            {
                try
                {
                    _historyStore.AddRecovery(audio, ex.Message);
                    RefreshHistory();
                    SetStatus("Transcription failed — the audio is saved for retry", true);
                }
                catch (Exception recoveryException)
                {
                    SetStatus($"Transcription failed — recovery could not be saved: {recoveryException.Message}", true);
                }
            }
            else
            {
                SetStatus($"Transcription failed — {ex.Message}", true);
            }
        }
        finally
        {
            _recorder.PcmDataAvailable -= Recorder_PcmDataAvailable;
            if (_streaming is not null)
            {
                _streaming.TranscriptUpdated -= Streaming_TranscriptUpdated;
            }
            _streaming = null;
            _operationCts?.Dispose();
            _operationCts = null;
            _quickNoteMode = false;
            _isTranscribing = false;
            SetReadyState();
        }
    }

    private async Task ConnectStreamingAsync(DeepgramStreamingSession streaming, CancellationToken cancellationToken)
    {
        try
        {
            await streaming.StartAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            await Dispatcher.InvokeAsync(() =>
            {
                if (ReferenceEquals(_streaming, streaming) && _recorder.IsRecording)
                {
                    PanelStatusDetail.Text = IsCredentialError(ex)
                        ? "Deepgram key rejected or expired — update it in Settings"
                        : "Live preview unavailable — final transcription will still run";
                    DocumentStatus.Text = IsCredentialError(ex)
                        ? "Deepgram API key was rejected or may be expired"
                        : $"Live preview unavailable — {ex.Message}";
                }
            });
        }
    }

    private async Task<string?> StopStreamingAsync(CancellationToken cancellationToken)
    {
        var streaming = _streaming;
        _streaming = null;
        if (streaming is null)
        {
            return null;
        }

        streaming.TranscriptUpdated -= Streaming_TranscriptUpdated;
        try
        {
            return await streaming.StopAsync(cancellationToken);
        }
        finally
        {
            await streaming.DisposeAsync();
        }
    }

    private void Recorder_PcmDataAvailable(byte[] pcm, int length)
    {
        _streaming?.SendAudio(pcm, length);
    }

    private void Streaming_TranscriptUpdated(string transcript)
    {
        Dispatcher.BeginInvoke(() =>
        {
            if (_recorder.IsRecording && !_isTranscribing)
            {
                TranscriptBox.Text = transcript;
                DocumentStatus.Text = "Live preview";
            }
        });
    }

    private IntPtr ResolvePasteTarget()
    {
        var ownHandle = new WindowInteropHelper(this).Handle;
        var candidate = _lastExternalWindow;
        if (candidate == IntPtr.Zero || candidate == ownHandle)
        {
            candidate = NativeMethods.GetForegroundWindow();
        }

        return candidate == ownHandle ? IntPtr.Zero : candidate;
    }

    private async Task CancelCurrentAsync()
    {
        _cancelRequested = true;
        _operationCts?.Cancel();
        if (!_recorder.IsRecording)
        {
            SetStatus("Cancelling...");
            return;
        }

        _waveformTimer.Stop();
        _stopwatch.Stop();
        try
        {
            _ = await _recorder.StopAsync();
            if (_streaming is not null)
            {
                _streaming.TranscriptUpdated -= Streaming_TranscriptUpdated;
                await _streaming.DisposeAsync();
                _streaming = null;
            }
            _recorder.PcmDataAvailable -= Recorder_PcmDataAvailable;
            _isTranscribing = false;
            SetReadyState();
            SetStatus("Dictation cancelled");
        }
        catch (Exception ex)
        {
            SetStatus($"Could not cancel dictation — {ex.Message}", true);
        }
    }

    private AppSettings ReadSettingsFromUi() => new()
    {
        ApiKey = ApiKeyBox.Password.Trim(),
        Dictionary = DictionaryBox.Text,
        Snippets = SnippetsBox.Text,
        AutoPaste = AutoPasteCheckBox.IsChecked == true,
        FilterFillers = FilterFillersCheckBox.IsChecked == true,
        SpokenPunctuation = SpokenPunctuationCheckBox.IsChecked == true,
        PressEnter = PressEnterCheckBox.IsChecked == true,
        Language = (LanguageBox.SelectedValue as string ?? LanguageBox.Text).Trim() is { Length: > 0 } language
            ? language
            : "en-US",
        MicrophoneDeviceNumber = MicrophoneBox.SelectedValue is int deviceNumber ? deviceNumber : 0,
        StartWithWindows = StartWithWindowsCheckBox.IsChecked == true
    };

    private void ApplySettings(AppSettings settings)
    {
        ApiKeyBox.Password = settings.ApiKey;
        DictionaryBox.Text = settings.Dictionary;
        SnippetsBox.Text = settings.Snippets;
        AutoPasteCheckBox.IsChecked = settings.AutoPaste;
        FilterFillersCheckBox.IsChecked = settings.FilterFillers;
        SpokenPunctuationCheckBox.IsChecked = settings.SpokenPunctuation;
        PressEnterCheckBox.IsChecked = settings.PressEnter;
        LanguageBox.SelectedValue = settings.Language;
        if (LanguageBox.SelectedIndex < 0)
        {
            LanguageBox.SelectedIndex = 0;
            LanguageBox.Text = settings.Language;
        }
        MicrophoneBox.SelectedValue = settings.MicrophoneDeviceNumber;
        if (MicrophoneBox.SelectedIndex < 0 && MicrophoneBox.Items.Count > 0)
        {
            MicrophoneBox.SelectedIndex = 0;
        }
        StartWithWindowsCheckBox.IsChecked = settings.StartWithWindows;
        RefreshSnippetSelector();
    }

    private void RefreshMicrophones()
    {
        MicrophoneBox.Items.Clear();
        var devices = AudioRecorder.GetDevices();
        foreach (var device in devices)
        {
            MicrophoneBox.Items.Add(new System.Windows.Controls.ComboBoxItem
            {
                Content = device.Name,
                Tag = device.Number
            });
        }

        if (devices.Count == 0)
        {
            MicrophoneBox.Items.Add(new System.Windows.Controls.ComboBoxItem
            {
                Content = "No microphone detected",
                Tag = -1,
                IsEnabled = false
            });
        }
    }

    private void RefreshSnippetSelector()
    {
        try
        {
            _snippets = SnippetParser.Parse(SnippetsBox.Text);
            SnippetSelector.ItemsSource = _snippets;
            if (_snippets.Count > 0)
            {
                SnippetSelector.SelectedIndex = 0;
            }
        }
        catch (Exception ex)
        {
            _snippets = Array.Empty<SnippetEntry>();
            SnippetSelector.ItemsSource = null;
            DocumentStatus.Text = $"Snippets need attention — {ex.Message}";
        }
    }

    private void SetReadyState()
    {
        RecordButton.IsEnabled = true;
        RecordButton.Content = "Start dictation";
        CancelButton.Visibility = Visibility.Collapsed;
        PanelStatusText.Text = "Ready to dictate";
        PanelStatusDetail.Text = "Press the shortcut or button";
        BarStateText.Text = "Ready to capture";
        BarMic.Background = new SolidColorBrush(Color.FromRgb(231, 231, 255));
        BarMicText.Foreground = new SolidColorBrush(Color.FromRgb(91, 92, 235));
        ListenCard.Background = new SolidColorBrush(Color.FromRgb(240, 240, 255));
    }

    private void SetRecordingState()
    {
        RecordButton.IsEnabled = true;
        RecordButton.Content = "Stop dictation";
        CancelButton.Visibility = Visibility.Visible;
        PanelStatusText.Text = "Listening now";
        PanelStatusDetail.Text = _quickNoteMode
            ? "Speak a thought — it will be saved as a note"
            : "Speak naturally — filler words are filtered";
        BarStateText.Text = _quickNoteMode ? "Listening for a quick note..." : "Listening...";
        BarMic.Background = new SolidColorBrush(Color.FromRgb(255, 224, 231));
        BarMicText.Foreground = new SolidColorBrush(Color.FromRgb(213, 76, 111));
        ListenCard.Background = new SolidColorBrush(Color.FromRgb(255, 241, 245));
        SetStatus("Listening...");
    }

    private void SetTranscribingState()
    {
        RecordButton.IsEnabled = false;
        RecordButton.Content = "Transcribing…";
        CancelButton.Visibility = Visibility.Visible;
        PanelStatusText.Text = "Cleaning your words";
        PanelStatusDetail.Text = "Deepgram is formatting the transcript";
        BarStateText.Text = "Transcribing...";
        SetStatus("Transcribing...");
    }

    private void SetStatus(string message, bool error = false)
    {
        DocumentStatus.Text = message;
        BarStateText.Text = message;
        var connectionError = error &&
            (message.Contains("Deepgram", StringComparison.OrdinalIgnoreCase) ||
             message.Contains("API key", StringComparison.OrdinalIgnoreCase) ||
             message.Contains("connection", StringComparison.OrdinalIgnoreCase));
        if (connectionError)
        {
            ConnectionText.Text = "Deepgram · check setup";
            ConnectionText.Foreground = new SolidColorBrush(Color.FromRgb(180, 64, 88));
        }
        else if (!error && ConnectionText.Text == "Deepgram · check setup")
        {
            ConnectionText.Text = string.IsNullOrWhiteSpace(_settings.ApiKey)
                ? "Deepgram · not tested"
                : "Deepgram · ready";
            ConnectionText.Foreground = new SolidColorBrush(Color.FromRgb(112, 125, 155));
        }
    }

    private void WaveformTimer_Tick(object? sender, EventArgs e)
    {
        var active = _recorder.IsRecording;
        var elapsed = _stopwatch.Elapsed;
        ElapsedText.Text = elapsed.ToString(@"mm\:ss");
        _wavePhase += 0.32;

        for (var i = 0; i < _waveformBars.Count; i++)
        {
            var wave = (Math.Sin(_wavePhase + i * 0.8) + 1) / 2;
            var height = active ? 6 + (24 * Math.Max(_audioLevel, 0.12) * (0.35 + wave * 0.65)) : 4;
            _waveformBars[i].Height = height;
            _waveformBars[i].Opacity = active ? 0.65 + wave * 0.35 : 0.35;
        }
    }

    private void TranscriptBox_TextChanged(object sender, System.Windows.Controls.TextChangedEventArgs e)
    {
        TranscriptPlaceholder.Visibility = string.IsNullOrWhiteSpace(TranscriptBox.Text) ? Visibility.Visible : Visibility.Collapsed;
        UpdateTranscriptMeta();
    }

    private void UpdateTranscriptMeta()
    {
        var words = Regex.Matches(TranscriptBox.Text, @"\b[\p{L}\p{N}']+\b").Count;
        WordCountText.Text = $"{words} {(words == 1 ? "word" : "words")}";
    }

    private void CopyButton_Click(object sender, RoutedEventArgs e)
    {
        if (string.IsNullOrWhiteSpace(TranscriptBox.Text))
        {
            SetStatus("Nothing to copy yet", true);
            return;
        }

        try
        {
            TextPaster.CopyToClipboard(TranscriptBox.Text);
            SetStatus("Copied to clipboard");
        }
        catch (Exception ex)
        {
            SetStatus($"Copy failed — {ex.Message}", true);
        }
    }

    private void ClearButton_Click(object sender, RoutedEventArgs e)
    {
        TranscriptBox.Clear();
        DocumentStatus.Text = "Ready when you are";
        SetStatus("Transcript cleared");
    }

    private void RefreshHistory()
    {
        var entries = _historyStore.Load().Take(8).ToList();
        HistoryListBox.ItemsSource = entries;
        HistoryEmptyText.Visibility = entries.Count == 0 ? Visibility.Visible : Visibility.Collapsed;
        RetryLastButton.IsEnabled = entries.Any(entry => entry.HasRecoveryAudio);
        DeleteHistoryButton.IsEnabled = _selectedHistoryEntry is not null && entries.Any(entry => entry.Id == _selectedHistoryEntry.Id);
        PlayAudioButton.IsEnabled = _selectedHistoryEntry?.HasAudio == true;
    }

    private void HistoryListBox_SelectionChanged(object sender, System.Windows.Controls.SelectionChangedEventArgs e)
    {
        _selectedHistoryEntry = HistoryListBox.SelectedItem as HistoryEntry;
        DeleteHistoryButton.IsEnabled = _selectedHistoryEntry is not null;
        PlayAudioButton.IsEnabled = _selectedHistoryEntry?.HasAudio == true;
        if (_selectedHistoryEntry is not { } entry || string.IsNullOrWhiteSpace(entry.Text))
        {
            return;
        }

        TranscriptBox.Text = entry.Text;
        DocumentStatus.Text = entry.IsQuickNote ? "Quick note loaded" : "Saved transcript loaded";
    }

    private void SaveHistoryEditButton_Click(object sender, RoutedEventArgs e)
    {
        if (_selectedHistoryEntry is null)
        {
            SetStatus("Choose a saved transcript from Recent before saving an edit", true);
            return;
        }
        if (string.IsNullOrWhiteSpace(TranscriptBox.Text))
        {
            SetStatus("A saved transcript cannot be empty", true);
            return;
        }

        try
        {
            _selectedHistoryEntry.Text = TranscriptBox.Text.Trim();
            if (!_selectedHistoryEntry.IsQuickNote)
            {
                _selectedHistoryEntry.Status = "Saved";
            }
            _historyStore.Update(_selectedHistoryEntry);
            RefreshHistory();
            SetStatus("Transcript edit saved");
        }
        catch (Exception ex)
        {
            SetStatus($"Transcript edit could not be saved — {ex.Message}", true);
        }
    }

    private void PlayAudioButton_Click(object sender, RoutedEventArgs e)
    {
        if (_selectedHistoryEntry?.AudioPath is not { } path)
        {
            SetStatus("Choose a saved transcript with audio first", true);
            return;
        }

        try
        {
            if (_playback.IsPlaying)
            {
                _playback.Stop();
                SetStatus("Recording playback stopped");
                return;
            }

            _playback.Play(path);
            SetStatus("Playing saved recording");
        }
        catch (Exception ex)
        {
            SetStatus($"Playback failed — {ex.Message}", true);
        }
    }

    private void PasteLastButton_Click(object sender, RoutedEventArgs e) => PasteLastTranscript();

    private void PasteLastTranscript()
    {
        try
        {
            var entry = _historyStore.LatestNonEmpty();
            if (entry is null)
            {
                SetStatus("There is no saved transcript to paste", true);
                return;
            }

            _pasteTarget = ResolvePasteTarget();
            var outcome = TextPaster.Paste(entry.Text, _pasteTarget);
            TranscriptBox.Text = entry.Text;
            SetStatus(DescribePasteOutcome(outcome, "Pasted the latest transcript", "Copied the latest transcript"));
        }
        catch (Exception ex)
        {
            SetStatus($"Paste last failed — {ex.Message}", true);
        }
    }

    private void QuickNoteButton_Click(object sender, RoutedEventArgs e)
    {
        if (string.IsNullOrWhiteSpace(TranscriptBox.Text) && !_recorder.IsRecording && !_isTranscribing)
        {
            StartRecording(isQuickNote: true);
            return;
        }

        SaveQuickNote();
    }

    private void SaveQuickNote()
    {
        try
        {
            var path = QuickNoteStore.Save(TranscriptBox.Text);
            _historyStore.Add(TranscriptBox.Text, "Quick note", isQuickNote: true);
            RefreshHistory();
            SetStatus($"Quick note saved — {System.IO.Path.GetFileName(path)}");
        }
        catch (Exception ex)
        {
            SetStatus($"Quick note failed — {ex.Message}", true);
        }
    }

    private async void RetryLastButton_Click(object sender, RoutedEventArgs e)
    {
        await RetryLatestAsync();
    }

    private async Task RetryLatestAsync()
    {
        if (_isTranscribing)
        {
            return;
        }

        HistoryEntry? entry;
        try
        {
            entry = _historyStore.LatestRetryable();
        }
        catch (Exception ex)
        {
            SetStatus($"History unavailable — {ex.Message}", true);
            return;
        }

        if (entry is null || string.IsNullOrWhiteSpace(entry.RecoveryAudioPath))
        {
            SetStatus("There is no failed recording to retry", true);
            return;
        }

        if (!File.Exists(entry.RecoveryAudioPath))
        {
            SetStatus("The saved recovery audio is missing", true);
            return;
        }

        _isTranscribing = true;
        _cancelRequested = false;
        _operationCts?.Dispose();
        _operationCts = new CancellationTokenSource();
        SetTranscribingState();
        try
        {
            _settings = ReadSettingsFromUi();
            _ = TranscriptCleaner.ParseDictionary(_settings.Dictionary);
            var raw = await _deepgram.TranscribeAsync(File.ReadAllBytes(entry.RecoveryAudioPath), _settings, _operationCts.Token);
            var cleaned = TranscriptCleaner.CleanForFlow(raw, _settings).Text;
            if (string.IsNullOrWhiteSpace(cleaned))
            {
                throw new InvalidOperationException("The cleaned retry transcript is empty.");
            }

            var recoveryPath = entry.RecoveryAudioPath;
            entry.Text = cleaned;
            entry.Status = "Saved";
            entry.Error = null;
            entry.RecoveryAudioPath = null;
            entry.Inserted = false;
            entry.AudioPath ??= recoveryPath;
            _historyStore.Update(entry);

            TranscriptBox.Text = cleaned;
            if (entry.IsQuickNote)
            {
                var notePath = QuickNoteStore.Save(cleaned);
                entry.Status = "Quick note";
                _historyStore.Update(entry);
                SetStatus($"Retry succeeded — quick note saved ({System.IO.Path.GetFileName(notePath)})");
            }
            else if (_settings.AutoPaste)
            {
                _pasteTarget = ResolvePasteTarget();
                var outcome = TextPaster.Paste(cleaned, _pasteTarget);
                entry.Inserted = outcome == PasteOutcome.Pasted;
                entry.Status = outcome == PasteOutcome.Pasted ? "Pasted" : "Copied";
                _historyStore.Update(entry);
                SetStatus(DescribePasteOutcome(outcome, "Retried and pasted into the active app", "Retried — copied the transcript"));
            }
            else
            {
                SetStatus("Retry succeeded — transcript saved");
            }
            RefreshHistory();
        }
        catch (OperationCanceledException) when (_cancelRequested)
        {
            SetStatus("Retry cancelled");
        }
        catch (Exception ex)
        {
            SetStatus($"Retry failed — {ex.Message}", true);
        }
        finally
        {
            _operationCts?.Dispose();
            _operationCts = null;
            _isTranscribing = false;
            SetReadyState();
        }
    }

    private static string DescribePasteOutcome(PasteOutcome outcome, string pastedMessage, string copiedMessage) =>
        outcome switch
        {
            PasteOutcome.Pasted => pastedMessage,
            PasteOutcome.CopiedBecauseTargetIsPassword => copiedMessage.Replace("Copied", "Password field protected — copied", StringComparison.Ordinal),
            _ => $"{copiedMessage} — no active text field was available"
        };

    private void InsertSnippetButton_Click(object sender, RoutedEventArgs e)
    {
        if (SnippetSelector.SelectedItem is not SnippetEntry snippet)
        {
            SetStatus("Add a snippet definition first", true);
            return;
        }

        var caret = TranscriptBox.CaretIndex;
        var prefix = caret > 0 && !char.IsWhiteSpace(TranscriptBox.Text[caret - 1]) ? " " : string.Empty;
        TranscriptBox.Text = TranscriptBox.Text.Insert(caret, prefix + snippet.Text);
        TranscriptBox.CaretIndex = caret + prefix.Length + snippet.Text.Length;
        TranscriptBox.Focus();
        SetStatus($"Inserted snippet: {snippet.Name}");
    }

    private void ExportHistoryButton_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new SaveFileDialog
        {
            Filter = "Markdown file (*.md)|*.md|All files (*.*)|*.*",
            FileName = $"insidey-speak-history-{DateTime.Now:yyyy-MM-dd}.md",
            Title = "Export transcript history"
        };
        if (dialog.ShowDialog(this) != true)
        {
            return;
        }

        try
        {
            _historyStore.ExportMarkdown(dialog.FileName);
            SetStatus("Transcript history exported");
        }
        catch (Exception ex)
        {
            SetStatus($"History export failed — {ex.Message}", true);
        }
    }

    private void DeleteHistoryButton_Click(object sender, RoutedEventArgs e)
    {
        if (_selectedHistoryEntry is null)
        {
            SetStatus("Choose a saved transcript before deleting", true);
            return;
        }
        if (MessageBox.Show(this, "Delete this transcript and any saved recovery audio?", "Delete transcript",
                MessageBoxButton.YesNo, MessageBoxImage.Warning) != MessageBoxResult.Yes)
        {
            return;
        }

        try
        {
            _historyStore.Delete(_selectedHistoryEntry);
            _selectedHistoryEntry = null;
            HistoryListBox.SelectedItem = null;
            RefreshHistory();
            SetStatus("Transcript deleted");
        }
        catch (Exception ex)
        {
            SetStatus($"Transcript could not be deleted — {ex.Message}", true);
        }
    }

    private async void CancelButton_Click(object sender, RoutedEventArgs e) => await CancelCurrentAsync();

    private async void Window_KeyDown(object sender, System.Windows.Input.KeyEventArgs e)
    {
        if (e.Key == Key.Escape && (_recorder.IsRecording || _isTranscribing))
        {
            e.Handled = true;
            await CancelCurrentAsync();
        }
    }

    private void ImportDictionaryButton_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new OpenFileDialog
        {
            Filter = "Dictionary CSV (*.csv)|*.csv|All files (*.*)|*.*",
            Title = "Import dictionary CSV"
        };
        if (dialog.ShowDialog(this) != true)
        {
            return;
        }

        try
        {
            var result = LibraryImporter.ImportDictionary(File.ReadAllText(dialog.FileName), TranscriptCleaner.ParseDictionary(DictionaryBox.Text));
            var imported = result.Items.Select(item => item.HeardAs is null ? item.Term : $"{item.HeardAs} => {item.Term}");
            DictionaryBox.Text = string.Join(Environment.NewLine,
                DictionaryBox.Text.Split('\n').Select(line => line.TrimEnd('\r')).Where(line => !string.IsNullOrWhiteSpace(line)).Concat(imported));
            SetStatus($"Imported {result.Items.Count} dictionary term(s)" + (result.Issues.Count == 0 ? string.Empty : $" with {result.Issues.Count} issue(s)"), result.Issues.Count > 0);
        }
        catch (Exception ex)
        {
            SetStatus($"Dictionary import failed — {ex.Message}", true);
        }
    }

    private void ImportSnippetsButton_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new OpenFileDialog
        {
            Filter = "Snippets JSON (*.json)|*.json|All files (*.*)|*.*",
            Title = "Import snippets JSON"
        };
        if (dialog.ShowDialog(this) != true)
        {
            return;
        }

        try
        {
            var existing = SnippetParser.Parse(SnippetsBox.Text);
            var result = LibraryImporter.ImportSnippets(File.ReadAllText(dialog.FileName), existing,
                TranscriptCleaner.ParseDictionary(DictionaryBox.Text));
            var imported = result.Items.Select(item => $"{item.Name} => {item.Text.Replace(Environment.NewLine, "\\n", StringComparison.Ordinal)}");
            SnippetsBox.Text = string.Join(Environment.NewLine,
                SnippetsBox.Text.Split('\n').Select(line => line.TrimEnd('\r')).Where(line => !string.IsNullOrWhiteSpace(line)).Concat(imported));
            RefreshSnippetSelector();
            SetStatus($"Imported {result.Items.Count} snippet(s)" + (result.Issues.Count == 0 ? string.Empty : $" with {result.Issues.Count} issue(s)"), result.Issues.Count > 0);
        }
        catch (Exception ex)
        {
            SetStatus($"Snippet import failed — {ex.Message}", true);
        }
    }

    private void SaveSettingsButton_Click(object sender, RoutedEventArgs e)
    {
        try
        {
            _settings = ReadSettingsFromUi();
            _settingsStore.Save(_settings);
            var executablePath = Environment.ProcessPath;
            if (string.IsNullOrWhiteSpace(executablePath))
            {
                throw new InvalidOperationException("Windows did not provide the current executable path for startup settings.");
            }
            _startupService.SetEnabled(_settings.StartWithWindows, executablePath);
            RefreshSnippetSelector();
            SetStatus("Settings saved securely");
        }
        catch (Exception ex)
        {
            SetStatus($"Settings could not be saved — {ex.Message}", true);
        }
    }

    private async void TestConnectionButton_Click(object sender, RoutedEventArgs e)
    {
        if (_isTranscribing)
        {
            return;
        }

        _isTranscribing = true;
        _cancelRequested = false;
        _operationCts?.Dispose();
        _operationCts = new CancellationTokenSource();
        TestConnectionButton.IsEnabled = false;
        SetStatus("Testing Deepgram connection...");
        try
        {
            _settings = ReadSettingsFromUi();
            await _deepgram.TestConnectionAsync(_settings, _operationCts.Token);
            ConnectionText.Text = "Deepgram · connected";
            ConnectionText.Foreground = new SolidColorBrush(Color.FromRgb(50, 129, 92));
            SetStatus("Deepgram is connected");
        }
        catch (Exception ex)
        {
            SetStatus(IsCredentialError(ex)
                ? "Connection failed — the Deepgram API key was rejected or may be expired"
                : $"Connection failed — {ex.Message}", true);
        }
        finally
        {
            TestConnectionButton.IsEnabled = true;
            _operationCts?.Dispose();
            _operationCts = null;
            _isTranscribing = false;
        }
    }

    private void RecordButton_Click(object sender, RoutedEventArgs e) => ToggleRecording();

    private static bool IsCredentialError(Exception exception) =>
        exception.Message.Contains("401", StringComparison.OrdinalIgnoreCase) ||
        exception.Message.Contains("403", StringComparison.OrdinalIgnoreCase) ||
        exception.Message.Contains("unauthorized", StringComparison.OrdinalIgnoreCase) ||
        exception.Message.Contains("forbidden", StringComparison.OrdinalIgnoreCase);

    private void Header_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
    {
        if (e.ChangedButton == MouseButton.Left)
        {
            DragMove();
        }
    }

    private void MinimizeButton_Click(object sender, RoutedEventArgs e) => Hide();

    private void CloseButton_Click(object sender, RoutedEventArgs e) => Hide();

    private void NavDictate_Click(object sender, RoutedEventArgs e) => SetStatus("Dictation workspace is ready");

    private void NavTranscripts_Click(object sender, RoutedEventArgs e)
    {
        HistoryListBox.Focus();
        SetStatus("Choose a saved transcript from Recent");
    }

    private void NavVocabulary_Click(object sender, RoutedEventArgs e)
    {
        DictionaryBox.Focus();
        SetStatus("Dictionary focused — add one term per line");
    }

    private void NavSettings_Click(object sender, RoutedEventArgs e)
    {
        ApiKeyBox.Focus();
        SetStatus("Settings focused");
    }
}
