#!/bin/bash

# Script untuk scheduled update data dan rebuild
# Jalankan dengan cron atau manual

cd /home/admin/pmk-sumatra-static

echo "=== Scheduled Update Started ==="
echo "$(date)"
echo ""

# 1. Ambil data terbaru dari BNPB
echo "Step 1: Mengambil data dari BNPB..."
./darurat-data-retrieve.sh
echo ""

# 2. Build aplikasi
echo "Step 2: Building aplikasi..."
npm run build
echo ""

# 3. Jalankan Docker production
echo "Step 3: Menjalankan Docker production..."
sudo ./docker-production.sh
echo ""

echo "=== Scheduled Update Completed ==="
echo "$(date)"
