using System.ComponentModel;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.WebSockets;
using System.Runtime.InteropServices;
using System.Security;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Channels;
using System.Windows;
using System.Windows.Automation;
using System.Windows.Interop;
using Microsoft.Win32;
using NAudio.Wave;

namespace InsideySpeak;

public sealed class AppSettings
{
    public string ApiKey { get; set; } = string.Empty;
    public string Dictionary { get; set; } = string.Empty;
    public string Snippets { get; set; } = string.Empty;
    public bool AutoPaste { get; set; } = true;
    public bool FilterFillers { get; set; } = true;
    public bool SpokenPunctuation { get; set; } = true;
    public bool PressEnter { get; set; } = true;
    public string Language { get; set; } = "en-US";
    public int MicrophoneDeviceNumber { get; set; }
    public bool StartWithWindows { get; set; }
}

public sealed record DictionaryEntry(string Phrase, string? Replacement);

public sealed class SettingsStore
{
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };
    private static readonly string DefaultSettingsDirectory = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "InsideySpeak");
    private readonly string _settingsDirectory;
    private readonly string _settingsPath;

    public SettingsStore(string? settingsDirectory = null)
    {
        _settingsDirectory = settingsDirectory ?? DefaultSettingsDirectory;
        _settingsPath = Path.Combine(_settingsDirectory, "settings.json");
    }

    private sealed class DiskSettings
    {
        public string? ProtectedApiKey { get; set; }
        public string Dictionary { get; set; } = string.Empty;
        public string Snippets { get; set; } = string.Empty;
        public bool AutoPaste { get; set; } = true;
        public bool FilterFillers { get; set; } = true;
        public bool SpokenPunctuation { get; set; } = true;
        public bool PressEnter { get; set; } = true;
        public string Language { get; set; } = "en-US";
        public int MicrophoneDeviceNumber { get; set; }
        public bool StartWithWindows { get; set; }
    }

    public AppSettings Load()
    {
        var environmentKey = Environment.GetEnvironmentVariable("DEEPGRAM_API_KEY");
        if (!File.Exists(_settingsPath))
        {
            return new AppSettings { ApiKey = environmentKey ?? string.Empty };
        }

        try
        {
            var disk = JsonSerializer.Deserialize<DiskSettings>(File.ReadAllText(_settingsPath), JsonOptions)
                ?? throw new InvalidOperationException("The settings file is empty.");

            return new AppSettings
            {
                ApiKey = environmentKey ?? Unprotect(disk.ProtectedApiKey) ?? string.Empty,
                Dictionary = disk.Dictionary,
                Snippets = disk.Snippets,
                AutoPaste = disk.AutoPaste,
                FilterFillers = disk.FilterFillers,
                SpokenPunctuation = disk.SpokenPunctuation,
                PressEnter = disk.PressEnter,
                Language = disk.Language,
                MicrophoneDeviceNumber = disk.MicrophoneDeviceNumber,
                StartWithWindows = disk.StartWithWindows
            };
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException($"Could not read {_settingsPath} because it is not valid JSON.", ex);
        }
    }

    public void Save(AppSettings settings)
    {
        Directory.CreateDirectory(_settingsDirectory);
        var disk = new DiskSettings
        {
            ProtectedApiKey = Protect(settings.ApiKey),
            Dictionary = settings.Dictionary,
            Snippets = settings.Snippets,
            AutoPaste = settings.AutoPaste,
            FilterFillers = settings.FilterFillers,
            SpokenPunctuation = settings.SpokenPunctuation,
            PressEnter = settings.PressEnter,
            Language = settings.Language,
            MicrophoneDeviceNumber = settings.MicrophoneDeviceNumber,
            StartWithWindows = settings.StartWithWindows
        };
        var temporaryPath = _settingsPath + ".tmp";
        File.WriteAllText(temporaryPath, JsonSerializer.Serialize(disk, JsonOptions));
        File.Move(temporaryPath, _settingsPath, true);
    }

    private static string? Protect(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var bytes = Encoding.UTF8.GetBytes(value);
        var input = Marshal.AllocHGlobal(bytes.Length);
        try
        {
            Marshal.Copy(bytes, 0, input, bytes.Length);
            var inputBlob = new DataBlob { cbData = bytes.Length, pbData = input };
            if (!CryptProtectData(ref inputBlob, null, IntPtr.Zero, null, IntPtr.Zero, 0, out var outputBlob))
            {
                throw new Win32Exception(Marshal.GetLastWin32Error(), "Windows could not protect the API key.");
            }

            try
            {
                var protectedBytes = new byte[outputBlob.cbData];
                Marshal.Copy(outputBlob.pbData, protectedBytes, 0, outputBlob.cbData);
                return Convert.ToBase64String(protectedBytes);
            }
            finally
            {
                if (outputBlob.pbData != IntPtr.Zero)
                {
                    LocalFree(outputBlob.pbData);
                }
            }
        }
        finally
        {
            Marshal.FreeHGlobal(input);
        }
    }

    private static string? Unprotect(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var bytes = Convert.FromBase64String(value);
        var input = Marshal.AllocHGlobal(bytes.Length);
        try
        {
            Marshal.Copy(bytes, 0, input, bytes.Length);
            var inputBlob = new DataBlob { cbData = bytes.Length, pbData = input };
            if (!CryptUnprotectData(ref inputBlob, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero, 0, out var outputBlob))
            {
                throw new SecurityException("Windows could not decrypt the saved API key for this user.");
            }

            try
            {
                var plainBytes = new byte[outputBlob.cbData];
                Marshal.Copy(outputBlob.pbData, plainBytes, 0, outputBlob.cbData);
                return Encoding.UTF8.GetString(plainBytes);
            }
            finally
            {
                if (outputBlob.pbData != IntPtr.Zero)
                {
                    LocalFree(outputBlob.pbData);
                }
            }
        }
        finally
        {
            Marshal.FreeHGlobal(input);
        }
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct DataBlob
    {
        public int cbData;
        public IntPtr pbData;
    }

    [DllImport("Crypt32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern bool CryptProtectData(ref DataBlob pDataIn, string? description, IntPtr entropy,
        string? reserved, IntPtr prompt, uint flags, out DataBlob pDataOut);

    [DllImport("Crypt32.dll", SetLastError = true)]
    private static extern bool CryptUnprotectData(ref DataBlob pDataIn, IntPtr description, IntPtr entropy,
        IntPtr reserved, IntPtr prompt, uint flags, out DataBlob pDataOut);

    [DllImport("Kernel32.dll")]
    private static extern IntPtr LocalFree(IntPtr memory);
}

public sealed record AudioDevice(int Number, string Name);

public sealed class AudioRecorder : IDisposable
{
    private readonly object _sync = new();
    private WaveIn? _waveIn;
    private WaveFileWriter? _writer;
    private MemoryStream? _buffer;
    private TaskCompletionSource<byte[]>? _stopCompletion;

    public event Action<float>? LevelChanged;
    public event Action<byte[], int>? PcmDataAvailable;

    public bool IsRecording
    {
        get
        {
            lock (_sync)
            {
                return _waveIn is not null;
            }
        }
    }

    public static IReadOnlyList<AudioDevice> GetDevices()
    {
        var devices = new List<AudioDevice>();
        for (var index = 0; index < WaveIn.DeviceCount; index++)
        {
            devices.Add(new AudioDevice(index, WaveIn.GetCapabilities(index).ProductName));
        }

        return devices;
    }

    public void Start(int deviceNumber = 0)
    {
        lock (_sync)
        {
            if (_waveIn is not null)
            {
                throw new InvalidOperationException("Recording is already in progress.");
            }

            if (WaveIn.DeviceCount == 0)
            {
                throw new InvalidOperationException("Windows did not report a microphone. Connect a microphone and try again.");
            }
            if (deviceNumber < 0 || deviceNumber >= WaveIn.DeviceCount)
            {
                throw new InvalidOperationException("The selected microphone is no longer available. Choose another microphone in Settings.");
            }

            _buffer = new MemoryStream();
            _writer = new WaveFileWriter(_buffer, new WaveFormat(16000, 16, 1));
            var waveIn = new WaveIn
            {
                DeviceNumber = deviceNumber,
                WaveFormat = new WaveFormat(16000, 16, 1),
                BufferMilliseconds = 50,
                NumberOfBuffers = 3
            };
            waveIn.DataAvailable += OnDataAvailable;
            _waveIn = waveIn;

            try
            {
                waveIn.StartRecording();
            }
            catch
            {
                waveIn.DataAvailable -= OnDataAvailable;
                waveIn.Dispose();
                _waveIn = null;
                _writer?.Dispose();
                _writer = null;
                _buffer = null;
                throw;
            }
        }
    }

    public Task<byte[]> StopAsync()
    {
        WaveIn waveIn;
        TaskCompletionSource<byte[]> completion;
        lock (_sync)
        {
            if (_waveIn is null)
            {
                return Task.FromException<byte[]>(new InvalidOperationException("Recording is not active."));
            }

            waveIn = _waveIn;
            completion = new TaskCompletionSource<byte[]>(TaskCreationOptions.RunContinuationsAsynchronously);
            _stopCompletion = completion;
            waveIn.RecordingStopped += OnRecordingStopped;
        }

        try
        {
            waveIn.StopRecording();
        }
        catch (Exception ex)
        {
            CompleteStop(ex, null);
        }

        return completion.Task;
    }

    private void OnDataAvailable(object? sender, WaveInEventArgs e)
    {
        var pcm = new byte[e.BytesRecorded];
        lock (_sync)
        {
            _writer?.Write(e.Buffer, 0, e.BytesRecorded);
            Buffer.BlockCopy(e.Buffer, 0, pcm, 0, e.BytesRecorded);
        }

        PcmDataAvailable?.Invoke(pcm, pcm.Length);

        double sum = 0;
        var sampleCount = e.BytesRecorded / 2;
        for (var i = 0; i < e.BytesRecorded - 1; i += 2)
        {
            var sample = BitConverter.ToInt16(e.Buffer, i) / 32768d;
            sum += sample * sample;
        }

        var level = sampleCount == 0 ? 0f : (float)Math.Min(1d, Math.Sqrt(sum / sampleCount) * 3.5d);
        LevelChanged?.Invoke(level);
    }

    private void OnRecordingStopped(object? sender, StoppedEventArgs e)
    {
        byte[]? audio = null;
        TaskCompletionSource<byte[]>? completion;
        WaveIn? waveIn;
        WaveFileWriter? writer;
        MemoryStream? buffer;

        lock (_sync)
        {
            completion = _stopCompletion;
            _stopCompletion = null;
            waveIn = _waveIn;
            writer = _writer;
            buffer = _buffer;
            _waveIn = null;
            _writer = null;
            _buffer = null;
        }

        try
        {
            writer?.Dispose();
            audio = buffer?.ToArray();
            if (waveIn is not null)
            {
                waveIn.DataAvailable -= OnDataAvailable;
                waveIn.RecordingStopped -= OnRecordingStopped;
                waveIn.Dispose();
            }
        }
        catch (Exception cleanupException)
        {
            e = new StoppedEventArgs(cleanupException);
        }

        CompleteStop(e.Exception, audio, completion);
    }

    private void CompleteStop(Exception? exception, byte[]? audio, TaskCompletionSource<byte[]>? completion = null)
    {
        completion ??= _stopCompletion;
        if (completion is null)
        {
            return;
        }

        if (exception is not null)
        {
            completion.TrySetException(exception);
        }
        else
        {
            completion.TrySetResult(audio ?? Array.Empty<byte>());
        }
    }

    public static byte[] CreateSilence(TimeSpan duration)
    {
        var format = new WaveFormat(16000, 16, 1);
        using var buffer = new MemoryStream();
        using (var writer = new WaveFileWriter(buffer, format))
        {
            writer.Write(new byte[(int)(format.AverageBytesPerSecond * duration.TotalSeconds)], 0,
                (int)(format.AverageBytesPerSecond * duration.TotalSeconds));
        }
        return buffer.ToArray();
    }

    public void Dispose()
    {
        WaveIn? waveIn;
        lock (_sync)
        {
            waveIn = _waveIn;
        }

        if (waveIn is not null)
        {
            try
            {
                waveIn.StopRecording();
            }
            catch
            {
                waveIn.Dispose();
            }
        }
    }
}

public sealed class DeepgramClient : IDisposable
{
    private readonly HttpClient _http = new() { Timeout = TimeSpan.FromSeconds(90) };

    public async Task<string> TranscribeAsync(byte[] audio, AppSettings settings, CancellationToken cancellationToken = default)
    {
        var responseBody = await SendAsync(audio, settings, cancellationToken);
        var transcript = ExtractTranscript(responseBody);
        if (string.IsNullOrWhiteSpace(transcript))
        {
            throw new InvalidOperationException("Deepgram returned no speech. Try recording a little longer.");
        }

        return transcript.Trim();
    }

    public async Task TestConnectionAsync(AppSettings settings, CancellationToken cancellationToken = default)
    {
        _ = await SendAsync(AudioRecorder.CreateSilence(TimeSpan.FromMilliseconds(400)), settings, cancellationToken);
    }

    public DeepgramStreamingSession CreateStreamingSession(AppSettings settings) => new(settings);

    private async Task<string> SendAsync(byte[] audio, AppSettings settings, CancellationToken cancellationToken)
    {
        var key = settings.ApiKey.Trim();
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new InvalidOperationException("Add a Deepgram API key in the right panel or set DEEPGRAM_API_KEY.");
        }

        var entries = TranscriptCleaner.ParseDictionary(settings.Dictionary);
        using var request = new HttpRequestMessage(HttpMethod.Post, BuildUri(settings, entries));
        request.Headers.Authorization = new AuthenticationHeaderValue("Token", key);
        var content = new ByteArrayContent(audio);
        content.Headers.ContentType = new MediaTypeHeaderValue("audio/wav");
        request.Content = content;

        using var response = await _http.SendAsync(request, HttpCompletionOption.ResponseContentRead, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Deepgram returned {(int)response.StatusCode}: {TrimError(body)}");
        }

        return body;
    }

    private static Uri BuildUri(AppSettings settings, IReadOnlyList<DictionaryEntry> entries)
    {
        if (entries.Count > 100)
        {
            throw new InvalidOperationException("The dictionary has more than 100 entries; reduce it before transcribing.");
        }

        var parameters = new List<string>
        {
            "model=nova-3",
            $"language={Uri.EscapeDataString(settings.Language)}",
            "smart_format=true",
            "punctuate=true",
            $"dictation={settings.SpokenPunctuation.ToString().ToLowerInvariant()}",
            $"filler_words={(!settings.FilterFillers).ToString().ToLowerInvariant()}"
        };

        var tokenCount = 0;
        foreach (var entry in entries)
        {
            var phrase = entry.Phrase.Trim();
            tokenCount += phrase.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries).Length;
            if (tokenCount > 500)
            {
                throw new InvalidOperationException("The dictionary exceeds Deepgram's 500-token keyterm limit; shorten it before transcribing.");
            }
            if (entry.Replacement is null)
            {
                parameters.Add($"keyterm={Uri.EscapeDataString(phrase)}");
            }
            else
            {
                var find = phrase.ToLowerInvariant();
                parameters.Add($"replace={Uri.EscapeDataString($"{find}:{entry.Replacement}")}");
                parameters.Add($"keyterm={Uri.EscapeDataString(entry.Replacement)}");
            }
        }

        return new Uri($"https://api.deepgram.com/v1/listen?{string.Join("&", parameters)}");
    }

    private static string ExtractTranscript(string responseBody)
    {
        using var document = JsonDocument.Parse(responseBody);
        var root = document.RootElement;
        if (!root.TryGetProperty("results", out var results) ||
            !results.TryGetProperty("channels", out var channels) ||
            channels.GetArrayLength() == 0)
        {
            return string.Empty;
        }

        var channel = channels[0];
        if (!channel.TryGetProperty("alternatives", out var alternatives) || alternatives.GetArrayLength() == 0)
        {
            return string.Empty;
        }

        return alternatives[0].TryGetProperty("transcript", out var transcript)
            ? transcript.GetString() ?? string.Empty
            : string.Empty;
    }

    private static string TrimError(string body)
    {
        var compact = Regex.Replace(body, "\\s+", " ").Trim();
        return compact.Length <= 240 ? compact : compact[..240] + "…";
    }

    public void Dispose() => _http.Dispose();
}

