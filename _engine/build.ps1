# Marketing FM — tool build.
# Stitches shell + engine.css + engine.js + <tool>/config.js into <tool>/index.html.
#
# The output is a single self-contained file with no external requests, so it can be
# served statically, opened offline, or sent to someone on WhatsApp as a file.
# This script exists only so the engine has one source of truth instead of N copies
# that drift. Run it after editing anything in _engine/ or any config.js.
#
#   pwsh tools/_engine/build.ps1

$ErrorActionPreference = "Stop"

$root   = Split-Path -Parent $PSScriptRoot
$shell  = Get-Content (Join-Path $PSScriptRoot "shell.html") -Raw
$css    = Get-Content (Join-Path $PSScriptRoot "engine.css") -Raw
$engine = Get-Content (Join-Path $PSScriptRoot "engine.js")  -Raw

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$built = 0

Get-ChildItem $root -Directory |
  Where-Object { Test-Path (Join-Path $_.FullName "config.js") } |
  Sort-Object Name |
  ForEach-Object {
    $cfgPath = Join-Path $_.FullName "config.js"
    $cfg     = Get-Content $cfgPath -Raw

    # <title> and meta description come from the config, so every user-facing
    # string in a tool lives in exactly one file.
    $title = [regex]::Match($cfg, '(?m)^\s*title:\s*"(.*?)",\s*$').Groups[1].Value
    $desc  = [regex]::Match($cfg, '(?m)^\s*desc:\s*"(.*?)",\s*$').Groups[1].Value
    if (-not $title) { throw "No 'title:' line found in $cfgPath" }
    if (-not $desc)  { throw "No 'desc:' line found in $cfgPath" }

    # String.Replace is literal — a '$' in the copy is not a substitution.
    $out = $shell.
      Replace('{{TITLE}}',  $title).
      Replace('{{DESC}}',   $desc).
      Replace('{{CSS}}',    $css.TrimEnd()).
      Replace('{{CONFIG}}', $cfg.TrimEnd()).
      Replace('{{ENGINE}}', $engine.TrimEnd())

    [System.IO.File]::WriteAllText((Join-Path $_.FullName "index.html"), $out, $utf8NoBom)
    Write-Host ("  built  {0,-22} {1}" -f $_.Name, $title)
    $built++
  }

# The Toolbox index is a static page, not an engine tool, but it shares the
# stylesheet — so it is built here too rather than carrying a second copy of the CSS.
$toolboxSrc = Join-Path $PSScriptRoot "toolbox.src.html"
if (Test-Path $toolboxSrc) {
  $tb = (Get-Content $toolboxSrc -Raw).Replace('{{CSS}}', $css.TrimEnd())
  [System.IO.File]::WriteAllText((Join-Path $root "index.html"), $tb, $utf8NoBom)
  Write-Host ("  built  {0,-22} {1}" -f "index.html", "the Toolbox")
  $built++
}

Write-Host ""
Write-Host "$built page(s) built."
