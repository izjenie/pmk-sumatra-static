import pytesseract
from PIL import Image
import json
import os
import re

# Path configuration
INPUT_IMAGE = "output/result/final_pmi.png"
OUTPUT_TEXT = "output/result/ocr_result.txt"
OUTPUT_JSON = "output/result/pmi_logistics_ocr.json"

# Untuk macOS dengan Homebrew
# brew install tesseract
# Untuk Ubuntu: sudo apt install tesseract-ocr
# Untuk Windows: Download dari https://github.com/UB-Mannheim/tesseract/wiki

# Uncomment jika perlu set path tesseract secara manual
# pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'  # macOS
# pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'  # Linux
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Windows


def extract_text_from_image(image_path):
    """Extract text dari gambar menggunakan pytesseract"""
    try:
        # Buka gambar
        img = Image.open(image_path)
        
        # Konfigurasi OCR untuk bahasa Indonesia + English
        # --psm 6 = Assume a single uniform block of text
        custom_config = r'--oem 3 --psm 6 -l ind+eng'
        
        # Extract text
        text = pytesseract.image_to_string(img, config=custom_config)
        
        return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None


def parse_stock_data(text):
    """Parse text hasil OCR menjadi struktur data"""
    lines = text.strip().split('\n')
    
    categories = {
        "makanan_dan_minuman": [],
        "pakaian_dan_perlengkapan_pribadi": [],
        "kesehatan_dan_kebersihan": [],
        "perlengkapan_dan_peralatan": [],
        "paket_dan_kit_khusus": [],
        "lainnya": []
    }
    
    current_category = "lainnya"
    
    # Pattern untuk mendeteksi item dengan quantity
    # Contoh: "ABON 2.196 KARTON" atau "BERAS 818615 Kg"
    item_pattern = re.compile(r'^([A-Z\s]+)\s+([\d.,]+)\s+([A-Z]+)$', re.IGNORECASE)
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Deteksi kategori
        line_lower = line.lower()
        if 'makanan' in line_lower or 'minuman' in line_lower:
            current_category = "makanan_dan_minuman"
            continue
        elif 'pakaian' in line_lower or 'pribadi' in line_lower:
            current_category = "pakaian_dan_perlengkapan_pribadi"
            continue
        elif 'kesehatan' in line_lower or 'kebersihan' in line_lower:
            current_category = "kesehatan_dan_kebersihan"
            continue
        elif 'perlengkapan' in line_lower or 'peralatan' in line_lower:
            current_category = "perlengkapan_dan_peralatan"
            continue
        elif 'paket' in line_lower or 'kit' in line_lower:
            current_category = "paket_dan_kit_khusus"
            continue
        
        # Coba parse item
        match = item_pattern.match(line)
        if match:
            name = match.group(1).strip()
            qty_str = match.group(2).replace('.', '').replace(',', '')
            unit = match.group(3).strip()
            
            try:
                qty = int(qty_str)
                categories[current_category].append({
                    "nama": name,
                    "qty": qty,
                    "unit": unit
                })
            except ValueError:
                pass
    
    return categories


def main():
    # Path ke gambar
    image_path = INPUT_IMAGE
    
    if not os.path.exists(image_path):
        print(f"Image not found at {image_path}")
        image_path = input("Enter full path to image: ").strip()
        
        if not os.path.exists(image_path):
            print("Image not found!")
            return
    
    print(f"Processing image: {image_path}")
    print("Extracting text with Tesseract OCR...")
    
    # Extract text
    text = extract_text_from_image(image_path)
    
    if text:
        print("\n✅ Text extracted!")
        
        # Save raw text
        os.makedirs(os.path.dirname(OUTPUT_TEXT), exist_ok=True)
        with open(OUTPUT_TEXT, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"✅ Raw text saved to: {OUTPUT_TEXT}")
        
        # Tampilkan preview
        print("\n📄 Preview (first 500 chars):")
        print("-" * 50)
        print(text[:500] + "..." if len(text) > 500 else text)
        print("-" * 50)
        
        # Parse data
        print("\n🔄 Parsing stock data...")
        categories = parse_stock_data(text)
        
        # Buat struktur JSON
        data = {
            "last_update": "Extracted via OCR",
            "data_stok": categories
        }
        
        # Save JSON
        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✅ JSON saved to: {OUTPUT_JSON}")
        
        # Summary
        print("\n📊 Summary:")
        total_items = 0
        for category, items in categories.items():
            count = len(items)
            total_items += count
            print(f"  {category.replace('_', ' ').title()}: {count} items")
        print(f"\n  Total: {total_items} items")
        
    else:
        print("❌ Failed to extract text from image")


if __name__ == "__main__":
    main()
