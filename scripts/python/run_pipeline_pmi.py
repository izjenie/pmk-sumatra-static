#!/usr/bin/env python3
"""
PMI Stock Data Pipeline
=======================
Script ini menggabungkan seluruh proses untuk mengambil data stok PMI:
1. Screenshot halaman PMI stock dengan Playwright
2. Stitch screenshots menjadi satu gambar
3. OCR gambar dengan Tesseract
4. Parse hasil OCR dengan DeepSeek API

Usage:
    python run_pipeline_pmi.py
    python run_pipeline_pmi.py --skip-screenshot
    python run_pipeline_pmi.py --skip-ocr
    python run_pipeline_pmi.py --only-api
"""

import os
import sys
import glob
import time
import hashlib
import shutil
import json
import re
from datetime import datetime

# Third-party imports
import cv2
import numpy as np
from PIL import Image
import pytesseract
from playwright.sync_api import sync_playwright
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file
load_dotenv()
load_dotenv("../../.env")

# ============================================================================
# CONFIGURATION
# ============================================================================
PMI_URL = "https://pmi.or.id/dashboard/stock"
SCREENSHOT_DIR = "output/screenshots"
TOP_SLICE_DIR = "output/screenshots/top-slice"
OVERLAP_DIR = "output/screenshots/overlap"
RESULT_DIR = "output/result"

FINAL_IMAGE = f"{RESULT_DIR}/final_pmi.png"
OCR_RESULT = f"{RESULT_DIR}/ocr_result.txt"
OUTPUT_JSON = "../../public/data/stock_pmi.txt"

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")


# ============================================================================
# STEP 1: SCREENSHOT WITH PLAYWRIGHT (from main.py)
# ============================================================================
def clear_screenshots(output_dir=SCREENSHOT_DIR):
    """Hapus semua file di direktori screenshots."""
    if os.path.exists(output_dir):
        files = glob.glob(os.path.join(output_dir, "*.png"))
        for f in files:
            os.remove(f)
        print(f"  Deleted {len(files)} files from '{output_dir}/'")


def run_screenshot():
    """Screenshot halaman PMI stock."""
    print("\n" + "="*60)
    print("STEP 1: SCREENSHOT PMI STOCK PAGE")
    print("="*60)
    
    clear_screenshots(SCREENSHOT_DIR)
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        page = browser.new_page(viewport={"width": 2560, "height": 900})
        
        print(f"Navigating to {PMI_URL}...")
        page.goto(PMI_URL, wait_until="domcontentloaded", timeout=60000)
        
        print("Waiting for page to fully load...")
        time.sleep(10)
        
        # Zoom halaman ke 125%
        print("Zooming page to 125%...")
        page.evaluate("document.body.style.zoom = '125%'")
        
        screenshot_count = 1
        max_screenshots = 20
        previous_hash = None
        
        # Klik di tengah halaman untuk fokus
        page.mouse.click(640, 450)
        time.sleep(1)
        
        while screenshot_count <= max_screenshots:
            filename = f"{SCREENSHOT_DIR}/pmi_stock_{timestamp}_{screenshot_count:02d}.png"
            page.screenshot(path=filename)
            print(f"  Screenshot {screenshot_count}: {filename}")
            
            # Hash untuk deteksi duplikat
            with open(filename, "rb") as f:
                current_hash = hashlib.md5(f.read()).hexdigest()
            
            if screenshot_count > 1 and current_hash == previous_hash:
                print("  Screenshot sama dengan sebelumnya, berhenti.")
                os.remove(filename)
                break
            
            previous_hash = current_hash
            
            # Scroll down
            page.mouse.click(640, 450)
            page.mouse.wheel(0, 450)
            time.sleep(2)
            
            screenshot_count += 1
        
        browser.close()
        print(f"\n✅ {screenshot_count - 1} screenshots saved to '{SCREENSHOT_DIR}/'")


# ============================================================================
# STEP 2: STITCH SCREENSHOTS (from stitch-vertical.py)
# ============================================================================
def load_as_cv2(path):
    """Load an image as BGR (cv2) array."""
    img = cv2.imread(path, cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f"Could not read image: {path}")
    return img


def find_exact_header_height(img1, img2, max_height=300):
    """Find exact pixel height where top regions are identical."""
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    w = min(w1, w2)
    max_h = min(max_height, h1, h2)
    
    gray1 = cv2.cvtColor(img1[:max_h, :w, :], cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2[:max_h, :w, :], cv2.COLOR_BGR2GRAY)
    
    header_height = 0
    for row in range(max_h):
        diff = np.abs(gray1[row, :].astype(int) - gray2[row, :].astype(int))
        if np.mean(diff) < 5:
            header_height = row + 1
        else:
            break
    
    return header_height


def find_exact_left_width(img1, img2):
    """Find exact pixel width where left regions are identical."""
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    h = min(h1, h2)
    w = min(w1, w2)
    
    gray1 = cv2.cvtColor(img1[:h, :w, :], cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2[:h, :w, :], cv2.COLOR_BGR2GRAY)
    
    left_width = 0
    for col in range(w):
        diff = np.abs(gray1[:, col].astype(int) - gray2[:, col].astype(int))
        if np.mean(diff) < 5:
            left_width = col + 1
        else:
            break
    
    return left_width


