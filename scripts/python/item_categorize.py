import os
import json
from dotenv import load_dotenv
from openai import OpenAI

# Load .env file
load_dotenv()

# Output directory
OUTPUT_DIR = "output"


def read_stock_json(filepath: str = f"{OUTPUT_DIR}/stock_pmi.json") -> dict:
    """Baca file stock_pmi.json."""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def read_format_example(filepath: str = f"{OUTPUT_DIR}/template_stock_pmi.txt") -> str:
    """Baca contoh format dari stock_pmi.txt."""
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()


def categorize_with_deepseek(client: OpenAI, stock_data: dict, format_example: str) -> dict:
    """
    Kirim data stok ke DeepSeek untuk dikategorikan.
    
    Returns:
        dict: Data stok yang sudah dikategorikan
    """
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
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=8192
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


def main():
    # Pastikan API key tersedia
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        print("Error: DEEPSEEK_API_KEY tidak ditemukan di .env")
        print("Buat file .env dengan isi: DEEPSEEK_API_KEY=your-api-key")
        return
    
    client = OpenAI(
        api_key=api_key,
        base_url="https://api.deepseek.com"
    )
    
    # Baca data
    print("Reading stock_pmi.json...")
    stock_data = read_stock_json()
    
    print("Reading format example from stock_pmi.txt...")
    format_example = read_format_example()
    
    # Kategorikan dengan DeepSeek
    print("Sending to DeepSeek for categorization...")
    result = categorize_with_deepseek(client, stock_data, format_example)
    
    # Simpan hasil
    output_file = f"{OUTPUT_DIR}/final_stock_pmi.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\nHasil disimpan ke '{output_file}'")
    print("\nPreview:")
    print(json.dumps(result, indent=2, ensure_ascii=False)[:2000])


if __name__ == "__main__":
    main()
