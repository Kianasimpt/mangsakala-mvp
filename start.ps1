# Mangsakala MVP — start backend + frontend HTTP server
# Usage: .\start.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

Write-Host "Starting Mangsakala backend..." -ForegroundColor Cyan
$server = Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000" `
    -WorkingDirectory $backend -PassThru -WindowStyle Normal

Write-Host "Starting frontend server..." -ForegroundColor Cyan
$frontend_server = Start-Process -FilePath "python" -ArgumentList "-m", "http.server", "3000" `
    -WorkingDirectory $frontend -PassThru -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "Opening frontend..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/Mangsakala-Almanac.html"

Write-Host ""
Write-Host "Backend : http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000/Mangsakala-Almanac.html" -ForegroundColor Green
Write-Host "API docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Press Enter to stop servers..." -ForegroundColor Yellow
Read-Host | Out-Null
Stop-Process -Id $server.Id -Force
Stop-Process -Id $frontend_server.Id -Force
Write-Host "Servers stopped." -ForegroundColor Red