def extract_and_save_cropped(input_dir=SCREENSHOT_DIR, output_dir=TOP_SLICE_DIR):
    """Step 2a: Crop header and left from all images."""
    files = sorted([
        os.path.join(input_dir, f)
        for f in os.listdir(input_dir)
        if f.lower().endswith((".png", ".jpg", ".jpeg"))
    ])
    
    if len(files) < 2:
        print("❌ Need at least 2 images to compare")
        return 0, 0
    
    print(f"📸 Found {len(files)} images")
    
    img1 = load_as_cv2(files[0])
    img2 = load_as_cv2(files[1])
    
    header_height = find_exact_header_height(img1, img2)
    left_width = find_exact_left_width(img1, img2)
    
    if header_height > 0:
        print(f"✅ Found identical top region: {header_height} pixels")
    if left_width > 0:
        print(f"✅ Found identical left region: {left_width} pixels")
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Save header
    if header_height > 0:
        header_img = img1[:header_height, left_width:, :]
        header_rgb = cv2.cvtColor(header_img, cv2.COLOR_BGR2RGB)
        header_path = os.path.join(output_dir, "header_pmi.png")
        Image.fromarray(header_rgb).save(header_path)
    
    # Crop all images
    for i, filepath in enumerate(files, 1):
        img = load_as_cv2(filepath)
        cropped = img[header_height:, left_width:, :]
        cropped_rgb = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB)
        output_path = os.path.join(output_dir, f"top_{i:02d}.png")
        Image.fromarray(cropped_rgb).save(output_path)
    
    print(f"✅ Saved {len(files)} cropped images to {output_dir}")
    return header_height, left_width


def find_overlap_height(top_img, bottom_img, max_overlap=500):
    """Find the overlap height between two images."""
    top_h, top_w = top_img.shape[:2]
    bottom_h, bottom_w = bottom_img.shape[:2]
    w = min(top_w, bottom_w)
    
    top_gray = cv2.cvtColor(top_img[:, :w, :], cv2.COLOR_BGR2GRAY)
    bottom_gray = cv2.cvtColor(bottom_img[:, :w, :], cv2.COLOR_BGR2GRAY)
    
    patch_h = min(int(bottom_h * 0.4), 300, top_h)
    patch = bottom_gray[:patch_h, :]
    
    search_start = max(0, top_h - max_overlap)
    search_roi = top_gray[search_start:, :]
    
    result = cv2.matchTemplate(search_roi, patch, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, max_loc = cv2.minMaxLoc(result)
    
    best_y_in_top = search_start + max_loc[1]
    top_img_overlap = top_h - best_y_in_top
    
    if top_img_overlap <= 0 or top_img_overlap > top_h:
        top_img_overlap = 0
    
    return top_img_overlap, 0


def process_overlap_iterative(input_dir=TOP_SLICE_DIR, output_dir=OVERLAP_DIR):
    """Step 2b: Process overlaps iteratively."""
    files = sorted([
        os.path.join(input_dir, f)
        for f in os.listdir(input_dir)
        if f.lower().endswith((".png", ".jpg", ".jpeg")) and not f.startswith("header")
    ])
    
    if len(files) < 2:
        print("❌ Need at least 2 images")
        return
    
    print(f"📸 Found {len(files)} images in {input_dir}")
    os.makedirs(output_dir, exist_ok=True)
    
    # Copy first image
    src = files[0]
    dst = os.path.join(output_dir, "overlap_01.png")
    shutil.copy2(src, dst)
    
    for i in range(1, len(files)):
        overlap_prev_path = os.path.join(output_dir, f"overlap_{i:02d}.png")
        top_next_path = files[i]
        overlap_next_path = os.path.join(output_dir, f"overlap_{i+1:02d}.png")
        
        overlap_prev = load_as_cv2(overlap_prev_path)
        top_next = load_as_cv2(top_next_path)
        
        overlap_height, _ = find_overlap_height(overlap_prev, top_next)
        img_height = overlap_prev.shape[0]
        
        if overlap_height > 0 and overlap_height < img_height:
            cropped = overlap_prev[:-overlap_height, :, :]
            cropped_rgb = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB)
            Image.fromarray(cropped_rgb).save(overlap_prev_path)
        
        shutil.copy2(top_next_path, overlap_next_path)
    
    print(f"✅ Processed {len(files)} images to {output_dir}")


