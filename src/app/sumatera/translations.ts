export type Language = 'id' | 'en';

export const translations = {
  id: {
    header: {
      title: 'KITA TANGGUH - Informasi seputar bencana Sumatera',
      emergency: 'NOMOR DARURAT',
      disaster: 'BENCANA',
    },
    callCenter: {
      bnpb: 'Call Center BNPB',
      basarnas: 'Call Center BASARNAS',
      clickToCall: 'Klik nomor telepon untuk langsung menghubungi',
      emergencyContacts: 'Kontak Darurat Provinsi',
    },
    situation: {
      title: 'Situasi Darurat di Sumatera',
      totalVictims: 'Total Korban',
      deceased: 'Meninggal Dunia',
      missing: 'Hilang',
      injured: 'Terluka',
      affectedAreas: 'Kab/Kota Terdampak',
      refugees: 'Pengungsi',
      totalRefugees: 'Total Pengungsi',
      damage: 'Kerusakan',
      houseDamaged: 'Rumah Rusak',
      worshipPlaces: 'Rumah Ibadah',
      publicFacilities: 'Fasilitas Umum',
      officeBuildings: 'Gedung/Kantor',
      healthFacilities: 'Fas. Kesehatan',
      bridges: 'Jembatan',
      educationFacilities: 'Fasilitas Pendidikan',
      persons: 'jiwa',
      thousand: 'ribu',
      source: 'Sumber',
      lastUpdate: 'Pembaruan Terakhir',
    },
    posko: {
      title: 'Daftar Posko Tanggap Darurat',
      clickToCall: 'Klik nomor telepon untuk langsung menghubungi posko',
    },
    callCenterSumut: {
      title: 'Call Center BPBD Sumatera Utara',
      subtitle: 'Kabupaten/Kota & Instansi Terkait',
      nationalSar: 'Badan SAR Nasional',
    },
    shelter: {
      title: 'Pos Pengungsian',
      subtitle: 'Lokasi pos pengungsian di wilayah terdampak bencana',
      search: 'Cari pos pengungsian...',
      openMaps: 'Buka di Google Maps',
      notFound: 'Tidak ada pos pengungsian yang ditemukan',
    },
    pmiStock: {
      title: 'Logistik Stok PMI',
      lastUpdate: 'Pembaruan Terakhir',
      loading: 'Memuat...',
      item: 'item',
      source: 'Sumber',
    },
    baznas: {
      title: 'Layanan BAZNAS',
      hotline: 'Pusdalops BAZNAS Tanggap Bencana',
      donationTitle: 'Dompet Bencana & Kemanusiaan BAZNAS',
      accountName: 'Badan Amil Zakat Nasional',
      source: 'Sumber',
    },
    news: {
      title: 'Langkah Terkini Pemerintah',
    },
    map: {
      title: 'Peta Operasi',
    },
    footer: {
      ministry: 'KEMENKO PMK',
      ministryFull: 'Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan',
      supportedBy: 'Didukung oleh:',
    },
    tabs: {
      all: 'Semua',
    },
  },
  en: {
    header: {
      title: 'KITA TANGGUH - Sumatra Disaster Information',
      emergency: 'EMERGENCY',
      disaster: 'NUMBERS',
    },
    callCenter: {
      bnpb: 'BNPB Call Center',
      basarnas: 'BASARNAS Call Center',
      clickToCall: 'Click phone number to call directly',
      emergencyContacts: 'Emergency Contacts for Province',
    },
    situation: {
      title: 'Emergency Situation in Sumatra',
      totalVictims: 'Total Victims',
      deceased: 'Deceased',
      missing: 'Missing',
      injured: 'Injured',
      affectedAreas: 'Affected Districts/Cities',
      refugees: 'Refugees',
      totalRefugees: 'Total Refugees',
      damage: 'Damage',
      houseDamaged: 'Houses Damaged',
      worshipPlaces: 'Places of Worship',
      publicFacilities: 'Public Facilities',
      officeBuildings: 'Office Buildings',
      healthFacilities: 'Health Facilities',
      bridges: 'Bridges',
      educationFacilities: 'Education Facilities',
      persons: 'people',
      thousand: 'thousand',
      source: 'Source',
      lastUpdate: 'Last Update',
    },
    posko: {
      title: 'Emergency Response Posts',
      clickToCall: 'Click phone number to call the post directly',
    },
    callCenterSumut: {
      title: 'North Sumatra BPBD Call Center',
      subtitle: 'Districts/Cities & Related Agencies',
      nationalSar: 'National Search and Rescue Agency',
    },
    shelter: {
      title: 'Refugee Camps',
      subtitle: 'Location of refugee camps in disaster-affected areas',
      search: 'Search refugee camps...',
      openMaps: 'Open in Google Maps',
      notFound: 'No refugee camps found',
    },
    pmiStock: {
      title: 'PMI Logistics Stock',
      lastUpdate: 'Last Update',
      loading: 'Loading...',
      item: 'items',
      source: 'Source',
    },
    baznas: {
      title: 'BAZNAS Services',
      hotline: 'BAZNAS Disaster Response Hotline',
      donationTitle: 'BAZNAS Disaster & Humanitarian Fund',
      accountName: 'National Zakat Agency',
      source: 'Source',
    },
    news: {
      title: 'Latest Government Actions',
    },
    map: {
      title: 'Operations Map',
    },
    footer: {
      ministry: 'KEMENKO PMK',
      ministryFull: 'Coordinating Ministry for Human Development and Cultural Affairs',
      supportedBy: 'Supported by:',
    },
    tabs: {
      all: 'All',
    },
  },
};

export const getTranslation = (lang: Language) => translations[lang];