public sealed class DeepgramStreamingSession : IAsyncDisposable
{
    private const string FinalizeMessage = "{\"type\":\"Finalize\"}";
    private readonly AppSettings _settings;
    private readonly ClientWebSocket _socket = new();
    private readonly Channel<byte[]> _audio = Channel.CreateUnbounded<byte[]>(new UnboundedChannelOptions
    {
        SingleReader = true,
        AllowSynchronousContinuations = false
    });
    private readonly CancellationTokenSource _shutdown = new();
    private readonly TaskCompletionSource<bool> _speechFinal = new(TaskCreationOptions.RunContinuationsAsynchronously);
    private readonly object _transcriptSync = new();
    private readonly StringBuilder _finalText = new();
    private string _interimText = string.Empty;
    private Task? _connectTask;
    private Task? _sendTask;
    private Task? _receiveTask;
    private Task<string?>? _stopTask;

    public DeepgramStreamingSession(AppSettings settings)
    {
        _settings = settings;
    }

    public event Action<string>? TranscriptUpdated;

    public bool IsConnected => _socket.State == WebSocketState.Open;

    public Task StartAsync(CancellationToken cancellationToken = default)
    {
        _connectTask ??= ConnectCoreAsync(cancellationToken);
        return _connectTask;
    }

    public void SendAudio(byte[] pcm, int length)
    {
        if (length <= 0 || _shutdown.IsCancellationRequested)
        {
            return;
        }

        var copy = new byte[length];
        Buffer.BlockCopy(pcm, 0, copy, 0, length);
        _audio.Writer.TryWrite(copy);
    }

