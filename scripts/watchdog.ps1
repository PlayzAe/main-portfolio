# Peak Development Server - Background Watchdog
# Ensures child processes are immediately cleaned up if the parent window or supervisor is closed
param(
    [Parameter(Mandatory = $true)]
    [int]$SupervisorPid,
    [Parameter(Mandatory = $false)]
    [int]$ParentPid = 0,
    [Parameter(Mandatory = $false)]
    [int]$TargetPort = 5173,
    [Parameter(Mandatory = $false)]
    [int]$DevServerPid = 0
)

$ErrorActionPreference = "SilentlyContinue"

while ($true) {
    Start-Sleep -Milliseconds 500

    $supervisorDead = $false
    $parentDead = $false

    # Check supervisor (powershell process)
    if ($SupervisorPid -gt 0) {
        $sup = Get-Process -Id $SupervisorPid -ErrorAction SilentlyContinue
        if (-not $sup) {
            $supervisorDead = $true
        }
    }

    # Check parent (cmd.exe process) if provided
    if ($ParentPid -gt 0) {
        $par = Get-Process -Id $ParentPid -ErrorAction SilentlyContinue
        if (-not $par) {
            $parentDead = $true
        }
    }

    # If either the cmd launcher or supervisor powershell exited, trigger cleanup
    if ($supervisorDead -or $parentDead) {
        if ($DevServerPid -gt 0) {
            & taskkill.exe /F /T /PID $DevServerPid 2>$null | Out-Null
        }

        # Also kill supervisor tree if parent died first
        if ($parentDead -and $SupervisorPid -gt 0) {
            & taskkill.exe /F /T /PID $SupervisorPid 2>$null | Out-Null
        }

        # Sweep target port to eradicate any listening processes
        $netstat = netstat -ano | Select-String ":$TargetPort\s+.*LISTENING"
        foreach ($line in $netstat) {
            $parts = ($line.ToString().Trim() -split '\s+')
            $listeningPid = $parts[-1]
            if ($listeningPid -match '^\d+$' -and [int]$listeningPid -gt 0) {
                & taskkill.exe /F /T /PID $listeningPid 2>$null | Out-Null
            }
        }
        break
    }
}
