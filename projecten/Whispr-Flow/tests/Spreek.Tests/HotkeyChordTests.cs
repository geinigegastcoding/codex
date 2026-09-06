using Spreek.Core;

namespace Spreek.Tests;

[TestClass]
public sealed class HotkeyChordTests
{
    [DataTestMethod]
    [DataRow("Ctrl+Win", "Ctrl+Win")]
    [DataRow("win + ctrl", "Ctrl+Win")]
    [DataRow("Ctrl+Win+Space", "Ctrl+Win+Space")]
    [DataRow("Shift+Alt+Z", "Alt+Shift+Z")]
    [DataRow("Ctrl+Win+N", "Ctrl+Win+N")]
    [DataRow("Ctrl+F12", "Ctrl+F12")]
    public void Valid_chords_parse_to_a_canonical_display(string input, string expected)
    {
        Assert.AreEqual(expected, HotkeyChord.Parse(input).ToString());
    }

    [DataTestMethod]
    [DataRow("")]
    [DataRow("Ctrl+Ctrl+K")]
    [DataRow("Ctrl+Hyper+K")]
    [DataRow("K+L")]
    [DataRow("Ctrl")]
    public void Invalid_chords_fail_loud(string input)
    {
        Assert.ThrowsException<FormatException>(() => HotkeyChord.Parse(input));
    }

    [TestMethod]
    public void Duplicate_actions_are_rejected_even_when_order_differs()
    {
        var bindings = new Dictionary<string, HotkeyChord>
        {
            ["one"] = HotkeyChord.Parse("Ctrl+Win+N"),
            ["two"] = HotkeyChord.Parse("Win+Ctrl+N"),
        };

        var error = Assert.ThrowsException<InvalidOperationException>(() => HotkeyChord.EnsureUnique(bindings));
        StringAssert.Contains(error.Message, "one");
        StringAssert.Contains(error.Message, "two");
    }
}
