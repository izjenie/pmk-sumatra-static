# PMK Sumatra Static - Disaster Response Dashboard

## Overview

A Next.js static website displaying real-time information about Sumatra disaster response efforts. The dashboard shows casualty statistics, news updates, PMI (Indonesian Red Cross) logistics stock data, and an interactive map of affected areas. Built as a static export site for fast deployment and easy hosting.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 16** with React 19 using the App Router pattern
- **Static export** for production (`output: 'export'` in next.config.ts)
- Development runs on port 5000 with host binding to 0.0.0.0 for Replit compatibility

### Routing Structure
- `/` - Redirects to `/sumatera`
- `/sumatera` - Main dashboard page with all disaster information

### Data Architecture
- **Fully static data model** - No database required
- Data stored as JSON files in `/public/data/` directory
- Statistics fetched client-side from static JSON files
- News and logistics data hardcoded in page components

### Styling
- **Tailwind CSS 4** with PostCSS integration
- Custom scrollbar styles and utility classes in globals.css
- Font Awesome icons loaded via CDN

### Map Integration
- **Leaflet** for interactive mapping
- ESRI satellite tiles as base layer
- Static markers for flood areas, distribution points, and refugee camps
- Bounded to Sumatra region coordinates

### Internationalization
- Custom translation system in `/src/app/sumatera/translations.ts`
- Supports Indonesian (id) and English (en)
- Language state managed at page component level

### Build Output
- Development: `.next` directory
- Production: `dist` directory (static HTML/CSS/JS)
- Images unoptimized for static hosting compatibility
- Trailing slashes enabled for static file servers

## External Dependencies

### Third-Party Services
- **Google Analytics** (G-9N2BG2NBS9) - Usage tracking via gtag.js
- **ESRI ArcGIS** - Satellite map tiles
- **Font Awesome CDN** - Icon library

### Python Scripts (Data Processing)
Located in `/scripts/python/` for data preparation:
- **Playwright** - Browser automation for screenshots
- **OpenAI API** - OCR and text extraction
- **DeepSeek API** - Item categorization
- **DashScope API** (Qwen) - Alternative vision AI
- **Volcano Engine API** (ByteDance Doubao) - Alternative vision AI

### Static Data Files
- `/public/data/*.txt` - JSON-formatted statistics (casualties, damages, facilities)
- `/public/data/stock_pmi.txt` - PMI logistics inventory data
- `/public/news/*.jpg` - News article images

### Deployment
- Docker support via shell scripts in `/scripts/`
- Production URL: tanggap-bencana.go.id