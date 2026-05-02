# Mangsakala MVP — start backend + open frontend
# Usage: .\start.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

Write-Host "Starting Mangsakala backend..." -ForegroundColor Cyan
$server = Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000" `
    -WorkingDirectory $backend -PassThru -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "Opening frontend..." -ForegroundColor Cyan
Start-Process (Join-Path $frontend "Mangsakala.html")

Write-Host ""
Write-Host "Backend : http://localhost:8000" -ForegroundColor Green
Write-Host "API docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Press Enter to stop the server..." -ForegroundColor Yellow
Read-Host | Out-Null
Stop-Process -Id $server.Id -Force
Write-Host "Server stopped." -ForegroundColor Red
