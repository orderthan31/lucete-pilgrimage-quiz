"""Subject-safe 16:9 crop geometry for the photo-motion build (no image I/O)."""
import math


def subject_crop(width, height, aspect, zoom=1.0, subject=None, focus=(0.5, 0.5), pan=(0.0, 0.0)):
    """Return a crop containing the ENTIRE approved normalized subject box.

    Zoom is reduced rather than cutting architecture. Portraits whose important
    features cannot fit at all are rejected; select a landscape source instead.
    Focus/pan are preferences, not permission to exclude a cross or facade.
    """
    values = (width, height, aspect, zoom, *focus, *pan)
    if not all(math.isfinite(v) for v in values) or min(width, height, aspect) <= 0 or zoom < 1:
        raise ValueError('Invalid image/crop geometry')
    subject = subject or (0.0, 0.0, 1.0, 1.0)
    if len(subject) != 4 or not all(math.isfinite(v) for v in subject):
        raise ValueError('Subject must contain four finite normalized coordinates')
    left, top, right, bottom = subject
    if not (0 <= left < right <= 1 and 0 <= top < bottom <= 1):
        raise ValueError('Subject must be a valid normalized rectangle')
    left, right = left * width, right * width
    top, bottom = top * height, bottom * height
    max_width = min(width, height * aspect)
    required_width = max(right - left, (bottom - top) * aspect)
    if required_width > max_width + 1e-7:
        raise ValueError('Subject cannot fit 16:9 without being cut; choose a wider photo or narrower approved subject')
    crop_width = max(max_width / zoom, required_width)
    crop_height = crop_width / aspect
    x_min, x_max = max(0.0, right - crop_width), min(width - crop_width, left)
    y_min, y_max = max(0.0, bottom - crop_height), min(height - crop_height, top)
    x = min(max(width * (focus[0] + pan[0]) - crop_width / 2, x_min), x_max)
    y = min(max(height * (focus[1] + pan[1]) - crop_height / 2, y_min), y_max)
    return x, y, x + crop_width, y + crop_height
