"""
PMI Stock Data Processor

Script untuk:
1. Screenshot halaman stok PMI dengan scrolling
2. OCR semua screenshot menggunakan OpenAI Vision
3. Kategorisasi item menggunakan DeepSeek
4. Output ke final_stock_pmi.txt
"""

import os
import glob
import time
import hashlib
import base64
import json
import shutil
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from playwright.sync_api import sync_playwright

# Load .env file
load_dotenv()

# Output directory
OUTPUT_DIR = "output"

# ============================================================
# STEP 1: Screenshot dengan Playwright
# ============================================================

def clear_screenshots(output_dir: str = f"{OUTPUT_DIR}/screenshots"):
    """Hapus semua file di direktori screenshots."""
    if os.path.exists(output_dir):
        files = glob.glob(os.path.join(output_dir, "*.png"))
        for f in files:
            os.remove(f)
        print(f"Deleted {len(files)} files from '{output_dir}/'")


def screenshot_full_page(url: str, output_dir: str = f"{OUTPUT_DIR}/screenshots"):
    """
    Browse ke URL, screenshot per viewport, scroll ke bawah, 
    dan screenshot lagi sampai halaman selesai.
    """
    # Hapus file lama di screenshots
    clear_screenshots(output_dir)
    
    # Buat direktori output jika belum ada
    os.makedirs(output_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        
        print(f"Navigating to {url}...")
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        
        # Tunggu konten loading selesai
        print("Waiting for page to fully load...")
        time.sleep(10)
        
        viewport_height = 900
        screenshot_count = 1
        max_screenshots = 20  # Batas maksimal screenshot
        
        # Cari scrollable container
        scroll_script = """
        () => {
            const scrollableElements = [
                document.scrollingElement,
                document.documentElement,
                document.body,
                document.querySelector('main'),
                document.querySelector('.main-content'),
                document.querySelector('[class*="content"]'),
                document.querySelector('[class*="scroll"]')
            ].filter(el => el !== null);
            
            for (const el of scrollableElements) {
                if (el.scrollHeight > el.clientHeight) {
                    return {
                        selector: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
                        scrollHeight: el.scrollHeight,
                        clientHeight: el.clientHeight
                    };
                }
            }
            return { selector: 'window', scrollHeight: document.body.scrollHeight, clientHeight: window.innerHeight };
        }
        """
        
        scroll_info = page.evaluate(scroll_script)
        print(f"Scroll container: {scroll_info}")
        
        # Klik di tengah halaman dulu untuk fokus
        page.mouse.click(640, 450)
        print("Clicked center of page to focus")
        time.sleep(1)
        
        previous_hash = None
        
        while screenshot_count <= max_screenshots:
            # Screenshot viewport saat ini
            filename = f"{output_dir}/pmi_stock_{timestamp}_{screenshot_count:02d}.png"
            page.screenshot(path=filename)
            print(f"Screenshot {screenshot_count}: {filename}")
            
            # Hitung hash screenshot untuk deteksi duplikat
            with open(filename, "rb") as f:
                current_hash = hashlib.md5(f.read()).hexdigest()
            
            # Cek apakah sama dengan screenshot sebelumnya
            if screenshot_count > 1 and current_hash == previous_hash:
                print("Screenshot sama dengan sebelumnya, berhenti.")
                os.remove(filename)
                break
            
            previous_hash = current_hash
            
            # Klik di tengah dan scroll dengan mouse wheel
            page.mouse.click(640, 450)
            page.mouse.wheel(0, 450)  # Scroll down setengah screen (450px)
            
            # Tunggu 2 detik sebelum screenshot berikutnya
            print("Scrolling down, waiting 2 seconds...")
            time.sleep(2)
            
            screenshot_count += 1
                
        browser.close()
        print(f"\nSelesai! {screenshot_count - 1} screenshot disimpan di folder '{output_dir}/'")


# ============================================================
# STEP 2: OCR dengan OpenAI Vision
# ============================================================

def encode_image_to_base64(image_path: str) -> str:
    """Encode gambar ke base64 string."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def ocr_screenshot(client: OpenAI, image_path: str) -> dict:
    """Kirim screenshot ke OpenAI Vision API untuk OCR."""
    base64_image = encode_image_to_base64(image_path)
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Ekstrak semua teks yang terlihat di gambar ini. 
                        Return dalam format JSON dengan struktur yang sesuai dengan konten.
                        Jika ada tabel, buat sebagai array of objects.
                        Jika ada angka/statistik, sertakan dengan label-nya.
                        Return HANYA JSON, tanpa markdown code block."""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        max_tokens=4096
    )
    
    content = response.choices[0].message.content
    
    try:
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            content = content.rsplit("```", 1)[0]
        return json.loads(content)
    except json.JSONDecodeError:
        return {"raw_text": content}


