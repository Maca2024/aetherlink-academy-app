# protect-output.ps1 — portable launcher for protect_output.py.
# Keep this wrapper as a delegate so every platform uses the same path rule.
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command python3 -ErrorAction SilentlyContinue }
$implementation = Join-Path $scriptDir "protect_output.py"
if (-not $python -or -not (Test-Path -LiteralPath $implementation -PathType Leaf)) {
    [Console]::Error.WriteLine("Blocked by first-hook: protect_output.py or Python is unavailable")
    exit 2
}
& $python.Source $implementation
exit $LASTEXITCODE
