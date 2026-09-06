using System.IO;
using NAudio.Wave;
using Spreek.Core;

namespace Spreek.Services;

public interface IAudioRecorder : IDisposable
{
    event EventHandler<byte[]>? AudioAvailable;
    event EventHandler<double>? LevelChanged;
    event EventHandler<string>? Failed;
    double DurationSeconds { get; }
    string? FilePath { get; }
    Task StartAsync(string path, int deviceNumber, CancellationToken cancellationToken);
    Task StopAsync(CancellationToken cancellationToken);
    Task CancelAsync();
}

public sealed class AudioRecorder : IAudioRecorder
{
    private const int SampleRate = 16000;
    private const int BytesPerSample = 2;
    private readonly object gate = new();
    private WaveInEvent? input;
    private WaveFileWriter? writer;
    private TaskCompletionSource<StoppedEventArgs>? stopped;
    private long capturedBytes;
    private bool disposed;

    public event EventHandler<byte[]>? AudioAvailable;
    public event EventHandler<double>? LevelChanged;
    public event EventHandler<string>? Failed;

    public double DurationSeconds => capturedBytes / (double)(SampleRate * BytesPerSample);
    public string? FilePath { get; private set; }

    public static IReadOnlyList<MicrophoneDevice> GetDevices()
    {
        var devices = new List<MicrophoneDevice>();
        for (var index = 0; index < WaveIn.DeviceCount; index++)
        {
            var capabilities = WaveIn.GetCapabilities(index);
            devices.Add(new MicrophoneDevice(index, capabilities.ProductName));
        }

        return devices;
    }

    public Task StartAsync(string path, int deviceNumber, CancellationToken cancellationToken)
    {
        ObjectDisposedException.ThrowIf(disposed, this);
        cancellationToken.ThrowIfCancellationRequested();
        lock (gate)
        {
            if (input is not null)
            {
                throw new InvalidOperationException("Microphone capture is already active.");
            }

            var devices = GetDevices();
            if (devices.Count == 0)
            {
                throw new MicrophoneUnavailableException("Windows reports no recording devices.");
            }

            if (deviceNumber < 0 || deviceNumber >= devices.Count)
            {
                throw new MicrophoneUnavailableException($"Microphone device {deviceNumber} is unavailable.");
            }

            var fullPath = Path.GetFullPath(path);
            Directory.CreateDirectory(Path.GetDirectoryName(fullPath) ?? throw new InvalidOperationException("Recording path has no directory."));
            capturedBytes = 0;
            FilePath = fullPath;
            stopped = new TaskCompletionSource<StoppedEventArgs>(TaskCreationOptions.RunContinuationsAsynchronously);
            input = new WaveInEvent
            {
                DeviceNumber = deviceNumber,
                WaveFormat = new WaveFormat(SampleRate, 16, 1),
                BufferMilliseconds = 100,
                NumberOfBuffers = 3,
            };
            writer = new WaveFileWriter(fullPath, input.WaveFormat);
            input.DataAvailable += OnDataAvailable;
            input.RecordingStopped += OnRecordingStopped;
            try
            {
                input.StartRecording();
            }
            catch
            {
                CleanupCapture();
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }

                throw;
            }
        }

        return Task.CompletedTask;
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        WaveInEvent? currentInput;
        Task<StoppedEventArgs>? wait;
        lock (gate)
        {
            currentInput = input;
            wait = stopped?.Task;
        }

        if (currentInput is null || wait is null)
        {
            return;
        }

        currentInput.StopRecording();
        var result = await wait.WaitAsync(TimeSpan.FromSeconds(5), cancellationToken).ConfigureAwait(false);
        lock (gate)
        {
            CleanupCapture();
        }

        if (result.Exception is not null)
        {
            throw new MicrophoneUnavailableException($"Microphone capture stopped unexpectedly: {result.Exception.Message}", result.Exception);
        }

        if (FilePath is null || !File.Exists(FilePath) || new FileInfo(FilePath).Length <= 44)
        {
            throw new InvalidDataException("The microphone produced no audio data.");
        }
    }

    public async Task CancelAsync()
    {
        try
        {
            await StopAsync(CancellationToken.None).ConfigureAwait(false);
        }
        catch (Exception error) when (error is InvalidDataException or MicrophoneUnavailableException or TimeoutException)
        {
        }

        if (FilePath is { Length: > 0 } path && File.Exists(path))
        {
            File.Delete(path);
        }
    }

    public void Dispose()
    {
        if (disposed)
        {
            return;
        }

        disposed = true;
        lock (gate)
        {
            CleanupCapture();
        }
    }

    private void OnDataAvailable(object? sender, WaveInEventArgs eventArgs)
    {
        var bytes = eventArgs.Buffer.AsSpan(0, eventArgs.BytesRecorded).ToArray();
        lock (gate)
        {
            if (writer is null)
            {
                return;
            }

            writer.Write(bytes, 0, bytes.Length);
            capturedBytes += bytes.Length;
        }

        AudioAvailable?.Invoke(this, bytes);
        LevelChanged?.Invoke(this, CalculateLevel(bytes));
    }

    private void OnRecordingStopped(object? sender, StoppedEventArgs eventArgs)
    {
        if (eventArgs.Exception is not null)
        {
            Failed?.Invoke(this, eventArgs.Exception.Message);
        }

        stopped?.TrySetResult(eventArgs);
    }

    private void CleanupCapture()
    {
        if (input is not null)
        {
            input.DataAvailable -= OnDataAvailable;
            input.RecordingStopped -= OnRecordingStopped;
            input.Dispose();
            input = null;
        }

        writer?.Flush();
        writer?.Dispose();
        writer = null;
        stopped = null;
    }

    private static double CalculateLevel(ReadOnlySpan<byte> pcm)
    {
        if (pcm.Length < BytesPerSample)
        {
            return 0;
        }

        double sum = 0;
        var count = pcm.Length / BytesPerSample;
        for (var index = 0; index + 1 < pcm.Length; index += BytesPerSample)
        {
            var sample = (short)(pcm[index] | pcm[index + 1] << 8);
            var normalized = sample / 32768d;
            sum += normalized * normalized;
        }

        return Math.Clamp(Math.Sqrt(sum / count) * 3.5, 0, 1);
    }
}

public sealed class MicrophoneUnavailableException : Exception
{
    public MicrophoneUnavailableException(string message)
        : base(message)
    {
    }

    public MicrophoneUnavailableException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
