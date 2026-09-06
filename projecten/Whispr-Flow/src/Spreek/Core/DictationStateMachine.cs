namespace Spreek.Core;

public sealed class DictationStateMachine
{
    private static readonly IReadOnlyDictionary<DictationState, HashSet<DictationState>> Allowed =
        new Dictionary<DictationState, HashSet<DictationState>>
        {
            [DictationState.Idle] = [DictationState.Connecting, DictationState.Processing, DictationState.Inserting],
            [DictationState.Connecting] = [DictationState.Listening, DictationState.Idle, DictationState.RecoverableError, DictationState.FatalError],
            [DictationState.Listening] = [DictationState.Finalizing, DictationState.Idle, DictationState.RecoverableError],
            [DictationState.Finalizing] = [DictationState.Processing, DictationState.Idle, DictationState.RecoverableError],
            [DictationState.Processing] = [DictationState.Inserting, DictationState.Idle, DictationState.RecoverableError, DictationState.FatalError],
            [DictationState.Inserting] = [DictationState.Idle, DictationState.RecoverableError],
            [DictationState.RecoverableError] = [DictationState.Processing, DictationState.Connecting, DictationState.Idle],
            [DictationState.FatalError] = [DictationState.Idle],
        };

    private readonly object gate = new();

    public DictationState Current { get; private set; } = DictationState.Idle;

    public event EventHandler<DictationState>? Changed;

    public void MoveTo(DictationState next)
    {
        lock (gate)
        {
            if (Current == next)
            {
                return;
            }

            if (!Allowed[Current].Contains(next))
            {
                throw new InvalidOperationException($"Illegal dictation transition: {Current} -> {next}.");
            }

            Current = next;
        }

        Changed?.Invoke(this, next);
    }

    public void Reset()
    {
        lock (gate)
        {
            Current = DictationState.Idle;
        }

        Changed?.Invoke(this, DictationState.Idle);
    }
}