    public Task<string?> StopAsync(CancellationToken cancellationToken = default)
    {
        return _stopTask ??= StopCoreAsync(cancellationToken);
    }

    private async Task<string?> StopCoreAsync(CancellationToken cancellationToken)
    {
        if (_connectTask is not null)
        {
            try
            {
                await _connectTask.ConfigureAwait(false);
            }
            catch
            {
                return GetTranscript();
            }
        }

        _audio.Writer.TryComplete();
        if (_sendTask is not null)
        {
            try
            {
                await _sendTask.ConfigureAwait(false);
            }
            catch
            {
                // The caller can use the reliable HTTP transcription fallback.
            }
        }

        if (_receiveTask is not null)
        {
            try
            {
                using var waitCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                waitCts.CancelAfter(TimeSpan.FromSeconds(2));
                await Task.Delay(Timeout.InfiniteTimeSpan, waitCts.Token).ConfigureAwait(false);
            }
            catch (OperationCanceledException)
            {
                // The final result is best effort; the HTTP path remains authoritative when needed.
            }
        }

        _shutdown.Cancel();
        try
        {
            if (_socket.State is WebSocketState.Open or WebSocketState.CloseReceived)
            {
                await _socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Finished", CancellationToken.None)
                    .ConfigureAwait(false);
            }
        }
        catch
        {
            // A dropped stream is handled by the HTTP fallback.
        }

        if (_receiveTask is not null)
        {
            try
            {
                await _receiveTask.ConfigureAwait(false);
            }
            catch
            {
                // A closed socket is expected after Finalize/CloseAsync.
            }
        }

        return GetTranscript();
    }

    private async Task ConnectCoreAsync(CancellationToken cancellationToken)
    {
        var key = _settings.ApiKey.Trim();
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new InvalidOperationException("Add a Deepgram API key before starting live transcription.");
        }

