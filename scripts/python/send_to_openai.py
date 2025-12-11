import base64
import json
import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# Load .env file
load_dotenv()

# Konfigurasi API - ambil dari .env
API_KEY = os.getenv("OPENAI_API_KEY")

# Path configuration
INPUT_IMAGE = "output/result/final_pmi.pdf"
OUTPUT_JSON = "output/result/pmi_logistics.json"


def encode_image_to_base64(image_path):
    """Encode gambar ke base64"""
    try:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode('utf-8')
    except Exception as e:
        print(f"Error reading image: {e}")
        return None


def analyze_pmi_logistics(image_path):
    """Analisis gambar logistik PMI dengan OpenAI GPT-4 Vision API"""
    
    # Encode gambar
    image_base64 = encode_image_to_base64(image_path)
    if not image_base64:
        return None
    
    # Setup client
    client = OpenAI(api_key=API_KEY)
    
    # Determine mime type
    if image_path.lower().endswith('.pdf'):
        mime_type = "application/pdf"
    elif image_path.lower().endswith('.jpg') or image_path.lower().endswith('.jpeg'):
        mime_type = "image/jpeg"
    else:
        mime_type = "image/png"
    
    # Prompt untuk parsing data logistik
    prompt = """
    Analyze this PMI (Palang Merah Indonesia) logistics stock image.
    Extract ALL items with their quantities and units.
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
        "tools": [],
        "other": []
      }
    }
    
    Important:
    - Extract ALL visible items from the image
    - Convert all quantities to numbers (e.g., "2.196 KARTON" → quantity: 2196, unit: "KARTON")
    - Remove duplicates
    - Group items into appropriate categories
    - If unsure about category, put in "other"
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{image_base64}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens=4000
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"API Error: {e}")
        return None


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
    
    # Periksa API key
    if not API_KEY:
        print("\n⚠️  WARNING: OPENAI_API_KEY not found in .env file!")
        print("Get your API key from: https://platform.openai.com/api-keys")
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
            os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
            with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Data saved to: {OUTPUT_JSON}")
            
            # Tampilkan summary
            print(f"\n📊 Summary:")
            print(f"Last update: {data.get('last_update', 'Not specified')}")
            
            if 'categories' in data:
                total_items = 0
                for category, items in data['categories'].items():
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
        print("❌ Failed to analyze image")


if __name__ == "__main__":
    main()
