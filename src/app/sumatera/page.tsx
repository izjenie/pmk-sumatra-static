"use client";

import { useState, useEffect } from 'react';
// Static data - no database connection needed
const newsData = [
  { 
    id: 1, 
    title: 'Pimpin Ratas Penanganan Bencana, Presiden Instruksikan Penyaluran Bantuan Lebih Teliti dan Tepat Waktu', 
    category: 'Pemerintahan', 
    image: '/news/1.jpg',
    date: '2025-12-08',
    content: 'Presiden Prabowo Subianto memimpin langsung Rapat Terbatas (Ratas) terkait penanganan dan pemulihan bencana alam di Aceh. Dalam rapat tersebut, Presiden memerintahkan jajarannya untuk segera menindaklanjuti temuan lapangan dan arahan-arahan yang telah disampaikan. Beliau menegaskan bahwa kekompakan seluruh unsur pemerintah, relawan, dan masyarakat merupakan kekuatan terbesar dalam mempercepat pemulihan wilayah yang terdampak bencana.\n\nDalam arahannya, Presiden menekankan pentingnya penyaluran bantuan yang lebih teliti dan tepat waktu agar segera sampai ke tangan warga yang membutuhkan. Operasi terpadu yang melibatkan TNI, Polri, Basarnas, dan BNPB serta pemerintah daerah diminta untuk diperkuat dalam mempercepat distribusi logistik dan memulihkan konektivitas antardaerah yang terputus.'
  },
  { 
    id: 2, 
    title: 'Tinjau Jembatan Bireuen-Takengon, Presiden Tunjuk KSAD Jenderal Maruli Simanjuntak Komandoi Perbaikan Infrastruktur', 
    category: 'Infrastruktur', 
    image: '/news/2.jpg',
    date: '2025-12-08',
    content: 'Usai meninjau pengerjaan jembatan di ruas vital Bireuen–Takengon, Kabupaten Bireuen, Presiden Prabowo berdialog langsung dengan warga dan petugas lapangan. Presiden melihat langsung kerja keras personel TNI, Polri, tim teknik PUPR, dan relawan dalam memulihkan akses yang terputus. Kunjungan ini menegaskan komitmen pemerintah untuk memastikan kebutuhan masyarakat terpenuhi dan isolasi wilayah segera berakhir.\n\nSebagai langkah percepatan strategis, Presiden menunjuk Kepala Staf Angkatan Darat (KSAD), Jenderal TNI Maruli Simanjuntak, sebagai komandan percepatan perbaikan infrastruktur. Penunjukan ini diharapkan dapat mengoptimalkan pengerahan alat berat dan personel untuk memperbaiki akses jalan dan jembatan yang rusak parah.'
  },
  { 
    id: 3, 
    title: 'Pastikan Stok Pangan Aman, Presiden: Bantuan Dikirim dari Berbagai Daerah untuk Warga Aceh', 
    category: 'Sosial', 
    image: '/news/3.jpg',
    date: '2025-12-08',
    content: 'Presiden Prabowo memastikan bahwa ketersediaan bahan pangan bagi warga terdampak bencana di Aceh telah diantisipasi dengan matang. Dalam keterangannya di Kabupaten Bireuen, Presiden menyebutkan bahwa bantuan tidak hanya mengandalkan stok lokal, tetapi juga akan dikirimkan dari berbagai daerah lain untuk menjamin tidak ada kekurangan logistik bagi para pengungsi maupun warga yang terisolir.\n\nPemerintah berkomitmen penuh untuk memastikan seluruh proses pemulihan berjalan cepat, terkoordinasi, dan sesuai dengan standar keselamatan. Tujuan utamanya adalah menjamin masyarakat Aceh dapat kembali beraktivitas dengan aman, lancar, dan normal sesegera mungkin.'
  },
  { 
    id: 4, 
    title: 'Presiden Prabowo Kembali ke Aceh, Tinjau Langsung Kerusakan Banjir dan Percepatan Penanganan Darurat', 
    category: 'Nasional', 
    image: '/news/4.jpg',
    date: '2025-12-08',
    content: 'Presiden Prabowo Subianto kembali melakukan kunjungan kerja ke Aceh untuk meninjau penanganan bencana alam secara langsung. Fokus utama kunjungan kali ini adalah melihat sejumlah lokasi yang mengalami kerusakan parah akibat banjir dan memastikan percepatan penanganan darurat berjalan efektif. Presiden ingin memastikan proses pemulihan di wilayah terdampak mendapatkan atensi maksimal dari pemerintah pusat.\n\nBapak Presiden juga melakukan pengecekan terhadap penyaluran bantuan dan proses evakuasi warga yang masih terjebak. Upaya pembukaan akses jalan yang terputus menjadi prioritas utama untuk memastikan isolasi wilayah dapat segera diakhiri dan bantuan logistik dapat masuk ke seluruh pelosok daerah bencana.'
  },
  { 
    id: 5, 
    title: 'Tinjau Posko Terpadu Lanud Sultan Iskandar Muda, Pemerintah Pastikan Arus Logistik Bantuan Terus Mengalir', 
    category: 'Nasional', 
    image: '/news/5.jpg',
    date: '2025-12-08',
    content: 'Menteri Koordinator Bidang Pembangunan Manusia dan Kebudayaan (Menko PMK), Pratikno, meninjau Posko Terpadu penanganan bencana alam Aceh di Lanud Sultan Iskandar Muda. Tempat ini difungsikan sebagai gudang logistik utama sebelum bantuan didistribusikan ke wilayah terdampak. Kunjungan ini memastikan kesiapan stok dan kelancaran rantai pasok bantuan kemanusiaan.\n\nSesuai arahan Bapak Presiden, bantuan tambahan akan terus dikirimkan dan berbagai langkah pemulihan akan dipercepat untuk memastikan masyarakat mendapatkan penanganan yang layak dan segera keluar dari masa tanggap darurat.'
  },
  { 
    id: 6, 
    title: 'PLN Berhasil Pulihkan 100% Sistem Kelistrikan Sumatra Utara Pasca Banjir dan Longsor', 
    category: 'Energi', 
    image: '/news/6.jpg',
    date: '2025-12-08',
    content: 'PT PLN (Persero) mengumumkan keberhasilan memulihkan 100% sistem kelistrikan yang terdampak banjir dan longsor di Sumatra Utara. Pemulihan total tercapai pada hari Minggu, di mana 103 jaringan distribusi yang sebelumnya rusak kini telah beroperasi kembali. Keberhasilan ini menjadi kabar baik bagi warga yang sempat mengalami pemadaman total akibat bencana alam.\n\nProses pemulihan ini merupakan hasil sinergi antara PLN, TNI, Polri, BNPB, pemerintah daerah, dan masyarakat setempat. Dalam waktu lima hari, tim gabungan berhasil memperbaiki infrastruktur listrik yang rusak di seluruh 33 kota/kabupaten yang terdampak.'
  },
];