        _socket.Options.SetRequestHeader("Authorization", $"Token {key}");
        using var connectCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, _shutdown.Token);
        connectCts.CancelAfter(TimeSpan.FromSeconds(8));
        await _socket.ConnectAsync(BuildUri(_settings, TranscriptCleaner.ParseDictionary(_settings.Dictionary)), connectCts.Token)
            .ConfigureAwait(false);

        _sendTask = SendLoopAsync();
        _receiveTask = ReceiveLoopAsync();
    }

    private async Task SendLoopAsync()
    {
        await foreach (var pcm in _audio.Reader.ReadAllAsync(_shutdown.Token).ConfigureAwait(false))
        {
            await _socket.SendAsync(pcm, WebSocketMessageType.Binary, true, _shutdown.Token).ConfigureAwait(false);
        }

        if (_socket.State == WebSocketState.Open)
        {
            var finalize = Encoding.UTF8.GetBytes(FinalizeMessage);
            await _socket.SendAsync(finalize, WebSocketMessageType.Text, true, _shutdown.Token).ConfigureAwait(false);
        }
    }

    private async Task ReceiveLoopAsync()
    {
        var buffer = new byte[8192];
        using var message = new MemoryStream();
        while (!_shutdown.IsCancellationRequested && _socket.State == WebSocketState.Open)
        {
            var result = await _socket.ReceiveAsync(buffer, _shutdown.Token).ConfigureAwait(false);
            if (result.MessageType == WebSocketMessageType.Close)
            {
                break;
            }

            message.Write(buffer, 0, result.Count);
            if (!result.EndOfMessage)
            {
                continue;
            }

            ProcessMessage(Encoding.UTF8.GetString(message.ToArray()));
            message.SetLength(0);
        }
    }

    private void ProcessMessage(string json)
    {
        try
        {
            using var document = JsonDocument.Parse(json);
            var root = document.RootElement;
            if (!root.TryGetProperty("type", out var type) ||
                !string.Equals(type.GetString(), "Results", StringComparison.OrdinalIgnoreCase))
            {
                return;
            }

            var transcript = string.Empty;
            if (root.TryGetProperty("channel", out var channel) &&
                channel.TryGetProperty("alternatives", out var alternatives) &&
                alternatives.GetArrayLength() > 0 &&
                alternatives[0].TryGetProperty("transcript", out var transcriptValue))
            {
                transcript = transcriptValue.GetString() ?? string.Empty;
            }

            var isFinal = root.TryGetProperty("is_final", out var finalValue) && finalValue.GetBoolean();
            var speechFinal = root.TryGetProperty("speech_final", out var speechFinalValue) && speechFinalValue.GetBoolean();
            lock (_transcriptSync)
            {
                if (isFinal)
                {
                    AppendTranscript(_finalText, transcript);
                    _interimText = string.Empty;
                }
                else
                {
                    _interimText = transcript;
                }

                var visible = Combine(_finalText.ToString(), _interimText);
                if (!string.IsNullOrWhiteSpace(visible))
                {
                    TranscriptUpdated?.Invoke(visible);
                }
            }

            if (speechFinal)
            {
                _speechFinal.TrySetResult(true);
            }
        }
        catch (JsonException)
        {
            // Ignore non-JSON provider frames; the final HTTP request remains available.
        }
    }

    private string? GetTranscript()
    {
        lock (_transcriptSync)
        {
            var text = Combine(_finalText.ToString(), _interimText).Trim();
            return string.IsNullOrWhiteSpace(text) ? null : text;
        }
    }

    private static void AppendTranscript(StringBuilder destination, string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return;
        }

        if (destination.Length > 0 && !char.IsWhiteSpace(destination[^1]) && !char.IsPunctuation(destination[^1]))
        {
            destination.Append(' ');
        }
        destination.Append(value.Trim());
    }

    private static string Combine(string first, string second)
    {
        if (string.IsNullOrWhiteSpace(first))
        {
            return second.Trim();
        }
        if (string.IsNullOrWhiteSpace(second))
        {
            return first.Trim();
        }

        return $"{first.Trim()} {second.Trim()}";
    }

    private static Uri BuildUri(AppSettings settings, IReadOnlyList<DictionaryEntry> entries)
    {
        if (entries.Count > 100)
        {
            throw new InvalidOperationException("The dictionary has more than 100 entries; reduce it before transcribing.");
        }

        var parameters = new List<string>
        {
            "model=nova-3",
            $"language={Uri.EscapeDataString(settings.Language)}",
            "smart_format=true",
            "punctuate=true",
            $"dictation={settings.SpokenPunctuation.ToString().ToLowerInvariant()}",
            $"filler_words={(!settings.FilterFillers).ToString().ToLowerInvariant()}",
            "interim_results=true",
            "endpointing=300",
            "encoding=linear16",
            "sample_rate=16000",
            "channels=1"
        };

        var tokenCount = 0;
        foreach (var entry in entries)
        {
            var phrase = entry.Phrase.Trim();
            tokenCount += phrase.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries).Length;
            if (tokenCount > 500)
            {
                throw new InvalidOperationException("The dictionary exceeds Deepgram's 500-token keyterm limit; shorten it before transcribing.");
            }
            if (entry.Replacement is null)
            {
                parameters.Add($"keyterm={Uri.EscapeDataString(phrase)}");
            }
            else
            {
                parameters.Add($"replace={Uri.EscapeDataString($"{phrase.ToLowerInvariant()}:{entry.Replacement}")}");
                parameters.Add($"keyterm={Uri.EscapeDataString(entry.Replacement)}");
            }
        }

        return new Uri($"wss://api.deepgram.com/v1/listen?{string.Join("&", parameters)}");
    }

    public async ValueTask DisposeAsync()
    {
        await StopAsync().ConfigureAwait(false);
        _socket.Dispose();
        _shutdown.Dispose();
    }
}

public sealed class HistoryEntry
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public DateTimeOffset CreatedUtc { get; set; } = DateTimeOffset.UtcNow;
    public string Text { get; set; } = string.Empty;
    public string Status { get; set; } = "Saved";
    public string? AudioPath { get; set; }
    public string? RecoveryAudioPath { get; set; }
    public string? Error { get; set; }
    public bool Inserted { get; set; }
    public bool IsQuickNote { get; set; }

    [JsonIgnore]
    public bool HasAudio => !string.IsNullOrWhiteSpace(AudioPath) && File.Exists(AudioPath);

    [JsonIgnore]
    public bool HasRecoveryAudio => !string.IsNullOrWhiteSpace(RecoveryAudioPath) && File.Exists(RecoveryAudioPath);

    public override string ToString()
    {
        var preview = string.IsNullOrWhiteSpace(Text)
            ? "Recording needs a retry"
            : Regex.Replace(Text, "\\s+", " ").Trim();
        if (preview.Length > 38)
        {
            preview = preview[..38] + "…";
        }

        return $"{preview}  ·  {CreatedUtc.ToLocalTime():MMM d, HH:mm}";
    }
}

