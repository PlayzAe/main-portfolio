# Peak Development Server - Process Lifecycle Manager
[CmdletBinding()]
param(
    [int]$Port = 5173,
    [string]$HostName = "localhost"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BaseDir = Split-Path -Parent $ScriptDir
$Url = "http://${HostName}:${Port}"

function Free-Port {
    param([int]$targetPort)
    try {
        $netstat = netstat -ano | Select-String ":$targetPort\s+.*LISTENING"
        foreach ($line in $netstat) {
            $parts = ($line.ToString().Trim() -split '\s+')
            $listeningPid = $parts[-1]
            if ($listeningPid -match '^\d+$' -and [int]$listeningPid -gt 0) {
                Write-Host "[Peak] Releasing port $targetPort (stopping PID $listeningPid)..." -ForegroundColor Yellow
                & taskkill.exe /F /T /PID $listeningPid 2>$null | Out-Null
            }
        }
    } catch {
        # Ignore cleanup errors
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "             PEAK - DEVELOPMENT SERVER                      " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Clean up any previous stale process on the target port
Free-Port -targetPort $Port

# 2. Determine npm command
$npmCmd = "npm.cmd"
if (-not (Get-Command "npm.cmd" -ErrorAction SilentlyContinue)) {
    $npmCmd = "npm"
}

# 3. Start dev server in sub-shell
Write-Host "[Peak] Starting dev server ('$npmCmd run dev')..." -ForegroundColor Green
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "cmd.exe"
$psi.Arguments = "/c $npmCmd run dev"
$psi.WorkingDirectory = $BaseDir
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $false

$devProc = [System.Diagnostics.Process]::Start($psi)

# 4. Resolve parent CMD PID and launch background watchdog
$cmdParentPid = 0
try {
    $cimProc = Get-CimInstance Win32_Process -Filter "ProcessId = $PID" -ErrorAction SilentlyContinue
    if ($cimProc) {
        $cmdParentPid = $cimProc.ParentProcessId
    }
} catch {}

$watchdogScript = Join-Path $ScriptDir "watchdog.ps1"
$watchdogProc = $null
if (Test-Path $watchdogScript) {
    try {
        $wPsi = New-Object System.Diagnostics.ProcessStartInfo
        $wPsi.FileName = "powershell.exe"
        $wPsi.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$watchdogScript`" -SupervisorPid $($PID) -ParentPid $cmdParentPid -TargetPort $Port -DevServerPid $($devProc.Id)"
        $wPsi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
        $wPsi.CreateNoWindow = $true
        $wPsi.UseShellExecute = $false
        $watchdogProc = [System.Diagnostics.Process]::Start($wPsi)
    } catch {
        # Watchdog is an extra safety layer; continue even if restricted
    }
}

# 5. Wait for the server to become available
Write-Host "[Peak] Waiting for dev server at $Url..." -ForegroundColor Green
$serverReady = $false
$maxAttempts = 40
$attempt = 0

while (-not $serverReady -and $attempt -lt $maxAttempts) {
    if ($devProc.HasExited) {
        Write-Host "[Peak] ERROR: Dev server process exited unexpectedly with code $($devProc.ExitCode)." -ForegroundColor Red
        break
    }
    $attempt++
    Start-Sleep -Milliseconds 350
    try {
        $check = netstat -ano | Select-String ":$Port\s+.*LISTENING"
        if ($check) {
            $serverReady = $true
        } else {
            $tcpClient = New-Object System.Net.Sockets.TcpClient
            $connect = $tcpClient.BeginConnect("localhost", $Port, $null, $null)
            $wait = $connect.AsyncWaitHandle.WaitOne(200, $false)
            if ($wait -and $tcpClient.Connected) {
                $serverReady = $true
            }
            $tcpClient.Close()
        }
    } catch {
        # Still booting up
    }
}

if ($serverReady) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  Peak Dev Server is LIVE at $Url" -ForegroundColor Green
    Write-Host "  Opening default web browser..." -ForegroundColor Green
    Write-Host "  Press [Q] or [Ctrl+C] to stop the server cleanly." -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host ""

    # Open default browser
    try {
        Start-Process $Url
    } catch {
        Write-Host "[Peak] Note: Browser auto-launch failed. You can open $Url manually." -ForegroundColor Gray
    }
} else {
    Write-Host "[Peak] WARNING: Server port check timed out. Please check the logs above." -ForegroundColor Yellow
}

# 6. Monitor process and wait for termination
try {
    $canReadKey = $false
    try {
        $canReadKey = [Console]::KeyAvailable -ne $null
    } catch {
        $canReadKey = $false
    }

    if ($canReadKey) {
        while (-not $devProc.HasExited) {
            if ([Console]::KeyAvailable) {
                $key = [Console]::ReadKey($true)
                if ($key.Key -eq [ConsoleKey]::Q) {
                    Write-Host ""
                    Write-Host "[Peak] Stop requested (Q pressed)." -ForegroundColor Cyan
                    break
                }
            }
            Start-Sleep -Milliseconds 250
        }
    } else {
        $devProc.WaitForExit()
    }
} finally {
    Write-Host ""
    Write-Host "[Peak] Shutting down development server..." -ForegroundColor Yellow

    # Stop dev process and tree
    try {
        if (-not $devProc.HasExited) {
            & taskkill.exe /F /T /PID $devProc.Id 2>$null | Out-Null
        }
    } catch {}

    # Stop watchdog process
    try {
        if ($watchdogProc -and -not $watchdogProc.HasExited) {
            Stop-Process -Id $watchdogProc.Id -Force -ErrorAction SilentlyContinue
        }
    } catch {}

    # Final sweep of port 5173
    Free-Port -targetPort $Port

    Write-Host "[Peak] Dev server stopped. All child processes cleaned up." -ForegroundColor Green
    Write-Host ""
}
