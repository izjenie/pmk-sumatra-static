# Server Deployment Guide

Panduan step-by-step untuk deploy update ke production server.

---

## Step 1: Build di Lokal

Jalankan build untuk generate folder `dist/` yang baru:

```bash
npm run build
```

---

## Step 2: Push ke GitHub

Commit dan push perubahan ke repository:

```bash
git add .
git commit -m "Update deployment"
git push
```

---

## Step 3: Login ke Server

Login ke production server.

---

## Step 4: Masuk ke Directory Project

```bash
cd ~/pmk-sumatra-static
```

---

## Step 5: Pull Update dari GitHub

```bash
git pull
```

---

## Step 6: Remove Semua Docker Container

Hapus semua container yang sedang berjalan:

```bash
sudo docker rm -f $(sudo docker ps -a -q)
```

---

## Step 7: Jalankan Docker Baru

```bash
sudo ./docker-production.sh
```

---

## Verifikasi

Cek apakah container sudah berjalan:

```bash
sudo docker ps
```

Akses aplikasi di browser: https://tanggap-bencana.go.id/sumatera/
