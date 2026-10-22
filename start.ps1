$ErrorActionPreference = 'Stop'
$projectPath = $PSScriptRoot
foreach ($tool in @('java', 'mvn.cmd', 'npm.cmd')) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        throw "Missing $tool. Install Java JDK 21+, Maven 3.8+, and Node.js 22+, then reopen PowerShell. See README.md."
    }
}
foreach ($port in @(3000, 8081)) {
    $listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($listener) { throw "Port $port is occupied. Stop the previous app or choose other ports manually using README.md." }
}
Push-Location (Join-Path $projectPath 'frontend')
try {
    if (-not (Test-Path 'node_modules/next/package.json')) {
        & npm.cmd ci
        if ($LASTEXITCODE -ne 0) { throw 'Frontend installation failed.' }
    }
} finally { Pop-Location }
$backendPath = (Join-Path $projectPath 'backend').Replace("'", "''")
$frontendPath = (Join-Path $projectPath 'frontend').Replace("'", "''")
$backendCommand = "Set-Location '$backendPath'; `$env:SERVER_PORT='8081'; `$env:APP_PROFILE='dev'; mvn.cmd spring-boot:run"
$frontendCommand = "Set-Location '$frontendPath'; `$env:NEXT_PUBLIC_API_URL='http://localhost:8081/api'; npm.cmd run dev"
Start-Process powershell.exe -ArgumentList @('-NoProfile', '-NoExit', '-Command', $backendCommand)
Start-Process powershell.exe -ArgumentList @('-NoProfile', '-NoExit', '-Command', $frontendCommand)
Write-Host 'Started backend and frontend terminal windows. Wait for both Ready/Started messages.'
Write-Host 'Open http://localhost:3000. Database check: http://localhost:8081/api/health/db'
Write-Host 'Press Ctrl+C in each server terminal to stop it.'
