import base64
import json
import os
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Konfigurasi API - ambil dari .env
API_KEY = os.getenv("DEEPSEEK_API_KEY")

def encode_image_to_base64(image_path):
    """Encode gambar ke base64"""
    try:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode('utf-8')
    except Exception as e:
        print(f"Error reading image: {e}")
        return None

def analyze_pmi_logistics(image_path):
    """Analisis gambar logistik PMI dengan DeepSeek API"""
    
    # Encode gambar
    image_base64 = encode_image_to_base64(image_path)
    if not image_base64:
        return None
    
    # Setup client
    client = OpenAI(
        api_key=API_KEY,
        base_url="https://api.deepseek.com"
    )
    
    # Prompt yang lebih sederhana
    prompt = """
    Analyze this PMI (Palang Merah Indonesia) logistics stock image.
    Extract all items with their quantities and units.
    Format the response as a JSON object with this structure:
    
    {
      "last_update": "date and time if visible",
      "categories": {
        "food_and_beverages": [
          {"name": "ITEM_NAME", "quantity": 123, "unit": "UNIT"}
        ],
        "clothing": [],
        "medical_supplies": [],
        "shelter_equipment": [],
        "tools": []
      }
    }
    
    Convert all quantities to numbers (e.g., "2.196 KARTON" → 2196).
    Remove duplicates.
    """
    
    # Determine mime type based on file extension
    if image_path.lower().endswith('.pdf'):
        mime_type = "application/pdf"
    else:
        mime_type = "image/png"
    
    try:
        # Gunakan model vision dengan format file
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "file", "file": {"url": f"data:{mime_type};base64,{image_base64}"}}
                    ]
                }
            ],
            max_tokens=3000
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"API Error with file format: {e}")
        
        # Fallback: kirim base64 sebagai text
        try:
            print("Trying fallback with text-only...")
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {
                        "role": "user",
                        "content": f"{prompt}\n\n[PDF/Image content encoded in base64, first 500 chars]: {image_base64[:500]}"
                    }
                ],
                max_tokens=3000
            )
            return response.choices[0].message.content
        except Exception as e2:
            print(f"Fallback also failed: {e2}")
            return None

def analyze_with_vision_api(image_path, client, prompt):
    """Alternative approach jika model vision tersedia"""
    try:
        # Baca file sebagai binary
        with open(image_path, "rb") as img_file:
            response = client.chat.completions.create(
                model="deepseek-vision",  # Model khusus vision jika ada
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{encode_image_to_base64(image_path)}"}}
                        ]
                    }
                ],
                max_tokens=3000
            )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Vision API also failed: {e}")
        return None

def main():
    # Path ke file - sesuaikan dengan lokasi Anda
    image_path = "output/result/final_pmi.pdf"
    
    if not os.path.exists(image_path):
        # Coba cari di lokasi lain
        print(f"Image not found at {image_path}")
        image_path = input("Enter full path to image: ").strip()
        
        if not os.path.exists(image_path):
            print("Image not found!")
            return
    
    print(f"Processing image: {image_path}")
    
    # Periksa API key
    if not API_KEY:
        print("\n⚠️  WARNING: DEEPSEEK_API_KEY not found in .env file!")
        print("Get your API key from: https://platform.deepseek.com/api_keys")
        return
    
    result = analyze_pmi_logistics(image_path)
    
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
            output_file = "output/result/pmi_logistics.json"
            os.makedirs(os.path.dirname(output_file), exist_ok=True)
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Data saved to: {output_file}")
            
            # Tampilkan summary
            print(f"\n📊 Summary:")
            print(f"Last update: {data.get('last_update', 'Not specified')}")
            
            if 'categories' in data:
                for category, items in data['categories'].items():
                    print(f"{category.replace('_', ' ').title()}: {len(items)} items")
            
        except json.JSONDecodeError:
            print("\n⚠️  Could not parse JSON. Raw response:")
            print("-" * 50)
            print(result[:500] + "..." if len(result) > 500 else result)
            print("-" * 50)
            
            # Save raw response
            with open("output/result/raw_response.txt", "w", encoding="utf-8") as f:
                f.write(result)
            print("Raw response saved to: output/result/raw_response.txt")
    else:
        print("❌ Failed to analyze image")

if __name__ == "__main__":
    main()
