# Helper script to set up SSH Keys for passwordless login to Synology NAS
$NAS_USER = "yangyang"
$NAS_IP = "192.168.3.200"

Write-Host "Creating SSH Key (if not exists)..." -ForegroundColor Yellow
if (-not (Test-Path "$env:USERPROFILE\.ssh\id_rsa")) {
    # Using '""' to properly pass empty string in PowerShell
    ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\id_rsa" -N '""'
}

Write-Host "Copying Public Key to NAS..." -ForegroundColor Yellow
$PublicKey = Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"

# Command to append key to authorized_keys on NAS
# We need to make sure .ssh directory exists and has permissions
$RemoteCommand = "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$PublicKey' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

Write-Host "Please enter your NAS password one last time to copy the key:" -ForegroundColor Cyan
ssh "$NAS_USER@$NAS_IP" $RemoteCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "SSH Key setup complete! You can now deploy without login passwords." -ForegroundColor Green
    Write-Host "Note: You might still be asked for password once per session for SUDO commands." -ForegroundColor Gray
}
else {
    Write-Host "Failed to setup keys. Please check your password and try again." -ForegroundColor Red
}

Pause
