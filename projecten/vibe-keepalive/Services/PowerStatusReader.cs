using System.Windows.Forms;
using VibeKeepAlive.Models;

namespace VibeKeepAlive.Services;

public static class PowerStatusReader
{
    public static PowerStatusSnapshot Read()
    {
        var status = SystemInformation.PowerStatus;
        var isOnBattery = status.PowerLineStatus == PowerLineStatus.Offline;
        var isOnAcPower = status.PowerLineStatus == PowerLineStatus.Online;
        var percent = status.BatteryLifePercent < 0
            ? 100
            : (int)Math.Round(status.BatteryLifePercent * 100, MidpointRounding.AwayFromZero);

        return new PowerStatusSnapshot
        {
            IsOnBattery = isOnBattery,
            IsOnAcPower = isOnAcPower,
            BatteryPercent = Math.Clamp(percent, 0, 100)
        };
    }
}
