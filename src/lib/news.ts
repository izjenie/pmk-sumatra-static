import { client, urlFor, NEWS_QUERY, SanityNewsItem } from './sanity';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  imageAlt: string;
  excerpt: string;
}

const fallbackNews: NewsItem[] = [
  {
    id: '1',
    title: 'Pemerintah Tetapkan Status Siaga Darurat Bencana',
    date: '8 Desember 2025',
    category: 'Kebijakan',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop',
    imageAlt: 'Rapat koordinasi pemerintah',
    excerpt: 'Presiden telah menetapkan status siaga darurat bencana untuk seluruh wilayah terdampak di Sumatera.',
  },
  {
    id: '2',
    title: 'TNI-Polri Kerahkan 10.000 Personel untuk Evakuasi',
    date: '7 Desember 2025',
    category: 'Operasi',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop',
    imageAlt: 'Tim evakuasi bekerja',
    excerpt: 'Gabungan TNI dan Polri mengerahkan lebih dari 10.000 personel untuk membantu proses evakuasi korban.',
  },
  {
    id: '3',
    title: 'Bantuan Internasional Mulai Berdatangan',
    date: '7 Desember 2025',
    category: 'Internasional',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop',
    imageAlt: 'Bantuan internasional tiba',
    excerpt: 'Berbagai negara sahabat mulai mengirimkan bantuan kemanusiaan untuk korban bencana di Sumatera.',
  },
  {
    id: '4',
    title: 'Posko Kesehatan Darurat Didirikan di 5 Titik',
    date: '6 Desember 2025',
    category: 'Kesehatan',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop',
    imageAlt: 'Posko kesehatan darurat',
    excerpt: 'Kementerian Kesehatan mendirikan 5 posko kesehatan darurat untuk melayani korban yang membutuhkan.',
  },
  {
    id: '5',
    title: 'Distribusi Logistik Capai 80% Target',
    date: '6 Desember 2025',
    category: 'Logistik',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop',
    imageAlt: 'Distribusi bantuan logistik',
    excerpt: 'BNPB melaporkan distribusi bantuan logistik telah mencapai 80% dari target yang ditetapkan.',
  },
  {
    id: '6',
    title: 'Relawan dari Seluruh Indonesia Bergerak',
    date: '5 Desember 2025',
    category: 'Relawan',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
    imageAlt: 'Relawan membantu korban',
    excerpt: 'Ribuan relawan dari berbagai organisasi di seluruh Indonesia bergerak menuju lokasi bencana.',
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export async function getNews(): Promise<NewsItem[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  
  if (!projectId) {
    console.log('Sanity not configured, using fallback news data');
    return fallbackNews;
  }

  try {
    const sanityNews: SanityNewsItem[] = await client.fetch(NEWS_QUERY);
    
    if (!sanityNews || sanityNews.length === 0) {
      console.log('No news from Sanity, using fallback data');
      return fallbackNews;
    }

    return sanityNews.map((item) => ({
      id: item._id,
      title: item.title,
      date: formatDate(item.publishDate),
      category: item.category,
      image: item.heroImage ? urlFor(item.heroImage).width(400).height(300).url() : fallbackNews[0].image,
      imageAlt: item.heroImageAlt || item.title,
      excerpt: item.excerpt,
    }));
  } catch (error) {
    console.error('Error fetching news from Sanity:', error);
    return fallbackNews;
  }
}

export { fallbackNews };
