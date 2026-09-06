using Spreek.Core;

namespace Spreek.Tests;

[TestClass]
public sealed class StateAndAssemblerTests
{
    [TestMethod]
    public void State_machine_rejects_a_second_start_while_listening()
    {
        var machine = new DictationStateMachine();
        machine.MoveTo(DictationState.Connecting);
        machine.MoveTo(DictationState.Listening);

        var error = Assert.ThrowsException<InvalidOperationException>(
            () => machine.MoveTo(DictationState.Connecting));

        StringAssert.Contains(error.Message, "Listening");
        StringAssert.Contains(error.Message, "Connecting");
    }

    [TestMethod]
    public void State_machine_allows_recoverable_error_to_retry()
    {
        var machine = new DictationStateMachine();
        machine.MoveTo(DictationState.Connecting);
        machine.MoveTo(DictationState.RecoverableError);

        machine.MoveTo(DictationState.Processing);

        Assert.AreEqual(DictationState.Processing, machine.Current);
    }

    [TestMethod]
    public void Assembler_orders_unique_final_segments_and_keeps_interim_separate()
    {
        var sut = new TranscriptAssembler();
        sut.Accept(new TranscriptSegment(2.0, 1.0, "world.", true, false, 0.9));
        sut.Accept(new TranscriptSegment(0.0, 2.0, "Hello", true, false, 0.9));
        sut.Accept(new TranscriptSegment(0.0, 2.0, "Hello", true, false, 0.9));
        sut.Accept(new TranscriptSegment(3.0, 1.0, "temporary", false, false, 0.5));

        Assert.AreEqual("Hello world.", sut.FinalText);
        Assert.AreEqual("temporary", sut.InterimText);
        Assert.AreEqual(0.9, sut.AverageConfidence, 0.001);
    }

    [TestMethod]
    public void Empty_or_whitespace_segments_do_not_pollute_output()
    {
        var sut = new TranscriptAssembler();
        sut.Accept(new TranscriptSegment(0, 1, " ", true, false, 0.8));
        sut.Accept(new TranscriptSegment(1, 1, "Useful", true, true, 0.7));

        Assert.AreEqual("Useful", sut.FinalText);
        Assert.IsTrue(sut.ReceivedFinalizeResult);
    }
}
