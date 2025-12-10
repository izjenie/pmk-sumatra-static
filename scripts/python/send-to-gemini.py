"""
Send screenshots to Gemini for parsing into JSON
"""

import os
import glob
import json
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image

# Load .env file
load_dotenv()

# Output directory
OUTPUT_DIR = "output"


def main():
    # Check API key
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY tidak ditemukan di .env")
        return
    
    # Configure Gemini
    genai.configure(api_key=api_key)
    
    # Find all screenshots
    screenshots_dir = f"{OUTPUT_DIR}/screenshots"
    pattern = os.path.join(screenshots_dir, "pmi_stock_*.png")
    image_paths = sorted(glob.glob(pattern))
    
    if not image_paths:
        print(f"Tidak ada screenshot ditemukan di '{screenshots_dir}/'")
        return
    
    print(f"Ditemukan {len(image_paths)} screenshot")
    
    # Build prompt parts with images
    prompt_parts = []
    prompt_parts.append("coba parsing ini menjadi json supaya bisa di proses, juga last updatenya di taro di json satu kali aja. make sure no duplicate item. Return ONLY valid JSON without markdown code blocks.")
    
    for img_path in image_paths:
        img_file = os.path.basename(img_path)
        print(f"Loading: {img_file}")
        img = Image.open(img_path)
        
        # Add the filename as text, then the actual image object
        prompt_parts.append(f"Filename: {img_file}")
        prompt_parts.append(img)
    
    # Initialize Model
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config={
            "response_mime_type": "application/json"
        }
    )
    
    print(f"\nSending {len(image_paths)} images to Gemini...")
    
    # Send the request
    response = model.generate_content(prompt_parts)
    
    content = response.text
    
    # Try to parse as JSON
    try:
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            content = content.rsplit("```", 1)[0]
        result = json.loads(content)
    except json.JSONDecodeError:
        result = {"raw_response": content}
    
    # Save to file
    output_file = f"{OUTPUT_DIR}/gemini_result.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\nHasil disimpan ke '{output_file}'")
    print("\nPreview:")
    print(json.dumps(result, indent=2, ensure_ascii=False)[:2000])


if __name__ == "__main__":
    main()
