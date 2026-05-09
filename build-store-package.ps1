# Build Chrome Web Store submission package for TITANSYS MIND
# Produces: titansys-mind-v7.0.0.zip (runtime files only, no dev artifacts)

$version = "7.0.0"
$outFile = "scriptflow-v$version.zip"
$projectRoot = $PSScriptRoot

# Files and directories to include in the store package
$include = @(
    "manifest.json",
    "background.js",
    "sidepanel.html",
    "sidepanel.js",
    "sidepanel-v2.css",
    "sidepanel.css",
    "assessment_stage2_3.js",
    "modules",
    "data",
    "icons"
)

# Remove old package if exists
if (Test-Path $outFile) { Remove-Item $outFile -Force }

# Build zip from included items only
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open((Join-Path $projectRoot $outFile), 'Create')

foreach ($item in $include) {
    $fullPath = Join-Path $projectRoot $item
    if (Test-Path $fullPath -PathType Leaf) {
        $entry = $zip.CreateEntry($item)
        $stream = $entry.Open()
        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Close()
        Write-Host "  + $item"
    } elseif (Test-Path $fullPath -PathType Container) {
        Get-ChildItem -Path $fullPath -Recurse -File | ForEach-Object {
            $relative = $_.FullName.Substring($projectRoot.Length + 1).Replace('\', '/')
            $entry = $zip.CreateEntry($relative)
            $stream = $entry.Open()
            $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
            $stream.Write($bytes, 0, $bytes.Length)
            $stream.Close()
            Write-Host "  + $relative"
        }
    } else {
        Write-Host "  ! MISSING: $item"
    }
}

$zip.Dispose()
Write-Host ""
Write-Host "Package created: $outFile"
Write-Host "Excluded: src/, dist/, node_modules/, tests/, shared/, *.md, *.config.*, package*.json, tsconfig.json"