public sealed class HistoryStore
{
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };
    private static readonly string DefaultAppDirectory = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "InsideySpeak");
    private readonly string _appDirectory;
    private readonly string _historyPath;
    private readonly string _recoveryDirectory;
    private readonly object _sync = new();

    public HistoryStore(string? appDirectory = null)
    {
        _appDirectory = appDirectory ?? DefaultAppDirectory;
        _historyPath = Path.Combine(_appDirectory, "history.json");
        _recoveryDirectory = Path.Combine(_appDirectory, "recovery");
    }

    public IReadOnlyList<HistoryEntry> Load()
    {
        lock (_sync)
        {
            return LoadUnsafe();
        }
    }

    public HistoryEntry Add(string text, string status = "Saved", bool inserted = false, bool isQuickNote = false, byte[]? audio = null)
    {
        var entry = new HistoryEntry
        {
            Text = text.Trim(),
            Status = status,
            Inserted = inserted,
            IsQuickNote = isQuickNote
        };
        if (audio is { Length: > 0 })
        {
            entry.AudioPath = SaveAudioUnsafe(entry.Id, audio, "recordings");
        }
        lock (_sync)
        {
            var entries = LoadUnsafe().ToList();
            entries.Insert(0, entry);
            WriteUnsafe(entries);
        }
        return entry;
    }

    public HistoryEntry AddRecovery(byte[] audio, string error)
    {
        var entry = new HistoryEntry
        {
            Status = "Needs retry",
            Error = SanitizeError(error)
        };

        lock (_sync)
        {
            Directory.CreateDirectory(_recoveryDirectory);
            entry.RecoveryAudioPath = SaveAudioUnsafe(entry.Id, audio, "recovery");
            entry.AudioPath = entry.RecoveryAudioPath;
            var entries = LoadUnsafe().ToList();
            entries.Insert(0, entry);
            WriteUnsafe(entries);
        }
        return entry;
    }

    public void Update(HistoryEntry entry)
    {
        lock (_sync)
        {
            var entries = LoadUnsafe().ToList();
            var index = entries.FindIndex(candidate => candidate.Id == entry.Id);
            if (index < 0)
            {
                throw new InvalidOperationException("That transcript is no longer in history.");
            }

            entries[index] = entry;
            WriteUnsafe(entries);
        }
    }

    public void Delete(HistoryEntry entry)
    {
        lock (_sync)
        {
            var entries = LoadUnsafe().ToList();
            if (entries.RemoveAll(candidate => candidate.Id == entry.Id) != 1)
            {
                throw new InvalidOperationException("That transcript is no longer in history.");
            }

            WriteUnsafe(entries);
            var paths = new[] { entry.RecoveryAudioPath, entry.AudioPath }
                .Where(path => !string.IsNullOrWhiteSpace(path))
                .Distinct(StringComparer.OrdinalIgnoreCase);
            foreach (var path in paths)
            {
                if (File.Exists(path))
                {
                    File.Delete(path);
                }
            }
        }
    }

    public void ExportMarkdown(string path)
    {
        if (string.IsNullOrWhiteSpace(path))
        {
            throw new ArgumentException("An export path is required.", nameof(path));
        }

        var markdown = new StringBuilder("# Insidey Speak history\r\n\r\n");
        foreach (var entry in Load().OrderBy(entry => entry.CreatedUtc))
        {
            markdown.Append("## ").Append(entry.CreatedUtc.ToLocalTime().ToString("yyyy-MM-dd HH:mm"));
            markdown.Append(" — ").Append(entry.Status).Append("\r\n\r\n");
            markdown.Append(string.IsNullOrWhiteSpace(entry.Text) ? "_(no transcript)_" : entry.Text.Trim());
            markdown.Append("\r\n\r\n");
        }

        var fullPath = Path.GetFullPath(path);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
        File.WriteAllText(fullPath, markdown.ToString(), Encoding.UTF8);
    }

    public HistoryEntry? LatestNonEmpty() => Load().FirstOrDefault(entry => !string.IsNullOrWhiteSpace(entry.Text));

    public HistoryEntry? LatestRetryable() => Load().FirstOrDefault(entry => entry.HasRecoveryAudio);

    public void RemoveRecoveryAudio(HistoryEntry entry)
    {
        var path = entry.RecoveryAudioPath;
        entry.RecoveryAudioPath = null;
        if (string.Equals(path, entry.AudioPath, StringComparison.OrdinalIgnoreCase))
        {
            entry.AudioPath = null;
        }
        if (!string.IsNullOrWhiteSpace(path) && File.Exists(path))
        {
            File.Delete(path);
        }
        Update(entry);
    }

    private List<HistoryEntry> LoadUnsafe()
    {
        if (!File.Exists(_historyPath))
        {
            return new List<HistoryEntry>();
        }

        try
        {
            return (JsonSerializer.Deserialize<List<HistoryEntry>>(File.ReadAllText(_historyPath), JsonOptions)
                ?? new List<HistoryEntry>())
                .OrderByDescending(entry => entry.CreatedUtc)
                .ToList();
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException("Saved transcript history is not valid JSON. Export or remove the damaged history file before continuing.", ex);
        }
    }

    private void WriteUnsafe(IReadOnlyList<HistoryEntry> entries)
    {
        Directory.CreateDirectory(_appDirectory);
        var temporaryPath = _historyPath + ".tmp";
        var retained = entries.Take(100).ToList();
        foreach (var removed in entries.Skip(100))
        {
            foreach (var path in new[] { removed.RecoveryAudioPath, removed.AudioPath }
                         .Where(path => !string.IsNullOrWhiteSpace(path))
                         .Distinct(StringComparer.OrdinalIgnoreCase))
            {
                if (File.Exists(path))
                {
                    File.Delete(path);
                }
            }
        }
        File.WriteAllText(temporaryPath, JsonSerializer.Serialize(retained, JsonOptions));
        File.Move(temporaryPath, _historyPath, true);
    }

    private string SaveAudioUnsafe(string id, byte[] audio, string folder)
    {
        var directory = Path.Combine(_appDirectory, folder);
        Directory.CreateDirectory(directory);
        var path = Path.Combine(directory, $"{id}.wav");
        File.WriteAllBytes(path, audio);
        return path;
    }

    private static string SanitizeError(string error)
    {
        var safe = Regex.Replace(error, @"(?i)authorization\s*:\s*token\s+[^\s,;]+", "authorization: [redacted]");
        safe = Regex.Replace(safe, @"(?i)(token|authorization|api[- ]?key|password)\s*[:=]\s*[^\s,;]+", "$1: [redacted]");
        safe = Regex.Replace(safe, "\\s+", " ").Trim();
        return safe.Length <= 240 ? safe : safe[..240] + "…";
    }
}

public sealed record SnippetEntry(string Name, string Text);

