using InsideySpeak;
using NAudio.Wave;

var settings = new AppSettings
{
    FilterFillers = true,
    Dictionary = "insidey speak => Insidey Speak\nDeep gram"
};

var cleaned = TranscriptCleaner.Clean(
    "Um, the deep gram demo is ready, you know, for insidey speak.", settings);

if (cleaned != "the deep gram demo is ready, for Insidey Speak.")
{
    throw new InvalidOperationException($"Transcript cleanup intent failed: '{cleaned}'");
}

var entries = TranscriptCleaner.ParseDictionary("brand name => Brand Name\nAPI\n# comment");
if (entries.Count != 2 || entries[0].Replacement != "Brand Name" || entries[1].Phrase != "API")
{
    throw new InvalidOperationException("Dictionary parsing intent failed.");
}

var flowResult = TranscriptCleaner.CleanForFlow("Done for today. Press enter", new AppSettings { PressEnter = true });
if (flowResult.Text != "Done for today." || !flowResult.PressEnter)
{
    throw new InvalidOperationException("Trailing press-enter command intent failed.");
}

var snippets = SnippetParser.Parse("my sign off => Groet, Daniel\n# ignored");
if (snippets.Count != 1 || snippets[0].Name != "my sign off")
{
    throw new InvalidOperationException("Snippet parsing intent failed.");
}

var snippetFlow = TranscriptCleaner.CleanForFlow(
    "Please use my sign off.",
    new AppSettings { Snippets = "my sign off => Groet, Daniel\\n{date}" },
    new DateTimeOffset(2026, 9, 2, 18, 5, 0, TimeSpan.FromHours(2)));
if (snippetFlow.Text != $"Please use Groet, Daniel{Environment.NewLine}2026-09-02." || snippetFlow.Warnings.Count != 0)
{
    throw new InvalidOperationException($"Voice snippet expansion intent failed: '{snippetFlow.Text}'.");
}

const string dictionaryCsv = "term\r\nInsidey\r\n\"Open, AI\"\r\nheard,Correct\r\ntoo,many,columns\r\nInsidey\r\n";
var dictionaryImport = LibraryImporter.ImportDictionary(dictionaryCsv);
if (dictionaryImport.Items.Count != 3 || dictionaryImport.Items.Single(item => item.Term == "Correct").HeardAs != "heard" || dictionaryImport.Issues.Count != 2)
{
    throw new InvalidOperationException("Dictionary CSV import intent failed.");
}

var snippetImport = LibraryImporter.ImportSnippets("[{\"name\":\"hello\",\"text\":\"Hello\"},{\"name\":\"\",\"text\":\"bad\"}]");
if (snippetImport.Items.Count != 1 || snippetImport.Issues.Count != 1)
{
    throw new InvalidOperationException("Snippet JSON import intent failed.");
}

