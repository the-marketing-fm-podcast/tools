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

# Site pages — the portfolio at /, the Toolbox at /tools, the case studies under /work.
# These are static pages rather than engine tools, but they share the stylesheet, so
# they are built here rather than carrying a second copy of the CSS.
#
# site.css is the site layer: serif display, the wider container, the committed
# terracotta and the chart primitives. Tool pages never load it — a question card is a
# product surface and stays on engine.css alone.
#
# Naming convention decides the output path, so adding a page means adding one file:
#   index.src.html            -> /index.html
#   tools.src.html            -> /tools/index.html
#   work-rugsbysensei.src.html -> /work/rugsbysensei/index.html
$siteDir = Join-Path $PSScriptRoot "site"
$siteCss = ""
$siteCssPath = Join-Path $PSScriptRoot "site.css"
if (Test-Path $siteCssPath) { $siteCss = (Get-Content $siteCssPath -Raw).TrimEnd() }

if (Test-Path $siteDir) {
  Get-ChildItem $siteDir -Filter "*.src.html" | Sort-Object Name | ForEach-Object {
    $name = $_.Name -replace '\.src\.html$', ''

    if ($name -eq "index") {
      $outFile = Join-Path $root "index.html"
    } else {
      # first hyphen becomes a directory separator: work-zelha -> work/zelha
      $rel = $name -replace '^([^-]+)-', '$1/'
      $outDir = Join-Path $root ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)
      if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
      $outFile = Join-Path $outDir "index.html"
    }

    $page = (Get-Content $_.FullName -Raw).
      Replace('{{CSS}}',     $css.TrimEnd()).
      Replace('{{SITECSS}}', $siteCss)

    [System.IO.File]::WriteAllText($outFile, $page, $utf8NoBom)
    Write-Host ("  built  {0,-22} {1}" -f $name, $outFile.Substring($root.Length + 1))
    $built++
  }
}

Write-Host ""
Write-Host "$built page(s) built."
