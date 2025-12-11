import os
from typing import List
from PIL import Image
import cv2
import numpy as np

INPUT_DIR = "output/screenshots"
OUTPUT_FILE = "output/stitched_vertical.png"


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


def extract_and_save_cropped(input_dir: str, output_dir: str = "output/screenshots/top-slice"):
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


def detect_static_header_footer(img1: np.ndarray, img2: np.ndarray, region_height: int = 100, threshold: float = 0.95) -> tuple:
    """
    Detect if top/bottom regions are similar between two images (static header/footer).
    Returns (header_height, footer_height) to remove.
    """
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    w = min(w1, w2)
    
    header_height = 0
    footer_height = 0
    
    # Check top region (header)
    top1 = cv2.cvtColor(img1[:region_height, :w, :], cv2.COLOR_BGR2GRAY)
    top2 = cv2.cvtColor(img2[:region_height, :w, :], cv2.COLOR_BGR2GRAY)
    
    # Calculate similarity using normalized correlation
    if top1.shape == top2.shape:
        correlation = cv2.matchTemplate(top1, top2, cv2.TM_CCOEFF_NORMED)
        if correlation[0][0] > threshold:
            header_height = region_height
            print(f"  📌 Detected static header ({region_height}px, similarity: {correlation[0][0]:.3f})")
    
    # Check bottom region (footer)
    bottom1 = cv2.cvtColor(img1[-region_height:, :w, :], cv2.COLOR_BGR2GRAY)
    bottom2 = cv2.cvtColor(img2[-region_height:, :w, :], cv2.COLOR_BGR2GRAY)
    
    if bottom1.shape == bottom2.shape:
        correlation = cv2.matchTemplate(bottom1, bottom2, cv2.TM_CCOEFF_NORMED)
        if correlation[0][0] > threshold:
            footer_height = region_height
            print(f"  📌 Detected static footer ({region_height}px, similarity: {correlation[0][0]:.3f})")
    
    return header_height, footer_height


def stitch_two_vertical_with_overlap(top_img: np.ndarray, bottom_img: np.ndarray, remove_header: int = 0, remove_footer: int = 0) -> np.ndarray:
    """
    Vertically stitch two images (top + bottom) by detecting overlapping region.
    Optionally removes static header from bottom image and footer from top image.
    Returns a new stitched BGR image.
    """
    
    # Remove footer from top image if specified
    if remove_footer > 0:
        top_img = top_img[:-remove_footer, :, :]
    
    # Remove header from bottom image if specified
    if remove_header > 0:
        bottom_img = bottom_img[remove_header:, :, :]

    # Use same width region for matching
    top_h, top_w = top_img.shape[:2]
    bottom_h, bottom_w = bottom_img.shape[:2]
    w = min(top_w, bottom_w)

    top = top_img[:, :w, :]
    bottom = bottom_img[:, :w, :]

    # Convert to grayscale
    top_gray = cv2.cvtColor(top, cv2.COLOR_BGR2GRAY)
    bottom_gray = cv2.cvtColor(bottom, cv2.COLOR_BGR2GRAY)

    # Patch height from the TOP of the bottom image
    patch_h = min(int(bottom_h * 0.4), 300, top_h)
    if patch_h < 10:
        # Fallback: just stack
        return np.vstack((top_img, bottom_img))

    patch = bottom_gray[:patch_h, :]  # strip at the top of bottom image

    # Search region: bottom part of top image
    search_start = max(0, top_h - 2 * patch_h)
    search_roi = top_gray[search_start:, :]

    # Template matching
    result = cv2.matchTemplate(search_roi, patch, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, max_loc = cv2.minMaxLoc(result)

    best_y_in_top = search_start + max_loc[1]  # y coordinate in full top image
    overlap = top_h - best_y_in_top  # how many rows overlap

    # Validate overlap
    if overlap <= 0 or overlap > min(top_h, bottom_h):
        print("⚠️ No reliable overlap found, stacking naively.")
        return np.vstack((top_img, bottom_img))
    
    print(f"  📐 Overlap detected: {overlap}px")

    # Build stitched image (keep full widths)
    stitched_w = max(top_w, bottom_w)
    stitched_h = top_h + (bottom_h - overlap)

    stitched = np.zeros((stitched_h, stitched_w, 3), dtype=np.uint8)

    # Place top image at y=0
    stitched[0:top_h, 0:top_w, :] = top_img

    # Place bottom image starting at (top_h - overlap)
    y_bottom_start = top_h - overlap
    stitched[y_bottom_start:y_bottom_start + bottom_h, 0:bottom_w, :] = bottom_img

    return stitched


def stitch_directory_vertical(input_dir: str, output_path: str):
    # Collect images
    files = sorted([
        os.path.join(input_dir, f)
        for f in os.listdir(input_dir)
        if f.lower().endswith((".png", ".jpg", ".jpeg"))
    ])

    if not files:
        raise ValueError(f"No images found in folder: {input_dir}")

    print(f"📸 Found {len(files)} images:")
    for f in files:
        print("  •", f)

    # Load first two images to detect static header/footer
    current = load_as_cv2(files[0])
    
    header_height = 0
    footer_height = 0
    
    if len(files) > 1:
        second = load_as_cv2(files[1])
        header_height, footer_height = detect_static_header_footer(current, second)
        print(f"\n📋 Static regions to remove - Header: {header_height}px, Footer: {footer_height}px\n")

    # Iteratively stitch all others below it
    for path in files[1:]:
        print("🔗 Stitching:", path)
        nxt = load_as_cv2(path)
        current = stitch_two_vertical_with_overlap(current, nxt, remove_header=header_height, remove_footer=footer_height)

    # Save final result
    stitched_rgb = cv2.cvtColor(current, cv2.COLOR_BGR2RGB)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    Image.fromarray(stitched_rgb).save(output_path)
    print(f"\n✅ Saved stitched image → {output_path}")


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


def combine_vertical(input_dir: str = "output/screenshots/overlap", output_path: str = "output/result/final_pmi.png"):
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
    
    # Save 2x resized version
    new_width = pil_image.width * 2
    new_height = pil_image.height * 2
    pil_image_2x = pil_image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    output_2x_path = output_path.replace(".png", "_2x.png")
    pil_image_2x.save(output_2x_path)
    print(f"✅ Saved 2x image → {output_2x_path} ({new_width}x{new_height})")


def process_overlap_iterative(input_dir: str = "output/screenshots/top-slice", output_dir: str = "output/screenshots/overlap"):
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
    import shutil
    
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


if __name__ == "__main__":
    # Step 1: Extract and save cropped images (crop header and left)
    header_height, left_width = extract_and_save_cropped(INPUT_DIR)
    
    print("\n" + "="*50 + "\n")
    
    # Step 2: Process overlaps iteratively
    process_overlap_iterative()
    
    # Step 3: Combine all overlap images vertically
    combine_vertical()

