param([string[]]$Tasks = @('assembleDebug', 'lintDebug'))
$ErrorActionPreference = 'Stop'
if (-not $env:JAVA_HOME -or -not (Test-Path -LiteralPath "$env:JAVA_HOME\bin\javac.exe")) {
    $passcraftJdk = Get-ChildItem -LiteralPath "$env:ProgramFiles\Android\openjdk" -Directory -Filter 'jdk-*' -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
    if (-not $passcraftJdk) { throw 'Set JAVA_HOME to a JDK 17 or newer, then run this script again.' }
    $env:JAVA_HOME = $passcraftJdk.FullName
}
if (-not $env:ANDROID_HOME) { $env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
if (-not (Test-Path -LiteralPath $env:ANDROID_HOME)) { throw 'Set ANDROID_HOME to your Android SDK directory.' }
# Java's Windows Unix-domain sockets need an ASCII temp path when the username contains non-ASCII characters.
$passcraftTemp = Join-Path $env:SystemRoot 'Temp'
$env:JAVA_TOOL_OPTIONS = "$env:JAVA_TOOL_OPTIONS -Djdk.net.unixdomain.tmpdir=$passcraftTemp".Trim()
Push-Location (Split-Path -Parent $PSScriptRoot)
try { & '.\gradlew.bat' @Tasks --no-daemon --console=plain; if ($LASTEXITCODE -ne 0) { throw "Gradle failed with exit code $LASTEXITCODE." } }
finally { Pop-Location }
