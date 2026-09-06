using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading.Channels;
using Spreek.Core;

namespace Spreek.Services;

public interface ILiveTranscriptionSession : IAsyncDisposable
{
    event EventHandler<string>? InterimChanged;
    event EventHandler<TranscriptSegment>? FinalSegment;
    event EventHandler<string>? Failed;
    int OmittedKeyterms { get; }
    string? RequestId { get; }
    void QueueAudio(byte[] pcm);
    Task<LiveTranscriptResult> CompleteAsync(CancellationToken cancellationToken);
    Task AbortAsync();
}

public interface IDeepgramService
{
    Task<ILiveTranscriptionSession> StartLiveAsync(
        string apiKey,
        DeepgramOptions options,
        IReadOnlyList<DictionaryEntry> dictionary,
        CancellationToken cancellationToken);

    Task<LiveTranscriptResult> TranscribeFileAsync(
        string apiKey,
        string wavPath,
        DeepgramOptions options,
        IReadOnlyList<DictionaryEntry> dictionary,
        CancellationToken cancellationToken);

    Task<CredentialCheckResult> TestCredentialAsync(
        string apiKey,
        DeepgramOptions options,
        CancellationToken cancellationToken);
}

public sealed class DeepgramClient : IDeepgramService, IDisposable
{
    private readonly HttpClient httpClient;
    private readonly bool ownsHttpClient;

    public DeepgramClient(HttpClient? httpClient = null)
    {
        this.httpClient = httpClient ?? new HttpClient { Timeout = TimeSpan.FromSeconds(30) };
        ownsHttpClient = httpClient is null;
    }

    public async Task<ILiveTranscriptionSession> StartLiveAsync(
        string apiKey,
        DeepgramOptions options,
        IReadOnlyList<DictionaryEntry> dictionary,
        CancellationToken cancellationToken)
    {
        ValidateKey(apiKey);
        var uri = DeepgramUriBuilder.BuildStreaming(options, dictionary, out var selection);
        var socket = new ClientWebSocket();
        socket.Options.SetRequestHeader("Authorization", $"Token {apiKey.Trim()}");
        socket.Options.KeepAliveInterval = TimeSpan.FromSeconds(5);
        try
        {
            await socket.ConnectAsync(uri, cancellationToken).ConfigureAwait(false);
            return new DeepgramLiveSession(socket, selection.OmittedCount);
        }
        catch
        {
            socket.Dispose();
            throw;
        }
    }

    public async Task<LiveTranscriptResult> TranscribeFileAsync(
        string apiKey,
        string wavPath,
        DeepgramOptions options,
        IReadOnlyList<DictionaryEntry> dictionary,
        CancellationToken cancellationToken)
    {
        ValidateKey(apiKey);
        if (!File.Exists(wavPath))
        {
            throw new FileNotFoundException("Recovery audio was not found.", wavPath);
        }

        var uri = DeepgramUriBuilder.BuildPrerecorded(options, dictionary, out _);
        await using var stream = File.OpenRead(wavPath);
        using var content = new StreamContent(stream);
        content.Headers.ContentType = new MediaTypeHeaderValue("audio/wav");
        return await SendPrerecordedAsync(apiKey, uri, content, options.Language, cancellationToken).ConfigureAwait(false);
    }