// Data Logistik Stok PMI (sumber: pmi.or.id/dashboard/stock - 9 Desember 2025 pukul 22.59)
const pmiStockCategories = {
  'Makanan': [
    { name: 'Abon', quantity: '2.196 KARTON' },
    { name: 'Bubur Bayi', quantity: '277 KARTON' },
    { name: 'Bubur Instan', quantity: '9.396 PCS' },
    { name: 'Gula', quantity: '758 KARTON' },
    { name: 'Ikan Kaleng', quantity: '201 KALENG' },
    { name: 'Kopi Sachet', quantity: '41 KARTON' },
    { name: 'Kornet', quantity: '8.855 KALENG' },
    { name: 'Makanan Kaleng', quantity: '5.874 KALENG' },
    { name: 'Makanan Ringan', quantity: '129.284 KARTON' },
    { name: 'Makanan Siap Saji', quantity: '7 KARTON' },
    { name: 'Mie Instan', quantity: '11.999 KARTON' },
    { name: 'Rendang Kaleng', quantity: '1.175 KALENG' },
    { name: 'Sarden', quantity: '2.221 KARTON' },
    { name: 'Sosis', quantity: '52 KARTON' },
    { name: 'Susu Bubuk', quantity: '193 KARTON' },
    { name: 'Susu Kaleng', quantity: '234 KALENG' },
    { name: 'Susu Kotak', quantity: '3.071 KARTON' },
    { name: 'Susu Sachet', quantity: '40 KARTON' },
    { name: 'Telur', quantity: '570 KG' },
    { name: 'Telur Asin', quantity: '35 KARTON' },
  ],
  'Minuman': [
    { name: 'Air Mineral', quantity: '6.586 KARTON' },
    { name: 'Minuman Energy', quantity: '7.282 PCS' },
    { name: 'Minuman Kaleng', quantity: '12 KARTON' },
    { name: 'Minuman Kemasan Botol', quantity: '332 KARTON' },
    { name: 'Minuman Sachet', quantity: '143 KARTON' },
  ],
  'Sembako': [
    { name: 'Beras', quantity: '783.535 Kg' },
    { name: 'Bumbu Instan', quantity: '102 KARTON' },
    { name: 'Garam', quantity: '21 KARTON' },
    { name: 'Kecap Manis', quantity: '16 KARTON' },
    { name: 'Kurma', quantity: '90 BOX' },
    { name: 'Madu', quantity: '120 PCS' },
    { name: 'Minyak Goreng 1L', quantity: '814 KARTON' },
    { name: 'Minyak Kayu Putih', quantity: '1.382 PCS' },
    { name: 'Sambal Botol', quantity: '1 KARTON' },
    { name: 'Teh Celup', quantity: '75 KARTON + 38 PACK' },
  ],
  'Pakaian': [
    { name: 'Celana Dalam Pria', quantity: '2.935 PCS' },
    { name: 'Celana Dalam Wanita', quantity: '950 PCS' },
    { name: 'Celana Panjang Wanita', quantity: '3.224 PCS' },
    { name: 'Daster', quantity: '3.500 UNIT' },
    { name: 'Garment Produk', quantity: '20.890 Pcs' },
    { name: 'Handuk', quantity: '134 BALE + 2.432 PCS' },
    { name: 'Jaket', quantity: '4 BALE' },
    { name: 'Jas Hujan', quantity: '682 PCS' },
    { name: 'Kaos Kaki', quantity: '100 KARTON' },
    { name: 'Kerudung', quantity: '14 BOX' },
    { name: 'Pakaian Anak', quantity: '5.942 PCS' },
    { name: 'Pakaian Dewasa', quantity: '25.631 PCS' },
    { name: 'Rompi Biru', quantity: '142 PCS' },
    { name: 'Rompi Merah', quantity: '1.363 PCS + 25 UNIT' },
    { name: 'Sarung', quantity: '32.164 PCS' },
    { name: 'Sandal Jepit', quantity: '100 PCS' },
    { name: 'Sepatu Boot', quantity: '864 PCS' },
    { name: 'Seragam Sekolah', quantity: '932 PCS' },
    { name: 'Shoes Cover', quantity: '625 PCS' },
  ],
  'Perlengkapan Bayi': [
    { name: 'Baby Kit', quantity: '1.935 BOX' },
    { name: 'Bedak Bayi', quantity: '12 BOX' },
    { name: 'Biskuit Bayi', quantity: '62 KARTON' },
    { name: 'Perlengkapan Bayi', quantity: '30 PACK + 10 BALE' },
    { name: 'Popok Anak', quantity: '2.283 KARTON' },
    { name: 'Popok Dewasa', quantity: '295 KARTON' },
    { name: 'Sabun Bayi', quantity: '4 BOX' },
  ],
  'Kesehatan': [
    { name: 'Alkohol Swab', quantity: '6 BOX' },
    { name: 'Apron', quantity: '12.690 PCS' },
    { name: 'Cairan Infus', quantity: '4 BOX' },
    { name: 'Face Shield', quantity: '12.140 PCS' },
    { name: 'Hazmat', quantity: '2.571 PCS' },
    { name: 'Head Cap', quantity: '50.000 PCS' },
    { name: 'Hygiene Kit', quantity: '9.166 BOX' },
    { name: 'Isolation Gowns', quantity: '7.600 UNIT' },
    { name: 'Kantong Mayat', quantity: '2.420 PCS' },
    { name: 'Kelambu', quantity: '10.615 PCS' },
    { name: 'Masker Kain', quantity: '129.082 PCS' },
    { name: 'Masker Medis', quantity: '290.465 PCS' },
    { name: 'Masker N95', quantity: '5.386 PCS' },
    { name: 'Obat-obatan', quantity: '930 KARTON' },
    { name: 'Oximeter', quantity: '270 PCS' },
    { name: 'Oxygen Concentrator', quantity: '10 UNIT' },
    { name: 'Pembalut Wanita', quantity: '957 KARTON + 3.397 PCS' },
    { name: 'Sarung Tangan Latex', quantity: '2.770 PCS' },
    { name: 'Thermometer Infrared', quantity: '285 PCS' },
    { name: 'Vitamin C', quantity: '889 KARTON' },
  ],
  'Tenda': [
    { name: 'Cover Tenda Rub Hall', quantity: '2 PCS' },
    { name: 'Tenda', quantity: '13 UNIT' },
    { name: 'Tenda Emergency', quantity: '1 UNIT' },
    { name: 'Tenda Family', quantity: '286 BAG' },
    { name: 'Tenda Gulung 2025', quantity: '800 UNIT' },
    { name: 'Tenda Individu', quantity: '71 UNIT' },
    { name: 'Tenda Modular', quantity: '450 UNIT' },
    { name: 'Tenda Oval', quantity: '2 UNIT' },
    { name: 'Tenda Peleton', quantity: '8 UNIT' },
    { name: 'Tenda Personil', quantity: '10 UNIT' },
    { name: 'Tenda Regu', quantity: '1 UNIT' },
    { name: 'Tenda Relawan', quantity: '2 UNIT' },
    { name: 'Tenda Serbaguna', quantity: '2 UNIT' },
    { name: 'Tenda Alas', quantity: '12 UNIT' },
  ],
  'Evakuasi': [
    { name: 'Hand Sirine Besar', quantity: '23 UNIT' },
    { name: 'Hand Sirine Kecil', quantity: '10 UNIT' },
    { name: 'Helm', quantity: '267 UNIT' },
    { name: 'Perahu Karet', quantity: '2 UNIT' },
    { name: 'Perlengkapan SAR', quantity: '1 BAG' },
    { name: 'Tali Twist Rope', quantity: '457 ROL' },
    { name: 'Tambang', quantity: '8 ROL' },
    { name: 'Tandu Basket', quantity: '4 UNIT' },
    { name: 'Tandu Lipat', quantity: '5 UNIT' },
    { name: 'Tandu Scoope', quantity: '5 UNIT' },
    { name: 'Tas Evakuasi', quantity: '249 PCS' },
    { name: 'Vertical Rescue', quantity: '1 BOX' },
  ],
  'Alat Kebutuhan': [
    { name: 'Bantal', quantity: '244 UNIT' },
    { name: 'Folding Bed', quantity: '91 UNIT' },
    { name: 'Genset', quantity: '4 UNIT' },
    { name: 'Genset Portable', quantity: '15 UNIT' },
    { name: 'Handy Talky Motorola', quantity: '98 UNIT' },
    { name: 'Jerigen 10L', quantity: '9.733 PCS' },
    { name: 'Jerigen 20L', quantity: '2.880 PCS' },
    { name: 'Kasur', quantity: '854 UNIT' },
    { name: 'Kitchen Kit', quantity: '2.550 BOX' },
    { name: 'Lampu Emergency', quantity: '15.336 UNIT' },
    { name: 'Matras', quantity: '1.473 PCS' },
    { name: 'Modul Starlink', quantity: '10 UNIT' },
    { name: 'School Kit', quantity: '3.245 BAG' },
    { name: 'Selimut', quantity: '417 BALE + 15.256 PCS' },
    { name: 'Shelter Kit', quantity: '145 BAG' },
    { name: 'Shelter Tool Kit', quantity: '1.100 BAG' },
    { name: 'Starlink', quantity: '90 UNIT' },
    { name: 'Tarpaulin', quantity: '1.383 PCS + 1.419 UNIT' },
    { name: 'Terpal Roll', quantity: '40 ROL' },
    { name: 'Tikar', quantity: '800 PCS' },
  ],
  'Air & Sanitasi': [
    { name: 'Cleaning Kit', quantity: '2.162 BAG' },
    { name: 'Filter Air', quantity: '38 UNIT' },
    { name: 'Hand Sanitizer', quantity: '94 KARTON' },
    { name: 'Hand Sprayer 16L', quantity: '20 UNIT' },
    { name: 'Pompa Air', quantity: '7 UNIT' },
    { name: 'Sabun Cuci', quantity: '31 KARTON' },
    { name: 'Sabun Cuci Piring', quantity: '15 KARTON' },
    { name: 'Sabun Mandi', quantity: '1.201 BOX' },
    { name: 'Sabun Mandi Cair', quantity: '1.176 PCS' },
    { name: 'Seng Gelombang', quantity: '46.969 PCS' },
    { name: 'Shampo', quantity: '2.246 BOTOL' },
    { name: 'Water Bladder', quantity: '15 UNIT' },
    { name: 'Water Tank 6M3', quantity: '1 UNIT' },
    { name: 'Watertank Onion 5M3', quantity: '28 UNIT' },
    { name: 'Watertank Onion 10M3', quantity: '1 UNIT' },
  ],
};

