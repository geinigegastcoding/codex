$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$required = @(
  'AGENTS.md',
  'Kennis/README.md',
  'Kennis/00-authority.md',
  'dashboard/package.json',
  'cursus/README.md',
  'content/videos/short-form-scripts.md',
  'content/videos/long-form-scripts.md'
)

$missing = @($required | Where-Object { -not (Test-Path -LiteralPath (Join-Path $root $_)) })
if ($missing.Count -gt 0) {
  $missing | ForEach-Object { Write-Error "Ontbrekend templatebestand: $_" }
  exit 1
}

$skillPaths = @(
  (Join-Path $root '.agents/skills'),
  (Join-Path $root '.claude/skills')
)
foreach ($skillPath in $skillPaths) {
  $count = @(Get-ChildItem -LiteralPath $skillPath -Recurse -File -Filter 'SKILL.md').Count
  if ($count -lt 5) { Write-Error "Te weinig skills in $skillPath"; exit 1 }
}

Write-Output 'Template-check geslaagd.'