public static class SnippetParser
{
    private const int MaxTriggerLength = 60;
    private const int MaxExpansionLength = 4_000;

    public static IReadOnlyList<SnippetEntry> Parse(string raw)
    {
        var snippets = new List<SnippetEntry>();
        var knownNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var rawLine in raw.Split('\n'))
        {
            var line = rawLine.Trim().TrimEnd('\r');
            if (string.IsNullOrWhiteSpace(line) || line.StartsWith('#'))
            {
                continue;
            }

            var separator = line.IndexOf("=>", StringComparison.Ordinal);
            if (separator <= 0 || separator >= line.Length - 2)
            {
                throw new FormatException("Each snippet must use ‘name => text’.");
            }

            var name = line[..separator].Trim();
            var text = line[(separator + 2)..].Trim().Replace("\\n", Environment.NewLine, StringComparison.Ordinal);
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(text))
            {
                throw new FormatException("Snippet names and text cannot be empty.");
            }
            if (name.Length > MaxTriggerLength)
            {
                throw new InvalidOperationException($"Snippet triggers cannot exceed {MaxTriggerLength} characters.");
            }
            if (text.Length > MaxExpansionLength)
            {
                throw new InvalidOperationException($"Snippet text cannot exceed {MaxExpansionLength} characters.");
            }
            if (!knownNames.Add(name))
            {
                throw new FormatException($"Snippet trigger is duplicated: {name}.");
            }

            snippets.Add(new SnippetEntry(name, text));
        }

        if (snippets.Count > 50)
        {
            throw new InvalidOperationException("The snippets list has more than 50 entries; reduce it before saving.");
        }

        return snippets;
    }

    public static string Expand(string text, DateTimeOffset now, ICollection<string> warnings)
    {
        return Regex.Replace(text, @"\{([^{}]+)\}", match =>
        {
            var variable = match.Groups[1].Value.ToLowerInvariant();
            return variable switch
            {
                "date" => now.ToLocalTime().ToString("yyyy-MM-dd"),
                "time" => now.ToLocalTime().ToString("HH:mm"),
                _ => UnknownVariable(match.Value, warnings)
            };
        });
    }

    private static string UnknownVariable(string variable, ICollection<string> warnings)
    {
        var warning = $"Unknown snippet variable: {variable}";
        if (!warnings.Contains(warning))
        {
            warnings.Add(warning);
        }
        return variable;
    }
}

public sealed record DictionaryImportItem(string Term, string? HeardAs);
public sealed record LibraryImportIssue(int Row, string Message);
public sealed record DictionaryImportResult(IReadOnlyList<DictionaryImportItem> Items, IReadOnlyList<LibraryImportIssue> Issues);
public sealed record SnippetImportItem(string Name, string Text);
public sealed record SnippetImportResult(IReadOnlyList<SnippetImportItem> Items, IReadOnlyList<LibraryImportIssue> Issues);

public static class LibraryImporter
{
    public static DictionaryImportResult ImportDictionary(string csv, IReadOnlyList<DictionaryEntry>? existing = null)
    {
        var items = new List<DictionaryImportItem>();
        var issues = new List<LibraryImportIssue>();
        var known = new HashSet<string>(
            existing?.Select(entry => entry.Replacement ?? entry.Phrase) ?? Array.Empty<string>(),
            StringComparer.OrdinalIgnoreCase);

        var row = 0;
        foreach (var rawLine in csv.Split('\n'))
        {
            row++;
            var line = rawLine.TrimEnd('\r');
            if (row == 1 && string.Equals(line.Trim(), "term", StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }
            if (string.IsNullOrWhiteSpace(line))
            {
                continue;
            }

            var columns = ParseCsvLine(line);
            if (columns.Count > 2)
            {
                issues.Add(new LibraryImportIssue(row, "Expected one or two columns, but found too many columns."));
                continue;
            }

            var term = columns.Count == 1 ? columns[0].Trim() : columns[1].Trim();
            var heardAs = columns.Count == 2 ? columns[0].Trim() : null;
            if (string.IsNullOrWhiteSpace(term))
            {
                issues.Add(new LibraryImportIssue(row, "The term is empty."));
                continue;
            }
            if (!known.Add(term))
            {
                issues.Add(new LibraryImportIssue(row, $"Duplicate term: {term}."));
                continue;
            }

            items.Add(new DictionaryImportItem(term, string.IsNullOrWhiteSpace(heardAs) ? null : heardAs));
        }

        return new DictionaryImportResult(items, issues);
    }

    public static SnippetImportResult ImportSnippets(string json, IReadOnlyList<SnippetEntry>? existing = null,
        IReadOnlyList<DictionaryEntry>? dictionary = null)
    {
        var items = new List<SnippetImportItem>();
        var issues = new List<LibraryImportIssue>();
        var known = new HashSet<string>(existing?.Select(snippet => snippet.Name) ?? Array.Empty<string>(), StringComparer.OrdinalIgnoreCase);
        if (dictionary is not null)
        {
            known.UnionWith(dictionary.Select(entry => entry.Replacement ?? entry.Phrase));
        }

        try
        {
            using var document = JsonDocument.Parse(json);
            if (document.RootElement.ValueKind != JsonValueKind.Array)
            {
                return new SnippetImportResult(items, [new LibraryImportIssue(1, "Expected a JSON array of snippets.")]);
            }

            var row = 0;
            foreach (var element in document.RootElement.EnumerateArray())
            {
                row++;
                var name = element.TryGetProperty("name", out var nameValue) ? nameValue.GetString()?.Trim() : null;
                var text = element.TryGetProperty("text", out var textValue) ? textValue.GetString()?.Trim() : null;
                if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(text))
                {
                    issues.Add(new LibraryImportIssue(row, "Snippet name and text are required."));
                    continue;
                }
                if (!known.Add(name))
                {
                    issues.Add(new LibraryImportIssue(row, $"Snippet name conflicts with an existing library item: {name}."));
                    continue;
                }

                items.Add(new SnippetImportItem(name, text));
            }
        }
        catch (JsonException ex)
        {
            issues.Add(new LibraryImportIssue(1, $"Invalid JSON: {ex.Message}"));
        }

        return new SnippetImportResult(items, issues);
    }

    private static List<string> ParseCsvLine(string line)
    {
        var columns = new List<string>();
        var current = new StringBuilder();
        var quoted = false;
        for (var index = 0; index < line.Length; index++)
        {
            var character = line[index];
            if (character == '"')
            {
                if (quoted && index + 1 < line.Length && line[index + 1] == '"')
                {
                    current.Append('"');
                    index++;
                }
                else
                {
                    quoted = !quoted;
                }
            }
            else if (character == ',' && !quoted)
            {
                columns.Add(current.ToString());
                current.Clear();
            }
            else
            {
                current.Append(character);
            }
        }

        columns.Add(current.ToString());
        return columns;
    }
}