def normalize_with_openai(client: OpenAI, all_ocr_data: list) -> dict:
    """Kirim semua hasil OCR ke OpenAI untuk dinormalisasi."""
    prompt = """Berikut adalah array JSON hasil OCR dari beberapa screenshot halaman stok logistik PMI.
Tolong gabungkan dan normalisasi menjadi satu JSON dengan format:

{
  "pembaruan_terakhir": "tanggal dan waktu pembaruan terakhir",
  "items": [
    {"nama": "NAMA ITEM", "jumlah": "123", "satuan": "UNIT"},
    ...
  ]
}

Aturan:
1. Gabungkan semua item dari semua screenshot
2. Hilangkan duplikat (item dengan nama sama)
3. Nama item gunakan UPPERCASE
4. Jumlah tetap sebagai string (bisa ada titik sebagai pemisah ribuan)
5. Satuan gunakan UPPERCASE
6. Jika ada item yang jumlah/satuannya kosong, coba cari dari screenshot lain
7. Return HANYA JSON, tanpa markdown code block

Data OCR:
"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": prompt + json.dumps(all_ocr_data, ensure_ascii=False)
            }
        ],
        max_tokens=16000
    )
    
    content = response.choices[0].message.content
    
    try:
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            content = content.rsplit("```", 1)[0]
        return json.loads(content)
    except json.JSONDecodeError:
        return {"error": "Failed to parse response", "raw": content}


def process_ocr(input_dir: str = f"{OUTPUT_DIR}/screenshots") -> dict:
    """Proses semua screenshot dengan OCR dan return hasil normalized."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY tidak ditemukan di .env")
        return None
    
    client = OpenAI(api_key=api_key)
    
    pattern = os.path.join(input_dir, "pmi_stock_*.png")
    files = sorted(glob.glob(pattern))
    
    if not files:
        print(f"Tidak ada file screenshot ditemukan di '{input_dir}/'")
        return None
    
    print(f"\nDitemukan {len(files)} screenshot untuk di-OCR\n")
    
    all_results = []
    
    for i, filepath in enumerate(files):
        filename = os.path.basename(filepath)
        print(f"[{i + 1}/{len(files)}] Processing: {filename}")
        
        try:
            result = ocr_screenshot(client, filepath)
            all_results.append({"file": filename, "data": result})
            print(f"  ✓ Berhasil")
            print(f"  Result: {json.dumps(result, indent=2, ensure_ascii=False)[:500]}...")
            print()
        except Exception as e:
            print(f"  ✗ Error: {e}")
            all_results.append({"file": filename, "error": str(e)})
    
    # Kumpulkan semua data JSON dari OCR
    all_ocr_data = [r["data"] for r in all_results if "data" in r]
    
    print("\n" + "=" * 50)
    print("Mengirim ke OpenAI untuk normalisasi...")
    print("=" * 50)
    
    final_result = normalize_with_openai(client, all_ocr_data)
    
    # Simpan ke file intermediate
    output_file = f"{OUTPUT_DIR}/stock_pmi.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(final_result, f, indent=2, ensure_ascii=False)
    
    print(f"\nHasil OCR disimpan ke '{output_file}'")
    
    return final_result


