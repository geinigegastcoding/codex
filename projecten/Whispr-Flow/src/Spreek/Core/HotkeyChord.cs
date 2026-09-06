namespace Spreek.Core;

[Flags]
public enum HotkeyModifiers
{
    None = 0,
    Control = 1,
    Alt = 2,
    Shift = 4,
    Windows = 8,
}

public readonly record struct HotkeyChord(HotkeyModifiers Modifiers, int? VirtualKey, string? KeyName)
{
    private static readonly IReadOnlyDictionary<string, (int Code, string Display)> NamedKeys = BuildNamedKeys();

    public static HotkeyChord Parse(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new FormatException("Shortcut cannot be empty.");
        }

        var modifiers = HotkeyModifiers.None;
        int? virtualKey = null;
        string? keyName = null;
        foreach (var rawPart in value.Split('+', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            var part = rawPart.Trim();
            var modifier = part.ToLowerInvariant() switch
            {
                "ctrl" or "control" => HotkeyModifiers.Control,
                "alt" => HotkeyModifiers.Alt,
                "shift" => HotkeyModifiers.Shift,
                "win" or "windows" => HotkeyModifiers.Windows,
                _ => HotkeyModifiers.None,
            };
            if (modifier != HotkeyModifiers.None)
            {
                if (modifiers.HasFlag(modifier))
                {
                    throw new FormatException($"Shortcut repeats modifier {part}.");
                }

                modifiers |= modifier;
                continue;
            }

            if (virtualKey is not null)
            {
                throw new FormatException("A shortcut can contain only one non-modifier key.");
            }

            if (part.Length == 1 && char.IsAsciiLetterOrDigit(part[0]))
            {
                keyName = char.ToUpperInvariant(part[0]).ToString();
                virtualKey = keyName[0];
            }
            else if (NamedKeys.TryGetValue(part, out var named))
            {
                virtualKey = named.Code;
                keyName = named.Display;
            }
            else
            {
                throw new FormatException($"Unknown shortcut key: {part}.");
            }
        }

        if (modifiers == HotkeyModifiers.None)
        {
            throw new FormatException("A global shortcut needs at least one modifier.");
        }

        if (virtualKey is null && CountModifiers(modifiers) < 2)
        {
            throw new FormatException("A modifier-only shortcut needs at least two modifiers.");
        }

        return new HotkeyChord(modifiers, virtualKey, keyName);
    }

    public static void EnsureUnique(IReadOnlyDictionary<string, HotkeyChord> bindings)
    {
        var duplicate = bindings
            .GroupBy(pair => pair.Value)
            .FirstOrDefault(group => group.Count() > 1);
        if (duplicate is null)
        {
            return;
        }

        throw new InvalidOperationException(
            $"Shortcut {duplicate.Key} is assigned to both {string.Join(" and ", duplicate.Select(pair => pair.Key))}.");
    }

    public bool RequiresVirtualKey(int virtualKey) =>
        VirtualKey == virtualKey ||
        Modifiers.HasFlag(HotkeyModifiers.Control) && IsControl(virtualKey) ||
        Modifiers.HasFlag(HotkeyModifiers.Alt) && IsAlt(virtualKey) ||
        Modifiers.HasFlag(HotkeyModifiers.Shift) && IsShift(virtualKey) ||
        Modifiers.HasFlag(HotkeyModifiers.Windows) && IsWindows(virtualKey);

    public bool IsPressed(Func<int, bool> isDown) =>
        (!Modifiers.HasFlag(HotkeyModifiers.Control) || isDown(0x11) || isDown(0xA2) || isDown(0xA3)) &&
        (!Modifiers.HasFlag(HotkeyModifiers.Alt) || isDown(0x12) || isDown(0xA4) || isDown(0xA5)) &&
        (!Modifiers.HasFlag(HotkeyModifiers.Shift) || isDown(0x10) || isDown(0xA0) || isDown(0xA1)) &&
        (!Modifiers.HasFlag(HotkeyModifiers.Windows) || isDown(0x5B) || isDown(0x5C)) &&
        (VirtualKey is null || isDown(VirtualKey.Value));

    public override string ToString()
    {
        var parts = new List<string>();
        if (Modifiers.HasFlag(HotkeyModifiers.Control)) parts.Add("Ctrl");
        if (Modifiers.HasFlag(HotkeyModifiers.Alt)) parts.Add("Alt");
        if (Modifiers.HasFlag(HotkeyModifiers.Shift)) parts.Add("Shift");
        if (Modifiers.HasFlag(HotkeyModifiers.Windows)) parts.Add("Win");
        if (KeyName is not null) parts.Add(KeyName);
        return string.Join('+', parts);
    }

    private static int CountModifiers(HotkeyModifiers modifiers) =>
        Enum.GetValues<HotkeyModifiers>().Count(value => value != HotkeyModifiers.None && modifiers.HasFlag(value));

    private static bool IsControl(int key) => key is 0x11 or 0xA2 or 0xA3;
    private static bool IsAlt(int key) => key is 0x12 or 0xA4 or 0xA5;
    private static bool IsShift(int key) => key is 0x10 or 0xA0 or 0xA1;
    private static bool IsWindows(int key) => key is 0x5B or 0x5C;

    private static IReadOnlyDictionary<string, (int Code, string Display)> BuildNamedKeys()
    {
        var keys = new Dictionary<string, (int, string)>(StringComparer.OrdinalIgnoreCase)
        {
            ["Space"] = (0x20, "Space"),
            ["Enter"] = (0x0D, "Enter"),
            ["Escape"] = (0x1B, "Escape"),
            ["Esc"] = (0x1B, "Escape"),
            ["Tab"] = (0x09, "Tab"),
            ["Backspace"] = (0x08, "Backspace"),
            ["Delete"] = (0x2E, "Delete"),
            ["Insert"] = (0x2D, "Insert"),
            ["Home"] = (0x24, "Home"),
            ["End"] = (0x23, "End"),
            ["PageUp"] = (0x21, "PageUp"),
            ["PageDown"] = (0x22, "PageDown"),
            ["Up"] = (0x26, "Up"),
            ["Down"] = (0x28, "Down"),
            ["Left"] = (0x25, "Left"),
            ["Right"] = (0x27, "Right"),
        };
        for (var number = 1; number <= 24; number++)
        {
            keys[$"F{number}"] = (0x6F + number, $"F{number}");
        }

        return keys;
    }
}