var historyDirectory = Path.Combine(Path.GetTempPath(), "InsideySpeakChecks", Guid.NewGuid().ToString("N"));
Directory.CreateDirectory(historyDirectory);
try
{
    var historyStore = new HistoryStore(historyDirectory);
    var saved = historyStore.Add("Persisted transcript", audio: new byte[1_600]);
    if (!saved.HasAudio)
    {
        throw new InvalidOperationException("Completed recording audio was not retained.");
    }
    saved.Status = "Pasted";
    historyStore.Update(saved);
    var recovery = historyStore.AddRecovery(new byte[1_600], "Authorization: Token secret-value");
    if (new HistoryStore(historyDirectory).Load().Count != 2 || !recovery.HasRecoveryAudio || recovery.Error?.Contains("secret-value", StringComparison.Ordinal) == true)
    {
        throw new InvalidOperationException("History persistence and recovery safety intent failed.");
    }
    historyStore.RemoveRecoveryAudio(recovery);
    if (recovery.HasRecoveryAudio)
    {
        throw new InvalidOperationException("Recovery cleanup intent failed.");
    }
    var exportPath = Path.Combine(historyDirectory, "history.md");
    historyStore.ExportMarkdown(exportPath);
    if (!File.ReadAllText(exportPath).Contains("Persisted transcript", StringComparison.Ordinal))
    {
        throw new InvalidOperationException("History export intent failed.");
    }
    historyStore.Delete(saved);
    if (new HistoryStore(historyDirectory).Load().Count != 1)
    {
        throw new InvalidOperationException("History delete intent failed.");
    }

    var settingsDirectory = Path.Combine(historyDirectory, "settings");
    var settingsStore = new SettingsStore(settingsDirectory);
    settingsStore.Save(new AppSettings { ApiKey = "secret-value", Language = "nl", StartWithWindows = true });
    var loadedSettings = settingsStore.Load();
    var settingsText = File.ReadAllText(Path.Combine(settingsDirectory, "settings.json"));
    var expectedApiKey = Environment.GetEnvironmentVariable("DEEPGRAM_API_KEY") ?? "secret-value";
    if (loadedSettings.ApiKey != expectedApiKey || !loadedSettings.StartWithWindows || settingsText.Contains("secret-value", StringComparison.Ordinal) || File.Exists(Path.Combine(settingsDirectory, "settings.json.tmp")))
    {
        throw new InvalidOperationException("Atomic encrypted settings intent failed.");
    }
}
finally
{
    if (Directory.Exists(historyDirectory))
    {
        Directory.Delete(historyDirectory, true);
    }
}

Console.WriteLine("Insidey Speak checks passed: filler filtering, replacements, and keyterm parsing.");

var liveKey = Environment.GetEnvironmentVariable("DEEPGRAM_API_KEY");
if (!string.IsNullOrWhiteSpace(liveKey))
{
    var liveAudioPath = Environment.GetEnvironmentVariable("DEEPGRAM_TEST_AUDIO");
    using var client = new DeepgramClient();
    var liveSettings = new AppSettings
    {
        ApiKey = liveKey,
        Dictionary = Environment.GetEnvironmentVariable("DEEPGRAM_TEST_DICTIONARY") ?? string.Empty
    };
    if (string.IsNullOrWhiteSpace(liveAudioPath))
    {
        await client.TestConnectionAsync(liveSettings);
        Console.WriteLine("Deepgram live check passed: API key accepted.");
    }
    else
    {
        var transcript = await client.TranscribeAsync(File.ReadAllBytes(liveAudioPath), liveSettings);
        var cleanedTranscript = TranscriptCleaner.Clean(transcript, liveSettings);
        Console.WriteLine($"Deepgram live check passed: '{cleanedTranscript}'");

        if (Environment.GetEnvironmentVariable("INSIDEY_TEST_STREAM") == "1")
        {
            await using var stream = client.CreateStreamingSession(liveSettings);
            await stream.StartAsync();
            using var reader = new WaveFileReader(liveAudioPath);
            var pcm = new byte[3200];
            int count;
            while ((count = reader.Read(pcm, 0, pcm.Length)) > 0)
            {
                stream.SendAudio(pcm, count);
                await Task.Delay(TimeSpan.FromSeconds((double)count / 32_000));
            }

            var streamedTranscript = await stream.StopAsync();
            if (string.IsNullOrWhiteSpace(streamedTranscript))
            {
                throw new InvalidOperationException("Deepgram streaming returned no transcript.");
            }

            Console.WriteLine($"Deepgram streaming check passed: '{TranscriptCleaner.Clean(streamedTranscript, liveSettings)}'");
        }
    }
}

if (Environment.GetEnvironmentVariable("INSIDEY_TEST_MIC") == "1")
{
    using var recorder = new AudioRecorder();
    recorder.Start();
    await Task.Delay(500);
    var capturedAudio = await recorder.StopAsync();
    if (capturedAudio.Length <= 1_600)
    {
        throw new InvalidOperationException("Microphone capture returned no usable WAV data.");
    }

    Console.WriteLine($"Microphone capture check passed: {capturedAudio.Length} bytes.");
}
