"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-[520px] sm:h-[650px] md:h-[768px] bg-gray-300 rounded-xl flex items-center justify-center">Loading Map...</div>
});

// Static data - no database connection needed
const newsData = [
  { 
    id: 1, 
    title: 'Presiden Prabowo Pimpin Ratas Penanganan Bencana Alam Aceh di Pos Pendamping Nasional', 
    category: 'Rapat Koordinasi', 
    image: '/news/1.png',
    date: '2025-12-08',
    content: 'Presiden Prabowo Subianto memimpin langsung Rapat Terbatas (Ratas) mengenai penanganan dan pemulihan bencana alam hidrometeorologi yang melanda wilayah Sumatera dan Aceh. Dalam pertemuan yang digelar di Pos Pendamping Nasional Provinsi Aceh ini, Presiden memberikan instruksi tegas kepada jajarannya untuk segera menindaklanjuti arahan di lapangan. Beliau menegaskan kekompakan seluruh unsur pemerintah, relawan, dan masyarakat sebagai kekuatan besar dalam mempercepat pemulihan wilayah terdampak.\n\nDalam arahannya, Presiden secara spesifik menyoroti perlunya penyaluran bantuan yang lebih teliti dan tepat waktu agar segera sampai ke tangan warga yang membutuhkan. Operasi terpadu yang melibatkan TNI, Polri, Basarnas, dan BNPB serta pemerintah daerah diminta untuk diperkuat, khususnya dalam mempercepat distribusi logistik dan memulihkan konektivitas antardaerah yang terputus. Presiden juga menyampaikan apresiasi mendalam kepada tingginya partisipasi publik dan solidaritas sosial sebagai bangsa dalam menghadapi musibah ini.'
  },
  { 
    id: 2, 
    title: 'PLN Tuntaskan Pemulihan Kelistrikan 100% di Wilayah Terdampak Banjir Sumatera Utara', 
    category: 'Pemulihan', 
    image: '/news/2.png',
    date: '2025-12-08',
    content: 'PT PLN (Persero) mengumumkan keberhasilannya dalam memulihkan 100% sistem kelistrikan yang sempat lumpuh akibat bencana banjir dan longsor di Sumatera Utara. Pemulihan total ini dicapai pada hari Minggu (7/12), di mana sebanyak 103 jaringan distribusi yang sebelumnya rusak kini telah kembali beroperasi normal. Upaya cepat ini memastikan pasokan listrik kembali menerangi wilayah-wilayah yang sempat terisolasi akibat bencana.\n\nProses pemulihan infrastruktur kelistrikan ini tidak dilakukan sendiri, melainkan melalui sinergi yang kuat antara PLN, TNI, Polri, BNPB, pemerintah daerah, dan masyarakat setempat. Dalam waktu lima hari, tim gabungan berhasil memperbaiki infrastruktur listrik yang rusak di seluruh 33 kota/kabupaten yang terdampak. Kerja keras ini menjadi langkah krusial dalam mendukung percepatan pemulihan kondisi sosial dan ekonomi masyarakat pascabencana.'
  },
  { 
    id: 3, 
    title: 'Presiden Tunjuk KSAD Komandoi Percepatan Perbaikan Infrastruktur Bireuen-Takengon', 
    category: 'Infrastruktur', 
    image: '/news/3.png',
    date: '2025-12-07',
    content: 'Presiden melakukan peninjauan langsung terhadap pengerjaan jembatan di ruas jalan vital yang menghubungkan Bireuen dan Takengon di Kabupaten Bireuen. Di lokasi tersebut, Presiden berdialog dengan warga serta para petugas lapangan, termasuk personel TNI, Polri, tim teknik Kementerian PUPR, dan relawan. Presiden menegaskan komitmen penuh pemerintah untuk memastikan seluruh kebutuhan masyarakat di wilayah terdampak dapat segera terpenuhi dan aksesibilitas kembali normal.\n\nSebagai langkah strategis untuk mempercepat pemulihan, Presiden secara khusus menunjuk Kepala Staf Angkatan Darat (KSAD), Jenderal TNI Maruli Simanjuntak, sebagai komandan percepatan perbaikan infrastruktur. Penunjukan ini diharapkan dapat mengoptimalkan pengerahan alat berat dan personel untuk memperbaiki akses jalan dan jembatan yang rusak parah, sehingga distribusi bantuan dan mobilitas warga tidak lagi terhambat.'
  },
  { 
    id: 4, 
    title: 'Posko Terpadu Lanud Sultan Iskandar Muda Jadi Pusat Logistik Bantuan Aceh', 
    category: 'Logistik', 
    image: '/news/4.png',
    date: '2025-12-07',
    content: 'Pemerintah telah mendirikan posko terpadu penanganan bencana alam Aceh yang berlokasi di Lanud Sultan Iskandar Muda. Lokasi ini juga difungsikan sebagai gudang logistik utama sebelum bantuan didistribusikan ke berbagai wilayah yang terdampak. Menteri Sekretaris Negara, Pratikno, yang berada di lokasi menegaskan bahwa sesuai arahan Presiden, bantuan tambahan akan terus dikirimkan secara bertahap.\n\nKeberadaan posko di pangkalan udara ini sangat strategis untuk mempercepat mobilisasi bantuan melalui jalur udara, terutama ke daerah-daerah yang sulit dijangkau melalui jalur darat. Berbagai langkah pemulihan akan dipercepat untuk memastikan masyarakat mendapatkan penanganan yang layak dan segera keluar dari masa tanggap darurat.'
  },
  { 
    id: 5, 
    title: 'Pemerintah Jamin Stok Pangan Warga Terdampak Bencana di Aceh Aman', 
    category: 'Pangan', 
    image: '/news/5.png',
    date: '2025-12-07',
    content: 'Dalam kunjungannya ke Kabupaten Bireuen, Provinsi Aceh, Presiden memastikan langsung bahwa ketersediaan bahan pangan bagi warga terdampak bencana telah diantisipasi dengan baik. Bantuan pangan dipastikan akan terus dikirimkan dari berbagai daerah untuk memenuhi kebutuhan para pengungsi dan korban bencana. Hal ini dilakukan guna mencegah terjadinya krisis pangan di tengah situasi darurat yang sedang berlangsung.\n\nPemerintah berkomitmen untuk memastikan seluruh proses pemulihan berjalan cepat, terkoordinasi, dan sesuai dengan standar keselamatan. Tujuan utamanya adalah menjamin masyarakat Aceh dapat kembali beraktivitas dengan aman, lancar, dan normal sesegera mungkin. Presiden juga tampak berinteraksi hangat dan memberikan penguatan moral kepada warga yang menyambut kedatangannya di lokasi pengungsian.'
  },
  { 
    id: 6, 
    title: 'Presiden Tinjau Langsung Evakuasi dan Pembukaan Akses Jalan di Aceh Besar', 
    category: 'Evakuasi', 
    image: '/news/6.png',
    date: '2025-12-07',
    content: 'Presiden Prabowo kembali mendarat di Aceh melalui Bandara Internasional Sultan Iskandar Muda, Kabupaten Aceh Besar, untuk meninjau penanganan bencana alam secara langsung. Kunjungan ini difokuskan untuk melihat kondisi sejumlah lokasi yang mengalami kerusakan parah akibat banjir serta memastikan percepatan penanganan darurat dan proses pemulihan wilayah yang terdampak berjalan sesuai rencana.\n\nSelain meninjau kerusakan fisik, Presiden juga melakukan pengecekan mendetail terhadap kelancaran penyaluran bantuan dan proses evakuasi warga yang masih terjebak. Upaya pembukaan akses jalan yang terputus menjadi prioritas utama dalam kunjungan ini untuk memastikan isolasi wilayah dapat segera diakhiri dan bantuan logistik dapat masuk ke seluruh pelosok daerah bencana.'
  },
];

