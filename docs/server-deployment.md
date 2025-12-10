# Server Deployment Guide

Panduan step-by-step untuk deploy update ke production server.

---

## Step 1: Login ke Server

Login ke production server.

---

## Step 2: Masuk ke Directory Project

```bash
cd ~/pmk-sumatra-static
```

---

## Step 3: Pull Update dari GitHub

```bash
git pull
```

---

## Step 4: Build Aplikasi

```bash
sudo npm run build
```

---

## Step 5: Jalankan Docker Production

```bash
sudo ./scripts/docker-production.sh
```

---

## Verifikasi

Test di browser: https://www.tanggap-bencana.go.id