def combine_vertical(input_dir=OVERLAP_DIR, output_path=FINAL_IMAGE):
    """Step 2c: Combine all images vertically."""
    files = sorted([
        os.path.join(input_dir, f)
        for f in os.listdir(input_dir)
        if f.lower().endswith((".png", ".jpg", ".jpeg"))
    ])
    
    if not files:
        print("❌ No images found in overlap folder")
        return
    
    print(f"📸 Found {len(files)} images in {input_dir}")
    
    images = []
    total_height = 0
    max_width = 0
    
    for filepath in files:
        img = load_as_cv2(filepath)
        h, w = img.shape[:2]
        images.append(img)
        total_height += h
        max_width = max(max_width, w)
    
    print(f"📐 Final size: {max_width}x{total_height}")
    
    combined = np.zeros((total_height, max_width, 3), dtype=np.uint8)
    
    y_offset = 0
    for img in images:
        h, w = img.shape[:2]
        combined[y_offset:y_offset + h, 0:w, :] = img
        y_offset += h
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    combined_rgb = cv2.cvtColor(combined, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(combined_rgb)
    pil_image.save(output_path)
    print(f"✅ Saved combined image → {output_path}")


def run_stitch():
    """Run all stitch steps."""
    print("\n" + "="*60)
    print("STEP 2: STITCH SCREENSHOTS")
    print("="*60)
    
    extract_and_save_cropped()
    print()
    process_overlap_iterative()
    print()
    combine_vertical()


# ============================================================================
# STEP 3: OCR WITH TESSERACT (from ocr_local.py)
# ============================================================================
def run_ocr():
    """Extract text from image using Tesseract OCR."""
    print("\n" + "="*60)
    print("STEP 3: OCR WITH TESSERACT")
    print("="*60)
    
    if not os.path.exists(FINAL_IMAGE):
        print(f"❌ Image not found: {FINAL_IMAGE}")
        return False
    
    print(f"Processing image: {FINAL_IMAGE}")
    
    try:
        img = Image.open(FINAL_IMAGE)
        custom_config = r'--oem 3 --psm 6 -l ind+eng'
        text = pytesseract.image_to_string(img, config=custom_config)
        
        if text:
            os.makedirs(os.path.dirname(OCR_RESULT), exist_ok=True)
            with open(OCR_RESULT, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"✅ OCR text saved to: {OCR_RESULT}")
            print(f"   Text length: {len(text)} chars")
            return True
        else:
            print("❌ Failed to extract text")
            return False
    except Exception as e:
        print(f"❌ OCR Error: {e}")
        return False


# ============================================================================
# STEP 4: PARSE WITH DEEPSEEK API (from send_to_deepseek.py)
# ============================================================================
def run_deepseek():
    """Parse OCR text with DeepSeek API."""
    print("\n" + "="*60)
    print("STEP 4: PARSE WITH DEEPSEEK API")
    print("="*60)
    
    if not DEEPSEEK_API_KEY:
        print("❌ DEEPSEEK_API_KEY not found in .env file!")
        return False
    
    if not os.path.exists(OCR_RESULT):
        print(f"❌ OCR result not found: {OCR_RESULT}")
        return False
    
    # Read OCR text
    with open(OCR_RESULT, "r", encoding="utf-8") as f:
        ocr_text = f.read()
    
    print(f"OCR text length: {len(ocr_text)} chars")
    print("Sending to DeepSeek for parsing...")
    
    # Setup client
    client = OpenAI(
        api_key=DEEPSEEK_API_KEY,
        base_url="https://api.deepseek.com"
    )
    
    # Prompt
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
        
        result = response.choices[0].message.content
        print("✅ Response received!")
        
        # Extract JSON
        clean_result = result.strip()
        if "```json" in clean_result:
            json_str = clean_result.split("```json")[1].split("```")[0].strip()
        elif "```" in clean_result:
            json_str = clean_result.split("```")[1].split("```")[0].strip()
        else:
            json_str = clean_result
        
        # Parse and save JSON
        data = json.loads(json_str)
        
        os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Data saved to: {OUTPUT_JSON}")
        
        # Summary
        print(f"\n📊 Summary:")
        print(f"Last update: {data.get('last_update', 'Not specified')}")
        
        if 'data_stok' in data:
            total_items = 0
            for category, items in data['data_stok'].items():
                count = len(items) if isinstance(items, list) else 0
                total_items += count
                print(f"  {category.replace('_', ' ').title()}: {count} items")
            print(f"\n  Total: {total_items} items")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parse error: {e}")
        return False
    except Exception as e:
        print(f"❌ API Error: {e}")
        return False


# ============================================================================
# MAIN PIPELINE
# ============================================================================
def main():
    """Run the full pipeline."""
    print("="*60)
    print("PMI STOCK DATA PIPELINE")
    print("="*60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Parse arguments
    skip_screenshot = "--skip-screenshot" in sys.argv
    skip_ocr = "--skip-ocr" in sys.argv
    only_api = "--only-api" in sys.argv
    
    if only_api:
        skip_screenshot = True
        skip_ocr = True
    
    # Step 1: Screenshot
    if not skip_screenshot:
        run_screenshot()
    else:
        print("\n⏭️  Skipping screenshot step")
    
    # Step 2: Stitch
    if not skip_screenshot:
        run_stitch()
    else:
        print("⏭️  Skipping stitch step")
    
    # Step 3: OCR
    if not skip_ocr:
        if not run_ocr():
            print("❌ OCR failed, stopping pipeline")
            return
    else:
        print("⏭️  Skipping OCR step")
    
    # Step 4: DeepSeek API
    run_deepseek()
    
    print("\n" + "="*60)
    print("PIPELINE COMPLETE")
    print("="*60)
    print(f"Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Output: {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
