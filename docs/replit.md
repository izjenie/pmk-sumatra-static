# PMK Sumatra Static - Disaster Response Dashboard

## Overview
This is a Next.js-based static website that displays information about the Sumatra disaster response efforts. The site shows statistics, news updates, logistics stock data from PMI, and an interactive map of affected areas.

## Project Structure
- **Framework**: Next.js 16.0.7 with React 19.2.0
- **Styling**: Tailwind CSS 4
- **Map Library**: Leaflet for interactive maps
- **Type**: Static export site (production) / Dev server (development)

## Key Features
- Disaster statistics dashboard (casualties, refugees, damages)
- News updates about disaster response
- PMI logistics stock tracking (176+ items)
- Interactive map showing affected areas and relief efforts
- Responsive design for mobile and desktop

## Development Setup

### Running Locally
The dev server runs on **port 5000** with host binding to `0.0.0.0` to support Replit's proxy:
```bash
npm run dev
```

### Building for Production
Static export to `dist` directory:
```bash
npm run build
```

## Configuration

### next.config.ts
- Development mode: Uses standard Next.js dev server
- Production mode: Exports static HTML to `dist` directory
- Images are unoptimized for static hosting
- Trailing slashes enabled for better static file serving

### Deployment
- **Type**: Static site deployment
- **Build command**: `npm run build`
- **Output directory**: `dist`
- Deployment configured via Replit deployment config

## Data Sources
- **News**: Static data in page.tsx (6 news items from December 2025)
- **PMI Stock**: Static data in page.tsx (176 logistics items, sourced from pmi.or.id dashboard as of Dec 8, 2025)
- **Map Markers**: Static markers in MapComponent.tsx showing flood areas, distribution points, and refugee camps

## Recent Changes (December 8, 2025)
- **Updated statistics from BNPB dashboard (8 Desember 2025)**:
  - Meninggal: 961 jiwa, Hilang: 291 jiwa, Terluka: 5 ribu jiwa
  - Rumah Rusak: 157,6 ribu, Rumah Ibadah: 425, Fasilitas Umum: 1,2 ribu
  - Fasilitas Kesehatan: 199, Fasilitas Pendidikan: 534, Jembatan: 497
  - Changed all "Rb" abbreviations to "ribu" for clarity
- Configured for Replit environment
- Updated dev server to run on port 5000 with 0.0.0.0 binding
- Modified MapComponent to use static marker data instead of API calls
- Set up conditional config for dev vs production builds
- Configured static deployment to `dist` directory
- Ensured NODE_ENV=production is set during build for proper static export

## Architecture Notes
- This is a client-side rendered static site with no backend
- Map component uses dynamic import with SSR disabled due to Leaflet's browser dependencies
- All data is embedded in the application (no external API calls)
- Suitable for hosting on static file servers or CDN