// Data Logistik Stok PMI (sumber: pmi.or.id/dashboard/stock - 8 Desember 2025 pukul 17.02)
// Total: 176 item
const pmiStockData = [
  { id: 1, name: 'Abon', icon: 'fa-box', quantity: '2.036 KARTON' },
  { id: 2, name: 'Air Mineral', icon: 'fa-bottle-water', quantity: '6.184 KARTON' },
  { id: 3, name: 'Alat Tulis', icon: 'fa-pen', quantity: '-47 BOX' },
  { id: 4, name: 'Alkohol Swab', icon: 'fa-box', quantity: '6 BOX' },
  { id: 5, name: 'Apron', icon: 'fa-shirt', quantity: '12.690 PCS' },
  { id: 6, name: 'Baby Kit', icon: 'fa-baby', quantity: '1.685 BOX' },
  { id: 7, name: 'Bantal', icon: 'fa-bed', quantity: '44 UNIT' },
  { id: 8, name: 'Baterai', icon: 'fa-battery-full', quantity: '42 PCS' },
  { id: 9, name: 'Bedak Bayi', icon: 'fa-baby', quantity: '12 BOX' },
  { id: 10, name: 'Benang Jahit', icon: 'fa-scissors', quantity: '8 BOX' },
  { id: 11, name: 'Bendera PMI', icon: 'fa-flag', quantity: '6.750 PCS' },
  { id: 12, name: 'Beras', icon: 'fa-bowl-rice', quantity: '726.167 Kg.' },
  { id: 13, name: 'Biskuit', icon: 'fa-cookie', quantity: '2.789 KARTON' },
  { id: 14, name: 'Bubur Bayi', icon: 'fa-baby', quantity: '262 KARTON' },
  { id: 15, name: 'Bubur Instan', icon: 'fa-bowl-food', quantity: '9.140 PCS' },
  { id: 16, name: 'Bumbu Instan', icon: 'fa-jar', quantity: '102 KARTON' },
  { id: 17, name: 'Cairan Infus', icon: 'fa-syringe', quantity: '4 BOX' },
  { id: 18, name: 'Cangkul', icon: 'fa-hammer', quantity: '167 UNIT' },
  { id: 19, name: 'Caramantel', icon: 'fa-link', quantity: '14 ROL' },
  { id: 20, name: 'Celana Dalam Wanita', icon: 'fa-shirt', quantity: '950 PCS' },
  { id: 21, name: 'Celana Panjang Wanita', icon: 'fa-shirt', quantity: '3.224 PCS' },
  { id: 22, name: 'Cleaning Kit', icon: 'fa-broom', quantity: '2.162 BAG' },
  { id: 23, name: 'Cover Tenda Rub Hall', icon: 'fa-campground', quantity: '2 PCS' },
  { id: 24, name: 'Daging Kaleng', icon: 'fa-drumstick-bite', quantity: '76 KALENG' },
  { id: 25, name: 'Daster', icon: 'fa-shirt', quantity: '3.500 UNIT' },
  { id: 26, name: 'Ember', icon: 'fa-bucket', quantity: '20 PCS' },
  { id: 27, name: 'Ember Plastik', icon: 'fa-bucket', quantity: '17 PCS' },
  { id: 28, name: 'Emergency Kit', icon: 'fa-kit-medical', quantity: '35 UNIT' },
  { id: 29, name: 'Face Shield', icon: 'fa-head-side-mask', quantity: '12.140 PCS' },
  { id: 30, name: 'Family Kit', icon: 'fa-people-roof', quantity: '4.148 BOX' },
  { id: 31, name: 'Family Kit D2025', icon: 'fa-people-roof', quantity: '800 BAG' },
  { id: 32, name: 'Filter Air', icon: 'fa-filter', quantity: '38 UNIT' },
  { id: 33, name: 'Folding Bed', icon: 'fa-bed', quantity: '91 UNIT' },
  { id: 34, name: 'Garam', icon: 'fa-jar', quantity: '21 KARTON' },
  { id: 35, name: 'Garment Produk', icon: 'fa-shirt', quantity: '20.890 PCS' },
  { id: 36, name: 'Genset', icon: 'fa-car-battery', quantity: '4 UNIT' },
  { id: 37, name: 'Genset Portable', icon: 'fa-car-battery', quantity: '15 UNIT' },
  { id: 38, name: 'Gergaji Besi', icon: 'fa-hammer', quantity: '4 UNIT' },
  { id: 39, name: 'Gerobak Dorong', icon: 'fa-cart-shopping', quantity: '2 UNIT' },
  { id: 40, name: 'Gula', icon: 'fa-cubes', quantity: '517 KARTON' },
  { id: 41, name: 'Hand Sanitizer', icon: 'fa-pump-soap', quantity: '94 KARTON' },
  { id: 42, name: 'Hand Sirine Besar', icon: 'fa-bullhorn', quantity: '23 UNIT' },
  { id: 43, name: 'Hand Sirine Kecil', icon: 'fa-bullhorn', quantity: '10 UNIT' },
  { id: 44, name: 'Hand Sprayer 16 LT', icon: 'fa-spray-can', quantity: '20 UNIT' },
  { id: 45, name: 'Handuk', icon: 'fa-bath', quantity: '134 BALE' },
  { id: 46, name: 'Handuk', icon: 'fa-bath', quantity: '207 PCS' },
  { id: 47, name: 'Handuk Besar', icon: 'fa-bath', quantity: '2.005 PCS' },
  { id: 48, name: 'Handy Talky Motorola', icon: 'fa-walkie-talkie', quantity: '98 UNIT' },
  { id: 49, name: 'Hazmat', icon: 'fa-shield-virus', quantity: '2.571 PCS' },
  { id: 50, name: 'Head Cap', icon: 'fa-hard-hat', quantity: '50.000 PCS' },
  { id: 51, name: 'Head Immobilization', icon: 'fa-head-side', quantity: '3 UNIT' },
  { id: 52, name: 'Head Lamp', icon: 'fa-lightbulb', quantity: '33 UNIT' },
  { id: 53, name: 'Helm', icon: 'fa-helmet-safety', quantity: '267 UNIT' },
  { id: 54, name: 'Hygiene and Disinfektan Kit', icon: 'fa-spray-can', quantity: '2.305 BOX' },
  { id: 55, name: 'Hygiene Kit', icon: 'fa-soap', quantity: '8.876 BOX' },
  { id: 56, name: 'Ikan Kaleng', icon: 'fa-fish', quantity: '201 KALENG' },
  { id: 57, name: 'Isolation Gowns', icon: 'fa-user-doctor', quantity: '7.600 UNIT' },
  { id: 58, name: 'Jaket', icon: 'fa-vest', quantity: '4 BALE' },
  { id: 59, name: 'Jas Hujan', icon: 'fa-cloud-rain', quantity: '682 PCS' },
  { id: 60, name: 'Jerigen 10 L', icon: 'fa-jug-detergent', quantity: '9.733 PCS' },
  { id: 61, name: 'Jerigen 20 L', icon: 'fa-jug-detergent', quantity: '2.880 PCS' },
  { id: 62, name: 'Jerry Can Foldable', icon: 'fa-jug-detergent', quantity: '1.000 UNIT' },
  { id: 63, name: 'Kacamata', icon: 'fa-glasses', quantity: '5.678 PCS' },
  { id: 64, name: 'Kantong Mayat', icon: 'fa-box-archive', quantity: '2.420 PCS' },
  { id: 65, name: 'Kaos Kaki', icon: 'fa-socks', quantity: '100 KARTON' },
  { id: 66, name: 'Karbol', icon: 'fa-bottle-droplet', quantity: '10 KARTON' },
  { id: 67, name: 'Kasur C2025', icon: 'fa-bed', quantity: '320 UNIT' },
  { id: 68, name: 'Kasur Lantai', icon: 'fa-bed', quantity: '854 UNIT' },
  { id: 69, name: 'Kecap Manis', icon: 'fa-bottle-droplet', quantity: '11 KARTON' },
  { id: 70, name: 'Kelambu', icon: 'fa-bed', quantity: '10.615 PCS' },
  { id: 71, name: 'Kerudung', icon: 'fa-user', quantity: '1 BOX' },
  { id: 72, name: 'Ketel Pack', icon: 'fa-box', quantity: '249 UNIT' },
  { id: 73, name: 'Kitchen Kit', icon: 'fa-utensils', quantity: '2.550 BOX' },
  { id: 74, name: 'Knapack', icon: 'fa-suitcase', quantity: '24 UNIT' },
  { id: 75, name: 'Kompas', icon: 'fa-compass', quantity: '169 UNIT' },
  { id: 76, name: 'Kopi Sachet', icon: 'fa-mug-hot', quantity: '13 KARTON' },
  { id: 77, name: 'Kornet', icon: 'fa-box', quantity: '6.071 KALENG' },
  { id: 78, name: 'Kurma', icon: 'fa-bowl-food', quantity: '90 BOX' },
  { id: 79, name: 'Lampu Badai Lentera', icon: 'fa-lightbulb', quantity: '2.000 UNIT' },
  { id: 80, name: 'Lampu Emergency', icon: 'fa-lightbulb', quantity: '15.298 UNIT' },
  { id: 81, name: 'Lotion Anti Nyamuk', icon: 'fa-spray-can', quantity: '8 BOX' },
  { id: 82, name: 'Madu', icon: 'fa-jar', quantity: '120 PCS' },
  { id: 83, name: 'Makanan Kaleng', icon: 'fa-box', quantity: '5.872 KALENG' },
  { id: 84, name: 'Makanan Ringan', icon: 'fa-cookie', quantity: '129.567 KARTON' },
  { id: 85, name: 'Masker Kain', icon: 'fa-mask-face', quantity: '129.082 PCS' },
  { id: 86, name: 'Masker Medis', icon: 'fa-mask-face', quantity: '285.465 PCS' },
  { id: 87, name: 'Masker N95', icon: 'fa-mask-face', quantity: '5.386 PCS' },
  { id: 88, name: 'Masker Respirator', icon: 'fa-mask-face', quantity: '317 PCS' },
  { id: 89, name: 'Matras', icon: 'fa-bed', quantity: '1.473 PCS' },
  { id: 90, name: 'Menstrual Hygiene Management Kit', icon: 'fa-box', quantity: '4 BOX' },
  { id: 91, name: 'Mie Instan', icon: 'fa-bowl-rice', quantity: '8.267 KARTON' },
  { id: 92, name: 'Minuman Energy', icon: 'fa-bottle-water', quantity: '6.186 PCS' },
  { id: 93, name: 'Minuman Kemasan Botol', icon: 'fa-bottle-water', quantity: '231 KARTON' },
  { id: 94, name: 'Minuman Sachet', icon: 'fa-mug-hot', quantity: '19 KARTON' },
  { id: 95, name: 'Minyak Goreng 1 L', icon: 'fa-bottle-droplet', quantity: '738 KARTON' },
  { id: 96, name: 'Minyak Kayu Putih', icon: 'fa-bottle-droplet', quantity: '808 PCS' },
  { id: 97, name: 'Modul Komunikasi Starlink', icon: 'fa-satellite-dish', quantity: '10 UNIT' },
  { id: 98, name: 'Nesting', icon: 'fa-utensils', quantity: '47 UNIT' },
  { id: 99, name: 'Obat-Obatan', icon: 'fa-pills', quantity: '722 KARTON' },
  { id: 100, name: 'Oxygen Concentrator', icon: 'fa-lungs', quantity: '10 UNIT' },
  { id: 101, name: 'Oxymeter', icon: 'fa-heart-pulse', quantity: '270 PCS' },
  { id: 102, name: 'Pakaian Anak', icon: 'fa-shirt', quantity: '5.942 PCS' },
  { id: 103, name: 'Pakaian Dalam Wanita', icon: 'fa-shirt', quantity: '3.340 PCS' },
  { id: 104, name: 'Pakaian Dewasa', icon: 'fa-shirt', quantity: '19.050 PCS' },
  { id: 105, name: 'Paket Sembako', icon: 'fa-box', quantity: '3.823 BAG' },
  { id: 106, name: 'Palu', icon: 'fa-hammer', quantity: '249 UNIT' },
  { id: 107, name: 'Pasta Gigi', icon: 'fa-tooth', quantity: '56 KARTON' },
  { id: 108, name: 'Pelastik Roll', icon: 'fa-scroll', quantity: '12 ROL' },
  { id: 109, name: 'Pembalut Wanita', icon: 'fa-box', quantity: '437 KARTON' },
  { id: 110, name: 'Pembalut Wanita', icon: 'fa-box', quantity: '1.909 PCS' },
  { id: 111, name: 'Pembalut Wanita', icon: 'fa-box', quantity: '24 UNIT' },
  { id: 112, name: 'Pembersih Lantai', icon: 'fa-broom', quantity: '3 KARTON' },
  { id: 113, name: 'Perahu Karet', icon: 'fa-ship', quantity: '2 UNIT' },
  { id: 114, name: 'Peralatan Mandi', icon: 'fa-shower', quantity: '30 BOX' },
  { id: 115, name: 'Perlengkapan Bayi', icon: 'fa-baby', quantity: '3 BALE' },
  { id: 116, name: 'Perlengkapan Bayi', icon: 'fa-baby', quantity: '30 PACK' },
  { id: 117, name: 'Perlengkapan Dapur Umum', icon: 'fa-utensils', quantity: '155 UNIT' },
  { id: 118, name: 'Perlengkapan Ibadah', icon: 'fa-mosque', quantity: '65 BALE' },
  { id: 119, name: 'Perlengkapan SAR', icon: 'fa-life-ring', quantity: '1 BAG' },
  { id: 120, name: 'Perlengkapan Sekolah', icon: 'fa-school', quantity: '201 BAG' },
  { id: 121, name: 'PHBS', icon: 'fa-hand-sparkles', quantity: '96 PCS' },
  { id: 122, name: 'Pisau Lipat', icon: 'fa-scissors', quantity: '118 PCS' },
  { id: 123, name: 'Plastik Sampah', icon: 'fa-trash', quantity: '25 PACK' },
  { id: 124, name: 'Pompa Air', icon: 'fa-faucet', quantity: '3 UNIT' },
  { id: 125, name: 'Popok Anak', icon: 'fa-baby', quantity: '1.841 KARTON' },
  { id: 126, name: 'Popok Dewasa', icon: 'fa-box', quantity: '275 KARTON' },
  { id: 127, name: 'Portable Toilet', icon: 'fa-toilet', quantity: '6 UNIT' },
  { id: 128, name: 'Rendang Kaleng', icon: 'fa-box', quantity: '1.175 KALENG' },
  { id: 129, name: 'Rompi Biru', icon: 'fa-vest', quantity: '142 PCS' },
  { id: 130, name: 'Rompi Merah', icon: 'fa-vest', quantity: '1.363 PCS' },
  { id: 131, name: 'Rompi Merah', icon: 'fa-vest', quantity: '25 UNIT' },
  { id: 132, name: 'Sabun Bayi', icon: 'fa-soap', quantity: '3 BOX' },
  { id: 133, name: 'Sabun Cuci', icon: 'fa-soap', quantity: '20 KARTON' },
  { id: 134, name: 'Sabun Cuci Piring', icon: 'fa-soap', quantity: '12 KARTON' },
  { id: 135, name: 'Sabun Mandi', icon: 'fa-soap', quantity: '485 BOX' },
  { id: 136, name: 'Sabun Mandi Cair', icon: 'fa-pump-soap', quantity: '1.176 PCS' },
  { id: 137, name: 'Sambal Botol', icon: 'fa-bottle-droplet', quantity: '1 KARTON' },
  { id: 138, name: 'Sandal Jepit', icon: 'fa-shoe-prints', quantity: '100 PCS' },
  { id: 139, name: 'Sarden', icon: 'fa-fish', quantity: '928 KARTON' },
  { id: 140, name: 'Sarung', icon: 'fa-shirt', quantity: '32.104 PCS' },
  { id: 141, name: 'Sarung Tangan Kain', icon: 'fa-hand', quantity: '523 PCS' },
  { id: 142, name: 'Sarung Tangan Karet', icon: 'fa-hand', quantity: '845 PCS' },
  { id: 143, name: 'Sarung Tangan Kulit', icon: 'fa-hand', quantity: '246 PCS' },
  { id: 144, name: 'Sarung Tangan Latex', icon: 'fa-hand', quantity: '2.770 PCS' },
  { id: 145, name: 'Sarung Tangan Medis', icon: 'fa-hand', quantity: '5 UNIT' },
  { id: 146, name: 'School Kit', icon: 'fa-school', quantity: '3.245 BAG' },
  { id: 147, name: 'Sekop', icon: 'fa-hammer', quantity: '701 PCS' },
  { id: 148, name: 'Sekop', icon: 'fa-hammer', quantity: '71 UNIT' },
  { id: 149, name: 'Sekop Lipat', icon: 'fa-hammer', quantity: '249 PCS' },
  { id: 150, name: 'Selang Filter', icon: 'fa-filter', quantity: '1 UNIT' },
  { id: 151, name: 'Selang Kompresor', icon: 'fa-wind', quantity: '140 PCS' },
  { id: 152, name: 'Selimut', icon: 'fa-bed', quantity: '3 BALE' },
  { id: 153, name: 'Selimut', icon: 'fa-bed', quantity: '11.279 PCS' },
  { id: 154, name: 'Selimut A2025', icon: 'fa-bed', quantity: '3.667 PCS' },
  { id: 155, name: 'Seng Gelombang', icon: 'fa-layer-group', quantity: '46.969 PCS' },
  { id: 156, name: 'Senter LED', icon: 'fa-lightbulb', quantity: '13 UNIT' },
  { id: 157, name: 'Sepatu Boot', icon: 'fa-shoe-prints', quantity: '864 PCS' },
  { id: 158, name: 'Sepeda', icon: 'fa-bicycle', quantity: '16 UNIT' },
  { id: 159, name: 'Seragam Sekolah', icon: 'fa-shirt', quantity: '907 PCS' },
  { id: 160, name: 'Shampo', icon: 'fa-pump-soap', quantity: '2.004 BOTOL' },
  { id: 161, name: 'Shelter Kit', icon: 'fa-house', quantity: '145 BAG' },
  { id: 162, name: 'Shelter Tool Kit', icon: 'fa-toolbox', quantity: '100 BAG' },
  { id: 163, name: 'Shoes Cover', icon: 'fa-shoe-prints', quantity: '625 PCS' },
  { id: 164, name: 'Sikat Gigi', icon: 'fa-tooth', quantity: '47 KARTON' },
  { id: 165, name: 'Skop', icon: 'fa-hammer', quantity: '12 UNIT' },
  { id: 166, name: 'Sleeping Bag', icon: 'fa-bed', quantity: '40 PCS' },
  { id: 167, name: 'Sosis', icon: 'fa-hotdog', quantity: '30 KARTON' },
  { id: 168, name: 'Sprayer Manual', icon: 'fa-spray-can', quantity: '1.362 UNIT' },
  { id: 169, name: 'Spray Gun', icon: 'fa-spray-can', quantity: '166 UNIT' },
  { id: 170, name: 'Starlink', icon: 'fa-satellite', quantity: '90 UNIT' },
  { id: 171, name: 'Stiker', icon: 'fa-note-sticky', quantity: '4.000 LEMBAR' },
  { id: 172, name: 'Susu Bubuk', icon: 'fa-mug-hot', quantity: '193 KARTON' },
  { id: 173, name: 'Susu Kaleng', icon: 'fa-mug-hot', quantity: '203 KALENG' },
  { id: 174, name: 'Susu Kotak', icon: 'fa-mug-hot', quantity: '929 KARTON' },
  { id: 175, name: 'Susu Sachet', icon: 'fa-mug-hot', quantity: '35 KARTON' },
  { id: 176, name: 'Tabung Gas 17 KG', icon: 'fa-fire', quantity: '1 UNIT' },
  { id: 177, name: 'Tabung Oksigen 10 L', icon: 'fa-lungs', quantity: '3 UNIT' },
  { id: 178, name: 'Tali Twist Rope', icon: 'fa-link', quantity: '457 ROL' },
  { id: 179, name: 'Tambang', icon: 'fa-link', quantity: '8 ROL' },
  { id: 180, name: 'Tandon Air 300 Lt', icon: 'fa-droplet', quantity: '4 UNIT' },
  { id: 181, name: 'Tandu Basket', icon: 'fa-bed-pulse', quantity: '4 UNIT' },
  { id: 182, name: 'Tandu Lipat', icon: 'fa-bed-pulse', quantity: '5 UNIT' },
  { id: 183, name: 'Tandu Scoope', icon: 'fa-bed-pulse', quantity: '5 UNIT' },
  { id: 184, name: 'Tarpaulin', icon: 'fa-square', quantity: '1.383 PCS' },
  { id: 185, name: 'Tarpaulin', icon: 'fa-square', quantity: '769 UNIT' },
  { id: 186, name: 'Tas Evakuasi', icon: 'fa-suitcase', quantity: '249 PCS' },
  { id: 187, name: 'Tas Pinggang', icon: 'fa-suitcase', quantity: '247 PCS' },
  { id: 188, name: 'Teh Celup', icon: 'fa-mug-hot', quantity: '55 KARTON' },
  { id: 189, name: 'Teh Celup', icon: 'fa-mug-hot', quantity: '38 PACK' },
  { id: 190, name: 'Telur', icon: 'fa-egg', quantity: '500 KG' },
  { id: 191, name: 'Tenda', icon: 'fa-campground', quantity: '13 UNIT' },
  { id: 192, name: 'Tenda Alas', icon: 'fa-campground', quantity: '12 UNIT' },
  { id: 193, name: 'Tenda Emergency', icon: 'fa-campground', quantity: '1 UNIT' },
  { id: 194, name: 'Tenda Family', icon: 'fa-campground', quantity: '286 BAG' },
  { id: 195, name: 'Tenda Gulung C2025', icon: 'fa-campground', quantity: '800 UNIT' },
  { id: 196, name: 'Tenda Individu', icon: 'fa-campground', quantity: '71 UNIT' },
  { id: 197, name: 'Tenda Modular', icon: 'fa-campground', quantity: '450 UNIT' },
  { id: 198, name: 'Tenda Oval', icon: 'fa-campground', quantity: '2 UNIT' },
  { id: 199, name: 'Tenda Peleton', icon: 'fa-campground', quantity: '3 UNIT' },
  { id: 200, name: 'Tenda Peleton', icon: 'fa-campground', quantity: '5 UNIT' },
  { id: 201, name: 'Tenda Personil', icon: 'fa-campground', quantity: '10 UNIT' },
  { id: 202, name: 'Tenda Regu', icon: 'fa-campground', quantity: '1 UNIT' },
  { id: 203, name: 'Tenda Relawan', icon: 'fa-campground', quantity: '2 UNIT' },
  { id: 204, name: 'Tenda Serbaguna', icon: 'fa-campground', quantity: '2 UNIT' },
  { id: 205, name: 'Tensi Digital', icon: 'fa-heart-pulse', quantity: '1 UNIT' },
  { id: 206, name: 'Terpal Roll', icon: 'fa-scroll', quantity: '40 ROL' },
  { id: 207, name: 'Thermometer Infrared', icon: 'fa-thermometer', quantity: '285 PCS' },
  { id: 208, name: 'Tissue', icon: 'fa-box-tissue', quantity: '93 KARTON' },
  { id: 209, name: 'Tisu Basah', icon: 'fa-box-tissue', quantity: '2 KARTON' },
  { id: 210, name: 'Tolak Angin', icon: 'fa-pills', quantity: '255 KARTON' },
  { id: 211, name: 'Topi Kupluk PMI', icon: 'fa-hat-cowboy', quantity: '47 PCS' },
  { id: 212, name: 'Topi Rimba PMI', icon: 'fa-hat-cowboy', quantity: '37 PCS' },
  { id: 213, name: 'Tripod', icon: 'fa-camera', quantity: '3 UNIT' },
  { id: 214, name: 'Veldples', icon: 'fa-bottle-water', quantity: '47 PCS' },
  { id: 215, name: 'Vertical Rescue', icon: 'fa-life-ring', quantity: '1 BOX' },
  { id: 216, name: 'Vitamin C', icon: 'fa-pills', quantity: '887 KARTON' },
  { id: 217, name: 'Water Bladder', icon: 'fa-droplet', quantity: '15 UNIT' },
  { id: 218, name: 'Water Tank 6 m3', icon: 'fa-droplet', quantity: '1 UNIT' },
  { id: 219, name: 'Watertank Kit Flexible Onion 10 M3', icon: 'fa-droplet', quantity: '1 UNIT' },
  { id: 220, name: 'Watertank Kit Flexible Onion 5 M3', icon: 'fa-droplet', quantity: '28 UNIT' },
];

