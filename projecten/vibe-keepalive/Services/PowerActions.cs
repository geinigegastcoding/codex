using System.Diagnostics;
using System.ComponentModel;
using System.IO;
using System.Runtime.InteropServices;
using VibeKeepAlive.Models;

namespace VibeKeepAlive.Services;

public static class PowerActions
{
    public static void Execute(PowerAction action)
    {
        switch (action)
        {
            case PowerAction.Shutdown:
                RunShutdown();
                break;
            case PowerAction.Hibernate:
                EnsureSucceeded(SetSuspendState(true, true, false), "Hibernate");
                break;
            case PowerAction.Sleep:
                EnsureSucceeded(SetSuspendState(false, true, false), "Sleep");
                break;
            case PowerAction.Lock:
                EnsureSucceeded(LockWorkStation(), "Lock");
                break;
            case PowerAction.DoNothing:
                break;
        }
    }

    private static void RunShutdown()
    {
        using var process = Process.Start(new ProcessStartInfo
        {
            FileName = Path.Combine(Environment.SystemDirectory, "shutdown.exe"),
            Arguments = "/s /t 0",
            CreateNoWindow = true,
            UseShellExecute = false
        });

        if (process is null)
        {
            throw new InvalidOperationException("Windows did not start shutdown.exe.");
        }
    }

    private static void EnsureSucceeded(bool succeeded, string action)
    {
        if (!succeeded)
        {
            throw new Win32Exception(Marshal.GetLastWin32Error(), $"Windows rejected the {action} action.");
        }
    }

    [DllImport("PowrProf.dll", SetLastError = true)]
    private static extern bool SetSuspendState(bool hibernate, bool forceCritical, bool disableWakeEvent);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern bool LockWorkStation();
}
