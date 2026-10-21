#!/usr/bin/env python3
"""Build multi-size icon.ico for ZORA Reader from the official emblem PNG."""
from PIL import Image, ImageDraw, ImageOps

SRC = "/home/z/my-project/zora-reader/assets/icon.png"
OUT = "/home/z/my-project/zora-reader/assets/icon.ico"
BG = (9, 10, 13, 255)
SIZES = [16, 24, 32, 48, 64, 128, 256]

src = Image.open(SRC).convert("RGBA")
gray = ImageOps.grayscale(src)
bbox = gray.point(lambda p: 255 if p > 24 else 0).getbbox()
if bbox:
    src = src.crop(bbox)

def tile(size):
    corner = max(2, int(size * 0.16))
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=corner, fill=BG)
    margin = int(size * (0.16 if size >= 48 else 0.12))
    inner = size - 2 * margin
    emb = src.copy()
    emb.thumbnail((inner, inner), Image.LANCZOS)
    img.alpha_composite(emb, ((size - emb.width) // 2, (size - emb.height) // 2))
    return img

imgs = [tile(s) for s in SIZES]
imgs[-1].save(OUT, format="ICO", sizes=[(s, s) for s in SIZES], append_images=imgs[:-1])
tile(512).save("/home/z/my-project/zora-reader/assets/icon-512.png")
print("icon.ico + icon-512.png OK")
