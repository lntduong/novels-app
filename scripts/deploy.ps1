# Deploy to Synology NAS (Automated)
# Usage: ./scripts/deploy.ps1

$NAS_USER = "yangyang"      # NAS User
$NAS_IP = "192.168.3.200"   # NAS IP
$NAS_PATH = "/volume1/web/novels"

# --- 1. SSH SETUP & CHECK ---
Write-Host "Checking SSH connection..." -ForegroundColor Yellow

# Di chuyen ve thu muc goc project
$ScriptRoot = Split-Path $MyInvocation.MyCommand.Path
Set-Location "$ScriptRoot\.."

# Generate SSH Key if not exists
if (-not (Test-Path "$env:USERPROFILE\.ssh\id_rsa")) {
    Write-Host "Creating SSH Key..." -ForegroundColor Yellow
    ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\id_rsa" -N '""'
}

# Ask for password ONCE for both SSH Setup (if needed) and SUDO
Write-Host "Nhap password NAS (dung cho SSH Setup & Sudo Deploy):" -ForegroundColor Cyan
$NAS_PASSWORD = Read-Host -AsSecureString
$NAS_PASSWORD_PLAIN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($NAS_PASSWORD))

# Try to SSH without password to check if key is already copied
ssh -o BatchMode=yes -o ConnectTimeout=5 "$NAS_USER@$NAS_IP" "echo 'SSH Connection OK'" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "SSH Key not found on NAS. Copying now..." -ForegroundColor Yellow
    $PublicKey = Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"
    
    # Use password to copy key. Using sshpass if available would be better, but pure PowerShell:
    # We use a trick: piping password to specific command might be hard without sshpass.
    # But user asks to merge. 
    # NOTE: Piping password to SSH for authentication is NOT supported by standard OpenSSH client on Windows without external tools like sshpass-win.
    # However, since we captured the password, we can try to use it for sudo later.
    # For copying key, standard ssh-copy-id is not on Windows.
    # We will assume user might still need to type password for the INITIAL copy if we can't automate it easily.
    # BUT, we can automate it if we use the exact logic from setup-ssh.ps1 but just run it.
    
    $SetupCmd = "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$PublicKey' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
    
    # This might prompt for password interactively because we can't easily pipe password to SSH Auth in Windows terminal
    Write-Host "Setting up SSH Key on NAS (Please enter password if prompted)..." -ForegroundColor Cyan
    ssh "$NAS_USER@$NAS_IP" $SetupCmd
}
else {
    Write-Host "SSH Key already setup. Skipping copy." -ForegroundColor Green
}

# --- 2. DEPLOYMENT ---
Write-Host "Starting Deployment..." -ForegroundColor Yellow

# Create Tarball (Excluding node_modules, .next, .git, builds, etc.)
Write-Host "Creating deployment package (deploy.tar.gz)..." -ForegroundColor Yellow
$ExcludeList = @("node_modules", ".next", ".git", ".vscode", "coverage", "deploy.tar.gz")
$ExcludeArgs = @()
foreach ($item in $ExcludeList) {
    $ExcludeArgs += "--exclude"
    $ExcludeArgs += $item
}

# Using bsttar included in Windows (tar.exe)
tar $ExcludeArgs -czf deploy.tar.gz .

if (-not (Test-Path "deploy.tar.gz")) {
    Write-Host "Failed to create deploy.tar.gz" -ForegroundColor Red
    exit 1
}

# Copy Files
Write-Host "Copying deployment package to $NAS_IP..." -ForegroundColor Yellow
# Copy tarball and .env file
scp -O deploy.tar.gz .env "$NAS_USER@$NAS_IP`:$NAS_PATH"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Copy successful!" -ForegroundColor Green
    
    # Clean up local tarball
    Remove-Item deploy.tar.gz -ErrorAction SilentlyContinue
    
    Write-Host "Extracting & Building on NAS..." -ForegroundColor Yellow
    
    # Build & Deploy Command
    # 1. Extract tarball
    # 2. Clean problematic folders AND conflicting icons
    # 3. Docker rebuild
    $BuildCmd = "cd $NAS_PATH && tar -xzf deploy.tar.gz && rm deploy.tar.gz && sudo -S -p '' sh -c 'rm -rf src/lib/supabase src/app/api/auth/login src/app/api/auth/logout src/app/auth prisma/fix-admin.ts public/vercel.svg public/next.svg public/favicon.ico src/app/favicon.ico && /usr/local/bin/docker compose up -d --build && echo Waiting for DB... && sleep 10 && /usr/local/bin/docker exec novels-web npx --yes prisma@5.22.0 db push --accept-data-loss --skip-generate'"
    
    # Execute with captured password for SUDO
    $NAS_PASSWORD_PLAIN | ssh "$NAS_USER@$NAS_IP" $BuildCmd
    
    Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Cyan
}
else {
    Write-Host "File copy failed." -ForegroundColor Red
}

Pause
