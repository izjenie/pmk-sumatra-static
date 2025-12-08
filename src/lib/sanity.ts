import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0];

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface SanityNewsItem {
  _id: string;
  title: string;
  slug: string;
  publishDate: string;
  category: string;
  heroImage: SanityImageSource;
  heroImageAlt: string;
  excerpt: string;
}

export const NEWS_QUERY = `*[_type == "newsArticle"] | order(publishDate desc)[0...6] {
  _id,
  title,
  "slug": slug.current,
  publishDate,
  category,
  heroImage,
  "heroImageAlt": heroImage.alt,
  excerpt
}`;
