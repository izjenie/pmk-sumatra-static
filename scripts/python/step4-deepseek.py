import json
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file
load_dotenv()
load_dotenv("../../.env")  # Also try project root

# Konfigurasi API - ambil dari .env
API_KEY = os.getenv("DEEPSEEK_API_KEY")

# Path configuration
INPUT_OCR = "output/result/ocr_result.txt"
OUTPUT_JSON = "../../public/data/stock_pmi.txt"


def read_ocr_result(file_path):
    """Baca file hasil OCR"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"Error reading OCR file: {e}")
        return None


def analyze_ocr_text(ocr_text):
    """Analisis text OCR dengan DeepSeek API"""
    
    # Setup client
    client = OpenAI(
        api_key=API_KEY,
        base_url="https://api.deepseek.com"
    )
    
    # Prompt untuk parsing OCR text ke JSON
    prompt = """ANDA ADALAH ASISTEN PEMROSESAN DATA yang ahli dalam ekstraksi dan struktur data inventaris. Tugas Anda adalah mengonversi teks hasil OCR dari gambar stok inventaris PMI menjadi JSON terstruktur.

**INSTRUKSI DETAIL:**
1. **Format JSON Output:** Gunakan struktur persis seperti ini:
   ```json
   {
     "last_update": "12 Desember 2025 pukul 19.35",
     "data_stok": {
       "makanan_dan_minuman": [...],
       "kesehatan_dan_kebersihan": [...],
       "pakaian_dan_perlengkapan_pribadi": [...],
       "perlengkapan_dan_peralatan": [...],
       "paket_dan_kit_khusus": [...],
       "lainnya": [...]
     }
   }
   ```

2. **Format setiap item:**
   ```json
   {"nama": "NAMA ITEM", "qty": 1234, "unit": "UNIT"}
   ```

3. **Aturan Konversi:**
   - Hilangkan titik pemisah ribuan (2.196 -> 2196)
   - qty harus berupa angka integer, bukan string
   - nama item dalam HURUF KAPITAL
   - unit dalam HURUF KAPITAL

4. **Kategori Item:**
   - **makanan_dan_minuman**: beras, mie instan, biskuit, susu, air mineral, makanan kaleng, bumbu, gula, garam, kopi, teh, dll
   - **kesehatan_dan_kebersihan**: masker, sabun, shampo, obat-obatan, popok, pembalut, hygiene kit, hand sanitizer, dll
   - **pakaian_dan_perlengkapan_pribadi**: pakaian, sarung, handuk, selimut, sandal, sepatu, helm, tas, dll
   - **perlengkapan_dan_peralatan**: tenda, terpal, genset, pompa, jerigen, kompor, lampu, alat pertukangan, dll
   - **paket_dan_kit_khusus**: family kit, baby kit, hygiene kit, shelter kit, school kit, dll
   - **lainnya**: item yang tidak masuk kategori di atas

5. **PENTING:**
   - Extract SEMUA item yang terdeteksi
   - Jika ada duplikat dengan unit berbeda, pisahkan sebagai item terpisah
   - Return HANYA JSON valid, tanpa penjelasan tambahan

6. **TANGGAL PEMBARUAN:**
   - Cari teks "Pembaruan Terakhir" atau "Perbartl" atau tanggal/waktu di awal text OCR
   - Format: "DD Bulan YYYY pukul HH.MM" (contoh: "12 Desember 2025 pukul 19.35")
   - Masukkan ke field "last_update" dalam JSON

**TEXT OCR:**
"""
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {
                    "role": "user",
                    "content": prompt + ocr_text
                }
            ],
            max_tokens=8000
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"API Error: {e}")
        return None


def main():
    # Path ke file OCR
    ocr_path = INPUT_OCR
    
    if not os.path.exists(ocr_path):
        print(f"OCR file not found at {ocr_path}")
        ocr_path = input("Enter full path to OCR result file: ").strip()
        
        if not os.path.exists(ocr_path):
            print("File not found!")
            return
    
    print(f"Reading OCR result: {ocr_path}")
    
    # Periksa API key
    if not API_KEY:
        print("\n⚠️  WARNING: DEEPSEEK_API_KEY not found in .env file!")
        print("Get your API key from: https://platform.deepseek.com/api_keys")
        return
    
    # Baca file OCR
    ocr_text = read_ocr_result(ocr_path)
    if not ocr_text:
        print("❌ Failed to read OCR file")
        return
    
    print(f"OCR text length: {len(ocr_text)} chars")
    print("Sending to DeepSeek for parsing...")
    
    result = analyze_ocr_text(ocr_text)
    
    if result:
        print("\n✅ Response received!")
        
        # Coba extract JSON
        try:
            # Clean response
            clean_result = result.strip()
            
            # Cari JSON dalam response
            if "```json" in clean_result:
                json_str = clean_result.split("```json")[1].split("```")[0].strip()
            elif "```" in clean_result:
                json_str = clean_result.split("```")[1].split("```")[0].strip()
            else:
                json_str = clean_result
            
            # Parse JSON
            data = json.loads(json_str)
            
            # Save to file
            os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
            with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Data saved to: {OUTPUT_JSON}")
            
            # Tampilkan summary
            print(f"\n📊 Summary:")
            print(f"Last update: {data.get('last_update', 'Not specified')}")
            
            if 'data_stok' in data:
                total_items = 0
                for category, items in data['data_stok'].items():
                    count = len(items) if isinstance(items, list) else 0
                    total_items += count
                    print(f"  {category.replace('_', ' ').title()}: {count} items")
                print(f"\n  Total: {total_items} items")
            
        except json.JSONDecodeError:
            print("\n⚠️  Could not parse JSON. Raw response:")
            print("-" * 50)
            print(result[:1000] + "..." if len(result) > 1000 else result)
            print("-" * 50)
            
            # Save raw response
            raw_path = "output/result/raw_response.txt"
            os.makedirs(os.path.dirname(raw_path), exist_ok=True)
            with open(raw_path, "w", encoding="utf-8") as f:
                f.write(result)
            print(f"Raw response saved to: {raw_path}")
    else:
        print("❌ Failed to analyze OCR text")

if __name__ == "__main__":
    main()
