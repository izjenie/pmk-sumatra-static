import os
import glob
import time
import hashlib
import shutil
from typing import List
from datetime import datetime
from PIL import Image
import cv2
import numpy as np
from playwright.sync_api import sync_playwright

# ============================================================
# Configuration
# ============================================================
OUTPUT_DIR = "output"
SCREENSHOTS_DIR = f"{OUTPUT_DIR}/screenshots"
TOP_SLICE_DIR = f"{SCREENSHOTS_DIR}/top-slice"
OVERLAP_DIR = f"{SCREENSHOTS_DIR}/overlap"
RESULT_DIR = f"{OUTPUT_DIR}/result"

# ============================================================
# STEP 0: Screenshot dengan Playwright
# ============================================================

def clear_screenshots(output_dir: str = SCREENSHOTS_DIR):
    """Hapus semua file di direktori screenshots."""
    if os.path.exists(output_dir):
        files = glob.glob(os.path.join(output_dir, "*.png"))
        for f in files:
            os.remove(f)
        print(f"Deleted {len(files)} files from '{output_dir}/'")


def screenshot_full_page(url: str, output_dir: str = SCREENSHOTS_DIR):
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
        # browser = p.chromium.launch(headless=False)
        browser = p.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        
        print(f"Navigating to {url}...")
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        
        # Tunggu konten loading selesai
        print("Waiting for page to fully load...")
        time.sleep(10)
        
        viewport_height = 900
        screenshot_count = 1
        max_screenshots = 20  # Batas maksimal screenshot
        
        # Cari scrollable container (bisa main content area, bukan window)
        # Coba beberapa selector yang umum digunakan
        scroll_script = """
        () => {
            // Coba scroll window dulu
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
                # Hapus screenshot duplikat
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
        print("Silakan cek manual apakah semua konten sudah ter-capture.")


# ============================================================
# Image Processing Utilities
# ============================================================

def load_as_cv2(path: str) -> np.ndarray:
    """Load an image as BGR (cv2) array."""
    img = cv2.imread(path, cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f"Could not read image: {path}")
    return img


def find_exact_header_height(img1: np.ndarray, img2: np.ndarray, max_height: int = 300) -> int:
    """
    Find exact pixel height where top regions are identical between two images.
    Returns the height in pixels.
    """
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    w = min(w1, w2)
    max_h = min(max_height, h1, h2)
    
    # Convert to grayscale for comparison
    gray1 = cv2.cvtColor(img1[:max_h, :w, :], cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2[:max_h, :w, :], cv2.COLOR_BGR2GRAY)
    
    # Find row-by-row where they differ
    header_height = 0
    for row in range(max_h):
        diff = np.abs(gray1[row, :].astype(int) - gray2[row, :].astype(int))
        if np.mean(diff) < 5:  # Allow small tolerance for compression artifacts
            header_height = row + 1
        else:
            break
    
    return header_height


def find_exact_left_width(img1: np.ndarray, img2: np.ndarray) -> int:
    """
    Find exact pixel width where left regions are identical between two images.
    Returns the width in pixels. No max_width limit - checks until columns differ.
    """
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    h = min(h1, h2)
    w = min(w1, w2)
    
    # Convert to grayscale for comparison
    gray1 = cv2.cvtColor(img1[:h, :w, :], cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2[:h, :w, :], cv2.COLOR_BGR2GRAY)
    
    # Find column-by-column where they differ
    left_width = 0
    for col in range(w):
        diff = np.abs(gray1[:, col].astype(int) - gray2[:, col].astype(int))
        if np.mean(diff) < 5:  # Allow small tolerance for compression artifacts
            left_width = col + 1
        else:
            break
    
    return left_width


def find_overlap_height(top_img: np.ndarray, bottom_img: np.ndarray, max_overlap: int = 500) -> tuple:
    """
    Find the overlap height between bottom of top_img and top of bottom_img.
    Returns (top_img_overlap, bottom_img_overlap) - pixels to crop from each image.
    These may differ if the same content has different pixel heights in each image.
    """
    top_h, top_w = top_img.shape[:2]
    bottom_h, bottom_w = bottom_img.shape[:2]
    w = min(top_w, bottom_w)
    
    # Convert to grayscale
    top_gray = cv2.cvtColor(top_img[:, :w, :], cv2.COLOR_BGR2GRAY)
    bottom_gray = cv2.cvtColor(bottom_img[:, :w, :], cv2.COLOR_BGR2GRAY)
    
    # 1. Find how much to crop from top_img's bottom:
    #    Search for bottom_img's top in top_img's bottom
    patch_h = min(int(bottom_h * 0.4), 300, top_h)
    patch = bottom_gray[:patch_h, :]
    
    search_start = max(0, top_h - max_overlap)
    search_roi = top_gray[search_start:, :]
    
    result = cv2.matchTemplate(search_roi, patch, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, max_loc = cv2.minMaxLoc(result)
    
    best_y_in_top = search_start + max_loc[1]
    top_img_overlap = top_h - best_y_in_top
    
    # 2. Find how much to crop from bottom_img's top:
    #    Search for top_img's bottom in bottom_img's top
    patch_h2 = min(int(top_h * 0.4), 300, bottom_h)
    patch2 = top_gray[-patch_h2:, :]  # bottom of top_img
    
    search_end = min(max_overlap, bottom_h)
    search_roi2 = bottom_gray[:search_end, :]
    
    result2 = cv2.matchTemplate(search_roi2, patch2, cv2.TM_CCOEFF_NORMED)
    _, max_val2, _, max_loc2 = cv2.minMaxLoc(result2)
    
    # The match position + patch height = where the overlap ends in bottom_img
    bottom_img_overlap = max_loc2[1] + patch_h2
    
    # Validate
    if top_img_overlap <= 0 or top_img_overlap > top_h:
        top_img_overlap = 0
    if bottom_img_overlap <= 0 or bottom_img_overlap > bottom_h:
        bottom_img_overlap = 0
    
    return top_img_overlap, bottom_img_overlap


# ============================================================
# STEP 1: Extract and Save Cropped Images
# ============================================================

def extract_and_save_cropped(input_dir: str = SCREENSHOTS_DIR, output_dir: str = TOP_SLICE_DIR):
    """
    Step 1: Detect identical top and left regions between images, then save all images with both cropped.
    """
    # Collect images
    files = sorted([
        os.path.join(input_dir, f)
        for f in os.listdir(input_dir)
        if f.lower().endswith((".png", ".jpg", ".jpeg"))
    ])
    
    if len(files) < 2:
        print("❌ Need at least 2 images to compare")
        return 0, 0
    
    print(f"📸 Found {len(files)} images")
    print(f"🔍 Comparing first two images to find identical regions...\n")
    
    # Load first two images
    img1 = load_as_cv2(files[0])
    img2 = load_as_cv2(files[1])
    
    # Find exact header height (top)
    header_height = find_exact_header_height(img1, img2)
    
    # Find exact left width
    left_width = find_exact_left_width(img1, img2)
    
    if header_height == 0 and left_width == 0:
        print("❌ No identical top or left region found")
        return 0, 0
    
    if header_height > 0:
        print(f"✅ Found identical top region: {header_height} pixels")
    if left_width > 0:
        print(f"✅ Found identical left region: {left_width} pixels")
    print()
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Save header from first image (the cropped top part)
    if header_height > 0:
        header_img = img1[:header_height, left_width:, :]
        header_rgb = cv2.cvtColor(header_img, cv2.COLOR_BGR2RGB)
        header_path = os.path.join(output_dir, "header_pmi.png")
        Image.fromarray(header_rgb).save(header_path)
        print(f"💾 Saved header → header_pmi.png ({header_img.shape[1]}x{header_img.shape[0]} pixels)\n")
    
    # Save all images with top and left cropped
    print(f"✂️ Cropping top {header_height}px and left {left_width}px from all images...\n")
    for i, filepath in enumerate(files, 1):
        img = load_as_cv2(filepath)
        # Crop top and left
        cropped = img[header_height:, left_width:, :]
        cropped_rgb = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB)
        
        # Save with numbered filename
        output_path = os.path.join(output_dir, f"top_{i:02d}.png")
        Image.fromarray(cropped_rgb).save(output_path)
        print(f"  💾 top_{i:02d}.png → {cropped.shape[1]}x{cropped.shape[0]} pixels")
    
    print(f"\n✅ Saved {len(files)} cropped images to {output_dir}")
    
    return header_height, left_width


# ============================================================
# STEP 2: Process Overlaps Iteratively
# ============================================================

def process_overlap_iterative(input_dir: str = TOP_SLICE_DIR, output_dir: str = OVERLAP_DIR):
    """
    Step 2: Iteratively process images to remove overlaps.
    
    Process:
    1. Copy top_01 to overlap folder
    2. For each image i=1 to N-1:
       - Compare overlap_{i} with top_{i+1}
       - Crop bottom of overlap_{i} to remove overlap
       - Copy top_{i+1} to overlap folder
    3. Result: overlap folder contains images ready to stack (no overlaps)
    """
    # Collect images from top-slice
    files = sorted([
        os.path.join(input_dir, f)
        for f in os.listdir(input_dir)
        if f.lower().endswith((".png", ".jpg", ".jpeg"))
    ])
    
    if len(files) < 2:
        print("❌ Need at least 2 images")
        return
    
    print(f"📸 Found {len(files)} images in {input_dir}")
    print(f"🔄 Processing overlaps iteratively...\n")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Step 1: Copy first image to overlap folder
    src = files[0]
    dst = os.path.join(output_dir, "overlap_01.png")
    shutil.copy2(src, dst)
    print(f"  📋 Copied top_01.png → overlap_01.png\n")
    
    # Step 2: Iteratively process all remaining images (starting from i=1)
    for i in range(1, len(files)):
        # Paths
        overlap_prev_path = os.path.join(output_dir, f"overlap_{i:02d}.png")
        top_next_path = files[i]  # top_{i+1} (0-indexed, so files[i] is top_{i+1})
        overlap_next_path = os.path.join(output_dir, f"overlap_{i+1:02d}.png")
        
        print(f"🔗 Processing: overlap_{i:02d} vs top_{i+1:02d}...")
        
        # Load images
        overlap_prev = load_as_cv2(overlap_prev_path)
        top_next = load_as_cv2(top_next_path)
        
        # Find overlap between bottom of overlap_prev and top of top_next
        overlap_height, _ = find_overlap_height(overlap_prev, top_next)
        
        img_height = overlap_prev.shape[0]
        
        if overlap_height > 0 and overlap_height < img_height:
            print(f"  📐 Overlap detected: {overlap_height}px")
            
            # Crop bottom of overlap_prev
            cropped = overlap_prev[:-overlap_height, :, :]
            cropped_rgb = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB)
            Image.fromarray(cropped_rgb).save(overlap_prev_path)
            print(f"  ✂️ Cropped overlap_{i:02d}.png → {cropped.shape[1]}x{cropped.shape[0]} pixels")
        elif overlap_height >= img_height:
            print(f"  ⚠️ Overlap ({overlap_height}px) >= image height ({img_height}px), keeping overlap_{i:02d}.png as is")
        else:
            print(f"  ⚠️ No overlap found, keeping overlap_{i:02d}.png as is")
        
        # Copy top_next to overlap folder
        shutil.copy2(top_next_path, overlap_next_path)
        print(f"  📋 Copied top_{i+1:02d}.png → overlap_{i+1:02d}.png")
        print()
    
    print(f"✅ Processed {len(files)} images to {output_dir}")
    print(f"   Images are now ready to stack vertically (no overlaps)")


# ============================================================
# STEP 3: Combine Vertically
# ============================================================

def combine_vertical(input_dir: str = OVERLAP_DIR, output_path: str = f"{RESULT_DIR}/final_pmi.png"):
    """
    Step 3: Combine all images in overlap folder vertically (simple stack, no overlap detection).
    Images are already processed to have no overlaps.
    """
    # Collect images
    files = sorted([
        os.path.join(input_dir, f)
        for f in os.listdir(input_dir)
        if f.lower().endswith((".png", ".jpg", ".jpeg"))
    ])
    
    if not files:
        print("❌ No images found in overlap folder")
        return
    
    print(f"📸 Found {len(files)} images in {input_dir}")
    print(f"🔗 Combining vertically...\n")
    
    # Load all images
    images = []
    total_height = 0
    max_width = 0
    
    for filepath in files:
        img = load_as_cv2(filepath)
        h, w = img.shape[:2]
        images.append(img)
        total_height += h
        max_width = max(max_width, w)
        print(f"  📄 {os.path.basename(filepath)} → {w}x{h}")
    
    print(f"\n📐 Final size: {max_width}x{total_height}")
    
    # Create combined image
    combined = np.zeros((total_height, max_width, 3), dtype=np.uint8)
    
    y_offset = 0
    for img in images:
        h, w = img.shape[:2]
        combined[y_offset:y_offset + h, 0:w, :] = img
        y_offset += h
    
    # Save result
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    combined_rgb = cv2.cvtColor(combined, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(combined_rgb)
    pil_image.save(output_path)
    print(f"\n✅ Saved combined image → {output_path}")
    
    # Also save as PDF
    pdf_path = output_path.replace(".png", ".pdf")
    pil_image.convert("RGB").save(pdf_path, "PDF")
    print(f"✅ Saved PDF → {pdf_path}")


# ============================================================
# Main Process
# ============================================================

def main():
    url = "https://pmi.or.id/dashboard/stock"
    
    print("=" * 60)
    print("STEP 0: Taking screenshots")
    print("=" * 60)
    screenshot_full_page(url)
    
    print("\n" + "=" * 60)
    print("STEP 1: Extract and save cropped images (crop header and left)")
    print("=" * 60)
    header_height, left_width = extract_and_save_cropped()
    
    print("\n" + "=" * 60)
    print("STEP 2: Process overlaps iteratively")
    print("=" * 60)
    process_overlap_iterative()
    
    print("\n" + "=" * 60)
    print("STEP 3: Combine all overlap images vertically")
    print("=" * 60)
    combine_vertical()
    
    print("\n" + "=" * 60)
    print("✅ DONE! All steps completed successfully.")
    print("=" * 60)


if __name__ == "__main__":
    main()
