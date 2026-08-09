import os
import glob
from PIL import Image, ImageChops

MIGRATED_DIR = '/Users/leninaviles/Projects/Aceray/public/assets/migrated'

def autocrop_image(filepath, threshold=245):
    try:
        im = Image.open(filepath)
        format_type = im.format or 'WEBP'
        
        # Convert to RGB to analyze background color difference
        rgb_im = im.convert('RGB')
        bg = Image.new('RGB', im.size, (255, 255, 255))
        diff = ImageChops.difference(rgb_im, bg)
        
        # Mask pixels that are near white (all channels > threshold)
        # We find bounding box of pixels that differ from pure white
        bbox = diff.getbbox()
        
        if not bbox:
            print(f"Skipping {os.path.basename(filepath)} (completely white or empty)")
            return
            
        w, h = im.size
        left, top, right, bottom = bbox
        
        # Calculate how many pixels were cropped
        cropped_w = right - left
        cropped_h = bottom - top
        
        # Only crop if there is actual white margin (at least 5px difference on any edge)
        if left > 5 or top > 5 or (w - right) > 5 or (h - bottom) > 5:
            print(f"Cropping {os.path.basename(filepath)}: original ({w}x{h}) -> bbox ({cropped_w}x{cropped_h}) [margins: L:{left}, T:{top}, R:{w-right}, B:{h-bottom}]")
            
            # Add tiny 2px padding buffer if needed so content isn't hard-cut
            pad = 2
            left_p = max(0, left - pad)
            top_p = max(0, top - pad)
            right_p = min(w, right + pad)
            bottom_p = min(h, bottom + pad)
            
            cropped = im.crop((left_p, top_p, right_p, bottom_p))
            
            # Save cropped image back
            if filepath.endswith('.webp'):
                cropped.save(filepath, format='WEBP', quality=85)
            elif filepath.endswith('.jpg') or filepath.endswith('.jpeg'):
                cropped.save(filepath, format='JPEG', quality=85)
            elif filepath.endswith('.png'):
                cropped.save(filepath, format='PNG')
            else:
                cropped.save(filepath)
            print(f"  Successfully cropped and saved {os.path.basename(filepath)}")
        else:
            print(f"No significant white margins in {os.path.basename(filepath)} ({w}x{h})")
            
    except Exception as e:
        print(f"Error processing {os.path.basename(filepath)}: {e}")

def main():
    extensions = ['*.webp', '*.jpg', '*.jpeg', '*.png']
    image_files = []
    for ext in extensions:
        image_files.extend(glob.glob(os.path.join(MIGRATED_DIR, ext)))
        
    print(f"Found {len(image_files)} image files in {MIGRATED_DIR}")
    for filepath in sorted(image_files):
        autocrop_image(filepath)

if __name__ == '__main__':
    main()
