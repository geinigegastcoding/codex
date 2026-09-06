using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Windows.Threading;
using Spreek.Core;

namespace Spreek.Services;

public sealed class GlobalHotkeyService : IDisposable
{
    private const int WhKeyboardLowLevel = 13;
    private const int WmKeyDown = 0x0100;
    private const int WmKeyUp = 0x0101;
    private const int WmSysKeyDown = 0x0104;
    private const int WmSysKeyUp = 0x0105;
    private const uint LlkhfInjected = 0x10;
    private readonly Dispatcher dispatcher;
    private readonly HookProcedure hookProcedure;
    private readonly HashSet<int> downKeys = [];
    private readonly HashSet<int> suppressedKeys = [];
    private nint hook;
    private DispatcherTimer? pendingPushTimer;
    private bool pushActive;
    private HotkeyChord pushToTalk;
    private HotkeyChord handsFree;
    private HotkeyChord pasteLast;
    private HotkeyChord quickNote;

    public GlobalHotkeyService(Dispatcher dispatcher)
    {
        this.dispatcher = dispatcher;
        hookProcedure = HookCallback;
        Apply(new AppSettings());
    }

    public event EventHandler? PushToTalkPressed;
    public event EventHandler? PushToTalkReleased;
    public event EventHandler? HandsFreePressed;
    public event EventHandler? PasteLastPressed;
    public event EventHandler? QuickNotePressed;
    public event EventHandler? CancelPressed;

    public bool IsDictationActive { get; set; }

    public void Apply(AppSettings settings)
    {
        var parsed = new Dictionary<string, HotkeyChord>
        {
            ["Push to talk"] = HotkeyChord.Parse(settings.PushToTalkShortcut),
            ["Hands free"] = HotkeyChord.Parse(settings.HandsFreeShortcut),
            ["Paste last"] = HotkeyChord.Parse(settings.PasteLastShortcut),
            ["Quick note"] = HotkeyChord.Parse(settings.QuickNoteShortcut),
        };
        HotkeyChord.EnsureUnique(parsed);
        pushToTalk = parsed["Push to talk"];
        handsFree = parsed["Hands free"];
        pasteLast = parsed["Paste last"];
        quickNote = parsed["Quick note"];
    }

    public void Start()
    {
        if (hook != 0)
        {
            return;
        }

        hook = SetWindowsHookEx(WhKeyboardLowLevel, hookProcedure, GetModuleHandle(null), 0);
        if (hook == 0)
        {
            throw new Win32Exception(Marshal.GetLastWin32Error(), "Could not install the global dictation shortcut.");
        }
    }

    public void Dispose()
    {
        CancelPendingPush();
        if (hook != 0)
        {
            _ = UnhookWindowsHookEx(hook);
            hook = 0;
        }
    }

    private nint HookCallback(int code, nint message, nint data)
    {
        if (code < 0)
        {
            return CallNextHookEx(hook, code, message, data);
        }

        var keyboard = Marshal.PtrToStructure<KeyboardData>(data);
        if ((keyboard.Flags & LlkhfInjected) != 0)
        {
            return CallNextHookEx(hook, code, message, data);
        }

        var virtualKey = unchecked((int)keyboard.VirtualKey);
        var isDown = message is WmKeyDown or WmSysKeyDown;
        var isUp = message is WmKeyUp or WmSysKeyUp;
        var suppress = false;

        if (isDown)
        {
            var firstPress = downKeys.Add(virtualKey);
            if (firstPress)
            {
                suppress = HandleKeyDown(virtualKey);
            }
            else if (suppressedKeys.Contains(virtualKey))
            {
                suppress = true;
            }
        }
        else if (isUp)
        {
            suppress = HandleKeyUp(virtualKey) || suppressedKeys.Remove(virtualKey);
            downKeys.Remove(virtualKey);
        }

        return suppress ? 1 : CallNextHookEx(hook, code, message, data);
    }

    private bool HandleKeyDown(int virtualKey)
    {
        if (virtualKey == 0x1B && IsDictationActive)
        {
            SuppressCurrentChord(virtualKey);
            Dispatch(CancelPressed);
            return true;
        }

        if (Triggered(handsFree, virtualKey))
        {
            CancelPendingPush();
            SuppressCurrentChord(virtualKey);
            Dispatch(HandsFreePressed);
            return true;
        }

        if (Triggered(pasteLast, virtualKey))
        {
            SuppressCurrentChord(virtualKey);
            Dispatch(PasteLastPressed);
            return true;
        }

        if (Triggered(quickNote, virtualKey))
        {
            SuppressCurrentChord(virtualKey);
            Dispatch(QuickNotePressed);
            return true;
        }

        if (!Triggered(pushToTalk, virtualKey))
        {
            return false;
        }

        SuppressCurrentChord(virtualKey);
        if (pushToTalk.VirtualKey is null)
        {
            ScheduleModifierOnlyPush();
        }
        else
        {
            ActivatePush();
        }

        return true;
    }

    private bool HandleKeyUp(int virtualKey)
    {
        if (!pushToTalk.RequiresVirtualKey(virtualKey))
        {
            return false;
        }

        var hadPending = pendingPushTimer is not null;
        CancelPendingPush();
        if (pushActive)
        {
            pushActive = false;
            Dispatch(PushToTalkReleased);
            return true;
        }

        return hadPending;
    }

    private bool Triggered(HotkeyChord chord, int currentKey) =>
        chord.IsPressed(downKeys.Contains) &&
        (chord.VirtualKey == currentKey || chord.VirtualKey is null && chord.RequiresVirtualKey(currentKey));

    private void ScheduleModifierOnlyPush()
    {
        CancelPendingPush();
        pendingPushTimer = new DispatcherTimer(TimeSpan.FromMilliseconds(160), DispatcherPriority.Input, (_, _) =>
        {
            CancelPendingPush();
            if (pushToTalk.IsPressed(downKeys.Contains))
            {
                ActivatePush();
            }
        }, dispatcher);
        pendingPushTimer.Start();
    }

    private void ActivatePush()
    {
        if (pushActive)
        {
            return;
        }

        pushActive = true;
        Dispatch(PushToTalkPressed);
    }

    private void CancelPendingPush()
    {
        pendingPushTimer?.Stop();
        pendingPushTimer = null;
    }

    private void SuppressCurrentChord(int triggerKey)
    {
        suppressedKeys.Add(triggerKey);
        foreach (var key in downKeys.Where(pushToTalk.RequiresVirtualKey))
        {
            suppressedKeys.Add(key);
        }
    }

    private void Dispatch(EventHandler? handler)
    {
        if (handler is not null)
        {
            _ = dispatcher.BeginInvoke(() => handler(this, EventArgs.Empty));
        }
    }

    private delegate nint HookProcedure(int code, nint message, nint data);

    [StructLayout(LayoutKind.Sequential)]
    private readonly struct KeyboardData
    {
        public readonly uint VirtualKey;
        public readonly uint ScanCode;
        public readonly uint Flags;
        public readonly uint Time;
        public readonly nuint ExtraInfo;
    }

    [DllImport("user32.dll", SetLastError = true)]
    private static extern nint SetWindowsHookEx(int hookId, HookProcedure callback, nint module, uint threadId);

    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool UnhookWindowsHookEx(nint hook);

    [DllImport("user32.dll")]
    private static extern nint CallNextHookEx(nint hook, int code, nint message, nint data);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode)]
    private static extern nint GetModuleHandle(string? moduleName);
}