    public async Task<CredentialCheckResult> TestCredentialAsync(
        string apiKey,
        DeepgramOptions options,
        CancellationToken cancellationToken)
    {
        try
        {
            ValidateKey(apiKey);
            var uri = DeepgramUriBuilder.BuildPrerecorded(options, [], out _);
            using var content = new ByteArrayContent(CreateSilentWav(TimeSpan.FromMilliseconds(250)));
            content.Headers.ContentType = new MediaTypeHeaderValue("audio/wav");
            _ = await SendPrerecordedAsync(apiKey, uri, content, options.Language, cancellationToken).ConfigureAwait(false);
            return new CredentialCheckResult(true, "Deepgram Nova-3 is ready.");
        }
        catch (DeepgramException error) when (error.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
        {
            return new CredentialCheckResult(false, "Deepgram rejected this API key.");
        }
        catch (Exception error) when (error is not OperationCanceledException)
        {
            return new CredentialCheckResult(false, $"Deepgram check failed: {error.Message}");
        }
    }

    public void Dispose()
    {
        if (ownsHttpClient)
        {
            httpClient.Dispose();
        }
    }

    private async Task<LiveTranscriptResult> SendPrerecordedAsync(
        string apiKey,
        Uri uri,
        HttpContent content,
        LanguageMode languageMode,
        CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, uri) { Content = content };
        request.Headers.TryAddWithoutValidation("Authorization", $"Token {apiKey.Trim()}");
        using var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false);
        var body = await response.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);
        if (!response.IsSuccessStatusCode)
        {
            var safeBody = body.Length > 1000 ? body[..1000] : body;
            throw new DeepgramException(response.StatusCode, $"Deepgram returned {(int)response.StatusCode}: {safeBody}");
        }

        return ParsePrerecorded(body, languageMode);
    }

    private static LiveTranscriptResult ParsePrerecorded(string json, LanguageMode languageMode)
    {
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        var requestId = root.TryGetProperty("metadata", out var metadata) && metadata.TryGetProperty("request_id", out var id)
            ? id.GetString()
            : null;
        if (!root.TryGetProperty("results", out var results) ||
            !results.TryGetProperty("channels", out var channels) ||
            channels.GetArrayLength() == 0 ||
            !channels[0].TryGetProperty("alternatives", out var alternatives) ||
            alternatives.GetArrayLength() == 0)
        {
            throw new InvalidDataException("Deepgram returned no transcription channel.");
        }

        var channel = channels[0];
        var alternative = alternatives[0];
        var text = alternative.TryGetProperty("transcript", out var transcript) ? transcript.GetString() ?? string.Empty : string.Empty;
        var confidence = alternative.TryGetProperty("confidence", out var confidenceValue) && confidenceValue.TryGetDouble(out var number)
            ? number
            : 0;
        var language = channel.TryGetProperty("detected_language", out var detected) && detected.ValueKind == JsonValueKind.String
            ? detected.GetString()
            : LanguageCode(languageMode);
        return new LiveTranscriptResult(text.Trim(), confidence, requestId, language ?? LanguageCode(languageMode));
    }

    private static string LanguageCode(LanguageMode mode) => mode switch
    {
        LanguageMode.Multilingual => "multi",
        LanguageMode.Dutch => "nl",
        LanguageMode.English => "en-US",
        _ => "unknown",
    };

    private static void ValidateKey(string apiKey)
    {
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new ArgumentException("Enter a Deepgram API key.", nameof(apiKey));
        }
    }

    private static byte[] CreateSilentWav(TimeSpan duration)
    {
        const int sampleRate = 16000;
        const short channels = 1;
        const short bitsPerSample = 16;
        var dataLength = (int)(sampleRate * channels * (bitsPerSample / 8) * duration.TotalSeconds);
        using var stream = new MemoryStream(44 + dataLength);
        using var writer = new BinaryWriter(stream, Encoding.ASCII, true);
        writer.Write(Encoding.ASCII.GetBytes("RIFF"));
        writer.Write(36 + dataLength);
        writer.Write(Encoding.ASCII.GetBytes("WAVEfmt "));
        writer.Write(16);
        writer.Write((short)1);
        writer.Write(channels);
        writer.Write(sampleRate);
        writer.Write(sampleRate * channels * bitsPerSample / 8);
        writer.Write((short)(channels * bitsPerSample / 8));
        writer.Write(bitsPerSample);
        writer.Write(Encoding.ASCII.GetBytes("data"));
        writer.Write(dataLength);
        writer.Write(new byte[dataLength]);
        writer.Flush();
        return stream.ToArray();
    }
}

public sealed class DeepgramException : Exception
{
    public DeepgramException(HttpStatusCode? statusCode, string message)
        : base(message)
    {
        StatusCode = statusCode;
    }

    public HttpStatusCode? StatusCode { get; }
}

internal sealed class DeepgramLiveSession : ILiveTranscriptionSession
{
    private readonly ClientWebSocket socket;
    private readonly Channel<byte[]> audio = Channel.CreateUnbounded<byte[]>(new UnboundedChannelOptions
    {
        SingleReader = true,
        SingleWriter = false,
    });
    private readonly CancellationTokenSource lifetime = new();
    private readonly TranscriptAssembler assembler = new();
    private readonly TaskCompletionSource<bool> finalizeReceived = new(TaskCreationOptions.RunContinuationsAsynchronously);
    private readonly TaskCompletionSource<Exception> failure = new(TaskCreationOptions.RunContinuationsAsynchronously);
    private readonly Task sendLoop;
    private readonly Task receiveLoop;
    private int completionStarted;
    private string language = "multi";

    public DeepgramLiveSession(ClientWebSocket socket, int omittedKeyterms)
    {
        this.socket = socket;
        OmittedKeyterms = omittedKeyterms;
        sendLoop = SendAudioLoopAsync();
        receiveLoop = ReceiveLoopAsync();
    }

    public event EventHandler<string>? InterimChanged;
    public event EventHandler<TranscriptSegment>? FinalSegment;
    public event EventHandler<string>? Failed;

    public int OmittedKeyterms { get; }
    public string? RequestId { get; private set; }

    public void QueueAudio(byte[] pcm)
    {
        ArgumentNullException.ThrowIfNull(pcm);
        if (Volatile.Read(ref completionStarted) != 0)
        {
            return;
        }

        _ = audio.Writer.TryWrite(pcm.ToArray());
    }

