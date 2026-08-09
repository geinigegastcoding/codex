param(
  [string]$Root = (Join-Path $PSScriptRoot '..\Kennis')
)

$ErrorActionPreference = 'Stop'
$rootPath = (Resolve-Path -LiteralPath $Root).Path
$markdown = Get-ChildItem -LiteralPath $rootPath -Recurse -File -Filter '*.md'
$required = @('README.md', 'index.md', '00-authority.md', '01-navigation.md', '02-capture-guide.md', '03-operating-model.md', '04-maintenance.md')
$missing = @($required | Where-Object { -not (Test-Path -LiteralPath (Join-Path $rootPath $_)) })
$issues = [System.Collections.Generic.List[string]]::new()

foreach ($file in $markdown) {
  $text = Get-Content -Raw -LiteralPath $file.FullName
  if ($file.Name -notin @('README.md', 'log.md', 'logs.md') -and $text -notmatch '(?m)^---\s*$') {
    $issues.Add("Ontbrekende frontmatter: $($file.FullName)")
  }
  if ($text -match ([char]0x2014)) {
    $issues.Add("Em dash gevonden: $($file.FullName)")
  }
}

foreach ($item in $missing) { $issues.Add("Ontbrekend kernbestand: $item") }

$agentSkills = Get-ChildItem -LiteralPath (Join-Path $rootPath '..\.agents\skills') -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
$claudeSkills = Get-ChildItem -LiteralPath (Join-Path $rootPath '..\.claude\skills') -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
if ((Compare-Object $agentSkills $claudeSkills) -ne $null) { $issues.Add('Skills in .agents en .claude zijn niet gespiegeld') }

if ($issues.Count -gt 0) {
  $issues | ForEach-Object { Write-Error $_ }
  exit 1
}

Write-Output "Kennis-check geslaagd: $($markdown.Count) Markdown-bestanden gecontroleerd."
