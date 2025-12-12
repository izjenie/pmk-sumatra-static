# by izjenie, December 2025

import os
import glob
import time
import hashlib
from datetime import datetime
from playwright.sync_api import sync_playwright


def clear_screenshots(output_dir: str = "output/screenshots"):
    """Hapus semua file di direktori screenshots."""
    if os.path.exists(output_dir):
        files = glob.glob(os.path.join(output_dir, "*.png"))
        for f in files:
            os.remove(f)
        print(f"Deleted {len(files)} files from '{output_dir}/'")


def screenshot_full_page(url: str, output_dir: str = "output/screenshots"):
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
        page = browser.new_page(viewport={"width": 2560, "height": 900})
        
        print(f"Navigating to {url}...")
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        
        # Tunggu konten loading selesai
        print("Waiting for page to fully load...")
        time.sleep(10)
        
        # Zoom halaman ke 125%
        print("Zooming page to 125%...")
        page.evaluate("document.body.style.zoom = '125%'")
        
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


def main():
    url = "https://pmi.or.id/dashboard/stock"
    screenshot_full_page(url)


if __name__ == "__main__":
    main()
