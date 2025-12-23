const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Ensure directories exist
const publicDir = path.join(__dirname, 'public');
const newsDir = path.join(publicDir, 'news');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(newsDir)) {
  fs.mkdirSync(newsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, newsDir);
  },
  filename: (req, file, cb) => {
    const newsId = req.params.id;
    const ext = path.extname(file.originalname);
    cb(null, `${newsId}.jpg`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Helper function to create sample data
function createSampleNews(id) {
  const categories = ['Berita Utama', 'Olahraga', 'Teknologi', 'Kesehatan', 'Hiburan', 'Bisnis'];
  const titles = [
    'Perkembangan Terkini di Indonesia',
    'Prestasi Gemilang Atlet Nasional',
    'Inovasi Teknologi Terbaru',
    'Tips Kesehatan untuk Hidup Lebih Baik',
    'Film Indonesia Raih Penghargaan Internasional',
    'Ekonomi Indonesia Terus Berkembang'
  ];
  const contents = [
    'Berita terkini mengenai perkembangan situasi di Indonesia. Berbagai sektor menunjukkan kemajuan yang signifikan dalam beberapa bulan terakhir.',
    'Atlet Indonesia berhasil meraih medali emas dalam kompetisi internasional. Prestasi ini membanggakan dan memotivasi generasi muda.',
    'Teknologi terbaru diluncurkan dengan fitur-fitur canggih yang memudahkan kehidupan sehari-hari masyarakat Indonesia.',
    'Panduan lengkap untuk menjaga kesehatan tubuh dan pikiran. Pola hidup sehat sangat penting untuk kualitas hidup yang lebih baik.',
    'Film produksi Indonesia berhasil meraih penghargaan di festival film internasional, mengharumkan nama bangsa.',
    'Pertumbuhan ekonomi Indonesia menunjukkan tren positif dengan berbagai sektor industri yang terus berkembang pesat.'
  ];

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

  return {
    title: titles[id - 1] || `Berita ${id}`,
    date: dateStr,
    content: contents[id - 1] || `Konten berita ${id}. Ini adalah contoh konten berita yang dapat Anda edit sesuai kebutuhan.`,
    category: categories[id - 1] || categories[0],
    image: `${id}.jpg`
  };
}

// Create sample categories if not exists
function ensureCategoriesExist() {
  const categoryPath = path.join(publicDir, 'category.json');
  if (!fs.existsSync(categoryPath)) {
    const categories = [
      'Berita Utama',
      'Olahraga',
      'Teknologi',
      'Kesehatan',
      'Hiburan',
      'Bisnis'
    ];
    fs.writeFileSync(categoryPath, JSON.stringify(categories, null, 2));
  }
}

// Create sample image if not exists
function ensureImageExists(id) {
  const imagePath = path.join(newsDir, `${id}.jpg`);
  if (!fs.existsSync(imagePath)) {
    // Create a simple colored rectangle as placeholder
    // Since we can't create actual images in Node.js without additional libraries,
    // we'll create a simple SVG and save it as a file
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const svg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="${colors[id - 1] || colors[0]}"/>
  <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">
    News ${id}
  </text>
</svg>`;
    fs.writeFileSync(imagePath.replace('.jpg', '.svg'), svg);
  }
}

// API Routes

// Get categories
app.get('/api/categories', (req, res) => {
  ensureCategoriesExist();
  const categoryPath = path.join(publicDir, 'category.json');
  const categories = JSON.parse(fs.readFileSync(categoryPath, 'utf8'));
  res.json(categories);
});

// Get news by ID
app.get('/api/news/:id', (req, res) => {
  const id = req.params.id;
  const newsPath = path.join(publicDir, `news${id}.json`);

  // Create sample data if file doesn't exist
  if (!fs.existsSync(newsPath)) {
    const sampleData = createSampleNews(parseInt(id));
    fs.writeFileSync(newsPath, JSON.stringify(sampleData, null, 2));
    ensureImageExists(parseInt(id));
  }

  const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
  res.json(newsData);
});

// Save news by ID
app.post('/api/news/:id', (req, res) => {
  const id = req.params.id;
  const newsPath = path.join(publicDir, `news${id}.json`);

  try {
    fs.writeFileSync(newsPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'News saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload image
app.post('/api/upload/:id', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    filename: req.file.filename
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`News editor available at http://localhost:${PORT}/news-editor.html`);

  // Initialize sample data
  ensureCategoriesExist();
  for (let i = 1; i <= 6; i++) {
    const newsPath = path.join(publicDir, `news${i}.json`);
    if (!fs.existsSync(newsPath)) {
      const sampleData = createSampleNews(i);
      fs.writeFileSync(newsPath, JSON.stringify(sampleData, null, 2));
      ensureImageExists(i);
    }
  }

  console.log('Sample data initialized');
});
