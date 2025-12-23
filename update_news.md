# Panduan Update News - PMK Sumatra Static

Dokumen ini menjelaskan cara mengupdate berita menggunakan News Editor.

## 🚀 Cara Menjalankan News Editor

### 1. Start Server
Jalankan server dengan command:
```bash
npm run news
```

Server akan berjalan di: `http://localhost:3005`

### 2. Akses News Editor
Buka browser dan akses:
```
http://localhost:3005/news-editor.html
```

---

## ✏️ Cara Update News

### Menggunakan Web Interface (Recommended)

1. **Buka News Editor** di browser (`http://localhost:3005/news-editor.html`)

2. **Navigasi ke News yang ingin diedit**
   - Gunakan tombol **"← Sebelumnya"** atau **"Selanjutnya →"** untuk berpindah antar news (1-6)
   - Counter di kanan atas menunjukkan posisi news saat ini (contoh: "News 1 of 6")

3. **Edit Field yang Diperlukan**
   - **Judul Berita**: Masukkan judul berita
   - **Tanggal**: Format DD/MM/YYYY (otomatis terisi tanggal hari ini, bisa diedit)
   - **Kategori**: Pilih dari dropdown (Pemerintahan, Infrastruktur, Sosial, Nasional, Energi)
   - **Konten Berita**: Tulis konten lengkap berita
   - **Gambar**: Klik area upload atau drag & drop untuk upload gambar baru

4. **Simpan Perubahan**
   - Klik tombol **"💾 Simpan Berita"**
   - Modal dialog akan muncul dengan pesan: "News nomor X sudah berhasil disimpan!"
   - Klik **OK** untuk menutup modal

5. **Verifikasi**
   - Navigate ke news lain, lalu kembali ke news yang baru diedit
   - Pastikan perubahan tersimpan dengan benar

---

## 📁 Struktur File

### Lokasi File News
Semua file news disimpan di: `public/news/`

```
public/news/
├── category.json       # Daftar kategori
├── news1.json         # Data news 1
├── news2.json         # Data news 2
├── news3.json         # Data news 3
├── news4.json         # Data news 4
├── news5.json         # Data news 5
├── news6.json         # Data news 6
├── 1.jpg              # Gambar news 1
├── 2.jpg              # Gambar news 2
├── 3.jpg              # Gambar news 3
├── 4.jpg              # Gambar news 4
├── 5.jpg              # Gambar news 5
└── 6.jpg              # Gambar news 6
```

### Format JSON News

Setiap file news (news1.json - news6.json) memiliki struktur:

```json
{
  "title": "Judul Berita",
  "title_en": "News Title (English)",
  "date": "DD/MM/YYYY",
  "category": "Kategori",
  "category_en": "Category (English)",
  "content": "Konten berita dalam bahasa Indonesia...",
  "content_en": "News content in English...",
  "image": "1.jpg"
}
```

**Field yang tersedia:**
- `title`: Judul berita (Bahasa Indonesia)
- `title_en`: Judul berita (English) - *optional*
- `date`: Tanggal berita (format DD/MM/YYYY)
- `category`: Kategori berita
- `category_en`: Kategori (English) - *optional*
- `content`: Konten berita (Bahasa Indonesia)
- `content_en`: Konten berita (English) - *optional*
- `image`: Nama file gambar (1.jpg - 6.jpg)

---

## 📝 Cara Update Manual (Tanpa Web Interface)

Jika ingin edit langsung file JSON:

1. **Edit File JSON**
   - Buka file `public/news/newsX.json` (X = 1-6)
   - Edit field yang diperlukan
   - Simpan file

2. **Ganti Gambar**
   - Replace file `public/news/X.jpg` dengan gambar baru
   - Pastikan nama file tetap sama (1.jpg - 6.jpg)
   - Format yang didukung: JPG, PNG, GIF

3. **Update Kategori** (jika perlu)
   - Edit file `public/news/category.json`
   - Format: array of strings
   ```json
   [
     "Pemerintahan",
     "Infrastruktur",
     "Sosial",
     "Nasional",
     "Energi"
   ]
   ```

---

## 🎯 Tips & Best Practices

1. **Backup Data**
   - Selalu backup file JSON sebelum melakukan perubahan besar
   - Copy folder `public/news/` ke lokasi aman

2. **Format Tanggal**
   - Gunakan format DD/MM/YYYY konsisten
   - Contoh: `23/12/2025`

3. **Ukuran Gambar**
   - Recommended: 800x600 pixels atau lebih
   - Format: JPG untuk ukuran file lebih kecil
   - Compress gambar sebelum upload untuk performa lebih baik

4. **Konten Berita**
   - Tulis konten yang jelas dan informatif
   - Gunakan paragraf untuk readability
   - Maksimal panjang konten: tidak dibatasi, tapi usahakan concise

5. **Kategori**
   - Pilih kategori yang sesuai dengan konten berita
   - Jika perlu kategori baru, tambahkan di `category.json`

---

## 🔧 Troubleshooting

### Server tidak bisa start
```bash
# Pastikan dependencies terinstall
npm install

# Jalankan server
npm run news
```

### Perubahan tidak tersimpan
- Pastikan server sedang berjalan
- Check console browser untuk error
- Pastikan file permissions correct (read/write access)

### Gambar tidak muncul
- Pastikan file gambar ada di `public/news/`
- Nama file harus sesuai (1.jpg - 6.jpg)
- Check format file (JPG, PNG, GIF)
- Refresh browser (Ctrl+F5 atau Cmd+Shift+R)

### Modal tidak muncul setelah save
- Refresh halaman
- Check console browser untuk JavaScript errors
- Pastikan browser support modern JavaScript

---

## 📞 Support

Jika ada masalah atau pertanyaan, check:
1. Console browser (F12 → Console tab)
2. Server logs di terminal
3. File permissions di folder `public/news/`

---

**Last Updated**: 23/12/2025
