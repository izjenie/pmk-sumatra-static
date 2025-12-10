#!/bin/bash

# Script untuk mengambil data dari BNPB GIS Server
# by izjenie, Dec 2025
# dan menyimpan ke public/data/

DATA_DIR="public/data"

echo "Mengambil data dari BNPB GIS Server..."

# Jumlah Terluka
echo "  - Jumlah Terluka..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&orderByFields=&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22luka_sakit%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1' -o "$DATA_DIR/jumlah_luka.txt"

# Jumlah Hilang
echo "  - Jumlah Hilang..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&orderByFields=&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22hilang%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1' -o "$DATA_DIR/jumlah_hilang.txt"

# Jumlah Meninggal
echo "  - Jumlah Meninggal..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&orderByFields=&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22meninggal%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1' -o "$DATA_DIR/jumlah_meninggal.txt"

# Kabupaten Terdampak
echo "  - Kabupaten Terdampak..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&orderByFields=&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22kabupaten%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22count%22%7D%5D&returnDistinctValues=true&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1' -o "$DATA_DIR/jumlah_kabupaten_terdampak.txt"

# Jumlah Rumah Rusak
echo "  - Jumlah Rumah Rusak..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&orderByFields=&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22rumah_rusak%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1' -o "$DATA_DIR/jumlah_rumah_rusak.txt"

# Fasilitas Umum
echo "  - Fasilitas Umum..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&orderByFields=&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22fasum_rusak%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1' -o "$DATA_DIR/jumlah_fasilitas_umum.txt"

# Fasilitas Pendidikan
echo "  - Fasilitas Pendidikan..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&orderByFields=&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22pendidikan_rusak%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1' -o "$DATA_DIR/jumlah_fasilitas_pendidikan.txt"

# Rumah Ibadah
echo "  - Rumah Ibadah..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&orderByFields=&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22rumah_ibadat_rusak%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1' -o "$DATA_DIR/jumlah_rumah_ibadah.txt"

# Fasilitas Kesehatan
echo "  - Fasilitas Kesehatan..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&orderByFields=&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22fasyankes_rusak%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1' -o "$DATA_DIR/jumlah_fasilitas_kesehatan.txt"

# Gedung/Kantor
echo "  - Gedung/Kantor..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&orderByFields=&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22kantor_rusak%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1' -o "$DATA_DIR/jumlah_gedung_kantor.txt"

# Jembatan
echo "  - Jembatan..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&orderByFields=&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22jembatan_rusak%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1' -o "$DATA_DIR/jumlah_jembatan.txt"

# Jumlah Meninggal per Kabkot
echo "  - Jumlah Meninggal per Kabkot..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&groupByFieldsForStatistics=kabupaten&resultRecordCount=1000&where=meninggal%3E2&orderByFields=value%20DESC&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22meninggal%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects' -o "$DATA_DIR/jumlah_meninggal_kabkot.txt"

# Jumlah Pengungsi per Kabkot
echo "  - Jumlah Pengungsi per Kabkot..."
curl -s 'https://gis.bnpb.go.id/server/rest/services/thematic/BANSOR_SUMATERA/MapServer/17/query?f=json&cacheHint=true&groupByFieldsForStatistics=kabupaten&resultRecordCount=1000&where=mengungsi%3E%3D2000&orderByFields=value%20DESC&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22mengungsi%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&returnGeometry=false&spatialRel=esriSpatialRelIntersects' -o "$DATA_DIR/jumlah_pengungsi.txt"

# Update timestamp
echo "  - Update timestamp..."
date "+%d %B %Y, %H:%M WIB" > "$DATA_DIR/last_update.txt"

echo "Selesai! Data tersimpan di $DATA_DIR/"