const pmiCategoryList = Object.keys(pmiStockCategories);

// Data Pos Pengungsian
const posPengungsianData = {
  'Aceh': [
    { name: 'SMU 1 Rantau', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Kantor BPBD Aceh Barat', lokasi: 'Aceh Barat - Johan Pahlawan', lat: 4.146, lng: 96.126, kabupaten: 'Aceh Barat', kecamatan: 'Johan Pahlawan' },
    { name: 'RSUD Cut Nyak Dhien', lokasi: 'Aceh Barat - Johan Pahlawan', lat: 4.146, lng: 96.126, kabupaten: 'Aceh Barat', kecamatan: 'Johan Pahlawan' },
    { name: 'Rumah Sakit Teuku Peukan', lokasi: 'Aceh Barat Daya - Susoh', lat: 3.735, lng: 96.84, kabupaten: 'Aceh Barat Daya', kecamatan: 'Blangpidie' },
    { name: 'Kantor Camat Trumon', lokasi: 'Aceh Selatan - Trumon', lat: 2.825, lng: 97.62, kabupaten: 'Aceh Selatan', kecamatan: 'Trumon' },
    { name: 'RSUD Dr. H. Yuliddin Away', lokasi: 'Aceh Selatan - Tapak Tuan', lat: 3.262, lng: 97.185, kabupaten: 'Aceh Selatan', kecamatan: 'Tapaktuan' },
    { name: 'Kantor BPBD Kab. Aceh Singkil', lokasi: 'Aceh Singkil - Singkil', lat: 2.28, lng: 97.79, kabupaten: 'Aceh Singkil', kecamatan: 'Singkil' },
    { name: 'RSUD Aceh Singkil', lokasi: 'Aceh Singkil - Gunung Meriah', lat: 2.305, lng: 97.85, kabupaten: 'Aceh Singkil', kecamatan: 'Singkil' },
    { name: 'GOR Aceh Tamiang, Karang Baru', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Puskesmas Karang Baru', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Mesjid At-Taqwa Rantau', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Kejaksaan Negeri Aceh Tamiang', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'SMK 1 Kota Lintang', lokasi: 'Aceh Tamiang - Kota Kuala Simpang', lat: 4.281, lng: 98.062, kabupaten: 'Aceh Tamiang', kecamatan: 'Kota Kualasinpang' },
    { name: 'Aula Setdakab (Serule Kayu)', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Masjid Balee Redelong', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'SD 2 Jamur Ujung', lokasi: 'Bener Meriah - Wih Pesam', lat: 4.7, lng: 96.8, kabupaten: 'Bener Meriah', kecamatan: 'Wih Pesam' },
  ],
  'Sumatera Utara': [
    { name: 'GOR Pandan', lokasi: 'Tapanuli Tengah - Pandan', lat: 1.69, lng: 98.83, kabupaten: 'Tapanuli Tengah', kecamatan: 'Pandan' },
    { name: 'Lobu Pining', lokasi: 'Tapanuli Utara - Pahae Julu', lat: 1.9682, lng: 99.0185, kabupaten: 'Tapanuli Utara', kecamatan: 'Siatas Barita' },
    { name: 'Gereja HKBP Desa Sibalanga', lokasi: 'Tapanuli Utara - Adian Koting', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'SMAN 1 Kejuruan Muda', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'Gedung Serba Guna', lokasi: 'Deli Serdang - Pantai Labu', lat: 3.6503, lng: 98.9099, kabupaten: 'Deli Serdang', kecamatan: 'Pantai Labu' },
    { name: 'Desa Bulu Cina', lokasi: 'Deli Serdang - Hamparan Perak', lat: 3.73, lng: 98.57, kabupaten: 'Deli Serdang', kecamatan: 'Hamparan Perak' },
    { name: 'Wisma Gereja HKBP Ds. Tarabintang', lokasi: 'Humbang Hasundutan - Tarabintang', lat: 2.1, lng: 98.55, kabupaten: 'Humbang Hasundutan', kecamatan: 'Pakkat' },
    { name: 'Jalan T.Imam Bonjol Kel. Setia', lokasi: 'Kota Binjai - Binjai Kota', lat: 3.6, lng: 98.48, kabupaten: 'Kota Binjai', kecamatan: 'Binjai Kota' },
    { name: 'Kantor Lurah Sei Mati', lokasi: 'Kota Medan - Medan Labuhan', lat: 3.695, lng: 98.69, kabupaten: 'Kota Medan', kecamatan: 'Medan Labuhan' },
    { name: 'Masjid Al Falah', lokasi: 'Kota Medan - Medan Maimun', lat: 3.578, lng: 98.685, kabupaten: 'Kota Medan', kecamatan: 'Medan Maimun' },
    { name: 'Kantor Walikota', lokasi: 'Kota Padang Sidempuan - Padangsidimpuan Utara', lat: 1.38, lng: 99.27, kabupaten: 'Kota Padang Sidempuan', kecamatan: 'Padangsidimpuan Utara' },
    { name: 'GOR Porimbunan', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Area Toll Tanjung Pura', lokasi: 'Langkat - Tanjung Pura', lat: 3.9102, lng: 98.4324, kabupaten: 'Langkat', kecamatan: 'Tanjung Pura' },
    { name: 'Masjid At Taqwa Besitang', lokasi: 'Langkat - Besitang', lat: 4.0641, lng: 98.1591, kabupaten: 'Langkat', kecamatan: 'Besitang' },
    { name: 'SMPN Besitang', lokasi: 'Langkat - Besitang', lat: 4.064, lng: 98.1567, kabupaten: 'Langkat', kecamatan: 'Besitang' },
    { name: 'Ds. Sei Rampah', lokasi: 'Serdang Bedagai - Sei Rampah', lat: 3.48, lng: 99.13, kabupaten: 'Serdang Bedagai', kecamatan: 'Sei Rampah' },
  ],
  'Sumatera Barat': [
    { name: 'Kantor Camat IV Koto', lokasi: 'Agam - IV Koto', lat: -0.25, lng: 100.35, kabupaten: 'Agam', kecamatan: 'Tilatang Kamang' },
    { name: 'BPBD Agam, Padang Baru', lokasi: 'Agam - Lubuk Basung', lat: -0.33, lng: 100.04, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'RSUD Lubuk Basung', lokasi: 'Agam - Lubuk Basung', lat: -0.33, lng: 100.04, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'Masjid Raya Ansharullah Nanggalo Padang', lokasi: 'Kota Padang - Nanggalo', lat: -0.89, lng: 100.37, kabupaten: 'Kota Padang', kecamatan: 'Nanggalo' },
    { name: 'Rumah Dinas Wali Kota Padang', lokasi: 'Kota Padang - Padang Barat', lat: -0.945, lng: 100.355, kabupaten: 'Kota Padang', kecamatan: 'Padang Barat' },
    { name: 'Posko Tanggap Darurat Kelurahan Batu Gadang', lokasi: 'Kota Padang - Lubuk Kilangan', lat: -0.95, lng: 100.45, kabupaten: 'Kota Padang', kecamatan: 'Lubuk Kilangan' },
    { name: 'Posko Tanggap Darurat Kelurahan Koto Lalang', lokasi: 'Kota Padang - Lubuk Kilangan', lat: -0.95, lng: 100.45, kabupaten: 'Kota Padang', kecamatan: 'Lubuk Kilangan' },
    { name: 'GOR Bulutangkis Bancah Laweh', lokasi: 'Kota Padang Panjang - Padang Panjang Timur', lat: -0.463, lng: 100.405, kabupaten: 'Kota Padang Panjang', kecamatan: 'Padang Panjang Barat' },
    { name: 'Pos Silayiang Bawah', lokasi: 'Kota Padang Panjang - Padang Panjang Barat', lat: -0.46, lng: 100.39, kabupaten: 'Kota Padang Panjang', kecamatan: 'Padang Panjang Barat' },
    { name: 'Balaikota Solok Kel. IX Korong', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'Taman Kota Kalumpang Kel. VI Suku', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'Nagari Kasang Kec. Batang Anai', lokasi: 'Padang Pariaman - Batang Anai', lat: -0.8, lng: 100.3, kabupaten: 'Padang Pariaman', kecamatan: 'Batang Anai' },
    { name: 'Posko Muaro Pingai', lokasi: 'Solok - Junjung Sirih', lat: -0.65, lng: 100.58, kabupaten: 'Solok', kecamatan: 'X Koto Singkarak' },
    { name: 'SD 11 Paninggahan', lokasi: 'Solok - Paninggahan', lat: -0.62, lng: 100.55, kabupaten: 'Tanah Datar', kecamatan: 'Rambatan' },
  ],
};

export default function Home() {
    const [selectedNews, setSelectedNews] = useState<typeof newsData[0] | null>(null);
  const [searchPosTerm, setSearchPosTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Aceh');
  const [selectedEmergencyTab, setSelectedEmergencyTab] = useState<string>('Sumatera Barat');
  const [selectedPengungsiTab, setSelectedPengungsiTab] = useState<string>('Semua');
  const [selectedPmiCategory, setSelectedPmiCategory] = useState<string>('Makanan');
  const [selectedPoskoTab, setSelectedPoskoTab] = useState<string>('Aceh');
  const [pengungsiData, setPengungsiData] = useState<{kabupaten: string; value: number; provinsi: string}[]>([]);
  const [totalPengungsi, setTotalPengungsi] = useState<number>(0);
  
  // Situasi Darurat states
  const [meninggal, setMeninggal] = useState<number>(0);
  const [hilang, setHilang] = useState<number>(0);
  const [terluka, setTerluka] = useState<number>(0);
  const [kabTerdampak, setKabTerdampak] = useState<number>(0);
  
  // Kerusakan states
  const [rumahRusak, setRumahRusak] = useState<number>(0);
  const [fasilitasUmum, setFasilitasUmum] = useState<number>(0);
  const [fasKesehatan, setFasKesehatan] = useState<number>(0);
  const [fasPendidikan, setFasPendidikan] = useState<number>(0);
  const [rumahIbadah, setRumahIbadah] = useState<number>(0);
  const [gedungKantor, setGedungKantor] = useState<number>(0);
  const [jembatan, setJembatan] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Mapping kabupaten to provinsi
  const kabupatenProvinsiMap: Record<string, string> = {
    'Aceh Tamiang': 'Aceh',
    'Aceh Timur': 'Aceh',
    'Aceh Utara': 'Aceh',
    'Bireuen': 'Aceh',
    'Gayo Lues': 'Aceh',
    'Pidie': 'Aceh',
    'Pidie Jaya': 'Aceh',
    'Aceh Tengah': 'Aceh',
    'Bener Meriah': 'Aceh',
    'Nagan Raya': 'Aceh',
    'Kota Subulussalam': 'Aceh',
    'Aceh Tenggara': 'Aceh',
    'Tapanuli Tengah': 'Sumatera Utara',
    'Langkat': 'Sumatera Utara',
    'Tapanuli Selatan': 'Sumatera Utara',
    'Humbang Hasundutan': 'Sumatera Utara',
    'Kota Sibolga': 'Sumatera Utara',
    'Tanah Datar': 'Sumatera Barat',
    'Agam': 'Sumatera Barat',
    'Pasaman Barat': 'Sumatera Barat',
    'Pesisir Selatan': 'Sumatera Barat',
  };

  // Helper function to fetch single value from ESRI JSON
  const fetchSingleValue = async (url: string): Promise<number> => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.features?.[0]?.attributes?.value || 0;
    } catch (err) {
      console.error(`Failed to load ${url}:`, err);
      return 0;
    }
  };

  useEffect(() => {
    // Fetch pengungsi data (has multiple features)
    fetch('/data/jumlah_pengungsi.txt')
      .then(res => res.json())
      .then(data => {
        const features = data.features || [];
        const mapped = features.map((f: { attributes: { kabupaten: string; value: number } }) => ({
          kabupaten: f.attributes.kabupaten,
          value: f.attributes.value,
          provinsi: kabupatenProvinsiMap[f.attributes.kabupaten] || 'Lainnya'
        }));
        setPengungsiData(mapped);
        const total = mapped.reduce((sum: number, item: { value: number }) => sum + item.value, 0);
        setTotalPengungsi(total);
      })
      .catch(err => console.error('Failed to load pengungsi data:', err));

    // Fetch Situasi Darurat data
    fetchSingleValue('/data/jumlah_meninggal.txt').then(setMeninggal);
    fetchSingleValue('/data/jumlah_hilang.txt').then(setHilang);
    fetchSingleValue('/data/jumlah_luka.txt').then(setTerluka);
    fetchSingleValue('/data/jumlah_kabupaten_terdampak.txt').then(setKabTerdampak);

    // Fetch Kerusakan data
    fetchSingleValue('/data/jumlah_rumah_rusak.txt').then(setRumahRusak);
    fetchSingleValue('/data/jumlah_fasilitas_umum.txt').then(setFasilitasUmum);
    fetchSingleValue('/data/jumlah_fasilitas_kesehatan.txt').then(setFasKesehatan);
    fetchSingleValue('/data/jumlah_fasilitas_pendidikan.txt').then(setFasPendidikan);
    fetchSingleValue('/data/jumlah_rumah_ibadah.txt').then(setRumahIbadah);
    fetchSingleValue('/data/jumlah_gedung_kantor.txt').then(setGedungKantor);
    fetchSingleValue('/data/jumlah_jembatan.txt').then(setJembatan);

    // Fetch last update
    fetch('/data/last_update.txt')
      .then(res => res.text())
      .then(text => setLastUpdate(text.trim()))
      .catch(err => console.error('Failed to load last update:', err));
  }, []);

  const getFilteredPos = () => {
    const regions = selectedRegion === 'Semua' 
      ? Object.keys(posPengungsianData) 
      : [selectedRegion];
    
    const result: { region: string; posts: typeof posPengungsianData['Aceh'] }[] = [];
    
    regions.forEach(region => {
      const posts = posPengungsianData[region as keyof typeof posPengungsianData]?.filter(post =>
        post.name.toLowerCase().includes(searchPosTerm.toLowerCase()) ||
        post.lokasi.toLowerCase().includes(searchPosTerm.toLowerCase()) ||
        post.kabupaten.toLowerCase().includes(searchPosTerm.toLowerCase())
      ) || [];
      if (posts.length > 0) {
        result.push({ region, posts });
      }
    });
    
    return result;
  };

  return (
    <div className="bg-white text-[#1B1B1B]">
      <header className="py-6 bg-[#1B1B1B] shadow text-white">
        <div className="container mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 place-items-center">
            <div className="container mx-auto text-center">
              <img src="/logo.png" className="h-20 mx-auto" alt="Logo" />
              <p className="text-s mt-2 text-white leading-tight font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>
                KEMENTERIAN KOORDINATOR <br />
                BIDANG PEMBANGUNAN MANUSIA DAN KEBUDAYAAN <br />
                REPUBLIK INDONESIA
              </p>
            </div>
            <div className="pt-1">
              <p className="text-center text-sm text-gray-400 mb-6">Didukung oleh:</p>
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-3">
                {/* BNPB */}
                <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center p-1">
                    <img src="/logos/bnpb.png" alt="BNPB" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-gray-400">BNPB</span>
                </div>
                {/* BASARNAS */}
                <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center p-1">
                    <img src="/logos/basarnas.png" alt="BASARNAS" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-gray-400">BASARNAS</span>
                </div>
                {/* PMI */}
                <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center p-1">
                    <img src="/logos/pmi.png" alt="PMI" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-gray-400">PMI</span>
                </div>
                {/* Badan Pangan Nasional */}
                <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center p-1">
                    <img src="/logos/bapanas.png" alt="Badan Pangan Nasional" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-gray-400">Bapanas</span>
                </div>
                {/* Badan Komunikasi Pemerintah RI */}
                <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center p-1">
                    <img src="/logos/bakom.png" alt="Badan Komunikasi Pemerintah" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-gray-400">Bakom RI</span>
                </div>
                {/* Kementerian Kesehatan */}
                <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center p-1">
                    <img src="/logos/kemenkes.png" alt="Kementerian Kesehatan" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-gray-400">Kemenkes</span>
                </div>
                {/* Kementerian Dalam Negeri */}
                <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center p-1">
                    <img src="/logos/kemendagri.png" alt="Kementerian Dalam Negeri" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-gray-400">Kemendagri</span>
                </div>
                {/* BMKG */}
                <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center p-1">
                    <img src="/logos/bmkg.png" alt="BMKG" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-gray-400">BMKG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Nomor Darurat Bencana Section */}
      <section className="py-16 bg-gradient-to-b from-[#1B1B1B] to-[#2d4a6d]">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <p className="text-center text-xl md:text-2xl text-white/80 mb-4">
            Kawal informasi seputar bencana Sumatera secara tepat dan akurat
          </p>
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-white mb-2">
            NOMOR DARURAT
          </h2>
          <h3 className="text-center text-4xl md:text-5xl font-black text-white mb-10">
            BENCANA
          </h3>

          {/* Call Center Utama */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <a href="tel:117" className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-4 w-[280px]">
              <div className="w-14 h-14 bg-[#D22730] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-phone text-white text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Call Center BNPB</p>
                <p className="text-4xl font-black text-[#1B1B1B]">117</p>
              </div>
            </a>
            <a href="tel:115" className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-4 w-[280px]">
              <div className="w-14 h-14 bg-[#D22730] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-phone text-white text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Call Center BASARNAS</p>
                <p className="text-4xl font-black text-[#1B1B1B]">115</p>
              </div>
            </a>
          </div>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            {['Sumatera Barat', 'Sumatera Utara'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedEmergencyTab(tab)}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                  selectedEmergencyTab === tab
                    ? 'bg-white text-[#1B1B1B] shadow-xl'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Provinsi Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#1B4D89] to-[#2d6cb5] px-6 py-4">
                <h4 className="text-xl font-bold text-white text-center">
                  Kontak Darurat Provinsi {selectedEmergencyTab}
                </h4>
              </div>
              <div className="p-6">
                {selectedEmergencyTab === 'Sumatera Barat' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'BPBD Sumatera Barat', phone: '(0751) 890721' },
                      { name: 'PMI Sumatera Barat', phone: '(0751) 27882' },
                      { name: 'Damkar Kota Padang', phone: '0811 6606 113' },
                      { name: 'BPBD Padang Pariaman', phone: '0811 666 2114' },
                      { name: 'Damkar Bukittinggi', phone: '0853 5515 7883' },
                      { name: 'BPBD Pesisir Selatan', phone: '0852 6938 0950' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="font-semibold text-gray-800 mb-2">{item.name}</p>
                        <a 
                          href={`tel:${item.phone.replace(/[^0-9]/g, '')}`} 
                          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 py-2 rounded-lg font-bold transition-colors"
                        >
                          <i className="fas fa-phone text-sm"></i>
                          {item.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                {selectedEmergencyTab === 'Sumatera Utara' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Basarnas Medan', phone: '0851 9179 5579' },
                      { name: 'BPBD PEMPROVSU', phone: '0811 6221 733' },
                      { name: 'BPBD Deli Serdang', phone: '0811 6782 022' },
                      { name: 'BPBD Medan', phone: '0813 7080 0880' },
                      { name: 'Damkar Medan', phone: '0811 6566 113' },
                      { name: 'Damkar Binjai', phone: '(061) 8821935' },
                      { name: 'BPBD Binjai', phone: '0811 6192 611' },
                      { name: 'BPBD P. Siantar', phone: '0822 6217 3370' },
                      { name: 'BPBD Tapteng', phone: '0812 9090 0222' },
                      { name: 'BPBD Taput', phone: '0813 7519 4119' },
                      { name: 'BPBD Sibolga', phone: '0631 21544' },
                      { name: 'BPBD Tapsel', phone: '0811 6217 115' },
                      { name: 'BPBD Sidempuan', phone: '0813 9241 5449' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="font-semibold text-gray-800 mb-2">{item.name}</p>
                        <a 
                          href={`tel:${item.phone.replace(/[^0-9]/g, '')}`} 
                          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 py-2 rounded-lg font-bold transition-colors"
                        >
                          <i className="fas fa-phone text-sm"></i>
                          {item.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-white/60 text-sm mt-8">
            <i className="fas fa-info-circle mr-2"></i>
            Klik nomor telepon untuk langsung menghubungi
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#1B1B1B] via-[#2a2a2a] to-[#1B1B1B] text-white pt-16 pb-20 relative">
        <div className="text-center mb-12 px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-wide">
            Situasi Darurat di Sumatera
          </h1>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Total Korban */}
            <div className="bg-gradient-to-br from-[#D22730] to-[#8B0000] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold">Total Korban</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>Meninggal Dunia</span>
                  <span className="text-2xl font-bold">{meninggal.toLocaleString('id-ID')} <span className="text-sm font-normal">jiwa</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>Hilang</span>
                  <span className="text-2xl font-bold">{hilang.toLocaleString('id-ID')} <span className="text-sm font-normal">jiwa</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>Terluka</span>
                  <span className="text-2xl font-bold">{terluka.toLocaleString('id-ID')} <span className="text-sm font-normal">jiwa</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>Kab/Kota Terdampak</span>
                  <span className="text-2xl font-bold">{kabTerdampak.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Pengungsi */}
            <div className="bg-gradient-to-br from-[#FF6B35] to-[#D22730] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold">Pengungsi</h3>
              </div>
              
              {/* Tab Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['Semua', 'Aceh', 'Sumatera Utara', 'Sumatera Barat'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedPengungsiTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedPengungsiTab === tab
                        ? 'bg-white text-[#D22730]'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scroll">
                {pengungsiData
                .filter(item => selectedPengungsiTab === 'Semua' || item.provinsi === selectedPengungsiTab)
                .map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-sm">{item.kabupaten}</span>
                    <span className="text-sm font-bold">{item.value.toLocaleString('id-ID')} <span className="text-xs font-normal">jiwa</span></span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center bg-white/20 rounded-lg py-3">
                <p className="text-sm opacity-80">Total Pengungsi</p>
                <p className="text-3xl font-black">± {(totalPengungsi / 1000).toFixed(0)} ribu <span className="text-lg font-normal">jiwa</span></p>
              </div>
            </div>

            {/* Kerusakan */}
            <div className="bg-gradient-to-br from-[#1B4D89] to-[#0D2E5C] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold">Kerusakan</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">Rumah Rusak</p>
                  <p className="text-lg font-bold">{rumahRusak.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">Rumah Ibadah</p>
                  <p className="text-lg font-bold">{rumahIbadah.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">Fasilitas Umum</p>
                  <p className="text-lg font-bold">{fasilitasUmum.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">Gedung/Kantor</p>
                  <p className="text-lg font-bold">{gedungKantor.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">Fas. Kesehatan</p>
                  <p className="text-lg font-bold">{fasKesehatan.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">Jembatan</p>
                  <p className="text-lg font-bold">{jembatan.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2 col-span-2">
                  <p className="text-xs opacity-70">Fasilitas Pendidikan</p>
                  <p className="text-lg font-bold">{fasPendidikan.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm opacity-60 mt-6" style={{ fontFamily: 'Arial, sans-serif' }}>
          Sumber: <a href="https://gis.bnpb.go.id/BANSORSUMATERA2025/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-white/80 transition-colors">Data BNPB →</a>
        </p>
        {lastUpdate && (
          <p className="text-center text-sm opacity-60 mt-2" style={{ fontFamily: 'Arial, sans-serif' }}>
            Last update: {lastUpdate}
          </p>
        )}
      </section>

      {/* Langkah Terkini Pemerintah Section */}
      <section className="container mx-auto bg-white px-4 sm:px-10 lg:px-32 xl:px-44 py-16">
        <h2 className="text-center text-3xl font-bold mb-14 tracking-wide">
          Langkah Terkini Pemerintah
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsData.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer hover:scale-[1.02]"
            >
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 bg-[#D22730] text-white text-xs font-semibold px-3 py-1 rounded">
                  {item.category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <p className="text-xs text-gray-400">
                  {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </p>
                <h3 className="font-semibold text-base leading-snug hover:text-[#D22730] transition line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* News Modal */}
      {selectedNews && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Close Button */}
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <span className="bg-[#D22730] text-white text-xs font-semibold px-3 py-1 rounded">
                {selectedNews.category}
              </span>
              <button 
                onClick={() => setSelectedNews(null)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              >
                <i className="fas fa-times text-gray-600"></i>
              </button>
            </div>
            
            {/* Modal Image */}
            <div className="h-64 bg-gray-200 overflow-hidden">
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-400">
                {selectedNews.date ? new Date(selectedNews.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
              </p>
              <h2 className="text-2xl font-bold text-[#1B1B1B]">
                {selectedNews.title}
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {selectedNews.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Daftar Posko Tanggap Darurat Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-3 bg-[#D22730] px-6 py-3 rounded-xl mb-4">
              <i className="fas fa-map-marker-alt text-white text-2xl"></i>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Daftar Posko Tanggap Darurat
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['Aceh', 'Sumatera Utara', 'Sumatera Barat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedPoskoTab(tab)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  selectedPoskoTab === tab
                    ? 'bg-[#D22730] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[500px] pr-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                const poskoData: Record<string, {kota: string; lokasi: string; nama: string; jabatan: string; kontak: string[]}[]> = {
                  'Aceh': [
                    { kota: "Bener Meriah", lokasi: "Pusat Perkantoran Bener Meriah / Kantor Bupati", nama: "Riswandika", jabatan: "Sekda Bener Meriah", kontak: ["085277761777"] },
                    { kota: "Langsa", lokasi: "BPBD Langsa", nama: "Nursal", jabatan: "Kepala Pelaksana BPBD", kontak: ["08116777776"] },
                    { kota: "Pidie", lokasi: "BPBD Pidie", nama: "Rabiul", jabatan: "Kepala Pelaksana BPBD", kontak: ["0811687540"] },
                    { kota: "Aceh Tengah", lokasi: "Kantor Bupati", nama: "Kepala Pelaksana BPBD", jabatan: "", kontak: ["085312839906", "082272926272"] },
                    { kota: "Subulussalam", lokasi: "BPBD Subulussalam", nama: "Ramadhan", jabatan: "Kepala Pelaksana BPBD", kontak: ["081263334511"] },
                    { kota: "Bireuen", lokasi: "Pendopo Bupati Bireuen", nama: "Junaidi", jabatan: "Sekretaris BPBD", kontak: ["081322091183"] },
                    { kota: "Pidie Jaya", lokasi: "Gedung MTQ", nama: "M. Nur", jabatan: "Kepala Pelaksana BPBD", kontak: ["08126961789"] },
                    { kota: "Lhokseumawe", lokasi: "Kantor Wali Kota", nama: "Haris", jabatan: "PLT Sekda", kontak: ["081262805671"] },
                    { kota: "Aceh Tamiang", lokasi: "-", nama: "Taryadi, SH, MH / Sulaiman / Erwin / Vian", jabatan: "TNI / BPBD", kontak: ["08126535555", "082160765678", "085270087600", "082370312858"] },
                    { kota: "Aceh Barat", lokasi: "BPBD Aceh Barat", nama: "T. Ronald", jabatan: "PLT Kalaksa BPBD", kontak: ["0811683300"] },
                    { kota: "Nagan Raya", lokasi: "Kantor Bupati Nagan Raya, Desa Sukaraja", nama: "Irfanda", jabatan: "Kepala Pelaksana BPBD", kontak: ["082166658456"] },
                    { kota: "Aceh Selatan", lokasi: "Koramil Trumon, Kantor Camat Trumon", nama: "Dandim", jabatan: "Staf", kontak: ["085362721822"] },
                    { kota: "Aceh Singkil", lokasi: "Kantor BPBD Aceh Singkil", nama: "Alhusni", jabatan: "Kepala Pelaksana BPBD", kontak: ["082277465795"] },
                    { kota: "Aceh Utara", lokasi: "Kabag Pemerintahan Kab. Aceh Utara", nama: "Yudha", jabatan: "", kontak: ["081394408638"] },
                    { kota: "Aceh Besar", lokasi: "Gudang Logistik BPBD Aceh Besar", nama: "Ridwan", jabatan: "Kepala Pelaksana BPBD", kontak: ["08126942570"] },
                  ],
                  'Sumatera Utara': [
                    { kota: "Medan", lokasi: "Kantor BPBD Kota Medan", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0618454900"] },
                    { kota: "Deli Serdang", lokasi: "Kantor BPBD Deli Serdang", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0617030007"] },
                    { kota: "Langkat", lokasi: "Kantor BPBD Langkat", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0618913255"] },
                    { kota: "Karo", lokasi: "Kantor BPBD Karo", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0628320110"] },
                    { kota: "Simalungun", lokasi: "Kantor BPBD Simalungun", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0622437770"] },
                    { kota: "Asahan", lokasi: "Kantor BPBD Asahan", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0623341234"] },
                    { kota: "Labuhanbatu", lokasi: "Kantor BPBD Labuhanbatu", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0624421700"] },
                    { kota: "Tapanuli Utara", lokasi: "Kantor BPBD Tapanuli Utara", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0633331125"] },
                    { kota: "Nias", lokasi: "Kantor BPBD Nias", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0639321021"] },
                    { kota: "Binjai", lokasi: "Kantor BPBD Binjai", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0618821800"] },
                  ],
                  'Sumatera Barat': [
                    { kota: "Padang", lokasi: "Kantor BPBD Kota Padang", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0751811120"] },
                    { kota: "Bukittinggi", lokasi: "Kantor BPBD Bukittinggi", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0752625555"] },
                    { kota: "Payakumbuh", lokasi: "Kantor BPBD Payakumbuh", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0752796699"] },
                    { kota: "Padang Panjang", lokasi: "Kantor BPBD Padang Panjang", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0752485555"] },
                    { kota: "Solok", lokasi: "Kantor BPBD Kota Solok", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0755324455"] },
                    { kota: "Agam", lokasi: "Kantor BPBD Agam", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0752765432"] },
                    { kota: "Tanah Datar", lokasi: "Kantor BPBD Tanah Datar", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0752571234"] },
                    { kota: "Pesisir Selatan", lokasi: "Kantor BPBD Pesisir Selatan", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0756211100"] },
                    { kota: "Sijunjung", lokasi: "Kantor BPBD Sijunjung", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0754831234"] },
                    { kota: "Dharmasraya", lokasi: "Kantor BPBD Dharmasraya", nama: "Kepala BPBD", jabatan: "Kepala Pelaksana BPBD", kontak: ["0754401234"] },
                  ],
                };
                return poskoData[selectedPoskoTab]?.map((posko, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-[#D22730] to-[#B71C1C] px-4 py-3">
                      <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <i className="fas fa-building text-sm"></i>
                        {posko.kota}
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <i className="fas fa-map-pin text-[#D22730] mt-1 w-4"></i>
                        <span className="text-gray-700 text-sm">{posko.lokasi}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <i className="fas fa-user text-[#D22730] mt-1 w-4"></i>
                        <div>
                          <span className="text-gray-800 font-semibold text-sm">{posko.nama}</span>
                          {posko.jabatan && <span className="text-gray-500 text-xs block">{posko.jabatan}</span>}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {posko.kontak.map((no, idx) => (
                          <a 
                            key={idx}
                            href={`tel:${no}`}
                            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1da851] text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                          >
                            <i className="fas fa-phone text-xs"></i>
                            {no}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              <i className="fas fa-info-circle mr-2"></i>
              Klik nomor telepon untuk langsung menghubungi posko
            </p>
          </div>
        </div>
      </section>

      {/* Call Center BPBD Sumatera Utara Section */}
      <section className="py-16 bg-[#1B1B1B]">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#D22730] to-[#B71C1C] px-6 py-3 rounded-xl mb-4">
              <i className="fas fa-headset text-white text-2xl"></i>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Call Center BPBD Sumatera Utara
              </h2>
            </div>
            <p className="text-gray-400 text-lg">Kabupaten/Kota & Instansi Terkait</p>
          </div>

          {/* Main BPBD & Emergency Services */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { nama: "BNPB", kontak: "117", icon: "fa-shield-alt", color: "from-red-600 to-red-800" },
              { nama: "PUSDALOPS PB BPBD Sumut", kontak: "0811 6221 733", icon: "fa-broadcast-tower", color: "from-orange-500 to-orange-700" },
              { nama: "PMI", kontak: "0852 6612 2520", icon: "fa-first-aid", color: "from-red-500 to-red-700" },
              { nama: "DAMKAR Medan", kontak: "0811 6566 113", icon: "fa-fire-extinguisher", color: "from-orange-600 to-red-600" },
            ].map((item, index) => (
              <a 
                key={index}
                href={`tel:${item.kontak.replace(/\s/g, '')}`}
                className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-center hover:scale-105 transition-transform shadow-lg`}
              >
                <i className={`fas ${item.icon} text-3xl text-white mb-2`}></i>
                <h3 className="font-bold text-white text-sm mb-1">{item.nama}</h3>
                <p className="text-white/90 font-mono text-lg font-bold">{item.kontak}</p>
              </a>
            ))}
          </div>

          {/* BASARNAS Special */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-life-ring text-3xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">BASARNAS</h3>
                  <p className="text-blue-200 text-sm">Badan SAR Nasional</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {["0852 0787 2962", "0851 9179 5579", "0812 7818 6376"].map((no, idx) => (
                  <a 
                    key={idx}
                    href={`tel:${no.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-mono font-bold transition-colors"
                  >
                    <i className="fas fa-phone text-sm"></i>
                    {no}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Kab/Kota Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { kota: "Tapanuli Selatan", contacts: [{ nama: "Idham", jabatan: "Kabid Darlog", no: "0813 6155 8157" }, { nama: "Call Center", jabatan: "", no: "0811 6217 115" }] },
              { kota: "Tapanuli Utara", contacts: [{ nama: "Kabid Darlog", jabatan: "", no: "0823 6596 6554" }, { nama: "Septian", jabatan: "Staff", no: "0823 6280 5391" }] },
              { kota: "Tapanuli Tengah", contacts: [{ nama: "Rahman Siregar", jabatan: "Kalaksa", no: "0812 6497 1117" }, { nama: "Erianto Tambunan", jabatan: "Kabid Darlog", no: "0822 7719 4959" }] },
              { kota: "Mandailing Natal", contacts: [{ nama: "Mukshin", jabatan: "Kalaksa", no: "0812 6368 9444" }, { nama: "Ibrahim", jabatan: "Kabid Darlog", no: "0822 7709 3939" }] },
              { kota: "Padang Sidimpuan", contacts: [{ nama: "Arfan", jabatan: "Kalaksa", no: "0812 6797 5913" }, { nama: "Nazaruddin", jabatan: "Kabid Darlog", no: "0821 6605 4989" }] },
              { kota: "Medan", contacts: [{ nama: "Call Center", jabatan: "", no: "0813 7080 0880" }] },
              { kota: "Deli Serdang", contacts: [{ nama: "Arif Tarigan", jabatan: "Kabid Darlog", no: "0812 6066 4433" }, { nama: "Call Center", jabatan: "", no: "0811 6782 022" }] },
              { kota: "Tebing Tinggi", contacts: [{ nama: "Iman Hebat", jabatan: "Kabid Darlog", no: "0821 6559 1206" }] },
              { kota: "Serdang Bedagai", contacts: [{ nama: "Marnaggok", jabatan: "Kabid Darlog", no: "0813 7012 5284" }] },
              { kota: "Langkat", contacts: [{ nama: "Call Center", jabatan: "", no: "0811 6571 117" }] },
              { kota: "Sibolga", contacts: [{ nama: "Dores", jabatan: "Kabid Darlog", no: "0823 9832 9981" }] },
              { kota: "Phakpak Barat", contacts: [{ nama: "J. Jaloho", jabatan: "Kabid Darlog", no: "0821 6047 0067" }] },
              { kota: "Nias Selatan", contacts: [{ nama: "Mission Laia", jabatan: "Sekretaris", no: "0821 6099 0000" }] },
              { kota: "Humbang Hasundutan", contacts: [{ nama: "Sabar Purba", jabatan: "Kalaksa", no: "0812 6007 4314" }, { nama: "Marnok", jabatan: "Staff", no: "0812 6912 3313" }] },
              { kota: "Binjai", contacts: [{ nama: "Mila", jabatan: "Kabid Darlog", no: "0812 6533 4355" }, { nama: "Call Center", jabatan: "", no: "0811 6116 113" }] },
              { kota: "Gunung Sitoli", contacts: [{ nama: "Eqoatur Jaya Daili", jabatan: "Kalaksa", no: "0812 6066 1771" }, { nama: "Adiman", jabatan: "Sekretaris", no: "0813 6215 8333" }] },
              { kota: "Asahan", contacts: [{ nama: "BPBD", jabatan: "", no: "0822 1181 4212" }] },
              { kota: "Batu Bara", contacts: [{ nama: "BPBD", jabatan: "", no: "0821 6662 3813" }] },
              { kota: "DAMKAR Binjai", contacts: [{ nama: "Call Center", jabatan: "", no: "061 882 1935" }] },
            ].map((item, index) => (
              <div key={index} className="bg-[#2A2A2A] rounded-xl overflow-hidden border border-gray-700 hover:border-[#D22730] transition-colors">
                <div className="bg-gradient-to-r from-[#3A3A3A] to-[#2A2A2A] px-4 py-3 border-b border-gray-700">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-[#D22730] text-sm"></i>
                    {item.kota}
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {item.contacts.map((contact, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{contact.nama}</p>
                        {contact.jabatan && <p className="text-gray-400 text-xs">{contact.jabatan}</p>}
                      </div>
                      <a 
                        href={`tel:${contact.no.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1da851] text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                      >
                        <i className="fas fa-phone text-xs"></i>
                        {contact.no}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              <i className="fas fa-info-circle mr-2"></i>
              Klik nomor telepon untuk langsung menghubungi
            </p>
          </div>
        </div>
      </section>

      {/* Pos Pengungsian Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-[#1B4D89] rounded-full flex items-center justify-center">
                <i className="fas fa-campground text-white text-xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-center text-[#1B1B1B]">
                Pos Pengungsian
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Lokasi pos pengungsian di wilayah terdampak bencana
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['Aceh', 'Sumatera Utara', 'Sumatera Barat'].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedRegion === region
                    ? 'bg-[#1B4D89] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {region}
                <span className="ml-2 text-sm opacity-75">
                  ({posPengungsianData[region as keyof typeof posPengungsianData]?.length || 0})
                </span>
              </button>
            ))}
          </div>

          <div className="relative mb-6 max-w-md mx-auto">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Cari pos pengungsian..."
              value={searchPosTerm}
              onChange={(e) => setSearchPosTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#1B4D89] focus:ring-2 focus:ring-[#1B4D89]/20 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(posPengungsianData[selectedRegion as keyof typeof posPengungsianData] || [])
              .filter(post =>
                post.name.toLowerCase().includes(searchPosTerm.toLowerCase()) ||
                post.lokasi.toLowerCase().includes(searchPosTerm.toLowerCase()) ||
                post.kabupaten.toLowerCase().includes(searchPosTerm.toLowerCase())
              )
              .map((post, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-[#1B1B1B] mb-2 line-clamp-2">{post.name}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-start gap-2">
                      <i className="fas fa-location-dot text-[#D22730] mt-0.5 flex-shrink-0"></i>
                      <span>{post.lokasi}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <i className="fas fa-building text-gray-400 mt-0.5 flex-shrink-0"></i>
                      <span>{post.kabupaten}, {post.kecamatan}</span>
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${post.lat},${post.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm text-[#1B4D89] hover:text-[#D22730] font-medium transition-colors"
                  >
                    <i className="fas fa-map"></i>
                    Buka di Google Maps
                    <i className="fas fa-external-link-alt text-xs"></i>
                  </a>
                </div>
              ))}
          </div>
          {(posPengungsianData[selectedRegion as keyof typeof posPengungsianData] || [])
            .filter(post =>
              post.name.toLowerCase().includes(searchPosTerm.toLowerCase()) ||
              post.lokasi.toLowerCase().includes(searchPosTerm.toLowerCase()) ||
              post.kabupaten.toLowerCase().includes(searchPosTerm.toLowerCase())
            ).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-search text-4xl mb-4 opacity-50"></i>
              <p>Tidak ada pos pengungsian yang ditemukan</p>
            </div>
          )}
        </div>
      </section>

      {/* Logistik Stok PMI Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-4 mb-2">
              <img src="/logos/pmi.png" alt="PMI" className="w-12 h-12 object-contain" />
              <h2 className="text-3xl font-bold text-center">
                Logistik Stok PMI
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Pembaruan Terakhir: <span className="font-semibold">9 Desember 2025 pukul 22.59</span>
            </p>
          </div>

          <div className="bg-white text-black rounded-xl shadow-xl p-6">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {pmiCategoryList.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedPmiCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedPmiCategory === category
                      ? 'bg-[#D22730] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Stock List */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">{selectedPmiCategory}</h3>
                <span className="text-sm text-gray-500">
                  {pmiStockCategories[selectedPmiCategory as keyof typeof pmiStockCategories]?.length || 0} item
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <tbody>
                    {(pmiStockCategories[selectedPmiCategory as keyof typeof pmiStockCategories] || []).map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-mono font-bold text-[#D22730]">{item.quantity}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 text-center">
              <a 
                href="https://pmi.or.id/dashboard/stock" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-[#D22730] hover:underline"
              >
                Sumber: pmi.or.id/dashboard/stock →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan BAZNAS Section */}
      <section className="bg-[#1B1B1B] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="bg-gradient-to-br from-[#FFF8E7] to-[#FFE4B5] rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
            {/* Header with Image */}
            <div className="relative h-56 md:h-72 overflow-hidden">
              <img 
                src="/images/baznas-logistik.png" 
                alt="Paket Logistik BAZNAS" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8E7] via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="inline-block bg-[#D22730] px-6 py-2 rounded-lg shadow-lg">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                    Layanan BAZNAS
                  </h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 text-center">
              {/* Hotline */}
              <div className="mb-6">
                <p className="text-[#8B4513] font-semibold text-lg mb-2">
                  Pusdalops BAZNAS Tanggap Bencana
                </p>
                <a 
                  href="tel:08180777211" 
                  className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                    <i className="fas fa-phone text-white text-lg"></i>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-[#1B1B1B]">0818 0777 2112</span>
                </a>
              </div>

              {/* Donation Info */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-inner">
                <h3 className="text-[#D22730] font-bold text-lg mb-4">
                  Dompet Bencana & Kemanusiaan BAZNAS
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="bg-[#1A4D2E] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                      <svg viewBox="0 0 100 40" className="h-6 w-auto">
                        <rect width="100" height="40" rx="4" fill="white"/>
                        <text x="50" y="26" textAnchor="middle" fill="#1A4D2E" fontSize="16" fontWeight="bold">BSI</text>
                      </svg>
                      <span>9000.055.740</span>
                    </div>
                    <div className="bg-[#003D79] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                      <svg viewBox="0 0 100 40" className="h-6 w-auto">
                        <rect width="100" height="40" rx="4" fill="white"/>
                        <text x="50" y="26" textAnchor="middle" fill="#003D79" fontSize="14" fontWeight="bold">BCA</text>
                      </svg>
                      <span>686.073.7777</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    a.n. <span className="font-semibold">Badan Amil Zakat Nasional</span>
                  </p>
                </div>
              </div>

              {/* Source */}
              <p className="mt-6 text-sm text-[#8B4513]/70">
                Sumber: <span className="font-semibold">Sitrep BAZNAS</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Peta Operasi Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-3xl font-bold text-center">
              Peta Operasi
            </h2>
          </div>
        </div>

        <div className="bg-white text-black rounded-xl shadow-xl p-3 h-200">
          <iframe
            id="ifrSafe-widget_22"
            className="w-full h-full"
            allowFullScreen
            allow="geolocation"
            data-testid="embedSafe"
            src="https://gis.bnpb.go.id/arcgis/apps/experiencebuilder/experience/?id=fdfd2c15e4124a1a90cf1e1686ae0e4c">
          </iframe>
        </div>
      </div>
      </section>

      <footer className="bg-[#1B1B1B] text-white pt-16 pb-10">
        <div className="container mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <img src="/logo.png" alt="Logo Kemenko PMK" className="w-16 h-16 object-contain" />
                <h3 className="font-bold text-lg leading-tight">
                  KEMENKO PMK <br />
                  <span className="text-sm font-normal text-gray-300">
                    Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-envelope text-[#D22730] mt-1"></i>
                <span className="text-sm text-gray-300">roinfhumasp@kemenkopmk.go.id</span>
              </div>
              <div className="flex items-start gap-3">
                <i className="fas fa-envelope text-[#D22730] mt-1"></i>
                <span className="text-sm text-gray-300">kearsipan@kemenkopmk.go.id</span>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-phone text-[#D22730] mt-1"></i>
                <span className="text-sm text-gray-300">(+62) 21 345 9444</span>
              </div>
              <div className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-[#D22730] mt-1"></i>
                <span className="text-sm text-gray-300 leading-relaxed">
                  Jl. Medan Merdeka Barat No. 3<br />
                  Jakarta Pusat, Indonesia
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2A2A2A] mt-8 pt-6 text-center text-xs text-gray-400">
            © 2025 Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan
          </div>
        </div>
      </footer>
    </div>
  );
}