export default function Home() {
  const [searchStockTerm, setSearchStockTerm] = useState('');
  const [selectedNews, setSelectedNews] = useState<typeof newsData[0] | null>(null);

  const filteredPmiStock = pmiStockData.filter(item =>
    item.name.toLowerCase().includes(searchStockTerm.toLowerCase())
  );

  return (
    <div className="bg-white text-[#1B1B1B]">
      <header className="py-6 bg-[#1B1B1B] shadow text-white">
        <div className="container mx-auto text-center">
          <img src="/logo.png" className="h-16 mx-auto" alt="Logo" />
          <p className="text-xs mt-2 text-white leading-tight font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>
            KEMENTRIAN KOORDINATOR <br />
            BIDANG PEMBANGUNAN MANUSIA DAN KEBUDAYAAN <br />
            REPUBLIK INDONESIA
          </p>
        </div>
      </header>

      <section className="bg-gradient-to-br from-[#1B1B1B] via-[#2a2a2a] to-[#1B1B1B] text-white pt-16 pb-20 relative">
        <div className="text-center mb-12 px-6">
          <p className="text-xl md:text-2xl opacity-80 mb-4">
            Kawal informasi seputar bencana Sumatera secara tepat dan akurat
          </p>
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
                  <span className="text-2xl font-bold">961 <span className="text-sm font-normal">jiwa</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>Hilang</span>
                  <span className="text-2xl font-bold">291 <span className="text-sm font-normal">jiwa</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>Terluka</span>
                  <span className="text-2xl font-bold">5 ribu <span className="text-sm font-normal">jiwa</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>Kab/Kota Terdampak</span>
                  <span className="text-2xl font-bold">52</span>
                </div>
              </div>
            </div>

            {/* Pengungsi */}
            <div className="bg-gradient-to-br from-[#FF6B35] to-[#D22730] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold">Pengungsi</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>Sumatera Utara</span>
                  <span className="text-xl font-bold">34,900 <span className="text-sm font-normal">jiwa</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>Aceh</span>
                  <span className="text-xl font-bold">795,700 <span className="text-sm font-normal">jiwa</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>Sumatera Barat</span>
                  <span className="text-xl font-bold">14,700 <span className="text-sm font-normal">jiwa</span></span>
                </div>
              </div>
              <div className="mt-4 text-center bg-white/20 rounded-lg py-3">
                <p className="text-sm opacity-80">Total Pengungsi</p>
                <p className="text-3xl font-black">± 845 ribu <span className="text-lg font-normal">jiwa</span></p>
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
                  <p className="text-lg font-bold">157,6 ribu</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">Rumah Ibadah</p>
                  <p className="text-lg font-bold">425</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">Fasilitas Umum</p>
                  <p className="text-lg font-bold">1,2 ribu</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">Gedung/Kantor</p>
                  <p className="text-lg font-bold">234</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">Fas. Kesehatan</p>
                  <p className="text-lg font-bold">199</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">Jembatan</p>
                  <p className="text-lg font-bold">497</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2 col-span-2">
                  <p className="text-xs opacity-70">Fasilitas Pendidikan</p>
                  <p className="text-lg font-bold">534</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm opacity-60 mt-6" style={{ fontFamily: 'Arial, sans-serif' }}>
          Sumber: <span className="font-semibold">Data BNPB, 8 Desember 2025</span>
        </p>
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
              <p className="text-gray-600 leading-relaxed">
                {selectedNews.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nomor Darurat Bencana Section */}
      <section className="py-16 bg-gradient-to-b from-[#1B1B1B] to-[#2d4a6d]">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-white mb-2">
            NOMOR DARURAT
          </h2>
          <h3 className="text-center text-4xl md:text-5xl font-black text-white mb-10">
            BENCANA
          </h3>

          {/* Call Center Utama */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <a href="tel:117" className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-4 min-w-[200px]">
              <div className="w-14 h-14 bg-[#D22730] rounded-full flex items-center justify-center">
                <i className="fas fa-phone text-white text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Call Center BNPB</p>
                <p className="text-4xl font-black text-[#1B1B1B]">117</p>
              </div>
            </a>
            <a href="tel:115" className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-4 min-w-[200px]">
              <div className="w-14 h-14 bg-[#D22730] rounded-full flex items-center justify-center">
                <i className="fas fa-phone text-white text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Call Center BASARNAS</p>
                <p className="text-4xl font-black text-[#1B1B1B]">115</p>
              </div>
            </a>
          </div>

          {/* Provinsi Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Sumatera Barat */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <h4 className="text-xl font-bold text-[#87CEEB] mb-4 text-center border-b border-white/20 pb-3">
                PROVINSI SUMATERA BARAT
              </h4>
              <div className="space-y-2">
                {[
                  { name: 'BPBD Sumatera Barat', phone: '(0751) 890721' },
                  { name: 'PMI Sumatera Barat', phone: '(0751) 27882' },
                  { name: 'Damkar Kota Padang', phone: '0811 6606 113' },
                  { name: 'BPBD Padang Pariaman', phone: '0811 666 2114' },
                  { name: 'Damkar Bukittinggi', phone: '0853 5515 7883' },
                  { name: 'BPBD Pesisir Selatan', phone: '0852 6938 0950' },
                ].map((item, idx) => (
                  <a key={idx} href={`tel:${item.phone.replace(/[^0-9]/g, '')}`} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-white/10 transition-colors group">
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-[#87CEEB] font-semibold group-hover:text-white transition-colors">{item.phone}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Sumatera Utara */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <h4 className="text-xl font-bold text-[#87CEEB] mb-4 text-center border-b border-white/20 pb-3">
                PROVINSI SUMATERA UTARA
              </h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scroll">
                {[
                  { name: 'Basarnas Medan', phone: '085191795579' },
                  { name: 'BPBD PEMPROVSU', phone: '08116221733' },
                  { name: 'BPBD Deli Serdang', phone: '08116782022' },
                  { name: 'BPBD Medan', phone: '081370800880' },
                  { name: 'Damkar Medan', phone: '08116566113' },
                  { name: 'Damkar Binjai', phone: '(061) 8821935' },
                  { name: 'BPBD Binjai', phone: '08116192611' },
                  { name: 'BPBD P. Siantar', phone: '082262173370' },
                  { name: 'BPBD Tapteng', phone: '081290900222' },
                  { name: 'BPBD Taput', phone: '081375194119' },
                  { name: 'BPBD Sibolga', phone: '063121544' },
                  { name: 'BPBD Tapsel', phone: '08116217115' },
                  { name: 'BPBD Sidempuan', phone: '081392415449' },
                ].map((item, idx) => (
                  <a key={idx} href={`tel:${item.phone.replace(/[^0-9]/g, '')}`} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-white/10 transition-colors group">
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-[#87CEEB] font-semibold group-hover:text-white transition-colors">{item.phone}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
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
              Pembaruan Terakhir: <span className="font-semibold">8 Desember 2025 pukul 17.02</span>
            </p>
          </div>

          <div className="bg-white text-black rounded-xl shadow-xl p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <label className="font-semibold text-gray-700 mr-2">Cari:</label>
                <input
                  type="text"
                  value={searchStockTerm}
                  onChange={(e) => setSearchStockTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#D22730] focus:ring-2 focus:ring-[#D22730]/25 outline-none transition"
                  placeholder="Cari item..."
                />
              </div>
              <a 
                href="https://pmi.or.id/dashboard/stock" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-[#D22730] hover:underline"
              >
                Sumber: pmi.or.id/dashboard/stock →
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50">
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Nama Barang</th>
                    <th className="text-right py-3 px-4 font-semibold">Jumlah Stok</th>
                  </tr>
                </thead>
              </table>
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <tbody>
                    {filteredPmiStock.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <i className={`fas ${item.icon} text-xl text-[#D22730] w-6 text-center`}></i>
                            <span className="font-semibold">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-lg">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center text-sm text-gray-500 mt-4">
                Menampilkan {filteredPmiStock.length} item
              </div>
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

      <section className="py-16 bg-gray-50">
        <h2 className="text-center text-3xl font-bold mb-6">
          Pemantauan Satelit Pulau Sumatera
        </h2>
        <div className="container mx-auto px-3 sm:px-6 md:px-20">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
            <MapComponent />
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

          {/* Partner Logos */}
          <div className="border-t border-[#2A2A2A] mt-12 pt-8">
            <p className="text-center text-sm text-gray-400 mb-6">Didukung oleh:</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
              {/* Kemenko PMK */}
              <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg flex items-center justify-center p-2">
                  <img src="/logo.png" alt="Kemenko PMK" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs text-gray-400">Kemenko PMK</span>
              </div>
              {/* BNPB */}
              <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg flex items-center justify-center p-1">
                  <img src="/logos/bnpb.png" alt="BNPB" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs text-gray-400">BNPB</span>
              </div>
              {/* BASARNAS */}
              <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg flex items-center justify-center p-1">
                  <img src="/logos/basarnas.png" alt="BASARNAS" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs text-gray-400">BASARNAS</span>
              </div>
              {/* PMI */}
              <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg flex items-center justify-center p-1">
                  <img src="/logos/pmi.png" alt="PMI" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs text-gray-400">PMI</span>
              </div>
              {/* Badan Pangan Nasional */}
              <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg flex items-center justify-center p-1">
                  <img src="/logos/bapanas.png" alt="Badan Pangan Nasional" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs text-gray-400">Bapanas</span>
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