public static class QuickNoteStore
{
    public static string Save(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            throw new InvalidOperationException("There is no transcript to save as a note.");
        }

        var directory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Insidey Speak Notes");
        Directory.CreateDirectory(directory);
        var suffix = Guid.NewGuid().ToString("N")[..6];
        var path = Path.Combine(directory, $"note-{DateTime.Now:yyyyMMdd-HHmmss}-{suffix}.md");
        var markdown = $"# Insidey Speak note\r\n\r\n{ text.Trim() }\r\n";
        File.WriteAllText(path, markdown, Encoding.UTF8);
        return path;
    }
}

public sealed class AudioPlayback : IDisposable
{
    private IWavePlayer? _output;
    private AudioFileReader? _reader;

    public bool IsPlaying => _output?.PlaybackState == PlaybackState.Playing;

    public void Play(string path)
    {
        if (!File.Exists(path))
        {
            throw new FileNotFoundException("The saved recording is no longer available.", path);
        }

        Stop();
        _reader = new AudioFileReader(path);
        _output = new WaveOut();
        _output.Init(_reader);
        _output.PlaybackStopped += PlaybackStopped;
        _output.Play();
    }

    public void Stop()
    {
        var output = _output;
        var reader = _reader;
        _output = null;
        _reader = null;
        if (output is not null)
        {
            output.PlaybackStopped -= PlaybackStopped;
            output.Stop();
            output.Dispose();
        }
        reader?.Dispose();
    }

    private void PlaybackStopped(object? sender, StoppedEventArgs e) => Stop();

    public void Dispose() => Stop();
}

public sealed class StartupService
{
    private const string RunKey = @"Software\Microsoft\Windows\CurrentVersion\Run";
    private const string ValueName = "InsideySpeak";

    public bool IsEnabled()
    {
        using var key = Registry.CurrentUser.OpenSubKey(RunKey, writable: false);
        return key?.GetValue(ValueName) is string value && !string.IsNullOrWhiteSpace(value);
    }

    public void SetEnabled(bool enabled, string executablePath)
    {
        using var key = Registry.CurrentUser.CreateSubKey(RunKey, writable: true)
            ?? throw new InvalidOperationException("Windows did not allow Insidey Speak to update startup settings.");
        if (enabled)
        {
            key.SetValue(ValueName, $"\"{Path.GetFullPath(executablePath)}\" --background", RegistryValueKind.String);
        }
        else
        {
            key.DeleteValue(ValueName, throwOnMissingValue: false);
        }
    }
}

public static class TranscriptCleaner
{
    public sealed record CleanResult(string Text, bool PressEnter, IReadOnlyList<string> Warnings);

    public static IReadOnlyList<DictionaryEntry> ParseDictionary(string raw)
    {
        var entries = new List<DictionaryEntry>();
        var lineNumber = 0;
        foreach (var rawLine in raw.Split('\n'))
        {
            lineNumber++;
            var line = rawLine.Trim().TrimEnd('\r');
            if (string.IsNullOrWhiteSpace(line) || line.StartsWith('#'))
            {
                continue;
            }

            var separator = line.IndexOf("=>", StringComparison.Ordinal);
            if (separator < 0)
            {
                entries.Add(new DictionaryEntry(line, null));
                continue;
            }

            var phrase = line[..separator].Trim();
            var replacement = line[(separator + 2)..].Trim();
            if (string.IsNullOrWhiteSpace(phrase) || string.IsNullOrWhiteSpace(replacement))
            {
                throw new FormatException($"Dictionary line {lineNumber} must be ‘spoken => replacement’.");
            }

            entries.Add(new DictionaryEntry(phrase, replacement));
        }

        return entries;
    }

    public static string Clean(string transcript, AppSettings settings)
    {
        return CleanForFlow(transcript, settings).Text;
    }

    public static CleanResult CleanForFlow(string transcript, AppSettings settings, DateTimeOffset? now = null)
    {
        var warnings = new List<string>();
        var text = transcript.Trim();
        if (settings.FilterFillers)
        {
            text = Regex.Replace(text,
                @"(?ix)(?<!\w)(?:uh-?huh|uh-?uh|nuh-?uh|mm-?hm|mhmm|uh|um|erm?|hmm|ah)(?!\w)[,;:]?\s*",
                string.Empty);
            text = Regex.Replace(text, @"(?ix)(?<!\w)you\s+know(?!\w)[,;:]?\s*", string.Empty);
        }

        foreach (var entry in ParseDictionary(settings.Dictionary).Where(entry => entry.Replacement is not null))
        {
            text = Regex.Replace(text, $"(?<!\\w){Regex.Escape(entry.Phrase)}(?!\\w)",
                _ => entry.Replacement!, RegexOptions.IgnoreCase);
        }

        var expansionTime = now ?? DateTimeOffset.Now;
        foreach (var snippet in SnippetParser.Parse(settings.Snippets).OrderByDescending(snippet => snippet.Name.Length))
        {
            var expansion = SnippetParser.Expand(snippet.Text, expansionTime, warnings);
            text = Regex.Replace(text, $"(?<!\\w){Regex.Escape(snippet.Name)}(?!\\w)",
                _ => expansion, RegexOptions.IgnoreCase);
        }

        var lines = text.Split('\n')
            .Select(line => Regex.Replace(line.TrimEnd('\r'), @"[ \t]+", " ").Trim())
            .Where(line => line.Length > 0);
        text = string.Join(Environment.NewLine, lines);
        text = Regex.Replace(text, @"\s+([,.!?;:])", "$1");
        text = Regex.Replace(text, @"([,.!?;:])(?=\S)", "$1 ");
        var pressEnter = settings.PressEnter && Regex.IsMatch(text, @"(?ix)(?:^|\s)press\s+enter[.!?]?$\s*");
        if (pressEnter)
        {
            text = Regex.Replace(text, @"(?ix)\s*press\s+enter[.!?]?$", string.Empty).Trim();
        }

        return new CleanResult(text.Trim(), pressEnter, warnings);
    }
}

public sealed class GlobalHotkey : IDisposable
{
    private const int WmHotkey = 0x0312;
    private const uint ModControl = 0x0002;
    private const uint ModShift = 0x0004;
    private const uint VkSpace = 0x20;
    private const uint VkN = 0x4E;
    private const uint VkV = 0x56;
    private const int HotkeyId = 0x4953;
    private const int QuickNoteHotkeyId = 0x4954;
    private const int PasteLastHotkeyId = 0x4955;
    private HwndSource? _source;
    private IntPtr _handle;
    private readonly List<int> _registeredIds = new();

    public event Action? Pressed;
    public event Action? QuickNotePressed;
    public event Action? PasteLastPressed;

