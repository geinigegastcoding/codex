using System.Windows.Threading;
using NAudio.Wave;
using Spreek.Core;
using Spreek.Services;

namespace Spreek.Diagnostics;

internal static class Program
{
    [STAThread]
    public static async Task<int> Main(string[] args)
    {
        if (args.Length == 0 || args[0].Equals("help", StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine("Spreek diagnostics: microphones | microphone [--seconds N] [--output PATH] | insert --text TEXT [--delay N]");
            return 0;
        }

        if (args[0].Equals("microphones", StringComparison.OrdinalIgnoreCase))
        {
            var devices = AudioRecorder.GetDevices();
            foreach (var device in devices)
            {
                Console.WriteLine($"{device.DeviceNumber}: {device.Name}");
            }

            return devices.Count > 0 ? 0 : 2;
        }

        if (args[0].Equals("microphone", StringComparison.OrdinalIgnoreCase))
        {
            return await RunMicrophoneAsync(args).ConfigureAwait(false);
        }

        if (args[0].Equals("insert", StringComparison.OrdinalIgnoreCase))
        {
            return await RunInsertAsync(args);
        }

        Console.Error.WriteLine($"Unknown diagnostic command: {args[0]}");
        return 2;
    }

    private static async Task<int> RunMicrophoneAsync(IReadOnlyList<string> arguments)
    {
        var seconds = ReadInt(arguments, "--seconds", 2, 1, 30);
        var output = ReadString(arguments, "--output") ??
            Path.Combine(Path.GetTempPath(), $"spreek-microphone-{Guid.NewGuid():N}.wav");
        var devices = AudioRecorder.GetDevices();
        if (devices.Count == 0)
        {
            Console.Error.WriteLine("No microphone devices found.");
            return 3;
        }

        using var recorder = new AudioRecorder();
        var maximumLevel = 0d;
        recorder.LevelChanged += (_, level) => maximumLevel = Math.Max(maximumLevel, level);
        await recorder.StartAsync(output, devices[0].DeviceNumber, CancellationToken.None).ConfigureAwait(false);
        await Task.Delay(TimeSpan.FromSeconds(seconds)).ConfigureAwait(false);
        await recorder.StopAsync(CancellationToken.None).ConfigureAwait(false);

        using var reader = new WaveFileReader(output);
        if (reader.WaveFormat.SampleRate != 16000 || reader.WaveFormat.Channels != 1 || reader.Length <= 44)
        {
            Console.Error.WriteLine("Captured WAV has an unexpected format.");
            return 4;
        }

        Console.WriteLine($"Microphone OK: {devices[0].Name}; {reader.TotalTime.TotalSeconds:F2}s; peak {maximumLevel:F3}; {Path.GetFullPath(output)}");
        return 0;
    }

    private static async Task<int> RunInsertAsync(IReadOnlyList<string> arguments)
    {
        var text = ReadString(arguments, "--text");
        if (string.IsNullOrWhiteSpace(text))
        {
            Console.Error.WriteLine("insert requires --text TEXT.");
            return 3;
        }

        var delay = ReadInt(arguments, "--delay", 3, 0, 30);
        Console.WriteLine($"Focus the target editor. Inserting in {delay} second(s)...");
        await Task.Delay(TimeSpan.FromSeconds(delay));

        var insertion = new TextInsertionService(Dispatcher.CurrentDispatcher);
        var target = insertion.CaptureTarget();
        await insertion.InsertAsync(target, text, InsertionMode.ControlV, false, CancellationToken.None);
        Console.WriteLine($"Insertion OK: {text.Length} characters into {target.ProcessName}.");
        return 0;
    }

    private static string? ReadString(IReadOnlyList<string> arguments, string name)
    {
        for (var index = 0; index < arguments.Count - 1; index++)
        {
            if (arguments[index].Equals(name, StringComparison.OrdinalIgnoreCase))
            {
                return arguments[index + 1];
            }
        }

        return null;
    }

    private static int ReadInt(IReadOnlyList<string> arguments, string name, int fallback, int minimum, int maximum)
    {
        var value = ReadString(arguments, name);
        return int.TryParse(value, out var parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
    }
}
