import os
import sys
from PIL import Image

def generate_hero_thumbs():
    slides = [
        '0006s_0000_Arte-UU-horizontal-C.webp',
        'Alba-4.webp',
        '0002s_0000_Ciao-UU-horizontal-C.webp',
        'colo-v.webp',
        '0003s_0002_Bora-horizontal-A.webp',
        'mira-x3-2-1.webp',
        'corso3.webp',
        'Spazio-R-2M-2.webp'
    ]

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    migrated_dir = os.path.join(base_dir, 'public', 'assets', 'migrated')
    out_dir = os.path.join(migrated_dir, 'thumbs')

    os.makedirs(out_dir, exist_ok=True)

    for name in slides:
        in_path = os.path.join(migrated_dir, name)
        out_path = os.path.join(out_dir, name)

        if not os.path.exists(in_path):
            continue

        try:
            with Image.open(in_path) as img:
                img_ratio = img.width / img.height
                target_ratio = 1.0
                if img_ratio > target_ratio:
                    new_width = int(img.height * target_ratio)
                    left = (img.width - new_width) // 2
                    img_cropped = img.crop((left, 0, left + new_width, img.height))
                else:
                    new_height = int(img.width / target_ratio)
                    top = (img.height - new_height) // 2
                    img_cropped = img.crop((0, top, img.width, top + new_height))

                resized = img_cropped.resize((120, 120), Image.Resampling.LANCZOS)
                resized.save(out_path, 'WEBP', quality=85)
                print(f'Generated hero thumbnail: {out_path} ({os.path.getsize(out_path)} bytes)')
        except Exception as e:
            print(f'Error processing {name}: {e}', file=sys.stderr)

if __name__ == '__main__':
    generate_hero_thumbs()