    public void Register(Window window)
    {
        _handle = new WindowInteropHelper(window).Handle;
        _source = HwndSource.FromHwnd(_handle) ?? throw new InvalidOperationException("Insidey Speak could not create its window hook.");
        _source.AddHook(WindowProc);
        if (!NativeMethods.RegisterHotKey(_handle, HotkeyId, ModControl | ModShift, VkSpace))
        {
            _source.RemoveHook(WindowProc);
            _source = null;
            throw new Win32Exception(Marshal.GetLastWin32Error(), "Ctrl + Shift + Space is already used by another app.");
        }

        _registeredIds.Add(HotkeyId);
        RegisterOptional(QuickNoteHotkeyId, VkN);
        RegisterOptional(PasteLastHotkeyId, VkV);
    }

    private void RegisterOptional(int id, uint virtualKey)
    {
        if (NativeMethods.RegisterHotKey(_handle, id, ModControl | ModShift, virtualKey))
        {
            _registeredIds.Add(id);
        }
    }

    private IntPtr WindowProc(IntPtr hwnd, int message, IntPtr wParam, IntPtr lParam, ref bool handled)
    {
        if (message == WmHotkey)
        {
            switch (wParam.ToInt32())
            {
                case HotkeyId:
                    Pressed?.Invoke();
                    handled = true;
                    break;
                case QuickNoteHotkeyId:
                    QuickNotePressed?.Invoke();
                    handled = true;
                    break;
                case PasteLastHotkeyId:
                    PasteLastPressed?.Invoke();
                    handled = true;
                    break;
            }
        }

        return IntPtr.Zero;
    }

    public void Dispose()
    {
        if (_handle != IntPtr.Zero)
        {
            foreach (var id in _registeredIds)
            {
                NativeMethods.UnregisterHotKey(_handle, id);
            }
            _registeredIds.Clear();
        }
        _source?.RemoveHook(WindowProc);
        _source = null;
        _handle = IntPtr.Zero;
    }
}

public enum PasteOutcome
{
    Pasted,
    CopiedBecauseTargetIsPassword,
    CopiedBecauseTargetWasUnavailable
}

public static class TextPaster
{
    public static void CopyToClipboard(string text)
    {
        Exception? last = null;
        for (var attempt = 0; attempt < 5; attempt++)
        {
            try
            {
                System.Windows.Clipboard.SetDataObject(text, true);
                return;
            }
            catch (Exception ex) when (ex is ExternalException or COMException)
            {
                last = ex;
                Thread.Sleep(35);
            }
        }

        throw new InvalidOperationException("Windows kept the clipboard busy; the text was not copied.", last);
    }

    public static bool IsPasswordTarget(IntPtr targetWindow)
    {
        try
        {
            var focused = AutomationElement.FocusedElement;
            if (focused is null || !focused.Current.IsPassword)
            {
                return false;
            }

            var focusedWindow = focused.Current.NativeWindowHandle;
            return targetWindow == IntPtr.Zero || focusedWindow == 0 || focusedWindow == targetWindow.ToInt32();
        }
        catch (ElementNotAvailableException)
        {
            return false;
        }
        catch (InvalidOperationException)
        {
            return false;
        }
    }

    public static PasteOutcome Paste(string text, IntPtr targetWindow)
    {
        if (targetWindow == IntPtr.Zero)
        {
            CopyToClipboard(text);
            return PasteOutcome.CopiedBecauseTargetWasUnavailable;
        }

        if (IsPasswordTarget(targetWindow))
        {
            CopyToClipboard(text);
            return PasteOutcome.CopiedBecauseTargetIsPassword;
        }

        CopyToClipboard(text);
        if (targetWindow != IntPtr.Zero)
        {
            NativeMethods.SetForegroundWindow(targetWindow);
            Thread.Sleep(90);
        }

        var inputs = new[]
        {
            NativeMethods.KeyboardInput(0x11, 0),
            NativeMethods.KeyboardInput(0x56, 0),
            NativeMethods.KeyboardInput(0x56, 0x0002),
            NativeMethods.KeyboardInput(0x11, 0x0002)
        };
        var sent = NativeMethods.SendInput((uint)inputs.Length, inputs, Marshal.SizeOf<NativeMethods.Input>());
        if (sent != inputs.Length)
        {
            throw new Win32Exception(Marshal.GetLastWin32Error(), "Windows could not paste into the active app.");
        }

        return PasteOutcome.Pasted;
    }

    public static void PressEnter()
    {
        var inputs = new[]
        {
            NativeMethods.KeyboardInput(0x0D, 0),
            NativeMethods.KeyboardInput(0x0D, 0x0002)
        };
        var sent = NativeMethods.SendInput((uint)inputs.Length, inputs, Marshal.SizeOf<NativeMethods.Input>());
        if (sent != inputs.Length)
        {
            throw new Win32Exception(Marshal.GetLastWin32Error(), "Windows could not press Enter in the active app.");
        }
    }
}

internal static class NativeMethods
{
    [StructLayout(LayoutKind.Sequential)]
    internal struct Input
    {
        public uint Type;
        public InputUnion Data;
    }

    [StructLayout(LayoutKind.Explicit)]
    internal struct InputUnion
    {
        [FieldOffset(0)]
        public KeyboardInputData Keyboard;

        [FieldOffset(0)]
        public MouseInputData Mouse;

        [FieldOffset(0)]
        public HardwareInputData Hardware;
    }

    [StructLayout(LayoutKind.Sequential)]
    internal struct KeyboardInputData
    {
        public ushort VirtualKey;
        public ushort ScanCode;
        public uint Flags;
        public uint Time;
        public IntPtr ExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    internal struct MouseInputData
    {
        public int X;
        public int Y;
        public uint MouseData;
        public uint Flags;
        public uint Time;
        public IntPtr ExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    internal struct HardwareInputData
    {
        public uint Message;
        public ushort ParameterLow;
        public ushort ParameterHigh;
    }

    internal static Input KeyboardInput(ushort virtualKey, uint flags) => new()
    {
        Type = 1,
        Data = new InputUnion
        {
            Keyboard = new KeyboardInputData { VirtualKey = virtualKey, Flags = flags }
        }
    };

    [DllImport("user32.dll", SetLastError = true)]
    internal static extern bool RegisterHotKey(IntPtr windowHandle, int id, uint modifiers, uint virtualKey);

    [DllImport("user32.dll", SetLastError = true)]
    internal static extern bool UnregisterHotKey(IntPtr windowHandle, int id);

    [DllImport("user32.dll", SetLastError = true)]
    internal static extern uint SendInput(uint inputCount, [In] Input[] inputs, int inputSize);

    [DllImport("user32.dll")]
    internal static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    internal static extern bool SetForegroundWindow(IntPtr windowHandle);
}
