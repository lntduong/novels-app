# Deploy to Synology NAS
# Usage: ./scripts/deploy.ps1

$NAS_USER = "yangyang"      # THAY TÊN USER NAS CỦA BẠN (VD: yangyang)
$NAS_IP = "192.168.3.200" # "100.100.66.15"     # IP NAS (Dùng IP Tailscale hoặc IP LAN)
$NAS_PATH = "/volume1/web/novels"

# Di chuyen ve thu muc goc project (cha cua folder scripts)
$ScriptRoot = Split-Path $MyInvocation.MyCommand.Path
Set-Location "$ScriptRoot\.."

# Ask for password once for SUDO
Write-Host "Nhap password NAS de chay lenh SUDO (se khong hien thi):" -ForegroundColor Cyan
$NAS_PASSWORD = Read-Host -AsSecureString
$NAS_PASSWORD_PLAIN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($NAS_PASSWORD))

Write-Host "Dang copy file len NAS ($NAS_IP)..." -ForegroundColor Yellow

# 1. Copy cac file quan trong
# Luu y: Ban nen chay scripts/setup-ssh.ps1 de khong phai nhap pass o buoc nay
scp -O -r src public prisma package.json next.config.ts Dockerfile docker-compose.yml .env "$NAS_USER@$NAS_IP`:$NAS_PATH"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Copy file thanh cong!" -ForegroundColor Green
    
    Write-Host "Dang build va khoi dong lai Docker tren NAS..." -ForegroundColor Yellow
    
    # 2. SSH vao va chay lenh build
    # Pipe password tu PowerShell vao SSH -> Sudo nhan tu Stdin
    # Luu y: -S doc password tu stdin. -p '' de khong hien prompt.
    # Chung ta can chuyen command sang dang: echo password | ssh ... nhung trong PowerShell de hon la dung InputObject
    
    $BuildCmd = "cd $NAS_PATH && sudo -S -p '' sh -c 'rm -rf src/lib/supabase src/app/api/auth/login src/app/api/auth/logout src/app/auth prisma/fix-admin.ts && /usr/local/bin/docker compose up -d --build'"
    
    # Su dung InputObject de pipe string vao stdin cua lenh ssh
    # Day la cach an toan nhat de pass password ma khong lo ve dau cau (quotes)
    $NAS_PASSWORD_PLAIN | ssh "$NAS_USER@$NAS_IP" $BuildCmd
    
    Write-Host "DA DEPLOY XONG!" -ForegroundColor Cyan
}
else {
    Write-Host "Loi khi copy file. Kiem tra lai ket noi hoac duong dan." -ForegroundColor Red
}

Pause
