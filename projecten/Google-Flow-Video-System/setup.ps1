$ErrorActionPreference = 'Stop'
$projectPath = $PSScriptRoot
$toolPath = Join-Path $projectPath 'tools\facefusion'
$pythonPath = Join-Path $projectPath '.venv\Scripts\python.exe'
$revision = '72470819a0373be3388b3929c8f8f311f418fc3c'

foreach ($command in @('git', 'uv', 'node', 'ffmpeg', 'ffprobe', 'curl')) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "Required tool is missing: $command"
    }
}
if (-not (Test-Path -LiteralPath $toolPath)) {
    New-Item -ItemType Directory -Path (Join-Path $projectPath 'tools') -Force | Out-Null
    git clone --depth 1 --no-checkout 'https://github.com/facefusion/facefusion.git' $toolPath
    if ($LASTEXITCODE -ne 0) { throw 'FaceFusion download failed' }
    git -C $toolPath fetch --depth 1 origin $revision
    if ($LASTEXITCODE -ne 0) { throw 'Tested revision download failed' }
    git -C $toolPath checkout --detach $revision
    if ($LASTEXITCODE -ne 0) { throw 'Tested revision setup failed' }
}
$actualRevision = git -C $toolPath rev-parse HEAD
if ($actualRevision -ne $revision) { throw "FaceFusion revision differs from the tested version: $actualRevision. Inspect it before upgrading." }
if (-not (Test-Path -LiteralPath $pythonPath)) {
    uv venv --python 3.12 (Join-Path $projectPath '.venv')
    if ($LASTEXITCODE -ne 0) { throw 'Python environment setup failed' }
}
uv pip install --link-mode copy --python $pythonPath -r (Join-Path $toolPath 'requirements.txt')
if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed' }
& $pythonPath (Join-Path $toolPath 'facefusion.py') --version
if ($LASTEXITCODE -ne 0) { throw 'FaceFusion validation failed' }
Write-Output 'Local setup is ready. Required model weights download on first use. Flow generation remains manual.'
