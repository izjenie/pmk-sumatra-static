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
      title: 'Call Center BPBD',
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
      items: [
        {
          title: 'Pimpin Ratas Penanganan Bencana, Presiden Instruksikan Penyaluran Bantuan Lebih Teliti dan Tepat Waktu',
          category: 'Pemerintahan',
          content: 'Presiden Prabowo Subianto memimpin langsung Rapat Terbatas (Ratas) terkait penanganan dan pemulihan bencana alam di Aceh. Dalam rapat tersebut, Presiden memerintahkan jajarannya untuk segera menindaklanjuti temuan lapangan dan arahan-arahan yang telah disampaikan. Beliau menegaskan bahwa kekompakan seluruh unsur pemerintah, relawan, dan masyarakat merupakan kekuatan terbesar dalam mempercepat pemulihan wilayah yang terdampak bencana.\n\nDalam arahannya, Presiden menekankan pentingnya penyaluran bantuan yang lebih teliti dan tepat waktu agar segera sampai ke tangan warga yang membutuhkan. Operasi terpadu yang melibatkan TNI, Polri, Basarnas, dan BNPB serta pemerintah daerah diminta untuk diperkuat dalam mempercepat distribusi logistik dan memulihkan konektivitas antardaerah yang terputus.',
        },
        {
          title: 'Tinjau Jembatan Bireuen-Takengon, Presiden Tunjuk KSAD Jenderal Maruli Simanjuntak Komandoi Perbaikan Infrastruktur',
          category: 'Infrastruktur',
          content: 'Usai meninjau pengerjaan jembatan di ruas vital Bireuen–Takengon, Kabupaten Bireuen, Presiden Prabowo berdialog langsung dengan warga dan petugas lapangan. Presiden melihat langsung kerja keras personel TNI, Polri, tim teknik PUPR, dan relawan dalam memulihkan akses yang terputus. Kunjungan ini menegaskan komitmen pemerintah untuk memastikan kebutuhan masyarakat terpenuhi dan isolasi wilayah segera berakhir.\n\nSebagai langkah percepatan strategis, Presiden menunjuk Kepala Staf Angkatan Darat (KSAD), Jenderal TNI Maruli Simanjuntak, sebagai komandan percepatan perbaikan infrastruktur. Penunjukan ini diharapkan dapat mengoptimalkan pengerahan alat berat dan personel untuk memperbaiki akses jalan dan jembatan yang rusak parah.',
        },
        {
          title: 'Pastikan Stok Pangan Aman, Presiden: Bantuan Dikirim dari Berbagai Daerah untuk Warga Aceh',
          category: 'Sosial',
          content: 'Presiden Prabowo memastikan bahwa ketersediaan bahan pangan bagi warga terdampak bencana di Aceh telah diantisipasi dengan matang. Dalam keterangannya di Kabupaten Bireuen, Presiden menyebutkan bahwa bantuan tidak hanya mengandalkan stok lokal, tetapi juga akan dikirimkan dari berbagai daerah lain untuk menjamin tidak ada kekurangan logistik bagi para pengungsi maupun warga yang terisolir.\n\nPemerintah berkomitmen penuh untuk memastikan seluruh proses pemulihan berjalan cepat, terkoordinasi, dan sesuai dengan standar keselamatan. Tujuan utamanya adalah menjamin masyarakat Aceh dapat kembali beraktivitas dengan aman, lancar, dan normal sesegera mungkin.',
        },
        {
          title: 'Presiden Prabowo Kembali ke Aceh, Tinjau Langsung Kerusakan Banjir dan Percepatan Penanganan Darurat',
          category: 'Nasional',
          content: 'Presiden Prabowo Subianto kembali melakukan kunjungan kerja ke Aceh untuk meninjau penanganan bencana alam secara langsung. Fokus utama kunjungan kali ini adalah melihat sejumlah lokasi yang mengalami kerusakan parah akibat banjir dan memastikan percepatan penanganan darurat berjalan efektif. Presiden ingin memastikan proses pemulihan di wilayah terdampak mendapatkan atensi maksimal dari pemerintah pusat.\n\nBapak Presiden juga melakukan pengecekan terhadap penyaluran bantuan dan proses evakuasi warga yang masih terjebak. Upaya pembukaan akses jalan yang terputus menjadi prioritas utama untuk memastikan isolasi wilayah dapat segera diakhiri dan bantuan logistik dapat masuk ke seluruh pelosok daerah bencana.',
        },
        {
          title: 'Tinjau Posko Terpadu Lanud Sultan Iskandar Muda, Pemerintah Pastikan Arus Logistik Bantuan Terus Mengalir',
          category: 'Nasional',
          content: 'Menteri Koordinator Bidang Pembangunan Manusia dan Kebudayaan (Menko PMK), Pratikno, meninjau Posko Terpadu penanganan bencana alam Aceh di Lanud Sultan Iskandar Muda. Tempat ini difungsikan sebagai gudang logistik utama sebelum bantuan didistribusikan ke wilayah terdampak. Kunjungan ini memastikan kesiapan stok dan kelancaran rantai pasok bantuan kemanusiaan.\n\nSesuai arahan Bapak Presiden, bantuan tambahan akan terus dikirimkan dan berbagai langkah pemulihan akan dipercepat untuk memastikan masyarakat mendapatkan penanganan yang layak dan segera keluar dari masa tanggap darurat.',
        },
        {
          title: 'PLN Berhasil Pulihkan 100% Sistem Kelistrikan Sumatra Utara Pasca Banjir dan Longsor',
          category: 'Energi',
          content: 'PT PLN (Persero) mengumumkan keberhasilan memulihkan 100% sistem kelistrikan yang terdampak banjir dan longsor di Sumatra Utara. Pemulihan total tercapai pada hari Minggu, di mana 103 jaringan distribusi yang sebelumnya rusak kini telah beroperasi kembali. Keberhasilan ini menjadi kabar baik bagi warga yang sempat mengalami pemadaman total akibat bencana alam.\n\nProses pemulihan ini merupakan hasil sinergi antara PLN, TNI, Polri, BNPB, pemerintah daerah, dan masyarakat setempat. Dalam waktu lima hari, tim gabungan berhasil memperbaiki infrastruktur listrik yang rusak di seluruh 33 kota/kabupaten yang terdampak.',
        },
      ],
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
    provinces: {
      'Sumatera Utara': 'Sumatera Utara',
      'Sumatera Barat': 'Sumatera Barat',
      'Aceh': 'Aceh',
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
      title: 'BPBD Call Center',
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
      items: [
        {
          title: 'Leading Disaster Response Meeting, President Orders More Thorough and Timely Aid Distribution',
          category: 'Government',
          content: 'President Prabowo Subianto directly led a Limited Meeting (Ratas) regarding disaster response and recovery in Aceh. During the meeting, the President ordered his staff to immediately follow up on field findings and directives that had been conveyed. He emphasized that the solidarity of all government elements, volunteers, and the community is the greatest strength in accelerating the recovery of disaster-affected areas.\n\nIn his direction, the President emphasized the importance of more thorough and timely aid distribution to reach those in need quickly. Integrated operations involving the TNI, Police, Basarnas, BNPB, and local governments were requested to be strengthened to accelerate logistics distribution and restore inter-regional connectivity that was disrupted.',
        },
        {
          title: 'Inspecting Bireuen-Takengon Bridge, President Appoints Army Chief General Maruli Simanjuntak to Command Infrastructure Repairs',
          category: 'Infrastructure',
          content: 'After inspecting bridge work on the vital Bireuen-Takengon route in Bireuen Regency, President Prabowo directly dialogued with residents and field officers. The President witnessed firsthand the hard work of TNI personnel, Police, PUPR technical teams, and volunteers in restoring disrupted access. This visit reaffirmed the government\'s commitment to ensuring community needs are met and regional isolation ends soon.\n\nAs a strategic acceleration measure, the President appointed the Army Chief of Staff (KSAD), General TNI Maruli Simanjuntak, as the commander for accelerating infrastructure repairs. This appointment is expected to optimize the deployment of heavy equipment and personnel to repair severely damaged roads and bridges.',
        },
        {
          title: 'Ensuring Food Stock Safety, President: Aid Sent from Various Regions for Aceh Residents',
          category: 'Social',
          content: 'President Prabowo ensured that food availability for disaster-affected residents in Aceh has been well anticipated. In his statement in Bireuen Regency, the President mentioned that aid will not only rely on local stocks but will also be sent from various other regions to ensure no shortage of logistics for refugees or isolated residents.\n\nThe government is fully committed to ensuring that the entire recovery process runs quickly, coordinated, and in accordance with safety standards. The main goal is to ensure Aceh residents can return to activities safely, smoothly, and normally as soon as possible.',
        },
        {
          title: 'President Prabowo Returns to Aceh, Directly Inspects Flood Damage and Emergency Response Acceleration',
          category: 'National',
          content: 'President Prabowo Subianto returned on a working visit to Aceh to directly oversee disaster response. The main focus of this visit was to observe several locations that suffered severe damage from flooding and ensure emergency response acceleration is running effectively. The President wants to ensure the recovery process in affected areas receives maximum attention from the central government.\n\nThe President also checked on aid distribution and the evacuation process for residents still trapped. Opening disrupted road access became the main priority to ensure regional isolation could be ended immediately and logistics aid could reach all corners of the disaster area.',
        },
        {
          title: 'Inspecting Integrated Post at Sultan Iskandar Muda Air Base, Government Ensures Aid Logistics Flow Continues',
          category: 'National',
          content: 'Coordinating Minister for Human Development and Culture (Menko PMK), Pratikno, inspected the Integrated Post for Aceh disaster response at Sultan Iskandar Muda Air Base. This place functions as the main logistics warehouse before aid is distributed to affected areas. This visit ensures stock readiness and smooth humanitarian aid supply chain.\n\nFollowing the President\'s direction, additional aid will continue to be sent and various recovery measures will be accelerated to ensure the community receives proper handling and quickly exits the emergency response period.',
        },
        {
          title: 'PLN Successfully Restores 100% of North Sumatra Electricity System After Floods and Landslides',
          category: 'Energy',
          content: 'PT PLN (Persero) announced the successful restoration of 100% of the electricity system affected by floods and landslides in North Sumatra. Total restoration was achieved on Sunday, where 103 distribution networks that were previously damaged are now operating again. This success is good news for residents who experienced total blackouts due to the natural disaster.\n\nThis recovery process was the result of synergy between PLN, TNI, Police, BNPB, local governments, and local communities. Within five days, the joint team successfully repaired damaged electrical infrastructure across all 33 affected cities/regencies.',
        },
      ],
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
    provinces: {
      'Sumatera Utara': 'North Sumatra',
      'Sumatera Barat': 'West Sumatra',
      'Aceh': 'Aceh',
    },
  },
};

export const getTranslation = (lang: Language) => translations[lang];
