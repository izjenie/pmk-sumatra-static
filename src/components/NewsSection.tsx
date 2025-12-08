"use client";

import { useState, useEffect } from 'react';
import { NewsItem, fallbackNews as staticNews } from '@/lib/news';
import { client, urlFor, NEWS_QUERY, SanityNewsItem } from '@/lib/sanity';

interface NewsSectionProps {
  initialNews?: NewsItem[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function NewsSection({ initialNews }: NewsSectionProps) {
  const [newsData, setNewsData] = useState<NewsItem[]>(initialNews || staticNews);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(!initialNews);

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    async function fetchNews() {
      try {
        const sanityNews: SanityNewsItem[] = await client.fetch(NEWS_QUERY);
        
        if (sanityNews && sanityNews.length > 0) {
          const formattedNews = sanityNews.map((item) => ({
            id: item._id,
            title: item.title,
            date: formatDate(item.publishDate),
            category: item.category,
            image: item.heroImage ? urlFor(item.heroImage).width(800).height(600).url() : staticNews[0].image,
            imageAlt: item.heroImageAlt || item.title,
            excerpt: item.excerpt,
          }));
          setNewsData(formattedNews);
        }
      } catch (error) {
        console.error('Error fetching news from Sanity:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-40 sm:h-44 md:h-48 bg-gray-300" />
              <div className="p-4 sm:p-5 md:p-6">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-3" />
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : (
          newsData.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedNews(item)}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.imageAlt || item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-[#D22730] text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <p className="text-gray-500 text-xs sm:text-sm mb-2">{item.date}</p>
                <h3 className="text-gray-800 font-bold text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-[#D22730] transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedNews && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[#D22730] text-white py-4 px-6 flex justify-between items-center">
              <span className="font-semibold text-sm uppercase tracking-wider">
                {selectedNews.category}
              </span>
              <button 
                onClick={() => setSelectedNews(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <img 
                src={selectedNews.image} 
                alt={selectedNews.imageAlt || selectedNews.title}
                className="w-full h-48 sm:h-64 object-cover rounded-xl mb-6"
              />
              <div className="space-y-4">
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <i className="far fa-calendar-alt"></i>
                  {selectedNews.date}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                  {selectedNews.title}
                </h2>
                <div className="prose prose-lg text-gray-600 whitespace-pre-line">
                  {selectedNews.excerpt}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
