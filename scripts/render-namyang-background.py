#!/usr/bin/env python3
"""Offline licensed-photo montage. Requires Pillow and FFmpeg, not app packages."""
import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import shutil
import subprocess

from PIL import Image, ImageDraw, ImageOps

from namyang_crop import subject_crop


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ffmpeg', default=shutil.which('ffmpeg'))
    parser.add_argument('--evidence-dir', required=True, type=Path)
    args = parser.parse_args()
    if not args.ffmpeg:
        parser.error('Provide --ffmpeg or put ffmpeg on PATH')
    media = Path(__file__).resolve().parents[1] / 'public/media'
    manifest = json.loads((media / 'namyang-background.sources.json').read_text())
    sources = []
    for source in manifest['sources']:
        path = media / source['file']
        assert hashlib.sha256(path.read_bytes()).hexdigest() == source['sha256'], path
        with Image.open(path) as image:
            sources.append(ImageOps.exif_transpose(image).convert('RGB'))
    args.evidence_dir.mkdir(parents=True, exist_ok=True)
    width, height, fps, duration = (manifest['width'], manifest['height'], manifest['fps'], manifest['duration_seconds'])
    assert width % 2 == height % 2 == 0 and fps > 0 and duration > 0
    for source, image in zip(manifest['sources'], sources, strict=True):
        assert (image.width, image.height) == (source['width'], source['height']), source['file']
        subject_crop(image.width, image.height, width / height,
                     subject=source['subject_bbox'], focus=source['focal_point'])
    frames = fps * duration
    segment = duration / len(sources)
    target = media / 'namyang-background.mp4'
    temporary = media / 'namyang-background.rendering.mp4'
    cmd = [args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
           '-threads', '2', '-filter_threads', '1', '-f', 'rawvideo',
           '-pix_fmt', 'rgb24', '-s', f'{width}x{height}', '-r', str(fps),
           '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-threads', '2',
           '-preset', 'medium', '-crf', '24', '-pix_fmt', 'yuv420p',
           '-movflags', '+faststart', '-metadata',
           'comment=Edited Namyang shrine photographs; per-source credits and licenses in credits.html',
           str(temporary)]
    sheet = Image.new('RGB', (1280, 780), '#222222')
    draw = ImageDraw.Draw(sheet)
    sample_frames = [0, 120, 168, 264, 312, 408, 456, 575]

    def shot(index, t):
        image = sources[index]
        # Motion never overrides the art-directed subject safety rectangle.
        phase = 2 * math.pi * t / duration + index * .8
        source = manifest['sources'][index]
        box = subject_crop(
            image.width, image.height, width / height,
            zoom=1.012 + .010 * math.sin(phase),
            subject=source.get('subject_bbox'),
            focus=source.get('focal_point', (.5, .5)),
            pan=(.004 * math.sin(phase), .003 * math.cos(phase)))
        return image.resize((width, height), Image.Resampling.BICUBIC, box=box)

    with subprocess.Popen(cmd, stdin=subprocess.PIPE) as process:
        assert process.stdin is not None
        try:
            for number in range(frames):
                t = number / fps
                index = int(t / segment)
                local_t = t % segment
                frame = shot(index, t)
                if local_t >= segment - 1.5:
                    blend = (local_t - (segment - 1.5)) / 1.5
                    blend = blend * blend * (3 - 2 * blend)
                    frame = Image.blend(frame, shot((index + 1) % len(sources), t), blend)
                if number == 0:
                    frame.save(media / 'namyang-poster.webp', quality=88, method=6)
                if number in sample_frames:
                    n = sample_frames.index(number)
                    x, y = (n % 4) * 320, (n // 4) * 390
                    thumb = frame.resize((320, 180), Image.Resampling.LANCZOS)
                    sheet.paste(thumb, (x, y))
                    draw.text((x + 8, y + 187), f'{t:.3f}s / scene {index + 1}', fill='white')
                    frame.save(args.evidence_dir / f'frame-{number:04d}.jpg', quality=90)
                process.stdin.write(frame.tobytes())
            process.stdin.close()
            if process.wait() != 0:
                raise RuntimeError('FFmpeg render failed')
        except BaseException:
            process.kill()
            raise
    temporary.replace(target)
    sheet.crop((0, 0, 1280, 600)).save(args.evidence_dir / 'render-contact.jpg', quality=90)
    hashes = {}
    for path in [target, media / 'namyang-poster.webp']:
        os.chown(path, media.stat().st_uid, media.stat().st_gid)
        hashes[path.name] = {'bytes': path.stat().st_size,
                             'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}
    (args.evidence_dir / 'asset-hashes.json').write_text(json.dumps(hashes, indent=2) + '\n')
    print(json.dumps(hashes, indent=2))


if __name__ == '__main__':
    main()
