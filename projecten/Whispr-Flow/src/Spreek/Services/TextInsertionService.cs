using System.ComponentModel;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Security;
using System.Text;
using System.Windows;
using System.Windows.Automation;
using System.Windows.Threading;
using Spreek.Core;

namespace Spreek.Services;

public interface ITextInsertionService
{
    TargetWindow CaptureTarget();
    Task CopyAsync(string text, CancellationToken cancellationToken);
    Task InsertAsync(TargetWindow target, string text, InsertionMode mode, bool pressEnter, CancellationToken cancellationToken);
}

public sealed class TextInsertionService : ITextInsertionService
{
    private const uint InputKeyboard = 1;
    private const uint KeyUp = 0x0002;
    private const uint Unicode = 0x0004;
    private readonly Dispatcher dispatcher;

    public TextInsertionService(Dispatcher dispatcher)
    {
        this.dispatcher = dispatcher;
    }

    public TargetWindow CaptureTarget()
    {
        var handle = GetForegroundWindow();
        var processName = "Unknown";
        if (handle != 0)
        {
            _ = GetWindowThreadProcessId(handle, out var processId);
            try
            {
                processName = Process.GetProcessById(unchecked((int)processId)).ProcessName;
            }
            catch (Exception error) when (error is ArgumentException or InvalidOperationException or Win32Exception)
            {
            }
        }

        var className = new StringBuilder(256);
        _ = GetClassName(handle, className, className.Capacity);
        var security = TargetSecurity.Unknown;
        try
        {
            var focused = AutomationElement.FocusedElement;
            security = focused is not null && (bool)focused.GetCurrentPropertyValue(AutomationElement.IsPasswordProperty)
                ? TargetSecurity.Password
                : TargetSecurity.Normal;
        }
        catch (ElementNotAvailableException)
        {
        }
        catch (InvalidOperationException)
        {
        }

        return new TargetWindow(handle, processName, className.ToString(), security);
    }

    public async Task CopyAsync(string text, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(text);
        cancellationToken.ThrowIfCancellationRequested();
        await dispatcher.InvokeAsync(() => System.Windows.Clipboard.SetText(text), DispatcherPriority.Send, cancellationToken);
    }

    public async Task InsertAsync(
        TargetWindow target,
        string text,
        InsertionMode mode,
        bool pressEnter,
        CancellationToken cancellationToken)
    {
        if (target.Security == TargetSecurity.Password)
        {
            throw new SecurityException("Spreek will not insert dictated text into a password field.");
        }

        await CopyAsync(text, cancellationToken).ConfigureAwait(false);
        if (target.Handle == 0)
        {
            throw new InvalidOperationException("The target window is no longer available. The transcript was copied instead.");
        }

        _ = SetForegroundWindow(target.Handle);
        await Task.Delay(60, cancellationToken).ConfigureAwait(false);

        var resolved = mode == InsertionMode.Auto
            ? target.ProcessName.Equals("WindowsTerminal", StringComparison.OrdinalIgnoreCase)
                ? InsertionMode.ControlShiftV
                : InsertionMode.ControlV
            : mode;
        switch (resolved)
        {
            case InsertionMode.ControlV:
                SendChord(0x11, 0x56);
                break;
            case InsertionMode.ControlShiftV:
                SendChord(0x11, 0x10, 0x56);
                break;
            case InsertionMode.Unicode:
                SendUnicode(text);
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(mode), mode, "Unknown insertion mode.");
        }

        if (pressEnter)
        {
            await Task.Delay(70, cancellationToken).ConfigureAwait(false);
            SendChord(0x0D);
        }
    }

    private static void SendChord(params ushort[] keys)
    {
        var inputs = new List<NativeInput>(keys.Length * 2);
        inputs.AddRange(keys.Select(key => Key(key, false)));
        inputs.AddRange(keys.Reverse().Select(key => Key(key, true)));
        Send(inputs);
    }

    private static void SendUnicode(string text)
    {
        var inputs = new List<NativeInput>(text.Length * 2);
        foreach (var character in text)
        {
            inputs.Add(UnicodeKey(character, false));
            inputs.Add(UnicodeKey(character, true));
        }

        Send(inputs);
    }

    private static void Send(IReadOnlyList<NativeInput> inputs)
    {
        var array = inputs.ToArray();
        var sent = SendInput(unchecked((uint)array.Length), array, Marshal.SizeOf<NativeInput>());
        if (sent != array.Length)
        {
            throw new Win32Exception(Marshal.GetLastWin32Error(), "Windows did not accept all text insertion events.");
        }
    }

    private static NativeInput Key(ushort virtualKey, bool keyUp) => new()
    {
        Type = InputKeyboard,
        Data = new InputUnion
        {
            Keyboard = new KeyboardInput
            {
                VirtualKey = virtualKey,
                Flags = keyUp ? KeyUp : 0,
            },
        },
    };

    private static NativeInput UnicodeKey(char character, bool keyUp) => new()
    {
        Type = InputKeyboard,
        Data = new InputUnion
        {
            Keyboard = new KeyboardInput
            {
                ScanCode = character,
                Flags = Unicode | (keyUp ? KeyUp : 0),
            },
        },
    };

    [StructLayout(LayoutKind.Sequential)]
    private struct NativeInput
    {
        public uint Type;
        public InputUnion Data;
    }

    [StructLayout(LayoutKind.Explicit)]
    private struct InputUnion
    {
        [FieldOffset(0)]
        public KeyboardInput Keyboard;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct KeyboardInput
    {
        public ushort VirtualKey;
        public ushort ScanCode;
        public uint Flags;
        public uint Time;
        public nuint ExtraInfo;
    }

    [DllImport("user32.dll")]
    private static extern nint GetForegroundWindow();

    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool SetForegroundWindow(nint window);

    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(nint window, out uint processId);

    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    private static extern int GetClassName(nint window, StringBuilder className, int maximumCount);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern uint SendInput(uint count, NativeInput[] inputs, int size);
}
