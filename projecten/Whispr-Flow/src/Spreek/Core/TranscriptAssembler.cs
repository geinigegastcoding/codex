namespace Spreek.Core;

public sealed class TranscriptAssembler
{
    private readonly Dictionary<(long Start, long Duration), TranscriptSegment> finalSegments = [];

    public string InterimText { get; private set; } = string.Empty;

    public bool ReceivedFinalizeResult { get; private set; }

    public string FinalText => string.Join(
        ' ',
        finalSegments.Values
            .OrderBy(segment => segment.Start)
            .Select(segment => segment.Text.Trim())
            .Where(text => text.Length > 0));

    public double AverageConfidence
    {
        get
        {
            var segments = finalSegments.Values.Where(segment => !string.IsNullOrWhiteSpace(segment.Text)).ToArray();
            if (segments.Length == 0)
            {
                return 0;
            }

            var totalWeight = segments.Sum(segment => Math.Max(segment.Duration, 0.001));
            return segments.Sum(segment => segment.Confidence * Math.Max(segment.Duration, 0.001)) / totalWeight;
        }
    }

    public void Accept(TranscriptSegment segment)
    {
        if (!segment.IsFinal)
        {
            InterimText = segment.Text.Trim();
            return;
        }

        var key = ((long)Math.Round(segment.Start * 1000), (long)Math.Round(segment.Duration * 1000));
        finalSegments[key] = segment;
        InterimText = string.Empty;
        ReceivedFinalizeResult |= segment.FromFinalize;
    }
}
