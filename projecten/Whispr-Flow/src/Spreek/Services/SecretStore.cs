using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Spreek.Services;

public sealed class SecretStore
{
    private static readonly byte[] Entropy = Encoding.UTF8.GetBytes("Spreek.Deepgram.ApiKey.v1");

    public SecretStore(string root)
    {
        Directory.CreateDirectory(root);
        FilePath = Path.Combine(root, "secret.dat");
    }

    public string FilePath { get; }

    public async Task SaveAsync(string apiKey, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(apiKey);
        var protectedBytes = ProtectedData.Protect(
            Encoding.UTF8.GetBytes(apiKey.Trim()),
            Entropy,
            DataProtectionScope.CurrentUser);
        var temporaryPath = FilePath + ".tmp";
        try
        {
            await File.WriteAllTextAsync(temporaryPath, Convert.ToBase64String(protectedBytes), cancellationToken).ConfigureAwait(false);
            File.Move(temporaryPath, FilePath, true);
        }
        finally
        {
            if (File.Exists(temporaryPath))
            {
                File.Delete(temporaryPath);
            }
        }
    }

    public async Task<string?> LoadAsync(CancellationToken cancellationToken = default)
    {
        if (!File.Exists(FilePath))
        {
            return null;
        }

        var encoded = await File.ReadAllTextAsync(FilePath, cancellationToken).ConfigureAwait(false);
        var bytes = ProtectedData.Unprotect(Convert.FromBase64String(encoded), Entropy, DataProtectionScope.CurrentUser);
        return Encoding.UTF8.GetString(bytes);
    }

    public void Delete()
    {
        if (File.Exists(FilePath))
        {
            File.Delete(FilePath);
        }
    }
}
