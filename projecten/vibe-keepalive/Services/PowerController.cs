using System.ComponentModel;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Text.RegularExpressions;
using VibeKeepAlive.Models;

namespace VibeKeepAlive.Services;

public sealed class PowerController : IDisposable
{
    private readonly string _recoveryPath;

    private static Guid ButtonsSubgroup = Guid.Parse("4f971e89-eebd-4455-a8de-9e59040e7347");
    private static Guid LidActionSetting = Guid.Parse("5ca83367-6e45-459f-a27b-476b1d01c936");

    private Guid? _schemeGuid;
    private uint? _originalAcLidAction;
    private uint? _originalDcLidAction;
    private bool _executionStateActive;
    private bool _lidSnapshotCaptured;

    public PowerController(string? recoveryPath = null)
    {
        _recoveryPath = recoveryPath ?? Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "VibeKeepAlive",
            "lid-action-recovery.json");
        RestoreLidSettings();
    }

    public bool IsActive => _executionStateActive;
    public string LastWarning { get; private set; } = string.Empty;

    public void Update(PowerStatusSnapshot power, AppSettings settings)
    {
        LastWarning = string.Empty;
        var allowed = power.IsOnBattery
            ? settings.KeepAwakeOnBattery && power.BatteryPercent >= settings.MinimumBatteryPercent
            : power.IsOnAcPower && settings.KeepAwakeOnAc;

        if (!allowed)
        {
            Release();
            if (power.IsOnBattery && power.BatteryPercent < settings.MinimumBatteryPercent)
            {
                LastWarning = $"Battery guard: {power.BatteryPercent}% is below the {settings.MinimumBatteryPercent}% safety threshold.";
            }
            else if (!power.IsOnBattery && !power.IsOnAcPower)
            {
                LastWarning = "Power source is unknown; keep-awake and lid overrides were released for safety.";
            }
            return;
        }

        if (!_executionStateActive)
        {
            var result = SetThreadExecutionState(ExecutionState.Continuous | ExecutionState.SystemRequired);
            if (result == 0)
            {
                throw new Win32Exception(Marshal.GetLastWin32Error(), "Windows rejected the keep-awake request.");
            }

            _executionStateActive = true;
        }

        if (!settings.KeepLidClosed)
        {
            RestoreLidSettings();
            return;
        }

        CaptureLidSettingsIfNeeded();
        ApplyLidOverrides(settings, power);
    }

    public void Release()
    {
        // Windows stores execution state per thread, so clear this thread even when the shared flag is false.
        SetThreadExecutionState(ExecutionState.Continuous);
        _executionStateActive = false;

        RestoreLidSettings();
    }

    public void Dispose() => Release();

    private void CaptureLidSettingsIfNeeded()
    {
        if (_lidSnapshotCaptured)
        {
            return;
        }

        if (File.Exists(_recoveryPath))
        {
            RestoreLidSettings();
            if (File.Exists(_recoveryPath))
            {
                return;
            }
        }

        try
        {
            if (PowerGetActiveScheme(IntPtr.Zero, out var activePolicyGuid) != 0 || activePolicyGuid == IntPtr.Zero)
            {
                LastWarning = "Windows did not expose the active power plan; lid protection is unavailable.";
                return;
            }

            Guid scheme;
            try
            {
                scheme = Marshal.PtrToStructure<Guid>(activePolicyGuid);
            }
            finally
            {
                LocalFree(activePolicyGuid);
            }

            var acResult = PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref ButtonsSubgroup, ref LidActionSetting, out var ac);
            var dcResult = PowerReadDCValueIndex(IntPtr.Zero, ref scheme, ref ButtonsSubgroup, ref LidActionSetting, out var dc);
            var effective = acResult == 0 && dcResult == 0 ? (Ac: (uint?)null, Dc: (uint?)null) : ReadEffectiveLidActions();
            uint? originalAc = acResult == 0 ? ac : effective.Ac;
            uint? originalDc = dcResult == 0 ? dc : effective.Dc;

            if (!originalAc.HasValue && !originalDc.HasValue)
            {
                LastWarning = "Windows did not expose the current lid-close actions; lid protection is unavailable.";
                return;
            }

            SaveRecoverySnapshot(new LidActionSnapshot(scheme, originalAc, originalDc));
            _schemeGuid = scheme;
            _originalAcLidAction = originalAc;
            _originalDcLidAction = originalDc;
            _lidSnapshotCaptured = true;
        }
        catch (Exception exception)
        {
            LastWarning = $"Lid protection unavailable: {exception.Message}";
        }
    }

    private void ApplyLidOverrides(AppSettings settings, PowerStatusSnapshot power)
    {
        if (!_lidSnapshotCaptured || !_schemeGuid.HasValue)
        {
            return;
        }

        var scheme = _schemeGuid.Value;
        uint result = 0;
        if (settings.KeepAwakeOnAc && _originalAcLidAction.HasValue)
        {
            result = PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref ButtonsSubgroup, ref LidActionSetting, 0);
        }

        if (result == 0 && settings.KeepAwakeOnBattery && _originalDcLidAction.HasValue &&
            (!power.IsOnBattery || power.BatteryPercent >= settings.MinimumBatteryPercent))
        {
            result = PowerWriteDCValueIndex(IntPtr.Zero, ref scheme, ref ButtonsSubgroup, ref LidActionSetting, 0);
        }

        if (result == 0)
        {
            result = PowerSetActiveScheme(IntPtr.Zero, ref scheme);
        }

        if (result != 0)
        {
            LastWarning = $"Windows could not apply lid protection (error {result}).";
            RestoreLidSettings();
        }
    }

    private void RestoreLidSettings()
    {
        if (!_lidSnapshotCaptured && !File.Exists(_recoveryPath))
        {
            return;
        }

        LidActionSnapshot snapshot;
        try
        {
            snapshot = _lidSnapshotCaptured
                ? new LidActionSnapshot(_schemeGuid!.Value, _originalAcLidAction, _originalDcLidAction)
                : JsonSerializer.Deserialize<LidActionSnapshot>(File.ReadAllText(_recoveryPath))
                    ?? throw new InvalidDataException("The lid recovery file is empty.");
        }
        catch (Exception exception)
        {
            LastWarning = $"Lid settings recovery file could not be read: {exception.Message}";
            return;
        }

        var scheme = snapshot.SchemeGuid;
        uint result = 0;
        if (snapshot.Ac.HasValue)
        {
            result = PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref ButtonsSubgroup, ref LidActionSetting, snapshot.Ac.Value);
        }

        if (result == 0 && snapshot.Dc.HasValue)
        {
            result = PowerWriteDCValueIndex(IntPtr.Zero, ref scheme, ref ButtonsSubgroup, ref LidActionSetting, snapshot.Dc.Value);
        }

        if (result == 0)
        {
            result = PowerSetActiveScheme(IntPtr.Zero, ref scheme);
        }

        if (result != 0)
        {
            LastWarning = $"Windows could not restore lid settings (error {result}); recovery will retry.";
            return;
        }

        try
        {
            File.Delete(_recoveryPath);
        }
        catch (Exception exception)
        {
            LastWarning = $"Lid settings were restored, but the recovery file could not be cleared: {exception.Message}";
            return;
        }

        _schemeGuid = null;
        _originalAcLidAction = null;
        _originalDcLidAction = null;
        _lidSnapshotCaptured = false;
    }

    private void SaveRecoverySnapshot(LidActionSnapshot snapshot)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(_recoveryPath)!);
        var temporaryPath = _recoveryPath + ".tmp";
        using (var stream = new FileStream(temporaryPath, FileMode.Create, FileAccess.Write, FileShare.None))
        {
            JsonSerializer.Serialize(stream, snapshot);
            stream.Flush(true);
        }

        File.Move(temporaryPath, _recoveryPath, true);
    }

    private static (uint? Ac, uint? Dc) ReadEffectiveLidActions()
    {
        try
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = Path.Combine(Environment.SystemDirectory, "powercfg.exe"),
                UseShellExecute = false,
                RedirectStandardOutput = true,
                CreateNoWindow = true
            };
            startInfo.ArgumentList.Add("/qh");
            startInfo.ArgumentList.Add("SCHEME_CURRENT");
            startInfo.ArgumentList.Add("SUB_BUTTONS");
            startInfo.ArgumentList.Add("LIDACTION");

            using var process = Process.Start(startInfo);
            if (process is null)
            {
                return (null, null);
            }

            var output = process.StandardOutput.ReadToEnd();
            process.WaitForExit();
            if (process.ExitCode != 0 || !output.Contains(LidActionSetting.ToString(), StringComparison.OrdinalIgnoreCase))
            {
                return (null, null);
            }

            var indices = Regex.Matches(output, @"0x([0-9a-fA-F]{1,8})");
            if (indices.Count != 2)
            {
                return (null, null);
            }

            var ac = uint.Parse(indices[0].Groups[1].Value, NumberStyles.HexNumber, CultureInfo.InvariantCulture);
            var dc = uint.Parse(indices[1].Groups[1].Value, NumberStyles.HexNumber, CultureInfo.InvariantCulture);
            return (ac <= 3 ? ac : null, dc <= 3 ? dc : null);
        }
        catch
        {
            return (null, null);
        }
    }

    private sealed record LidActionSnapshot(Guid SchemeGuid, uint? Ac, uint? Dc);

    [Flags]
    private enum ExecutionState : uint
    {
        SystemRequired = 0x00000001,
        Continuous = 0x80000000
    }

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern ExecutionState SetThreadExecutionState(ExecutionState flags);

    [DllImport("PowrProf.dll", SetLastError = true)]
    private static extern uint PowerGetActiveScheme(IntPtr userRootPowerKey, out IntPtr activePolicyGuid);

    [DllImport("PowrProf.dll", SetLastError = true)]
    private static extern uint PowerReadACValueIndex(
        IntPtr rootPowerKey,
        ref Guid schemeGuid,
        ref Guid subgroupOfPowerSettingsGuid,
        ref Guid powerSettingGuid,
        out uint acValueIndex);

    [DllImport("PowrProf.dll", SetLastError = true)]
    private static extern uint PowerReadDCValueIndex(
        IntPtr rootPowerKey,
        ref Guid schemeGuid,
        ref Guid subgroupOfPowerSettingsGuid,
        ref Guid powerSettingGuid,
        out uint dcValueIndex);

    [DllImport("PowrProf.dll", SetLastError = true)]
    private static extern uint PowerWriteACValueIndex(
        IntPtr rootPowerKey,
        ref Guid schemeGuid,
        ref Guid subgroupOfPowerSettingsGuid,
        ref Guid powerSettingGuid,
        uint acValueIndex);

    [DllImport("PowrProf.dll", SetLastError = true)]
    private static extern uint PowerWriteDCValueIndex(
        IntPtr rootPowerKey,
        ref Guid schemeGuid,
        ref Guid subgroupOfPowerSettingsGuid,
        ref Guid powerSettingGuid,
        uint dcValueIndex);

    [DllImport("PowrProf.dll", SetLastError = true)]
    private static extern uint PowerSetActiveScheme(IntPtr userRootPowerKey, ref Guid schemeGuid);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern IntPtr LocalFree(IntPtr handle);
}
