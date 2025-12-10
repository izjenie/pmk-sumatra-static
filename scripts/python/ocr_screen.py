import os
import glob
import base64
import json
from dotenv import load_dotenv
from openai import OpenAI

# Load .env file
load_dotenv()


def encode_image_to_base64(image_path: str) -> str:
    """Encode gambar ke base64 string."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def ocr_screenshot(client: OpenAI, image_path: str) -> dict:
    """
    Kirim screenshot ke OpenAI Vision API untuk OCR.
    
    Returns:
        dict: JSON hasil OCR
    """
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
    
    # Coba parse sebagai JSON
    try:
        # Hapus markdown code block jika ada
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            content = content.rsplit("```", 1)[0]
        return json.loads(content)
    except json.JSONDecodeError:
        return {"raw_text": content}


def process_all_screenshots(input_dir: str = "screenshots"):
    """
    Proses semua screenshot di direktori dengan OCR.
    """
    # Pastikan API key tersedia
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY tidak ditemukan di .env")
        print("Buat file .env dengan isi: OPENAI_API_KEY=your-api-key")
        return
    
    client = OpenAI(api_key=api_key)
    
    # Cari semua file PNG
    pattern = os.path.join(input_dir, "pmi_stock_*.png")
    files = sorted(glob.glob(pattern))
    
    if not files:
        print(f"Tidak ada file screenshot ditemukan di '{input_dir}/'")
        return
    
    print(f"Ditemukan {len(files)} screenshot untuk di-OCR\n")
    
    all_results = []
    
    for i, filepath in enumerate(files):
        filename = os.path.basename(filepath)
        print(f"[{i + 1}/{len(files)}] Processing: {filename}")
        
        try:
            result = ocr_screenshot(client, filepath)
            all_results.append({
                "file": filename,
                "data": result
            })
            print(f"  ✓ Berhasil")
            print(f"  Result: {json.dumps(result, indent=2, ensure_ascii=False)[:500]}...")
            print()
        except Exception as e:
            print(f"  ✗ Error: {e}")
            all_results.append({
                "file": filename,
                "error": str(e)
            })
    
    # Kumpulkan semua data JSON dari OCR
    all_ocr_data = [r["data"] for r in all_results if "data" in r]
    
    # Submit ke OpenAI untuk normalize menjadi format final
    print("\n" + "=" * 50)
    print("Mengirim ke OpenAI untuk normalisasi...")
    print("=" * 50)
    
    final_result = normalize_with_openai(client, all_ocr_data)
    
    # Simpan ke file
    output_file = "stock_pmi.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(final_result, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 50)
    print("HASIL FINAL:")
    print("=" * 50)
    print(json.dumps(final_result, indent=2, ensure_ascii=False))
    print(f"\nDisimpan ke '{output_file}'")


def normalize_with_openai(client: OpenAI, all_ocr_data: list) -> dict:
    """
    Kirim semua hasil OCR ke OpenAI untuk dinormalisasi menjadi format final.
    
    Returns:
        dict: {pembaruan_terakhir, items: [{nama, jumlah, satuan}, ...]}
    """
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
    
    # Parse JSON
    try:
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            content = content.rsplit("```", 1)[0]
        return json.loads(content)
    except json.JSONDecodeError:
        return {"error": "Failed to parse response", "raw": content}


def find_items_recursive(obj, items_list):
    """Cari items secara rekursif dalam struktur JSON apapun."""
    if isinstance(obj, dict):
        # Cek apakah ini adalah item (punya nama/name dan jumlah/quantity)
        has_name = any(k in obj for k in ["nama", "name", "item", "Name", "Item"])
        has_qty = any(k in obj for k in ["jumlah", "quantity", "Quantity", "Jumlah"])
        
        if has_name and has_qty:
            items_list.append(obj)
        else:
            # Rekursif ke dalam, prioritaskan key yang kemungkinan berisi items
            for key, value in obj.items():
                key_lower = key.lower()
                # Cek apakah key ini kemungkinan berisi daftar items
                if any(k in key_lower for k in ["items", "stock", "stok", "logistic", "logistik"]):
                    find_items_recursive(value, items_list)
                else:
                    find_items_recursive(value, items_list)
    elif isinstance(obj, list):
        for item in obj:
            find_items_recursive(item, items_list)


def find_update_time(obj):
    """Cari waktu pembaruan secara rekursif."""
    if isinstance(obj, dict):
        for key, value in obj.items():
            key_lower = key.lower()
            if any(k in key_lower for k in ["pembaruan", "update", "terakhir", "last"]):
                if isinstance(value, str) and ("desember" in value.lower() or "2025" in value):
                    return value
                elif isinstance(value, dict):
                    # Coba gabungkan tanggal dan waktu
                    tanggal = value.get("tanggal") or value.get("date") or ""
                    waktu = value.get("waktu") or value.get("time") or ""
                    if tanggal:
                        return f"{tanggal} pukul {waktu}".strip()
            
            # Rekursif
            result = find_update_time(value)
            if result:
                return result
    elif isinstance(obj, list):
        for item in obj:
            result = find_update_time(item)
            if result:
                return result
    return None


def combine_results(all_results: list) -> dict:
    """
    Combine semua hasil OCR menjadi satu JSON final.
    
    Returns:
        dict: {pembaruan_terakhir, items: [...]}
    """
    pembaruan_terakhir = None
    all_items = []
    seen_items = set()  # Untuk menghindari duplikat
    
    for result in all_results:
        if "error" in result:
            continue
        
        data = result.get("data", {})
        
        # Cari pembaruan terakhir
        if not pembaruan_terakhir:
            pembaruan_terakhir = find_update_time(data)
        
        # Cari items secara rekursif
        found_items = []
        find_items_recursive(data, found_items)
        
        # Normalize dan tambahkan items
        for item in found_items:
            # Normalize key names
            name = item.get("nama") or item.get("name") or item.get("item") or item.get("Name") or item.get("Item") or ""
            quantity = item.get("jumlah") or item.get("quantity") or item.get("Quantity") or item.get("Jumlah") or ""
            unit = item.get("satuan") or item.get("unit") or item.get("Unit") or item.get("Satuan") or ""
            
            # Jika quantity sudah include unit (e.g., "2.196 KARTON" atau "29 UNIT")
            if isinstance(quantity, str) and " " in quantity and not unit:
                parts = quantity.rsplit(" ", 1)
                if len(parts) == 2:
                    quantity, unit = parts
            
            # Skip jika tidak ada nama
            if not name:
                continue
            
            # Buat key unik untuk cek duplikat
            item_key = f"{name.upper().strip()}"
            if item_key in seen_items:
                continue
            seen_items.add(item_key)
            
            all_items.append({
                "nama": name.strip(),
                "jumlah": str(quantity).strip(),
                "satuan": unit.strip()
            })
    
    return {
        "pembaruan_terakhir": pembaruan_terakhir or "",
        "items": all_items
    }


def main():
    process_all_screenshots()


if __name__ == "__main__":
    main()
