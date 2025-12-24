"use client";

import { useState, useEffect } from 'react';
import { Language, getTranslation } from './translations';

type NewsItem = {
  id: number;
  title: string;
  title_en: string;
  category: string;
  category_en: string;
  content: string;
  content_en: string;
  image: string;
  date: string;
};

type PmiStockItem = { name: string; quantity: string };
type PmiStockCategories = Record<string, PmiStockItem[]>;

// Data Pos Pengungsian
const posPengungsianData = {
  'Aceh': [
    { name: 'SMU 1 Rantau', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Desa Tungkop', lokasi: 'Aceh Barat - Sungai Mas', lat: 4.35, lng: 96.25, kabupaten: 'Aceh Barat', kecamatan: 'Pante Ceureumen' },
    { name: 'Kantor BPBD Aceh Barat', lokasi: 'Aceh Barat - Johan Pahlawan', lat: 4.146, lng: 96.126, kabupaten: 'Aceh Barat', kecamatan: 'Johan Pahlawan' },
    { name: 'Kecamatan Pante Ceureumen', lokasi: 'Aceh Barat - Pante Ceureumen', lat: 4.28, lng: 96.2, kabupaten: 'Aceh Barat', kecamatan: 'Kaway Xvi' },
    { name: 'RSUD Cut Nyak Dhien', lokasi: 'Aceh Barat - Johan Pahlawan', lat: 4.146, lng: 96.126, kabupaten: 'Aceh Barat', kecamatan: 'Johan Pahlawan' },
    { name: 'Desa Pasar Blangpidie Asrama Kodim 0110', lokasi: 'Aceh Barat Daya - Blang Pidie', lat: 3.75, lng: 96.86, kabupaten: 'Aceh Barat Daya', kecamatan: 'Blangpidie' },
    { name: 'Rumah Sakit Teuku Peukan', lokasi: 'Aceh Barat Daya - Susoh', lat: 3.735, lng: 96.84, kabupaten: 'Aceh Barat Daya', kecamatan: 'Blangpidie' },
    { name: 'Meunasah indrapuri', lokasi: 'Aceh Besar - Indrapuri', lat: 5.43, lng: 95.46, kabupaten: 'Aceh Besar', kecamatan: 'Indrapuri' },
    { name: 'Kantor Camat Trumon', lokasi: 'Aceh Selatan - Trumon', lat: 2.825, lng: 97.62, kabupaten: 'Aceh Selatan', kecamatan: 'Trumon' },
    { name: 'Kantor Camat Trumon Timur', lokasi: 'Aceh Selatan - Trumon Timur', lat: 2.85, lng: 97.7, kabupaten: 'Aceh Selatan', kecamatan: 'Trumon Tengah' },
    { name: 'Posko Kompi 1 Batalyon C Pelopor Sat Brimob', lokasi: 'Aceh Selatan - Trumon Timur', lat: 2.85, lng: 97.7, kabupaten: 'Aceh Selatan', kecamatan: 'Trumon Tengah' },
    { name: 'RSUD Dr. H. Yuliddin Away', lokasi: 'Aceh Selatan - Tapak Tuan', lat: 3.262, lng: 97.185, kabupaten: 'Aceh Selatan', kecamatan: 'Tapaktuan' },
    { name: 'Kantor BPBD Kab. Aceh Singkil', lokasi: 'Aceh Singkil - Singkil', lat: 2.28, lng: 97.79, kabupaten: 'Aceh Singkil', kecamatan: 'Singkil' },
    { name: 'Kantor Kec. Gunung Meriah', lokasi: 'Aceh Singkil - Gunung Meriah', lat: 2.305, lng: 97.85, kabupaten: 'Aceh Singkil', kecamatan: 'Singkil' },
    { name: 'RSUD Aceh Singkil', lokasi: 'Aceh Singkil - Gunung Meriah', lat: 2.305, lng: 97.85, kabupaten: 'Aceh Singkil', kecamatan: 'Singkil' },
    { name: 'BABO (Blok 8), kec. BANDAR PUSAKA', lokasi: 'Aceh Tamiang - Bandar Pusaka', lat: 4.15, lng: 97.9, kabupaten: 'Aceh Tamiang', kecamatan: 'Tamiang Hulu' },
    { name: 'Bukit Desa Sriwijaya', lokasi: 'Aceh Tamiang - Kota Kuala Simpang', lat: 4.281, lng: 98.062, kabupaten: 'Aceh Tamiang', kecamatan: 'Kota Kualasinpang' },
    { name: 'Bukit desa suka jadi paya bujok', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'BUKIT MEJA PT.PPP KEBUN TANAH TERBAN', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Daerah sekitar bukit rambat, kampung Jawa', lokasi: 'Aceh Tamiang - Tenggulun', lat: 4.085, lng: 97.95, kabupaten: 'Aceh Tamiang', kecamatan: 'Tenggulun' },
    { name: 'DESA BUNDAR DUSUN BAHAGIA', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'DESA PANTAI CEMPA (dibukit dekat tower), kec. BANDAR PUSAKA', lokasi: 'Aceh Tamiang - Bandar Pusaka', lat: 4.15, lng: 97.9, kabupaten: 'Aceh Tamiang', kecamatan: 'Tamiang Hulu' },
    { name: 'Desa paya raja, kecamatan banda mulya', lokasi: 'Aceh Tamiang - Banda Mulia', lat: 4.42, lng: 98.15, kabupaten: 'Aceh Tamiang', kecamatan: 'Bendahara' },
    { name: 'DESA PENGIDAM, kec. BANDAR PUSAKA', lokasi: 'Aceh Tamiang - Bandar Pusaka',lat: 4.15, lng: 97.9, kabupaten: 'Aceh Tamiang', kecamatan: 'Tamiang Hulu' },
    { name: 'DESA SAMPAIMAH KEC.MANYAK PAYED', lokasi: 'Aceh Tamiang - Manyak Payed', lat: 4.35, lng: 98.08, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'DESA SERBA, Dsn. ALUR HITAM (Area bukit ujung)', lokasi: 'Aceh Tamiang - Bandar Pusaka', lat: 4.15, lng: 97.9, kabupaten: 'Aceh Tamiang', kecamatan: 'Tamiang Hulu' },
    { name: 'DESA TELAGA MEUKU, KEC. BANDA MULIA', lokasi: 'Aceh Tamiang - Banda Mulia', lat: 4.42, lng: 98.15, kabupaten: 'Aceh Tamiang', kecamatan: 'Bendahara' },
    { name: 'Di bukit blok 9 depan rumah nek bibi', lokasi: 'Aceh Tamiang - Bandar Pusaka', lat: 4.15, lng: 97.9, kabupaten: 'Aceh Tamiang', kecamatan: 'Tamiang Hulu' },
    { name: 'Dusun lalang desa Mekarjaya', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Dusun pekan, desa mesjid sungai iyu, kecamatan bendahara', lokasi: 'Aceh Tamiang - Bendahara', lat: 4.4, lng: 98.15, kabupaten: 'Aceh Tamiang', kecamatan: 'Bendahara' },
    { name: 'Dusun permai desa Mekarjaya', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Gang bunga tupah', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Gang TU 2 Kp Dalam, belakang SD IT (rumah kuning 2 lantai)', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Gang wak mis Depan gerbang SD IT kampung dalam (rumah tingkat 2)', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'GOR Aceh Tamiang, Karang Baru', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'JnT karang baru', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Kampung bukit kecamatan tenggulun', lokasi: 'Aceh Tamiang - Tenggulun', lat: 4.085, lng: 97.95, kabupaten: 'Aceh Tamiang', kecamatan: 'Tenggulun' },
    { name: 'Kantor Camat Sungai Liput', lokasi: 'Aceh Tamiang - Tenggulun', lat: 4.085, lng: 97.95, kabupaten: 'Aceh Tamiang', kecamatan: 'Tenggulun' },
    { name: 'Kantor datok Benua Raja', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Kantor datok kampung durian', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Kantor pengadilan Kuala Simpang', lokasi: 'Aceh Tamiang - Kota Kuala Simpang', lat: 4.281, lng: 98.062, kabupaten: 'Aceh Tamiang', kecamatan: 'Kota Kualasinpang' },
    { name: 'Kawasan pabrik betami dan BDL (desa alur manis & perkebunan rantau)', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Kejaksaan Negeri Aceh Tamiang', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Kp. Durian arah jalan ke kebun ubi', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Kuburan cina kp. Durian', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Masjid Istiqamah Kp.landuh/benua raja', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Masjid Nurul Iman - Bukit Suling', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Mesjid At-Taqwa Rantau', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Mesjid Beteng, Desa Marlempang', lokasi: 'Aceh Tamiang - Bendahara', lat: 4.4, lng: 98.15, kabupaten: 'Aceh Tamiang', kecamatan: 'Bendahara' },
    { name: 'Mesjid dan Tk pulau 3', lokasi: 'Aceh Tamiang - Tamiang Hulu', lat: 4.185, lng: 97.98, kabupaten: 'Aceh Tamiang', kecamatan: 'Kejuruan Muda' },
    { name: 'Mesjid Darussalam Simpang 4', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Mesjid kebun medang ara', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Mesjid Kp Dalam', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Mesjid SPBU DUA DARA, seuneubok baro', lokasi: 'Aceh Tamiang - Manyak Payed', lat: 4.35, lng: 98.08, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Mesjid Taqwa Kuala Simpang (Samping GK Kupi)', lokasi: 'Aceh Tamiang - Kota Kuala Simpang', lat: 4.281, lng: 98.062, kabupaten: 'Aceh Tamiang', kecamatan: 'Kota Kualasinpang' },
    { name: 'Mesra Lorong 1 dusun barang meuku', lokasi: 'Aceh Tamiang - Manyak Payed', lat: 4.35, lng: 98.08, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Meunasah Sp 3', lokasi: 'Aceh Tamiang - Manyak Payed', lat: 4.35, lng: 98.08, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Pajak hongkong', lokasi: 'Aceh Tamiang - Kuala Simpang', lat: 4.281, lng: 98.062, kabupaten: 'Aceh Tamiang', kecamatan: 'Kota Kualasinpang' },
    { name: 'Palang Merah Gg Jati bagian atas (bukit palang merah)', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Perumahan dekat RSUD', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Pesantren At thayyib (ex gudang DR) kp. Durian', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Pesantren menanggni', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Peternakan ayam dekat rel arah ke tupah atas', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Petojo (bekas pabrik es) tanjung karang', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'PKS tanah terban (dipabrik nya) - 100 KK', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Pondok sopin bagian atas karang jadi', lokasi: 'Aceh Tamiang - Tenggulun', lat: 4.085, lng: 97.95, kabupaten: 'Aceh Tamiang', kecamatan: 'Tenggulun' },
    { name: 'Puskesmas Karang Baru', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'RANTAU BINTANG (dekat SD), kec. BANDAR PUSAKA', lokasi: 'Aceh Tamiang - Bandar Pusaka', lat: 4.15, lng: 97.9, kabupaten: 'Aceh Tamiang', kecamatan: 'Tamiang Hulu' },
    { name: 'Rel PKS Tj. Sementok (Rumah Tengku muksal)', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'RUKO DEPAN KODIM KARANG BARU SAMPING PEGADAIAN', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Ruko samping Kopi PB gaming It.2 (sblm gang mawaddah)', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Ruko sekitaran kp.landuh', lokasi: 'Aceh Tamiang - Rantau', lat: 4.3325, lng: 98.061, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Rumah Pak lili tingkat 3, Dusun mesjid, Tanjung karang', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'SD depan istana karang baru', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'SMK 1 Kota lintang', lokasi: 'Aceh Tamiang - Kota Kuala Simpang', lat: 4.281, lng: 98.062, kabupaten: 'Aceh Tamiang', kecamatan: 'Kota Kualasinpang' },
    { name: 'SUKA JADI PAYA BUJOK', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Taman RSUD aceh tamiang', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'TK Tahfiz Quran Jamalul Arafah (Seputaran kantor PLN Ranting guys Sulum)', lokasi: 'Aceh Tamiang - Bandar Pusaka', lat: 4.15, lng: 97.9, kabupaten: 'Aceh Tamiang', kecamatan: 'Tamiang Hulu' },
    { name: 'Tualang cut', lokasi: 'Aceh Tamiang - Manyak Payed', lat: 4.35, lng: 98.08, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Tupah', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Ujung lorong gang mawaddah rumah lantai 3', lokasi: 'Aceh Tamiang - Karang Baru', lat: 4.303, lng: 98.0525, kabupaten: 'Aceh Tamiang', kecamatan: 'Karang Baru' },
    { name: 'Balee Dusun Seuneuddon,', lokasi: 'Aceh Utara - Seuneuddon', lat: 5.08, lng: 97.45, kabupaten: 'Aceh Utara', kecamatan: 'T. Jambo Aye' },
    { name: 'Meunasah dan Masjid Kec. Tanah Jambo Aye,', lokasi: 'Aceh Utara - Tanah Jambo Aye', lat: 5.1, lng: 97.48, kabupaten: 'Aceh Timur', kecamatan: 'Pante Bidari' },
    { name: 'SMS 1 Seunedon,', lokasi: 'Aceh Utara - Seuneuddon', lat: 5.08, lng: 97.45, kabupaten: 'Aceh Utara', kecamatan: 'T. Jambo Aye' },
    { name: 'Aula Kantor Desa (Pasar Simpang Tiga)', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Aula Kantor Desa Karang Rejo (Jamur Ujung)', lokasi: 'Bener Meriah - Wih Pesam', lat: 4.7, lng: 96.8, kabupaten: 'Bener Meriah', kecamatan: 'Wih Pesam' },
    { name: 'Aula Setdakab (Serule Kayu)', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Dayah Dusun Suka Mulia (Syura Jadi)', lokasi: 'Bener Meriah - Wih Pesam', lat: 4.7, lng: 96.8, kabupaten: 'Bener Meriah', kecamatan: 'Wih Pesam' },
    { name: 'Depan Rumah Warga di Muyang Kute Mangkung, SD 2 Puja Mulia', lokasi: 'Bener Meriah - Bandar', lat: 4.73, lng: 96.83, kabupaten: 'Bener Meriah', kecamatan: 'Wih Pesam' },
    { name: 'Dusun Intan (Lampahan)', lokasi: 'Bener Meriah - Timang Gajah', lat: 4.65, lng: 96.75, kabupaten: 'Aceh Tengah', kecamatan: 'Silih Nara' },
    { name: 'Gedung BUMK Pulo Intan (Pulo Intan)', lokasi: 'Bener Meriah - Pintu Rime Gayo', lat: 4.6, lng: 96.7, kabupaten: 'Aceh Tengah', kecamatan: 'Celala' },
    { name: 'Gedung Serba Guna (Gegerung)', lokasi: 'Bener Meriah - Wih Pesam', lat: 4.7, lng: 96.8, kabupaten: 'Bener Meriah', kecamatan: 'Wih Pesam' },
    { name: 'Gedung Serbaguna (Karang Rejo)', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Jalan Kampung Kepies', lokasi: 'Bener Meriah - Permata', lat: 4.85, lng: 96.95, kabupaten: 'Bener Meriah', kecamatan: 'Permata' },
    { name: 'Kampung Baru 76 (Lampahan)', lokasi: 'Bener Meriah - Timang Gajah', lat: 4.65, lng: 96.75, kabupaten: 'Aceh Tengah', kecamatan: 'Silih Nara' },
    { name: 'Kampung Karang Jadi (Lampahan)', lokasi: 'Bener Meriah - Timang Gajah', lat: 4.65, lng: 96.75, kabupaten: 'Aceh Tengah', kecamatan: 'Silih Nara' },
    { name: 'Kantor Desa di Pondok Sayur', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Kantor Desa Rembele', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Kantor Desa Ujung Gele', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Kantor Koperasi Aisyara (Suka Ramai Bawah)', lokasi: 'Bener Meriah - Wih Pesam', lat: 4.7, lng: 96.8, kabupaten: 'Bener Meriah', kecamatan: 'Wih Pesam' },
    { name: 'Masjid Balee Redelong', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Masjid Baru (Seni Antara)', lokasi: 'Bener Meriah - Permata', lat: 4.85, lng: 96.95, kabupaten: 'Bener Meriah', kecamatan: 'Permata' },
    { name: 'Pantan Kemuning (Tunyang)', lokasi: 'Bener Meriah - Timang Gajah', lat: 4.65, lng: 96.75, kabupaten: 'Aceh Tengah', kecamatan: 'Silih Nara' },
    { name: 'Pasar Lampahan Timur (Lampahan Timur)', lokasi: 'Bener Meriah - Timang Gajah', lat: 4.65, lng: 96.75, kabupaten: 'Aceh Tengah', kecamatan: 'Silih Nara' },
    { name: 'Pintu Gerbang PI (Panji Mulia Satu)', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Polindes Dusun Tebang Baru (Rimba Raya)', lokasi: 'Bener Meriah - Pintu Rime Gayo', lat: 4.6, lng: 96.7, kabupaten: 'Aceh Tengah', kecamatan: 'Celala' },
    { name: 'Polindes Rime Raya', lokasi: 'Bener Meriah - Pintu Rime Gayo', lat: 4.6, lng: 96.7, kabupaten: 'Aceh Tengah', kecamatan: 'Celala' },
    { name: 'Polindes Seni Antara (Burni Pase)', lokasi: 'Bener Meriah - Permata', lat: 4.85, lng: 96.95, kabupaten: 'Bener Meriah', kecamatan: 'Permata' },
    { name: 'Posko Utama (Serule Kayu)', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Puskesmas Lama Teritit (Simpang Teritit)', lokasi: 'Bener Meriah - Wih Pesam', lat: 4.7, lng: 96.8, kabupaten: 'Bener Meriah', kecamatan: 'Wih Pesam' },
    { name: 'Rumah Kepala Dusun (Mupakat Jadi)', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Rumah Pak Dusun Setie', lokasi: 'Bener Meriah - Timang Gajah', lat: 4.65, lng: 96.75, kabupaten: 'Aceh Tengah', kecamatan: 'Silih Nara' },
    { name: 'Rumah Pak Reje Dusun 5 (Sumber Jaya)', lokasi: 'Bener Meriah - Timang Gajah', lat: 4.65, lng: 96.75, kabupaten: 'Aceh Tengah', kecamatan: 'Silih Nara' },
    { name: 'Rumah Reje (Tunyang)', lokasi: 'Bener Meriah - Timang Gajah', lat: 4.65, lng: 96.75, kabupaten: 'Aceh Tengah', kecamatan: 'Silih Nara' },
    { name: 'Rumah Warga di Bukit Pepani', lokasi: 'Bener Meriah - Wih Pesam', lat: 4.7, lng: 96.8, kabupaten: 'Bener Meriah', kecamatan: 'Wih Pesam' },
    { name: 'Rumah Warga di Gelampang Wih Tenang Uken', lokasi: 'Bener Meriah - Permata', lat: 4.85, lng: 96.95, kabupaten: 'Bener Meriah', kecamatan: 'Permata' },
    { name: 'Rumah Warga di Mutiara Baru', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Rumah Warga di Uning Bersah', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'SD 2 Jamur Ujung', lokasi: 'Bener Meriah - Wih Pesam', lat: 4.7, lng: 96.8, kabupaten: 'Bener Meriah', kecamatan: 'Wih Pesam' },
    { name: 'SD Cemparam Jaya', lokasi: 'Bener Meriah - Mesidah', lat: 4.8, lng: 96.9, kabupaten: 'Bener Meriah', kecamatan: 'Permata' },
    { name: 'SD Uning Baro (Meriah Jaya)', lokasi: 'Bener Meriah - Gajah Putih', lat: 4.68, lng: 96.78, kabupaten: 'Aceh Tengah', kecamatan: 'Kute Panang' },
    { name: 'SDN 2 Lampahan (Lampahan)', lokasi: 'Bener Meriah - Timang Gajah', lat: 4.65, lng: 96.75, kabupaten: 'Aceh Tengah', kecamatan: 'Silih Nara' },
    { name: 'Simpang Rahmat Menasah (Dusun Tiga)', lokasi: 'Bener Meriah - Gajah Putih', lat: 4.68, lng: 96.78, kabupaten: 'Aceh Tengah', kecamatan: 'Kute Panang' },
    { name: 'SMP 2 Wih Pesam', lokasi: 'Bener Meriah - Wih Pesam', lat: 4.7, lng: 96.8, kabupaten: 'Bener Meriah', kecamatan: 'Wih Pesam' },
    { name: 'Toko Milik M. Yusuf (Burni Pase)', lokasi: 'Bener Meriah - Permata', lat: 4.85, lng: 96.95, kabupaten: 'Bener Meriah', kecamatan: 'Permata' },
    { name: 'TPA Mesjid Uning Teritit', lokasi: 'Bener Meriah - Bukit', lat: 4.72, lng: 96.85, kabupaten: 'Bener Meriah', kecamatan: 'Bukit' },
    { name: 'Balai Latihan Kerja', lokasi: 'Gayo Lues - Blangkejeren', lat: 3.98, lng: 97.33, kabupaten: 'Gayo Lues', kecamatan: 'Blangkejeren' },
    { name: 'Bale Musara', lokasi: 'Gayo Lues - Blangkejeren', lat: 3.98, lng: 97.33, kabupaten: 'Gayo Lues', kecamatan: 'Blangkejeren' },
    { name: 'Kantor Camat Terangun', lokasi: 'Gayo Lues - Terangun', lat: 3.9, lng: 97.2, kabupaten: 'Gayo Lues', kecamatan: 'Kutapanjang' },
    { name: 'Menasah Indrapuri', lokasi: 'Gayo Lues - Blangkejeren', lat: 3.98, lng: 97.33, kabupaten: 'Gayo Lues', kecamatan: 'Blangkejeren' },
    { name: 'Puskesmas Kota', lokasi: 'Gayo Lues - Blangkejeren', lat: 3.98, lng: 97.33, kabupaten: 'Gayo Lues', kecamatan: 'Blangkejeren' },
    { name: 'Remukut', lokasi: 'Gayo Lues - Pantan Cuaca', lat: 3.95, lng: 97.15, kabupaten: 'Gayo Lues', kecamatan: 'Blangjerango' },
    { name: 'SD Negeri Blangtegulun', lokasi: 'Gayo Lues - Blangkejeren', lat: 3.98, lng: 97.33, kabupaten: 'Gayo Lues', kecamatan: 'Blangkejeren' },
    { name: 'SDN Blangtegulun', lokasi: 'Gayo Lues - Blangkejeren', lat: 3.98, lng: 97.33, kabupaten: 'Gayo Lues', kecamatan: 'Blangkejeren' },
    { name: 'Tetingi', lokasi: 'Gayo Lues - Blangpegayon', lat: 4.0, lng: 97.35, kabupaten: 'Gayo Lues', kecamatan: 'Blangkejeren' },
    { name: 'Kantor BPBD Sabang', lokasi: 'Kota Sabang - Sukajaya', lat: 5.86, lng: 95.34, kabupaten: 'Kota Sabang', kecamatan: 'Sukajaya' },
    { name: 'Desa Blang Meurandeh', lokasi: 'Nagan Raya - Beutong Ateuh', lat: 4.45, lng: 96.45, kabupaten: 'Aceh Barat', kecamatan: 'Pante Ceureumen' },
    { name: 'Desa Gampong Gunong', lokasi: 'Nagan Raya - Darul Makmur', lat: 4.05, lng: 96.55, kabupaten: 'Nagan Raya', kecamatan: 'Darul Makmur' },
    { name: 'Desa Kuta Trieng', lokasi: 'Nagan Raya - Darul Makmur', lat: 4.05, lng: 96.55, kabupaten: 'Nagan Raya', kecamatan: 'Darul Makmur' },
    { name: 'Desa Lamie', lokasi: 'Nagan Raya - Darul Makmur', lat: 4.05, lng: 96.55, kabupaten: 'Nagan Raya', kecamatan: 'Darul Makmur' },
    { name: 'Desa Tuwi Buya', lokasi: 'Nagan Raya - Darul Makmur', lat: 4.05, lng: 96.55, kabupaten: 'Nagan Raya', kecamatan: 'Darul Makmur' },
    { name: 'Kantor dinas sosial pidie jaya', lokasi: 'Pidie Jaya - Meureudu', lat: 5.24, lng: 96.25, kabupaten: 'Pidie Jaya', kecamatan: 'Meureudu' },
    { name: 'Musholla Surau Tabek', lokasi: 'Kota Solok - Lubuk Sikarah', lat: 5.03, lng: 97.31, kabupaten: 'Aceh Utara', kecamatan: 'Lhoksukon' }
  ],
  'Sumatera Utara': [
    { name: 'Desa Sipange', lokasi: 'Tapanuli Tengah - Tukka', lat: 1.74, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Kota' },
    { name: 'Dusun Sibalanga Jae', lokasi: 'Tapanuli Utara - Adian Koting', lat: 1.74, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Kota' },
    { name: 'Dusun Sibalanga Julu', lokasi: 'Tapanuli Utara - Adian Koting', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Gereja HKBP Desa Sibalanga', lokasi: 'Tapanuli Utara - Adian Koting', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Lobu Pining', lokasi: 'Tapanuli Utara - Pahae Julu', lat: 1.9682, lng: 99.0185, kabupaten: 'Tapanuli Utara', kecamatan: 'Siatas Barita' },
    { name: 'Robean', lokasi: 'Tapanuli Utara - Purba Tua', lat: 1.8619, lng: 99.1496, kabupaten: 'Tapanuli Utara', kecamatan: 'Pahae Jae' },
    { name: 'SDN Sihaporas', lokasi: 'Tapanuli Utara - Parmonangan', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Sitol Bahal', lokasi: 'Tapanuli Utara - Purba Tua', lat: 1.8653, lng: 99.1437, kabupaten: 'Tapanuli Utara', kecamatan: 'Pahae Jae' },
    { name: 'GOR Pandan', lokasi: 'Tapanuli Tengah - Pandan', lat: 1.69, lng: 98.83, kabupaten: 'Tapanuli Tengah', kecamatan: 'Pandan' },
    { name: 'BUKIT belakang SMA 1 KJM (Sd Impres)', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'Bukit blkang pabrik sisil / pabrik sisiro payanas/sidodadi', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'Bukit simpang pangkalan mau arah ke desa pangkalan, kebun tengah dekat gudang aqua', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'Depan SPBU kebun tengah', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'Klinik abah', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'Mesjid Seumadam', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'Minuran SMANDU', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'Perumahan samping SPBU seumadam', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'Polsek Kejuruan Muda', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'SD AW Seumadam', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'SMAN 1 KEJURUAN MUDA', lokasi: 'Aceh Tamiang - Kejuruan Muda', lat: 4.21, lng: 98.12, kabupaten: 'Langkat', kecamatan: 'Pematang Jaya' },
    { name: 'Buntul Kendawi', lokasi: 'Aceh Tenggara - Darul Hasanah', lat: 2.02, lng: 98.97, kabupaten: 'Tapanuli Utara', kecamatan: 'Tarutung' },
    { name: 'GOR Bancah Laweh', lokasi: 'Kota Padang Panjang - Padang Panjang Timur', lat: 1.75, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Islamic Center', lokasi: 'Kota Padang Panjang - Padang Panjang Timur', lat: 1.75, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Kantor Lurah Pasar Usang', lokasi: 'Kota Padang Panjang - Padang Panjang Barat', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Kantor Lurah Silaian Bawah', lokasi: 'Kota Padang Panjang - Padang Panjang Barat', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Mesjid Nurul F. Tanah Lambik', lokasi: 'Kota Padang Panjang - Padang Panjang Timur', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Mesjid Nurul Saadah, Gumala', lokasi: 'Kota Padang Panjang - Padang Panjang Timur', lat: 1.74, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Kota' },
    { name: 'Mushola Nur Falah, Kampung Manggis', lokasi: 'Kota Padang Panjang - Padang Panjang Barat', lat: 1.74, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Kota' },
    { name: 'Rumah Dinas Camat Padang Panjang Timur', lokasi: 'Kota Padang Panjang - Padang Panjang Timur', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'SDN 10 Padang Panjang Barat', lokasi: 'Kota Padang Panjang - Padang Panjang Barat', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'SDN 11 PPT, Koto Panjang', lokasi: 'Kota Padang Panjang - Padang Panjang Timur', lat: 1.74, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Kota' },
    { name: 'SDN 13 PPT, Koto Katik', lokasi: 'Kota Padang Panjang - Padang Panjang Timur', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Taman Kota Kalumpang', lokasi: 'Kota Solok - Lubuk Sikarah', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Desa Bulu Cina', lokasi: 'Deli Serdang - Hamparan Perak', lat: 3.73, lng: 98.57, kabupaten: 'Deli Serdang', kecamatan: 'Hamparan Perak' },
    { name: 'Gedung Serba Guna', lokasi: 'Deli Serdang - Pantai Labu', lat: 3.6503, lng: 98.9099, kabupaten: 'Deli Serdang', kecamatan: 'Pantai Labu' },
    { name: 'Mesjid Al Ikhlas', lokasi: 'Deli Serdang - Pantai Labu', lat: 3.6466, lng: 98.8901, kabupaten: 'Deli Serdang', kecamatan: 'Pantai Labu' },
    { name: 'Mesjid Dusun 1', lokasi: 'Deli Serdang - Pantai Labu', lat: 3.6577, lng: 98.8919, kabupaten: 'Deli Serdang', kecamatan: 'Pantai Labu' },
    { name: 'Musholla Al Hidayah 2', lokasi: 'Deli Serdang - Pantai Labu', lat: 3.6467, lng: 98.9042, kabupaten: 'Deli Serdang', kecamatan: 'Pantai Labu' },
    { name: 'Musholla Nur Muhammad', lokasi: 'Deli Serdang - Pantai Labu', lat: 3.6406, lng: 98.9021, kabupaten: 'Deli Serdang', kecamatan: 'Pantai Labu' },
    { name: 'Posko DPD Golkar', lokasi: 'Deli Serdang - Pantai Labu', lat: 3.6403, lng: 98.8965, kabupaten: 'Deli Serdang', kecamatan: 'Pantai Labu' },
    { name: 'Posko Dusun 1', lokasi: 'Deli Serdang - Pantai Labu', lat: 3.6571, lng: 98.8918, kabupaten: 'Deli Serdang', kecamatan: 'Pantai Labu' },
    { name: 'SD Negeri Desa Tengah', lokasi: 'Deli Serdang - Pantai Labu', lat: 3.645, lng: 98.9007, kabupaten: 'Deli Serdang', kecamatan: 'Pantai Labu' },
    { name: 'Desa Pulogadung', lokasi: 'Humbang Hasundutan - Pakkat', lat: 2.16, lng: 98.62, kabupaten: 'Humbang Hasundutan', kecamatan: 'Onan Ganjang' },
    { name: 'Ds. Batu Nagodang Siatas', lokasi: 'Humbang Hasundutan - Onan Ganjang', lat: 2.18, lng: 98.68, kabupaten: 'Humbang Hasundutan', kecamatan: 'Sijamapolang' },
    { name: 'Ds. Purba Baringin', lokasi: 'Humbang Hasundutan - Pakkat', lat: 2.16, lng: 98.62, kabupaten: 'Humbang Hasundutan', kecamatan: 'Onan Ganjang' },
    { name: 'Ds. Purbasatu', lokasi: 'Humbang Hasundutan - Pakkat', lat: 2.16, lng: 98.62, kabupaten: 'Humbang Hasundutan', kecamatan: 'Onan Ganjang' },
    { name: 'Gereja HKBP Parbotihan', lokasi: 'Humbang Hasundutan - Onan Ganjang', lat: 2.18, lng: 98.68, kabupaten: 'Humbang Hasundutan', kecamatan: 'Sijamapolang' },
    { name: 'rumah warga di Ds. Pangguguran', lokasi: 'Humbang Hasundutan - Pakkat', lat: 2.16, lng: 98.62, kabupaten: 'Humbang Hasundutan', kecamatan: 'Onan Ganjang' },
    { name: 'SDN UPT 121', lokasi: 'Humbang Hasundutan - Onan Ganjang', lat: 2.18, lng: 98.68, kabupaten: 'Humbang Hasundutan', kecamatan: 'Sijamapolang' },
    { name: 'Tanah lapang Panggunggunan', lokasi: 'Humbang Hasundutan - Pakkat', lat: 2.16, lng: 98.62, kabupaten: 'Humbang Hasundutan', kecamatan: 'Onan Ganjang' },
    { name: 'Wisma Gereja HKBP Ds. Tarabintang', lokasi: 'Humbang Hasundutan - Tarabintang', lat: 2.1, lng: 98.55, kabupaten: 'Humbang Hasundutan', kecamatan: 'Pakkat' },
    { name: 'Wisma HKBP', lokasi: 'Humbang Hasundutan - Tarabintang', lat: 2.1, lng: 98.55, kabupaten: 'Humbang Hasundutan', kecamatan: 'Pakkat' },
    { name: 'Jalan T.Imam Bonjol Kel. Setia', lokasi: 'Kota Binjai - Binjai Kota', lat: 3.6, lng: 98.48, kabupaten: 'Kota Binjai', kecamatan: 'Binjai Kota' },
    { name: 'Gereja HKBP Edinazer', lokasi: 'Kota Medan - Medan Barat', lat: 3.6, lng: 98.67, kabupaten: 'Kota Medan', kecamatan: 'Medan Barat' },
    { name: 'Gereja HKBP Judea', lokasi: 'Kota Medan - Medan Tuntungan', lat: 3.51, lng: 98.61, kabupaten: 'Kota Medan', kecamatan: 'Medan Tuntungan' },
    { name: 'Gereja Jeriko', lokasi: 'Kota Medan - Medan Tembung', lat: 3.6, lng: 98.71, kabupaten: 'Deli Serdang', kecamatan: 'Percut Sei Tuan' },
    { name: 'Kantor Lurah Sei Mati', lokasi: 'Kota Medan - Medan Labuhan', lat: 3.695, lng: 98.69, kabupaten: 'Kota Medan', kecamatan: 'Medan Labuhan' },
    { name: 'Kantor Lurah Terjun', lokasi: 'Kota Medan - Medan Marelan', lat: 3.68, lng: 98.645, kabupaten: 'Deli Serdang', kecamatan: 'Labuhan Deli' },
    { name: 'Komplek Swalloew', lokasi: 'Kota Medan - Medan Amplas', lat: 3.54, lng: 98.7, kabupaten: 'Kota Medan', kecamatan: 'Medan Amplas' },
    { name: 'Masjid AL Falah', lokasi: 'Kota Medan - Medan Maimun', lat: 3.578, lng: 98.685, kabupaten: 'Kota Medan', kecamatan: 'Medan Maimun' },
    { name: 'Masjid Al Istiqomah', lokasi: 'Kota Medan - Medan Helvetia', lat: 3.605, lng: 98.635, kabupaten: 'Kota Medan', kecamatan: 'Medan Helvetia' },
    { name: 'Masjid AL Muqomar', lokasi: 'Kota Medan - Medan Selayang', lat: 3.55, lng: 98.63, kabupaten: 'Kota Medan', kecamatan: 'Medan Selayang' },
    { name: 'Masjid Al Mutaqin', lokasi: 'Kota Medan - Medan Johor', lat: 3.535, lng: 98.675, kabupaten: 'Kota Medan', kecamatan: 'Medan Johor' },
    { name: 'Masjid Al. Hasanah', lokasi: 'Kota Medan - Medan Timur', lat: 3.6, lng: 98.68, kabupaten: 'Kota Medan', kecamatan: 'Medan Timur' },
    { name: 'Masjid Kuningan ALhikmah', lokasi: 'Kota Medan - Medan Area', lat: 3.58, lng: 98.69, kabupaten: 'Kota Medan', kecamatan: 'Medan Kota' },
    { name: 'Masjid Nasuha Taqwa', lokasi: 'Kota Medan - Medan Amplas', lat: 3.54, lng: 98.7, kabupaten: 'Kota Medan', kecamatan: 'Medan Amplas' },
    { name: 'Masjid Nurul Huda', lokasi: 'Kota Medan - Medan Denai', lat: 3.56, lng: 98.7, kabupaten: 'Kota Medan', kecamatan: 'Medan Kota' },
    { name: 'Mushola Al Huda', lokasi: 'Kota Medan - Medan Perjuangan', lat: 3.6, lng: 98.69, kabupaten: 'Kota Medan', kecamatan: 'Medan Timur' },
    { name: 'SD. Permata', lokasi: 'Kota Medan - Medan Sunggal', lat: 3.59, lng: 98.62, kabupaten: 'Kota Medan', kecamatan: 'Medan Sunggal' },
    { name: 'Sekolah Babu Ulum', lokasi: 'Kota Medan - Medan Marelan', lat: 3.68, lng: 98.645, kabupaten: 'Deli Serdang', kecamatan: 'Labuhan Deli' },
    { name: 'Wisma Efrata', lokasi: 'Kota Medan - Medan Baru', lat: 3.58, lng: 98.66, kabupaten: 'Kota Medan', kecamatan: 'Medan Baru' },
    { name: 'Desa Goti', lokasi: 'Kota Padang Sidempuan - Padangsidimpuan Tenggara', lat: 1.35, lng: 99.3, kabupaten: 'Kota Padang Sidempuan', kecamatan: 'Padangsidimpuan Tenggara' },
    { name: 'Desa Manegen', lokasi: 'Kota Padang Sidempuan - Padangsidimpuan Tenggara', lat: 1.35, lng: 99.3, kabupaten: 'Kota Padang Sidempuan', kecamatan: 'Padangsidimpuan Tenggara' },
    { name: 'Desa Sabungan Sipabangun', lokasi: 'Kota Padang Sidempuan - Padangsidimpuan Hutaimbaru', lat: 1.4, lng: 99.25, kabupaten: 'Kota Padang Sidempuan', kecamatan: 'Padangsidimpuan Utara' },
    { name: 'Desa Tinjoman', lokasi: 'Kota Padang Sidempuan - Padangsidimpuan Hutaimbaru', lat: 1.4, lng: 99.25, kabupaten: 'Kota Padang Sidempuan', kecamatan: 'Padangsidimpuan Utara' },
    { name: 'Esdeli Jl.Kosantaroji Kel.Ujung Padang', lokasi: 'Kota Padang Sidempuan - Padangsidimpuan Selatan', lat: 1.36, lng: 99.27, kabupaten: 'Kota Padang Sidempuan', kecamatan: 'Padangsidimpuan Selatan' },
    { name: 'Gg. Syukur Kel. Losung Batu', lokasi: 'Kota Padang Sidempuan - Padangsidimpuan Utara', lat: 1.38, lng: 99.27, kabupaten: 'Kota Padang Sidempuan', kecamatan: 'Padangsidimpuan Utara' },
    { name: 'Kantor Walikota', lokasi: 'Kota Padang Sidempuan - Padangsidimpuan Utara', lat: 1.38, lng: 99.27, kabupaten: 'Kota Padang Sidempuan', kecamatan: 'Padangsidimpuan Utara' },
    { name: 'Melati Seberang Kel. Sidangka', lokasi: 'Kota Padang Sidempuan - Padangsidimpuan Selatan', lat: 1.36, lng: 99.27, kabupaten: 'Kota Padang Sidempuan', kecamatan: 'Padangsidimpuan Selatan' },
    { name: 'Belakang Puskesmas Parombunan', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Gg Kenanga Kel. Aek parambunan', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Gg. Aman Parombunan', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Gg. Ambaroba', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Gg. Mandiri Taspen', lokasi: 'Kota Sibolga - Sibolga Kota', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Gg. Maninjau', lokasi: 'Kota Sibolga - Sibolga Sambas', lat: 1.74, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Kota' },
    { name: 'GOR Porimbunan', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'jalan Imam Bonjol', lokasi: 'Kota Sibolga - Sibolga Kota', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'jalan kenari', lokasi: 'Kota Sibolga - Sibolga Sambas', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Jl. Murai Kel. Aek manis', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Jl. Sudirman', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Kantor IPHI', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Kel Huta Barangan', lokasi: 'Kota Sibolga - Sibolga Utara', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Kel. Aek Habil', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Kel. Angin Nauli', lokasi: 'Kota Sibolga - Sibolga Utara', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Kel. Huta Tonga Tonga', lokasi: 'Kota Sibolga - Sibolga Utara', lat: 1.74, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Kota' },
    { name: 'Kel. Pancuran gerobak', lokasi: 'Kota Sibolga - Sibolga Kota', lat: 1.75, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Kel. Sibolga ilir', lokasi: 'Kota Sibolga - Sibolga Utara', lat: 1.74, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Kota' },
    { name: 'Kel. Simare-mare', lokasi: 'Kota Sibolga - Sibolga Utara', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'lingkungan lima, Kel. Pancuran gerobak', lokasi: 'Kota Sibolga - Sibolga Kota', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'masjid Al Ashar', lokasi: 'Kota Sibolga - Sibolga Kota', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Masjid Al-Jihad', lokasi: 'Kota Sibolga - Sibolga Sambas', lat: 1.75, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Masjid Kenanga', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Masjid taqwa', lokasi: 'Kota Sibolga - Sibolga Sambas', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Desa S Kalangan', lokasi: 'Tapanuli Tengah - Tukka', lat: 1.74, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Kota' },
    { name: 'Desa Simarpinggan dan Parjaringan', lokasi: 'Tapanuli Tengah - Kolang', lat: 1.75, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'pasar baru', lokasi: 'Kota Sibolga - Sibolga Kota', lat: 1.75, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'raja pancuran', lokasi: 'Kota Sibolga - Sibolga Kota', lat: 1.74, lng: 98.78, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Kota' },
    { name: 'simpang Lima', lokasi: 'Kota Sibolga - Sibolga Kota', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'SMP 5 , Parombunan', lokasi: 'Kota Sibolga - Sibolga Selatan', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Area Toll Tanjung Pura', lokasi: 'Langkat - Tanjung Pura', lat: 3.9102, lng: 98.4324, kabupaten: 'Langkat', kecamatan: 'Tanjung Pura' },
    { name: 'Basecamp Perairan Cempa', lokasi: 'Langkat - Hinai', lat: 3.8053, lng: 98.3905, kabupaten: 'Langkat', kecamatan: 'Hinai' },
    { name: 'Kantor Camat Sei Lepan', lokasi: 'Langkat - Sei Lepan', lat: 3.9756, lng: 98.1897, kabupaten: 'Langkat', kecamatan: 'Besitang' },
    { name: 'Masjid At Taqwa Besitang', lokasi: 'Langkat - Besitang', lat: 4.0641, lng: 98.1591, kabupaten: 'Langkat', kecamatan: 'Besitang' },
    { name: 'Masjid Batu Melenggang', lokasi: 'Langkat - Hinai', lat: 3.7879, lng: 98.403, kabupaten: 'Langkat', kecamatan: 'Hinai' },
    { name: 'Masjid Uhdiyah Babalan', lokasi: 'Langkat - Babalan', lat: 4.0136, lng: 98.2819, kabupaten: 'Langkat', kecamatan: 'Sei Lepan' },
    { name: 'SMPN Besitang', lokasi: 'Langkat - Besitang', lat: 4.064, lng: 98.1567, kabupaten: 'Langkat', kecamatan: 'Besitang' },
    { name: 'Stabat Lama Barat', lokasi: 'Langkat - Wampu', lat: 3.7896, lng: 98.3532, kabupaten: 'Langkat', kecamatan: 'Padang Tualang' },
    { name: 'Tebasan Desa Pantai Gemi', lokasi: 'Langkat - Stabat', lat: 3.7368, lng: 98.4625, kabupaten: 'Langkat', kecamatan: 'Stabat' },
    { name: 'SD 037 Tangga Bosi', lokasi: 'Mandailing Natal - Siabu', lat: 0.95, lng: 99.53, kabupaten: 'Mandailing Natal', kecamatan: 'Bukit Malintang' },
    { name: 'Ds. Sei Rampah', lokasi: 'Serdang Bedagai - Sei Rampah', lat: 3.48, lng: 99.13, kabupaten: 'Serdang Bedagai', kecamatan: 'Sei Rampah' },
    { name: 'Kantor Desa Pasar Baru', lokasi: 'Serdang Bedagai - Teluk Mengkudu', lat: 3.55, lng: 99.15, kabupaten: 'Serdang Bedagai', kecamatan: 'Teluk Mengkudu' },
    { name: 'Rumah Kepala Desa Liberia', lokasi: 'Serdang Bedagai - Teluk Mengkudu', lat: 3.55, lng: 99.15, kabupaten: 'Serdang Bedagai', kecamatan: 'Teluk Mengkudu' },
    { name: 'Desa Hutanabolon', lokasi: 'Tapanuli Tengah - Tukka', lat: 1.745, lng: 98.785, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Utara' },
    { name: 'Desa Mampang Baru', lokasi: 'Tapanuli Tengah - Sibabangun', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' },
    { name: 'Desa Pondok Bambu', lokasi: 'Tapanuli Tengah - Tukka', lat: 1.73, lng: 98.79, kabupaten: 'Kota Sibolga', kecamatan: 'Sibolga Sambas' }
  ],
  'Sumatera Barat': [
    { name: 'Kantor Camat IV Koto', lokasi: 'Agam - IV Koto', lat: -0.25, lng: 100.35, kabupaten: 'Agam', kecamatan: 'Tilatang Kamang' },
    { name: 'Masjid Islahul Khair', lokasi: 'Agam - Ampek Nagari', lat: -0.3, lng: 100.05, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'BPBD Agam, Padang Baru', lokasi: 'Agam - Lubuk Basung', lat: -0.33, lng: 100.04, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'Jalan Batuang', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Kampung Jambu', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Kantor Camat Tanjung Mutiara', lokasi: 'Agam - Tanjung Mutiara', lat: -0.45, lng: 100.05, kabupaten: 'Padang Pariaman', kecamatan: 'Sungai Garingging' },
    { name: 'Kantor Wali Nagari Bawan', lokasi: 'Agam - Ampek Nagari', lat: -0.3, lng: 100.05, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'Kantor Wali Nagari Bayua', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Kantor Wali Nagari Koto Kaciak', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Kantor Wali Nagari Pasia Laweh', lokasi: 'Agam - Palupuh', lat: -0.15, lng: 100.25, kabupaten: 'Agam', kecamatan: 'Palupuh' },
    { name: 'Los Pasar Tiku', lokasi: 'Agam - Tanjung Mutiara', lat: -0.45, lng: 100.05, kabupaten: 'Padang Pariaman', kecamatan: 'Sungai Garingging' },
    { name: 'Masjid Istiqomah dan MDA', lokasi: 'Agam - Tanjung Mutiara', lat: -0.45, lng: 100.05, kabupaten: 'Padang Pariaman', kecamatan: 'Sungai Garingging' },
    { name: 'Masjid Koto Baru', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Masjid Nurul Fallah Limo Badak', lokasi: 'Agam - Ampek Nagari', lat: -0.3, lng: 100.05, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'Masjid Nurul Iman Jorong Bukik Malanca', lokasi: 'Agam - Ampek Nagari', lat: -0.3, lng: 100.05, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'Masjid Nurul Sahadah Jorong Saskan', lokasi: 'Agam - Ampek Nagari', lat: -0.3, lng: 100.05, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'Masjid Pasa Rabaa', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Masjid Ummil Quran', lokasi: 'Agam - Tanjung Mutiara', lat: -0.45, lng: 100.05, kabupaten: 'Padang Pariaman', kecamatan: 'Sungai Garingging' },
    { name: 'MDA Bancah', lokasi: 'Agam - Tanjung Mutiara', lat: -0.45, lng: 100.05, kabupaten: 'Padang Pariaman', kecamatan: 'Sungai Garingging' },
    { name: 'MDA dan SDN 11', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'MTS N Terpadu', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Mushola Posko pengungsian', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Musholla (Bawan)', lokasi: 'Agam - Ampek Nagari', lat: -0.3, lng: 100.05, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'Nagari Bawan - Masjid dan Tenda pengungsian', lokasi: 'Agam - Ampek Nagari', lat: -0.3, lng: 100.05, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'RSUD Lubuk Basung', lokasi: 'Agam - Lubuk Basung', lat: -0.33, lng: 100.04, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'Rumah Batu Salamo', lokasi: 'Agam - Tanjung Mutiara', lat: -0.45, lng: 100.05, kabupaten: 'Padang Pariaman', kecamatan: 'Sungai Garingging' },
    { name: 'Rumah Buk Irdawati Jambu Putiah', lokasi: 'Agam - Tanjung Mutiara', lat: -0.45, lng: 100.05, kabupaten: 'Padang Pariaman', kecamatan: 'Sungai Garingging' },
    { name: 'Rumah Kerabat', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Rumah Masyarakat', lokasi: 'Agam - Ampek Nagari', lat: -0.3, lng: 100.05, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'SDN 19 Koto Tinggi', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Simpang 4 Koto Tinggi', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Simpang Patai', lokasi: 'Agam - Ampek Nagari', lat: -0.3, lng: 100.05, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'Sungai Rangeh', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Tanah Lapang', lokasi: 'Agam - Tanjung Raya', lat: -0.3, lng: 100.15, kabupaten: 'Agam', kecamatan: 'Tanjung Raya' },
    { name: 'Tempat saudara (Bawan)', lokasi: 'Agam - Ampek Nagari', lat: -0.3, lng: 100.05, kabupaten: 'Agam', kecamatan: 'Lubuk Basung' },
    { name: 'Asrama maritim belakang aciak mart', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Balai pertemuan RT 2 RW 8', lokasi: 'Kota Padang - Kuranji', lat: -0.9, lng: 100.4, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Bidan Marni Novera', lokasi: 'Kota Padang - Kuranji', lat: -0.9, lng: 100.4, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Cupak (Cupak / Cupak Tangah), Pauh', lokasi: 'Kota Padang - Pauh', lat: -0.915, lng: 100.41, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Dadok Tunggul Hitam', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Gedung serbaguna Kp.KB RT 4 RW 4', lokasi: 'Kota Padang - Kuranji', lat: -0.9, lng: 100.4, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Gudang pinang jl pulai raya RT 003 RW 002', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Kantor perikanan RT 02 RW 07', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Kelurahan Tabing Banda Gadang', lokasi: 'Kota Padang - Nanggalo', lat: -0.89, lng: 100.37, kabupaten: 'Kota Padang', kecamatan: 'Nanggalo' },
    { name: 'Kurao Pagang', lokasi: 'Kota Padang - Nanggalo', lat: -0.89, lng: 100.37, kabupaten: 'Kota Padang', kecamatan: 'Nanggalo' },
    { name: 'Lubuk Minturun', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Masjid Al hijrah Kp Apa', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Masjid Al Manar RT 03 RW 08', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Masjid Hidayah RT 01 RW 10', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Masjid Ikhwanul Muhajirin Komp. Mega Permai Tahap 1', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Masjid Nurul Falah RT 02 RW 05, Jln. Maransi', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Masjid Nurul Falah sungai duo 02 RW 07.', lokasi: 'Kota Padang - Pasir Nan Tigo', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Masjid Raya Ansharullah Nanggalo Padang', lokasi: 'Kota Padang - Nanggalo', lat: -0.89, lng: 100.37, kabupaten: 'Kota Padang', kecamatan: 'Nanggalo' },
    { name: 'Mesjid At Taubah RT 1 RW 1', lokasi: 'Kota Padang - Kuranji', lat: -0.9, lng: 100.4, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Mesjid Ittiadul Muslimin RT3 RW 7', lokasi: 'Kota Padang - Kuranji', lat: -0.9, lng: 100.4, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Mesjid Muttaqin RT 4 RW 4', lokasi: 'Kota Padang - Kuranji', lat: -0.9, lng: 100.4, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Mushalla al hijrah, RT 3 RW 12 Baringin', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Mushalla An Nabawi Rt 04 RW 14', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Mushalla Darussalam RT 01 RW 01', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Mushola Al - Ikhlas Salingka I', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Musholla At thoybah RT. 02 RW. 03', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Musholla Jabalnur', lokasi: 'Kota Padang - Kuranji', lat: -0.9, lng: 100.4, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Pos Surau Gadang', lokasi: 'Kota Padang - Nanggalo', lat: -0.89, lng: 100.37, kabupaten: 'Kota Padang', kecamatan: 'Nanggalo' },
    { name: 'Posko Gerbang Langit', lokasi: 'Kota Padang - Pauh', lat: -0.915, lng: 100.41, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Posko Mesjid Tajul Arifin Pindah Ke Mushalla Jabalrahmah', lokasi: 'Kota Padang - Pauh', lat: -0.915, lng: 100.41, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Posko Mesjid Taqwa', lokasi: 'Kota Padang - Pauh', lat: -0.915, lng: 100.41, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Posko Mushalla Al Mukmin', lokasi: 'Kota Padang - Pauh', lat: -0.915, lng: 100.41, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Posko Mushalla Muthahirin Koto Tuo RT 001/004', lokasi: 'Kota Padang - Pauh', lat: -0.915, lng: 100.41, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Posko RT 02 RW 01', lokasi: 'Kota Padang - Pauh', lat: -0.915, lng: 100.41, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Posko SDN 02 Cupak Tangah', lokasi: 'Kota Padang - Pauh', lat: -0.915, lng: 100.41, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Posko Sungkai', lokasi: 'Kota Padang - Pauh', lat: -0.915, lng: 100.41, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Posko Tahfis', lokasi: 'Kota Padang - Kuranji', lat: -0.9, lng: 100.4, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Posko Tanggap Darurat Kelurahan Batu Gadang', lokasi: 'Kota Padang - Lubuk Kilangan', lat: -0.95, lng: 100.45, kabupaten: 'Kota Padang', kecamatan: 'Lubuk Kilangan' },
    { name: 'Posko Tanggap Darurat Kelurahan Koto Lalang', lokasi: 'Kota Padang - Lubuk Kilangan', lat: -0.95, lng: 100.45, kabupaten: 'Kota Padang', kecamatan: 'Lubuk Kilangan' },
    { name: 'Rumah Dinas Wali Kota Padang', lokasi: 'Kota Padang - Padang Barat', lat: -0.945, lng: 100.355, kabupaten: 'Kota Padang', kecamatan: 'Padang Barat' },
    { name: 'Rumah Gadang dekat Mesjid Muthamainah', lokasi: 'Kota Padang - Kuranji', lat: -0.9, lng: 100.4, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Rumah Gadang Koto Tuo RT. 01 RW.01', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'Rumah quran An Nazifah Kp Guo RT 04 RW 066-Dapur Umum Setara Hero', lokasi: 'Kota Padang - Kuranji', lat: -0.9, lng: 100.4, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'Rumah Warga/Tenda', lokasi: 'Kota Padang - Kuranji', lat: -0.9, lng: 100.4, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'SD 41 Lori RT 03 RW 03', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'SDN 02 Cupak Tangah', lokasi: 'Kota Padang - Pauh', lat: -0.915, lng: 100.41, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'SDN 22 Cupak Pauh Kota Padang', lokasi: 'Kota Padang - Pauh', lat: -0.915, lng: 100.41, kabupaten: 'Kota Padang', kecamatan: 'Kuranji' },
    { name: 'SMP Negeri 29 Padang', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'TPU Balai Gadang', lokasi: 'Kota Padang - Koto Tangah', lat: -0.865, lng: 100.345, kabupaten: 'Kota Padang', kecamatan: 'Koto Tangah' },
    { name: 'GOR Bulutangkis Bancah Laweh', lokasi: 'Kota Padang Panjang - Padang Panjang Timur', lat: -0.463, lng: 100.405, kabupaten: 'Kota Padang Panjang', kecamatan: 'Padang Panjang Barat' },
    { name: 'Pos Silayiang Bawah', lokasi: 'Kota Padang Panjang - Padang Panjang Barat', lat: -0.46, lng: 100.39, kabupaten: 'Kota Padang Panjang', kecamatan: 'Padang Panjang Barat' },
    { name: 'Balaikota Solok Kel. IX Korong', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'Mesjid Al Amin Kel. Tanah Garam', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'Mesjid Al Aqsa Kel. Tanah Garam', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'Mesjid Alfirdaus Kel. KTK', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'Mesjid Nurul Iman Kel. Tanah Garam', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'Mushalla Alfalah Kel. IX Korong', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'Mushalla Baitul Makmur Kel. Ktk', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'Mushalla Sabilillah Kel. Tanah Garam', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'SD Payo Kel. Tanah Garam', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'SMP 4 Kel. Sinapa Piliang', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'Taman Kota Kalumpang Kel. VI Suku', lokasi: 'Kota Solok - Lubuk Sikarah', lat: -0.79, lng: 100.65, kabupaten: 'Kota Solok', kecamatan: 'Lubuk Sikarah' },
    { name: 'Dirumah warga yang tidak terdampak banjir', lokasi: 'Padang Pariaman - Ulakan Tapakis', lat: -0.7, lng: 100.25, kabupaten: 'Padang Pariaman', kecamatan: 'Ulakan Tapakih' },
    { name: 'Halaman Mushala surau kalapaian Pasar Kampuang Galapuang Ulakan', lokasi: 'Padang Pariaman - Ulakan Tapakis', lat: -0.7, lng: 100.25, kabupaten: 'Padang Pariaman', kecamatan: 'Ulakan Tapakih' },
    { name: 'Kabun Bungo Pasang', lokasi: 'Padang Pariaman - Ulakan Tapakis', lat: -0.7, lng: 100.25, kabupaten: 'Padang Pariaman', kecamatan: 'Ulakan Tapakih' },
    { name: 'Kampuang Koto', lokasi: 'Padang Pariaman - Ulakan Tapakis', lat: -0.7, lng: 100.25, kabupaten: 'Padang Pariaman', kecamatan: 'Ulakan Tapakih' },
    { name: 'Korong Sungai Pinang', lokasi: 'Padang Pariaman - Batang Anai', lat: -0.8, lng: 100.3, kabupaten: 'Padang Pariaman', kecamatan: 'Batang Anai' },
    { name: 'Korong Sungai Pinang, Perumahan Abi', lokasi: 'Padang Pariaman - Batang Anai', lat: -0.7, lng: 100.25, kabupaten: 'Padang Pariaman', kecamatan: 'Ulakan Tapakih' },
    { name: 'Nagari Kampuang Galapuang Ulakan', lokasi: 'Padang Pariaman - Ulakan Tapakis', lat: -0.7, lng: 100.25, kabupaten: 'Padang Pariaman', kecamatan: 'Ulakan Tapakih' },
    { name: 'Nagari Kasang Kec. Batang Anai', lokasi: 'Padang Pariaman - Batang Anai', lat: -0.8, lng: 100.3, kabupaten: 'Padang Pariaman', kecamatan: 'Batang Anai' },
    { name: 'Nagari Ulakan', lokasi: 'Padang Pariaman - Ulakan Tapakis', lat: -0.7, lng: 100.25, kabupaten: 'Padang Pariaman', kecamatan: 'Ulakan Tapakih' },
    { name: 'Padang Pauh', lokasi: 'Padang Pariaman - Ulakan Tapakis', lat: -0.7, lng: 100.25, kabupaten: 'Padang Pariaman', kecamatan: 'Ulakan Tapakih' },
    { name: 'Pasa rumah An. Vera', lokasi: 'Padang Pariaman - Ulakan Tapakis', lat: -0.7, lng: 100.25, kabupaten: 'Padang Pariaman', kecamatan: 'Ulakan Tapakih' },
    { name: 'Posko di Korong Padang Lapai', lokasi: 'Padang Pariaman - 2X11 Kayu Tanam', lat: -0.66, lng: 100.18, kabupaten: 'Padang Pariaman', kecamatan: 'Nan Sabaris' },
    { name: 'Posko Masjid Nurul Huda Korong Rimbo Kalam', lokasi: 'Padang Pariaman - 2X11 Kayu Tanam', lat: -0.66, lng: 100.18, kabupaten: 'Padang Pariaman', kecamatan: 'Nan Sabaris' },
    { name: 'Posko Masjid Taqwa Banda dan Surau Katimaha Nagari Anduring', lokasi: 'Padang Pariaman - 2X11 Kayu Tanam', lat: -0.66, lng: 100.18, kabupaten: 'Padang Pariaman', kecamatan: 'Nan Sabaris' },
    { name: 'Surau Palak Pisang', lokasi: 'Padang Pariaman - Ulakan Tapakis', lat: -0.7, lng: 100.25, kabupaten: 'Padang Pariaman', kecamatan: 'Ulakan Tapakih' },
    { name: 'Surau Parik', lokasi: 'Padang Pariaman - Ulakan Tapakis', lat: -0.7, lng: 100.25, kabupaten: 'Padang Pariaman', kecamatan: 'Ulakan Tapakih' },
    { name: 'TPA Mesjid Mujahiddin Korong Kasai', lokasi: 'Padang Pariaman - Batang Anai', lat: -0.8, lng: 100.3, kabupaten: 'Padang Pariaman', kecamatan: 'Batang Anai' },
    { name: 'Posko Muaro Pingai', lokasi: 'Solok - Junjung Sirih', lat: -0.65, lng: 100.58, kabupaten: 'Solok', kecamatan: 'X Koto Singkarak' },
    { name: 'SD 11 Paninggahan', lokasi: 'Solok - Paninggahan', lat: -0.62, lng: 100.55, kabupaten: 'Tanah Datar', kecamatan: 'Rambatan' }
  ],
};

const callCenterBPBD = {
  'Aceh': [
    { kota: "Aceh Barat", contacts: [{ nama: "BPBD", jabatan: "", no: "(0655) 7551413" }] },
    { kota: "Aceh Besar", contacts: [{ nama: "BPBD", jabatan: "", no: "0811 6713 113" }] },
    { kota: "Aceh Jaya", contacts: [{ nama: "BPBD", jabatan: "", no: "0811 6899 113" }] },
    { kota: "Aceh Selatan", contacts: [{ nama: "BPBD", jabatan: "", no: "(0656) 322797 " }] },
    { kota: "Aceh Tengah", contacts: [{ nama: "BPBD", jabatan: "", no: "0812 6425 7378" }] },
    { kota: "Aceh Timur", contacts: [{ nama: "BPBD", jabatan: "", no: "0823 2466 8545" }] },
    { kota: "Kota Banda Aceh", contacts: [{ nama: "BPBD", jabatan: "", no: " 0822 7670 5800" }] },
    { kota: "Kota Lhokseumawe", contacts: [{ nama: "BPBD", jabatan: "", no: " 0851 0500 4113" }] },
    { kota: "Langsa", contacts: [{ nama: "BPBD", jabatan: "", no: "(0641) 20113113" }] },
    { kota: "Pidie", contacts: [{ nama: "BPBD", jabatan: "", no: "(0653) 7829 567" }] },
    { kota: "Aceh Singkil", contacts: [{ nama: "Pusdalops", jabatan: "", no: "0852 7691 3181" }] },
  ],
  'Sumatera Utara': [
    { kota: "Tapanuli Selatan", contacts: [{ nama: "Idham", jabatan: "Kabid Darlog", no: "0813 6155 8157" }] },
    { kota: "Tapanuli Utara", contacts: [{ nama: "Kabid Darlog", jabatan: "", no: "0823 6596 6554" }, { nama: "Septian", jabatan: "Staff", no: "0823 6280 5391" }] },
    { kota: "Tapanuli Tengah", contacts: [{ nama: "Rahman Siregar", jabatan: "Kalaksa", no: "0812 6497 1117" }, { nama: "Erianto Tambunan", jabatan: "Kabid Darlog", no: "0822 7719 4959" }] },
    { kota: "Mandailing Natal", contacts: [{ nama: "Mukshin", jabatan: "Kalaksa", no: "0812 6368 9444" }, { nama: "Ibrahim", jabatan: "Kabid Darlog", no: "0822 7709 3939" }] },
    { kota: "Padang Sidimpuan", contacts: [{ nama: "Arfan", jabatan: "Kalaksa", no: "0812 6797 5913" }, { nama: "Nazaruddin", jabatan: "Kabid Darlog", no: "0821 6605 4989" }] },
    { kota: "Medan", contacts: [{ nama: "BPBD", jabatan: "", no: "0813 7080 0880" }] },
    { kota: "Deli Serdang", contacts: [{ nama: "Arif Tarigan", jabatan: "Kabid Darlog", no: "0812 6066 4433" }, { nama: "BPBD", jabatan: "", no: "0811 6782 022" }] },
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
  ],
  'Sumatera Barat': [
    { kota: "Kota Padang", contacts: [{ nama: "BPBD", jabatan: "", no: "0858 9152 2181" }] },
    { kota: "Padang Pariaman", contacts: [{ nama: "BPBD", jabatan: "", no: "0811 6662 114" }] },
    { kota: "Pesisir Selatan", contacts: [{ nama: "BPBD", jabatan: "", no: "0852 6938 0950" }] },
  ],
}

const emergencyServices = {
  'Aceh': [
    { nama: "BNPB", kontak: "117", icon: "fa-shield-alt", color: "from-red-600 to-red-800" },
    { nama: "PUSDALOPS BPBD Aceh Tengah", kontak: "0812 6425 7378", icon: "fa-broadcast-tower", color: "from-orange-500 to-orange-700" },
    { nama: "PMI", kontak: "0852 6612 2520", icon: "fa-first-aid", color: "from-red-500 to-red-700" },
    { nama: "Damkar BPBK Aceh Jaya", kontak: "0811 6792 113", icon: "fa-fire-extinguisher", color: "from-orange-600 to-red-600" }
  ],
  'Sumatera Utara': [
    { nama: "BNPB", kontak: "117", icon: "fa-shield-alt", color: "from-red-600 to-red-800" },
    { nama: "PUSDALOPS PB BPBD Sumut", kontak: "0811 6221 733", icon: "fa-broadcast-tower", color: "from-orange-500 to-orange-700" },
    { nama: "PMI", kontak: "0852 6612 2520", icon: "fa-first-aid", color: "from-red-500 to-red-700" },
    { nama: "Damkar Medan", kontak: "0811 6566 113", icon: "fa-fire-extinguisher", color: "from-orange-600 to-red-600" }
  ],
  'Sumatera Barat': [
    { nama: "BNPB", kontak: "117", icon: "fa-shield-alt", color: "from-red-600 to-red-800" },
    { nama: "PUSDALOPS PB BPBD Sumbar", kontak: "(0751) 890720", icon: "fa-broadcast-tower", color: "from-orange-500 to-orange-700" },
    { nama: "PMI", kontak: "0852 6612 2520", icon: "fa-first-aid", color: "from-red-500 to-red-700" },
    { nama: "Damkar Kota Padang", kontak: "0811 6606 113", icon: "fa-fire-extinguisher", color: "from-orange-600 to-red-600" }
  ],
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('id');
  const t = getTranslation(language);
  
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchPosTerm, setSearchPosTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Aceh');
  const [selectedEmergencyTab, setSelectedEmergencyTab] = useState<string>('Aceh');
  const [selectedPengungsiTab, setSelectedPengungsiTab] = useState<string>('Semua');
  const [selectedPmiCategory, setSelectedPmiCategory] = useState<string>('Makanan');
  const [pmiStockCategories, setPmiStockCategories] = useState<PmiStockCategories>({});
  const [pmiLastUpdate, setPmiLastUpdate] = useState<string>('');
  const [selectedPoskoTab, setSelectedPoskoTab] = useState<string>('Aceh');
  const [pengungsiData, setPengungsiData] = useState<{ kabupaten: string; value: number; provinsi: string }[]>([]);
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

    // Fetch PMI stock data
    fetch('/data/stock_pmi.txt')
      .then(res => res.json())
      .then(data => {
        setPmiLastUpdate(data.last_update || '');
        const categoryMap: Record<string, string> = {
          'makanan_dan_minuman': 'Makanan & Minuman',
          'pakaian_dan_textil': 'Pakaian & Tekstil',
          'kesehatan_dan_kebersihan': 'Kesehatan & Kebersihan',
          'perlengkapan_tenda_dan_shelter': 'Tenda & Shelter',
          'peralatan_dan_perlengkapan_teknis': 'Peralatan Teknis',
          'pakaian_dan_perlengkapan_pribadi': 'Pakaian & Perlengkapan Pribadi',
          'perlengkapan_dan_peralatan': 'Perlengkapan & Peralatan',
          'paket_dan_kit_khusus': 'Paket & Kit Khusus',
        };
        const transformed: PmiStockCategories = {};
        if (data.data_stok) {
          Object.entries(data.data_stok).forEach(([key, items]) => {
            const categoryName = categoryMap[key] || key;
            transformed[categoryName] = (items as Array<{nama: string; qty: number; unit: string}>).map(item => ({
              name: item.nama,
              quantity: `${item.qty.toLocaleString('id-ID')} ${item.unit}`
            }));
          });
        }
        setPmiStockCategories(transformed);
        if (Object.keys(transformed).length > 0) {
          setSelectedPmiCategory(Object.keys(transformed)[0]);
        }
      })
      .catch(err => console.error('Failed to load PMI stock data:', err));

    // Fetch news data from JSON files
    const fetchNewsData = async () => {
      try {
        const newsPromises = [1, 2, 3, 4, 5, 6].map(async (i) => {
          const res = await fetch(`/news/news${i}.json`);
          const data = await res.json();
          return {
            id: i,
            title: data.title || '',
            title_en: data.title_en || data.title || '',
            category: data.category || '',
            category_en: data.category_en || data.category || '',
            content: data.content || '',
            content_en: data.content_en || data.content || '',
            image: `/news/${data.image || `${i}.jpg`}`,
            date: data.date || '',
          };
        });
        const newsItems = await Promise.all(newsPromises);
        setNewsData(newsItems);
      } catch (err) {
        console.error('Failed to load news data:', err);
      }
    };
    fetchNewsData();
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
      {/* Language Toggle - Fixed Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200"
        >
          <span className={`text-sm font-semibold ${language === 'id' ? 'text-[#D22730]' : 'text-gray-400'}`}>ID</span>
          <div className="w-10 h-6 bg-gray-200 rounded-full relative">
            <div className={`absolute top-1 w-4 h-4 bg-[#D22730] rounded-full transition-all ${language === 'id' ? 'left-1' : 'left-5'}`}></div>
          </div>
          <span className={`text-sm font-semibold ${language === 'en' ? 'text-[#D22730]' : 'text-gray-400'}`}>EN</span>
        </button>
      </div>

      {/* Nomor Darurat Bencana Section */}
      <section className="py-16 bg-gradient-to-b from-[#1B1B1B] to-[#2d4a6d]">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <p className="text-center text-xl md:text-2xl text-white/80 mb-4">
            {t.header.title}
          </p>
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-white mb-2">
            {t.header.emergency}
          </h2>
          <h3 className="text-center text-4xl md:text-5xl font-black text-white mb-10">
            {t.header.disaster}
          </h3>

          {/* Call Center Utama */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <a href="tel:117" className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-4 w-[280px]">
              <div className="w-14 h-14 bg-[#D22730] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-phone text-white text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">{t.callCenter.bnpb}</p>
                <p className="text-4xl font-black text-[#1B1B1B]">117</p>
              </div>
            </a>
            <a href="tel:115" className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-4 w-[280px]">
              <div className="w-14 h-14 bg-[#D22730] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-phone text-white text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">{t.callCenter.basarnas}</p>
                <p className="text-4xl font-black text-[#1B1B1B]">115</p>
              </div>
            </a>
          </div>

          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['Aceh', 'Sumatera Utara', 'Sumatera Barat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedEmergencyTab(tab)}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${selectedEmergencyTab === tab
                    ? 'bg-white text-[#1B1B1B] shadow-xl'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/30'
                  }`}
              >
                {t.provinces[tab as keyof typeof t.provinces] || tab}
              </button>
            ))}
          </div>

          {/* Provinsi Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#1B4D89] to-[#2d6cb5] px-6 py-4">
                <h4 className="text-xl font-bold text-white text-center">
                  {t.callCenter.emergencyContacts} {t.provinces[selectedEmergencyTab as keyof typeof t.provinces] || selectedEmergencyTab}
                </h4>
              </div>
              <div className="p-6 max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {selectedEmergencyTab === 'Aceh' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'BPBD Aceh', phone: '(0651)34783' },
                      { name: 'Basarnas Wilayah Aceh', phone: '(0651) 33876' },
                      { name: 'PMI Aceh', phone: '0852 2315 0090' },
                      { name: 'BPBD Aceh Besar (Emergency)', phone: '0811 6713 113' },
                      { name: 'Pusdalops BPBD Aceh Tengah', phone: '0812 6425 7378' },
                      { name: 'BPBD Aceh Tengah', phone: '(0643) 23113' },
                      { name: 'UDD PMI Aceh Utara (Darah)', phone: '0823 7998 1593' },
                      { name: 'BPBD Pidie (Kantor)', phone: '(0653) 7829567' },
                      { name: 'BPBD Aceh Barat', phone: '(0655) 7551413' },
                      { name: 'BPBD Kota Banda Aceh (WhatsApp)', phone: '0822 7670 5800' },
                      { name: 'BPBD Aceh Timur', phone: '0823 2466 8545' },
                      { name: 'BPBD Aceh Jaya', phone: '0811 6899 113' },
                      { name: 'Damkar BPBK Aceh Jaya', phone: '0811 6792 113' },
                      { name: 'BPBD Langsa', phone: '(0641) 20113113' },
                      { name: 'BPBD Kota Lhokseumawe', phone: '0851 0500 4113' },
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
                {selectedEmergencyTab === 'Sumatera Barat' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
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
            {t.callCenter.clickToCall}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#1B1B1B] via-[#2a2a2a] to-[#1B1B1B] text-white pt-16 pb-20 relative">
        <div className="text-center mb-12 px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-wide">
            {t.situation.title}
          </h1>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Total Korban */}
            <div className="bg-gradient-to-br from-[#D22730] to-[#8B0000] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold">{t.situation.totalVictims}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>{t.situation.deceased}</span>
                  <span className="text-2xl font-bold">{meninggal.toLocaleString('id-ID')} <span className="text-sm font-normal">{t.situation.persons}</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>{t.situation.missing}</span>
                  <span className="text-2xl font-bold">{hilang.toLocaleString('id-ID')} <span className="text-sm font-normal">{t.situation.persons}</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>{t.situation.injured}</span>
                  <span className="text-2xl font-bold">{terluka.toLocaleString('id-ID')} <span className="text-sm font-normal">{t.situation.persons}</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                  <span>{t.situation.affectedAreas}</span>
                  <span className="text-2xl font-bold">{kabTerdampak.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Pengungsi */}
            <div className="bg-gradient-to-br from-[#FF6B35] to-[#D22730] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold">{t.situation.refugees}</h3>
              </div>

              {/* Tab Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['Semua', 'Aceh', 'Sumatera Utara', 'Sumatera Barat'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedPengungsiTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${selectedPengungsiTab === tab
                        ? 'bg-white text-[#D22730]'
                        : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                  >
                    {tab === 'Semua' ? t.tabs.all : (t.provinces[tab as keyof typeof t.provinces] || tab)}
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
                <p className="text-sm opacity-80">{t.situation.totalRefugees}</p>
                <p className="text-3xl font-black">± {(totalPengungsi / 1000).toFixed(0)} {t.situation.thousand} <span className="text-lg font-normal">{t.situation.persons}</span></p>
              </div>
            </div>

            {/* Kerusakan */}
            <div className="bg-gradient-to-br from-[#1B4D89] to-[#0D2E5C] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold">{t.situation.damage}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">{t.situation.houseDamaged}</p>
                  <p className="text-lg font-bold">{rumahRusak.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">{t.situation.worshipPlaces}</p>
                  <p className="text-lg font-bold">{rumahIbadah.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">{t.situation.publicFacilities}</p>
                  <p className="text-lg font-bold">{fasilitasUmum.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">{t.situation.officeBuildings}</p>
                  <p className="text-lg font-bold">{gedungKantor.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">{t.situation.healthFacilities}</p>
                  <p className="text-lg font-bold">{fasKesehatan.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs opacity-70">{t.situation.bridges}</p>
                  <p className="text-lg font-bold">{jembatan.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2 col-span-2">
                  <p className="text-xs opacity-70">{t.situation.educationFacilities}</p>
                  <p className="text-lg font-bold">{fasPendidikan.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm opacity-60 mt-6" style={{ fontFamily: 'Arial, sans-serif' }}>
          {t.situation.source}: <a href="https://gis.bnpb.go.id/BANSORSUMATERA2025/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-white/80 transition-colors">Data BNPB →</a>
        </p>
        {lastUpdate && (
          <p className="text-center text-sm opacity-60 mt-2" style={{ fontFamily: 'Arial, sans-serif' }}>
            {t.situation.lastUpdate}: {lastUpdate}
          </p>
        )}
      </section>

      {/* Daftar Posko Tanggap Darurat Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-3 bg-[#D22730] px-6 py-3 rounded-xl mb-4">
              <i className="fas fa-map-marker-alt text-white text-2xl"></i>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {t.posko.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['Aceh', 'Sumatera Utara', 'Sumatera Barat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedPoskoTab(tab)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${selectedPoskoTab === tab
                    ? 'bg-[#D22730] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {t.provinces[tab as keyof typeof t.provinces] || tab}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[500px] pr-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                const poskoData: Record<string, { kota: string; lokasi: string; nama: string; jabatan: string; kontak: string[] }[]> = {
                  'Aceh': [
                    // { kota: "Bener Meriah", lokasi: "Pusat Perkantoran Bener Meriah / Kantor Bupati", nama: "Riswandika", jabatan: "Sekda Bener Meriah", kontak: ["085277761777"] },
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
              {t.posko.clickToCall}
            </p>
          </div>
        </div>
      </section>

      {/* Call Center BPBD Section */}
      <section className="py-16 bg-[#1B1B1B]">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#D22730] to-[#B71C1C] px-6 py-3 rounded-xl mb-4">
              <i className="fas fa-headset text-white text-2xl"></i>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {t.callCenterSumut.title}
              </h2>
            </div>
            <p className="text-gray-400 text-lg">{t.callCenterSumut.subtitle}</p>
          </div>

          {/* BASARNAS Special */}
          {/* <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-life-ring text-3xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">BASARNAS</h3>
                  <p className="text-blue-200 text-sm">{t.callCenterSumut.nationalSar}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {["0852 0787 2962", "0812 7818 6376"].map((no, idx) => (
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
          </div> */}

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['Aceh', 'Sumatera Utara', 'Sumatera Barat'].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${selectedRegion === region
                    ? 'bg-[#1B4D89] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {t.provinces[region as keyof typeof t.provinces] || region}
              </button>
            ))}
          </div>

          {/* Main BPBD & Emergency Services */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {(emergencyServices[selectedRegion as keyof typeof emergencyServices] || []).map((item, index) => (
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

          {/* Kab/Kota Grid */}
          <div className="overflow-y-auto max-h-[500px] pr-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="overflow-y-auto max-h-[500px] pr-2" style={{ scrollbarWidth: 'thin' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
                {(callCenterBPBD[selectedRegion as keyof typeof callCenterBPBD] || [])
                  .map((item, idx) => (
                    <div key={idx} className="bg-[#2A2A2A] rounded-xl overflow-hidden border border-gray-700 hover:border-[#D22730] transition-colors">
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
            </div>
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
                {t.shelter.title}
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              {t.shelter.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['Aceh', 'Sumatera Utara', 'Sumatera Barat'].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${selectedRegion === region
                    ? 'bg-[#1B4D89] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {t.provinces[region as keyof typeof t.provinces] || region}
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
              placeholder={t.shelter.search}
              value={searchPosTerm}
              onChange={(e) => setSearchPosTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#1B4D89] focus:ring-2 focus:ring-[#1B4D89]/20 outline-none transition-all"
            />
          </div>

          <div className="overflow-y-auto max-h-[500px] pr-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
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
                    {t.shelter.openMaps}
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
                <p>{t.shelter.notFound}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Logistik Stok PMI Section */}
      <section className="py-16 bg-[#1B1B1B]">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#D22730] to-[#B71C1C] px-6 py-3 rounded-xl mb-4">
              <img src="/logos/pmi.png" alt="PMI" className="w-12 h-12 object-contain" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {t.pmiStock.title}
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">
                <a
                  href="https://pmi.or.id/dashboard/stock"
                  target="_blank"
                  rel="noopener noreferrer"

                >
                  {t.pmiStock.source}: pmi.or.id/dashboard/stock →
                </a>
              </span>
            </p>
            <p className="text-sm text-gray-500">
              {t.pmiStock.lastUpdate}: <span className="font-semibold">{pmiLastUpdate || t.pmiStock.loading}</span>
            </p>
          </div>

          <div className="bg-white text-black rounded-xl shadow-xl p-6">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(pmiStockCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedPmiCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedPmiCategory === category
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
                  {pmiStockCategories[selectedPmiCategory]?.length || 0} {t.pmiStock.item}
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <tbody>
                    {(pmiStockCategories[selectedPmiCategory] || []).map((item, idx) => (
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
                {t.pmiStock.source}: pmi.or.id/dashboard/stock →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan BAZNAS Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="bg-gradient-to-br from-[#FFF8E7] to-[#FFE4B5] rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
            {/* Header with Image */}
            <div className="relative h-56 md:h-72 overflow-hidden">
              <img
                src="/images/layanan-baznas.jpeg"
                alt="Paket Logistik BAZNAS"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8E7] via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="inline-block bg-[#D22730] px-6 py-2 rounded-lg shadow-lg">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                    {t.baznas.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 text-center">
              {/* Hotline */}
              <div className="mb-6">
                <p className="text-[#8B4513] font-semibold text-lg mb-2">
                  {t.baznas.hotline}
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
                  {t.baznas.donationTitle}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="bg-[#1A4D2E] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                      <svg viewBox="0 0 100 40" className="h-6 w-auto">
                        <rect width="100" height="40" rx="4" fill="white" />
                        <text x="50" y="26" textAnchor="middle" fill="#1A4D2E" fontSize="16" fontWeight="bold">BSI</text>
                      </svg>
                      <span>9000.055.740</span>
                    </div>
                    <div className="bg-[#003D79] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                      <svg viewBox="0 0 100 40" className="h-6 w-auto">
                        <rect width="100" height="40" rx="4" fill="white" />
                        <text x="50" y="26" textAnchor="middle" fill="#003D79" fontSize="14" fontWeight="bold">BCA</text>
                      </svg>
                      <span>686.073.7777</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    a.n. <span className="font-semibold">{t.baznas.accountName}</span>
                  </p>
                </div>
              </div>

              {/* Source */}
              <p className="mt-6 text-sm text-[#8B4513]/70">
                {t.baznas.source}: <span className="font-semibold">Sitrep BAZNAS</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Langkah Terkini Pemerintah Section */}
      <section className=" mx-auto bg-[#1B1B1B] px-4 sm:px-10 lg:px-32 xl:px-44 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#D22730] to-[#B71C1C] px-6 py-3 rounded-xl mb-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              {t.news.title}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsData.map((item) => {
            const parseDate = (dateStr: string) => {
              const parts = dateStr.split('/');
              if (parts.length === 3) {
                return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
              }
              return new Date(dateStr);
            };
            const displayTitle = language === 'en' ? item.title_en : item.title;
            const displayCategory = language === 'en' ? item.category_en : item.category;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer hover:scale-[1.02]"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={item.image}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 bg-[#D22730] text-white text-xs font-semibold px-3 py-1 rounded">
                    {displayCategory}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-xs text-gray-400">
                    {item.date ? parseDate(item.date).toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </p>
                  <h3 className="font-semibold text-base leading-snug hover:text-[#D22730] transition line-clamp-2">
                    {displayTitle}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* News Modal */}
      {selectedNews && (() => {
        const parseDate = (dateStr: string) => {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          }
          return new Date(dateStr);
        };
        const displayTitle = language === 'en' ? selectedNews.title_en : selectedNews.title;
        const displayCategory = language === 'en' ? selectedNews.category_en : selectedNews.category;
        const displayContent = language === 'en' ? selectedNews.content_en : selectedNews.content;
        return (
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
                  {displayCategory}
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
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-400">
                  {selectedNews.date ? parseDate(selectedNews.date).toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </p>
                <h2 className="text-2xl font-bold text-[#1B1B1B]">
                  {displayTitle}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {displayContent}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Peta Operasi Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl font-bold text-center">
                {t.map.title}
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
        <div className="py-6 bg-[#1B1B1B] shadow text-white">
          <div className="container mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 place-items-center">
              <div className="flex flex-col gap-6 mt-10 p-2">
                <div className="flex items-center gap-4">
                  <img
                    src="/logo.png"
                    alt="Logo Kemenko PMK"
                    className="w-16 h-16 object-contain"
                  />
                  <h3 className="font-bold text-lg leading-tight">
                    {t.footer.ministry} <br />
                    <span className="text-sm font-normal text-gray-300">
                      {t.footer.ministryFull}
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-envelope text-[#D22730] mt-1"></i>
                      <span className="text-sm">roinfhumasp@kemenkopmk.go.id</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="fas fa-envelope text-[#D22730] mt-1"></i>
                      <span className="text-sm">kearsipan@kemenkopmk.go.id</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-phone text-[#D22730] mt-1"></i>
                      <span className="text-sm">(+62) 21 345 9444</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="fas fa-map-marker-alt text-[#D22730] mt-1"></i>
                      <span className="text-sm leading-relaxed">
                        Jl. Medan Merdeka Barat No. 3<br />
                        Jakarta Pusat, Indonesia
                      </span>
                    </div>
                  </div>

                </div>
              </div>
              <div className="pt-1">
                <p className="text-center text-sm text-gray-400 mb-6">{t.footer.supportedBy}</p>
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
        </div>
      </footer>
    </div>
  );
}
