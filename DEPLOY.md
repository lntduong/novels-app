# Hướng dẫn Deploy Website lên NAS Synology

Đây là hướng dẫn cập nhật website `vnnovely` lên NAS bằng script tự động.

## 1. Yêu cầu chuẩn bị
- Máy tính Windows đã cài sẵn **OpenSSH Client** (mặc định Windows 10/11 đều có).
- Trên NAS Synology:
    - Đã bật **SSH** (Control Panel > Terminal & SNMP > Enable SSH service).
    - Đã có Docker (Container Manager).
- File script: `scripts/deploy.ps1`.

## 2. Cách chạy Deploy (Khuyên dùng)
Mỗi khi bạn sửa code xong và muốn đẩy lên NAS để chạy:

1.  Mở thư mục `vnnovely/novels/scripts` trong Explorer.
2.  Chuột phải vào file **`deploy.ps1`**.
3.  Chọn **Run with PowerShell**.

### Quá trình chạy:
1.  **Copy file**: Script sẽ dùng kết nối SCP để copy code mới nhất lên thư mục `/volume1/web/novels` trên NAS.
    - *Lưu ý: Chỉ copy code nguồn, không copy `node_modules` nên rất nhẹ.*
2.  **Build Docker**: Script sẽ tự động SSH vào NAS và chạy lệnh `docker compose up -d --build`.
3.  **Nhập mật khẩu**: Khi hiện nhắc lệnh `Password:`, hãy nhập mật khẩu Admin NAS của bạn và Enter.

---

## 3. Cách deploy thủ công (Khi gặp lỗi)
Nếu script trên gặp lỗi, bạn có thể thực hiện thủ công từng bước:

### Bước 1: Copy file
Copy toàn bộ các file/thư mục sau (ghi đè) lên NAS tại `/volume1/web/novels`:
- `src/`
- `public/`
- `prisma/`
- `Dockerfile`
- `docker-compose.yml`
- `next.config.ts`
- `package.json`

### Bước 2: Chạy lệnh trên NAS
1.  Mở Terminal (CMD/PowerShell) trên máy tính.
2.  SSH vào NAS: `ssh admin_user@IP_CUA_NAS`
3.  Di chuyển tới thư mục: `cd /volume1/web/novels`
4.  Chạy lệnh build:
    ```bash
    sudo /usr/local/bin/docker compose up -d --build
    ```

## 4. Các lỗi thường gặp

**Lỗi: `scp: Connection closed` hoặc `subsystem request failed`**
- Do NAS tắt SFTP.
- **Khắc phục**: Dùng cờ `-O` trong lệnh scp (script đã tự động có).

**Lỗi: `sudo: docker: command not found`**
- Do Docker chưa được thêm vào PATH của sudo.
- **Khắc phục**: Dùng đường dẫn tuyệt đối `/usr/local/bin/docker` (script đã tự động có).

**Lỗi: Tên file/thư mục không tìm thấy**
- Kiểm tra lại đường dẫn `$NAS_PATH` trong file script xem có đúng với thực tế trên NAS không.
