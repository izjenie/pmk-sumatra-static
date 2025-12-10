"""
Send screenshots to DeepSeek Vision for parsing into JSON
"""

import os
import glob
import base64
import json
from dotenv import load_dotenv
from openai import OpenAI

# Load .env file
load_dotenv()

# Output directory
OUTPUT_DIR = "output"


def encode_image(image_path):
    """Encode image to base64"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def main():
    # Check API key (use DASHSCOPE_API_KEY for Qwen VL)
    api_key = os.getenv("DASHSCOPE_API_KEY")
    if not api_key:
        print("Error: DASHSCOPE_API_KEY tidak ditemukan di .env")
        return
    
    # Initialize the client with longer timeout (Qwen VL via DashScope)
    client = OpenAI(
        api_key=api_key,
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
        timeout=300.0  # 5 minutes timeout
    )
    
    # Find all screenshots
    screenshots_dir = f"{OUTPUT_DIR}/screenshots"
    pattern = os.path.join(screenshots_dir, "pmi_stock_*.png")
    image_paths = sorted(glob.glob(pattern))
    
    if not image_paths:
        print(f"Tidak ada screenshot ditemukan di '{screenshots_dir}/'")
        return
    
    print(f"Ditemukan {len(image_paths)} screenshot")
    
    # Encode all images
    encoded_images = []
    for image_path in image_paths:
        try:
            print(f"Encoding: {os.path.basename(image_path)}")
            base64_image = encode_image(image_path)
            encoded_images.append(base64_image)
        except Exception as e:
            print(f"Error encoding {image_path}: {e}")
    
    # Prepare messages with multiple images
    messages = [
        {
            "role": "user",
            "content": []
        }
    ]
    
    # Add all images to the content
    for base64_image in encoded_images:
        messages[0]["content"].append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/png;base64,{base64_image}"
            }
        })
    
    # Add the text prompt
    messages[0]["content"].append({
        "type": "text",
        "text": "coba parsing ini menjadi json supaya bisa di proses, juga last updatenya di taro di json satu kali aja. make sure no duplicate item"
    })
    
    print("\nSending to Qwen VL...")
    
    # Make the API call
    response = client.chat.completions.create(
        model="qwen-vl-max",
        messages=messages,
        max_tokens=8192
    )
    
    content = response.choices[0].message.content
    
    # Try to parse as JSON
    try:
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            content = content.rsplit("```", 1)[0]
        result = json.loads(content)
    except json.JSONDecodeError:
        result = {"raw_response": content}
    
    # Save to file
    output_file = f"{OUTPUT_DIR}/deepseek_result.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\nHasil disimpan ke '{output_file}'")
    print("\nPreview:")
    print(json.dumps(result, indent=2, ensure_ascii=False)[:2000])


if __name__ == "__main__":
    main()
