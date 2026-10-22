#!/usr/bin/env python3
"""Reproduce CI-based sharing cards/icons; never redraw the source mark."""
import base64
import hashlib
import io
import json
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
SOURCE = PUBLIC / 'brand/lucete-profile.png'
SOURCE_HASH = '5d6dc81b64c07161b1c418f26939a6ed35311235a3fefed2a849030c7ccf51ed'
SCALE = 2
BACKGROUND = '#F5F6F1'
INK = '#25364C'
SECONDARY = '#52627A'
BLUE = '#496587'
YELLOW = '#E6CD72'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def font(weight, size):
    face = TTFont(PUBLIC / f'fonts/hangyeol/Pretendard-{weight}.woff2')
    face.flavor = None
    output = io.BytesIO()
    face.save(output)
    output.seek(0)
    return ImageFont.truetype(output, size * SCALE)


def card(logo, height):
    image = Image.new('RGB', (1200 * SCALE, height * SCALE), BACKGROUND)
    draw = ImageDraw.Draw(image)
    sy = height / 630
    draw.rectangle((0, 0, 1200 * SCALE, 6 * SCALE), fill=BLUE)
    draw.rectangle((0, (height - 4) * SCALE, 1200 * SCALE, height * SCALE), fill=YELLOW)
    logo_size = round(220 * SCALE * sy)
    resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    logo_xy = ((image.width - logo_size) // 2, round(99 * SCALE * sy))
    image.paste(resized, logo_xy, resized)
    boxes = []
    for text, top, size, weight, fill in [
        ('영통영덕성당 청년회', 48, 23, 'Medium', SECONDARY),
        ('2026 루체테', 351, 45, 'SemiBold', INK),
        ('성지순례 퀴즈', 411, 68, 'Bold', INK),
        ('남양성모성지', 520, 28, 'Medium', SECONDARY),
    ]:
        face = font(weight, round(size * sy))
        xy = (600 * SCALE, round(top * SCALE * sy))
        box = draw.textbbox(xy, text, font=face, anchor='mt')
        assert box[0] >= 285 * SCALE and box[2] <= 915 * SCALE, (text, box)
        assert box[1] >= 24 * SCALE and box[3] <= (height - 28) * SCALE, (text, box)
        draw.text(xy, text, font=face, anchor='mt', fill=fill)
        boxes.append({'text': text, 'bbox': [round(value / SCALE, 2) for value in box]})
    return image.resize((1200, height), Image.Resampling.LANCZOS), {
        'text': boxes,
        'logo_bbox': [round(logo_xy[0] / SCALE), round(logo_xy[1] / SCALE), round((logo_xy[0] + logo_size) / SCALE), round((logo_xy[1] + logo_size) / SCALE)],
        'center_square_safe': True,
    }


def icon(logo, size, opaque=False):
    image = Image.new('RGBA', (size, size), 'white' if opaque else (0, 0, 0, 0))
    inset = max(1, round(size * (0.08 if opaque else 0.025)))
    side = size - inset * 2
    resized = logo.resize((side, side), Image.Resampling.LANCZOS)
    image.alpha_composite(resized, (inset, inset))
    return image


def main():
    assert sha(SOURCE.read_bytes()) == SOURCE_HASH, 'Source CI changed; review before rendering'
    logo = Image.open(SOURCE).convert('RGBA')
    corner = logo.getpixel((0, 0))
    assert logo.size == (565, 565) and isinstance(corner, tuple) and corner[3] == 0
    social = PUBLIC / 'social'
    icons = PUBLIC / 'icons'
    social.mkdir(exist_ok=True)
    icons.mkdir(exist_ok=True)
    paths = []
    layout = {}
    for name, height in [('og', 630), ('twitter', 600)]:
        image, layout[name] = card(logo, height)
        jpg = social / f'lucete-pilgrimage-2026-{name}-v1.jpg'
        image.save(jpg, quality=92, subsampling=0, optimize=True, progressive=True)
        paths.append(jpg)
        if name == 'og':
            png = jpg.with_suffix('.png')
            image.save(png, optimize=True)
            paths.append(png)
    for size, name, opaque in [
        (32, 'favicon-32.png', False),
        (180, 'apple-touch-icon.png', True),
        (192, 'icon-192.png', True),
        (512, 'icon-512.png', True),
    ]:
        path = icons / name
        icon(logo, size, opaque).save(path, optimize=True)
        paths.append(path)
    ico = PUBLIC / 'favicon.ico'
    icon(logo, 64).save(ico, sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    paths.append(ico)
    favicon_png = base64.b64encode((icons / 'favicon-32.png').read_bytes()).decode()
    svg = PUBLIC / 'favicon.svg'
    svg.write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><image width="32" height="32" href="data:image/png;base64,' + favicon_png + '"/></svg>\n')
    paths.append(svg)
    assets = []
    for path in paths:
        data = path.read_bytes()
        entry = {'path': '/' + path.relative_to(PUBLIC).as_posix(), 'bytes': len(data), 'sha256': sha(data)}
        if path.suffix not in ('.svg', '.ico'):
            with Image.open(path) as image:
                image.verify()
            with Image.open(path) as image:
                entry.update(width=image.width, height=image.height, mode=image.mode)
        assets.append(entry)
    manifest = {
        'version': 1,
        'source': {'path': '/brand/lucete-profile.png', 'sha256': SOURCE_HASH, 'is_vector_master': False, 'treatment': 'Original CI resized with aspect ratio/colors intact and composited; no redraw, recolor or replacement lettering.'},
        'renderer': 'scripts/render-share-assets.py',
        'font': 'Local Pretendard; original WOFF2 files and SIL OFL notice unchanged. TTF conversion is in memory only.',
        'layout': layout,
        'assets': assets,
    }
    (social / 'assets-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'assets': assets, 'source_unchanged': sha(SOURCE.read_bytes()) == SOURCE_HASH}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