    public async Task<LiveTranscriptResult> CompleteAsync(CancellationToken cancellationToken)
    {
        if (Interlocked.Exchange(ref completionStarted, 1) != 0)
        {
            throw new InvalidOperationException("This Deepgram session is already finishing.");
        }

        audio.Writer.TryComplete();
        await sendLoop.WaitAsync(cancellationToken).ConfigureAwait(false);
        ThrowIfFailed();
        await SendTextAsync("{\"type\":\"Finalize\"}", cancellationToken).ConfigureAwait(false);

        var finalizeDelay = Task.Delay(TimeSpan.FromMilliseconds(1800), cancellationToken);
        _ = await Task.WhenAny(finalizeReceived.Task, failure.Task, finalizeDelay).ConfigureAwait(false);
        ThrowIfFailed();

        await SendTextAsync("{\"type\":\"CloseStream\"}", cancellationToken).ConfigureAwait(false);
        var receiveTimeout = Task.Delay(TimeSpan.FromSeconds(5), cancellationToken);
        var receiveWinner = await Task.WhenAny(receiveLoop, failure.Task, receiveTimeout).ConfigureAwait(false);
        ThrowIfFailed();
        if (receiveWinner == receiveTimeout)
        {
            socket.Abort();
        }
        else if (receiveWinner == receiveLoop)
        {
            await receiveLoop.ConfigureAwait(false);
        }

        var text = assembler.FinalText;
        if (string.IsNullOrWhiteSpace(text))
        {
            throw new DeepgramException(null, "No speech was detected.");
        }

        return new LiveTranscriptResult(text, assembler.AverageConfidence, RequestId, language);
    }

    public async Task AbortAsync()
    {
        if (Interlocked.Exchange(ref completionStarted, 1) == 0)
        {
            audio.Writer.TryComplete();
        }

        lifetime.Cancel();
        socket.Abort();
        try
        {
            await Task.WhenAll(sendLoop, receiveLoop).ConfigureAwait(false);
        }
        catch (Exception error) when (error is OperationCanceledException or WebSocketException)
        {
        }
    }

    public async ValueTask DisposeAsync()
    {
        await AbortAsync().ConfigureAwait(false);
        socket.Dispose();
        lifetime.Dispose();
    }

    private async Task SendAudioLoopAsync()
    {
        try
        {
            await foreach (var chunk in audio.Reader.ReadAllAsync(lifetime.Token).ConfigureAwait(false))
            {
                await socket.SendAsync(chunk, WebSocketMessageType.Binary, true, lifetime.Token).ConfigureAwait(false);
            }
        }
        catch (OperationCanceledException) when (lifetime.IsCancellationRequested)
        {
        }
        catch (Exception error)
        {
            ReportFailure(error);
        }
    }

    private async Task ReceiveLoopAsync()
    {
        var buffer = new byte[16 * 1024];
        try
        {
            while (!lifetime.IsCancellationRequested && socket.State is WebSocketState.Open or WebSocketState.CloseSent)
            {
                using var message = new MemoryStream();
                WebSocketReceiveResult received;
                do
                {
                    received = await socket.ReceiveAsync(buffer, lifetime.Token).ConfigureAwait(false);
                    if (received.MessageType == WebSocketMessageType.Close)
                    {
                        return;
                    }

                    if (received.MessageType == WebSocketMessageType.Text)
                    {
                        message.Write(buffer, 0, received.Count);
                    }
                }
                while (!received.EndOfMessage);

                if (received.MessageType != WebSocketMessageType.Text)
                {
                    continue;
                }

                var parsed = DeepgramResponseParser.Parse(Encoding.UTF8.GetString(message.ToArray()));
                if (parsed.RequestId is { Length: > 0 })
                {
                    RequestId = parsed.RequestId;
                }

                switch (parsed.Kind)
                {
                    case DeepgramMessageKind.Result when parsed.Segment is not null:
                        assembler.Accept(parsed.Segment);
                        if (parsed.Language is { Length: > 0 })
                        {
                            language = parsed.Language;
                        }

                        if (parsed.Segment.IsFinal)
                        {
                            FinalSegment?.Invoke(this, parsed.Segment);
                        }
                        else
                        {
                            InterimChanged?.Invoke(this, parsed.Segment.Text);
                        }

                        if (parsed.Segment.FromFinalize)
                        {
                            finalizeReceived.TrySetResult(true);
                        }

                        break;
                    case DeepgramMessageKind.Error:
                        ReportFailure(new DeepgramException(null, parsed.ErrorMessage ?? "Deepgram streaming failed."));
                        return;
                }
            }
        }
        catch (OperationCanceledException) when (lifetime.IsCancellationRequested)
        {
        }
        catch (Exception error)
        {
            ReportFailure(error);
        }
    }

    private async Task SendTextAsync(string json, CancellationToken cancellationToken)
    {
        var bytes = Encoding.UTF8.GetBytes(json);
        await socket.SendAsync(bytes, WebSocketMessageType.Text, true, cancellationToken).ConfigureAwait(false);
    }

    private void ReportFailure(Exception error)
    {
        if (failure.TrySetResult(error))
        {
            Failed?.Invoke(this, error.Message);
        }
    }

    private void ThrowIfFailed()
    {
        if (failure.Task.IsCompletedSuccessfully)
        {
            throw failure.Task.Result;
        }
    }
}