# ============================================================
# STEP 3: Kategorisasi dengan DeepSeek
# ============================================================

def read_format_example(filepath: str = f"{OUTPUT_DIR}/template_stock_pmi.txt") -> str:
    """Baca contoh format dari stock_pmi.txt."""
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()


def categorize_with_deepseek(client: OpenAI, stock_data: dict, format_example: str) -> dict:
    """Kirim data stok ke DeepSeek untuk dikategorikan."""
    prompt = f"""Berikut adalah data stok logistik PMI dalam format JSON:

{json.dumps(stock_data, indent=2, ensure_ascii=False)}

Tolong kategorikan semua item tersebut sesuai dengan format berikut ini:

{format_example}

Aturan:
1. Kategorikan setiap item ke dalam kategori yang sesuai (makanan, minuman, sembako, pakaian, perlengkapan_bayi, kesehatan, logistik_tenda, perlengkapan_evakuasi, alat_kebutuhan, air_dan_sanitasi, dll)
2. Gunakan format yang sama persis seperti contoh di atas
3. Nama item gunakan snake_case lowercase
4. Jumlah dan satuan digabung menjadi satu string (contoh: "2.196 KARTON")
5. Jika ada item baru yang tidak ada di contoh, kategorikan ke kategori yang paling sesuai
6. Return HANYA JSON, tanpa markdown code block
7. Pastikan field "last_update" diisi dengan pembaruan_terakhir dari data input
"""
    
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=8192
    )
    
    content = response.choices[0].message.content
    
    try:
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            content = content.rsplit("```", 1)[0]
        return json.loads(content)
    except json.JSONDecodeError:
        return {"error": "Failed to parse response", "raw": content}


def categorize_items(stock_data: dict) -> dict:
    """Kategorisasi items menggunakan DeepSeek."""
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        print("Error: DEEPSEEK_API_KEY tidak ditemukan di .env")
        return None
    
    client = OpenAI(
        api_key=api_key,
        base_url="https://api.deepseek.com"
    )
    
    print("\nReading format example from stock_pmi.txt...")
    format_example = read_format_example()
    
    print("Sending to DeepSeek for categorization...")
    result = categorize_with_deepseek(client, stock_data, format_example)
    
    # Simpan hasil
    output_file = f"{OUTPUT_DIR}/final_stock_pmi.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\nHasil kategorisasi disimpan ke '{output_file}'")
    
    return result


# ============================================================
# MAIN
# ============================================================

def main():
    url = "https://pmi.or.id/dashboard/stock"
    
    print("=" * 60)
    print("PMI STOCK DATA PROCESSOR")
    print("=" * 60)
    
    # Step 1: Screenshot
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("\n[STEP 1] Taking screenshots...")
    print("-" * 40)
    screenshot_full_page(url)
    
    # Step 2: OCR
    print("\n[STEP 2] Processing OCR...")
    print("-" * 40)
    stock_data = process_ocr()
    
    if not stock_data:
        print("OCR gagal, proses dihentikan.")
        return
    
    # Step 3: Kategorisasi
    print("\n[STEP 3] Categorizing items...")
    print("-" * 40)
    final_result = categorize_items(stock_data)
    
    if final_result:
        # Copy to public/data/stock_pmi.txt
        src_file = f"{OUTPUT_DIR}/final_stock_pmi.txt"
        dst_file = "../../public/data/stock_pmi.txt"
        shutil.copy(src_file, dst_file)
        
        print("\n" + "=" * 60)
        print("PROSES SELESAI!")
        print("=" * 60)
        print(f"Output: {OUTPUT_DIR}/final_stock_pmi.txt")
        print(f"Copied to: public/data/stock_pmi.txt")
        print("\nPreview:")
        print(json.dumps(final_result, indent=2, ensure_ascii=False)[:2000])


if __name__ == "__main__":
    main()
