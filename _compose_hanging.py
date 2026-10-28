"""Composite the pewter rococo frame with the Reliquary still. One-shot; delete after."""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(r"c:\Users\rikra\GitProjects\Taikoi")
FRAME_SRC = Path(r"C:\Users\rikra\.cursor\projects\c-Users-rikra-GitProjects-Taikoi\assets\pewter-rococo-chroma.jpg")
STILL_SRC = ROOT / "art" / "22-reliquary.jpg"
FRAME_OUT = ROOT / "art" / "frames" / "pewter-reliquary.png"
HANGING_OUT = ROOT / "art" / "hangings" / "22-reliquary-pewter.png"


def cover_crop(im: Image.Image, tw: int, th: int) -> Image.Image:
    sw, sh = im.size
    scale = max(tw / sw, th / sh)
    nw = max(tw, int(round(sw * scale)))
    nh = max(th, int(round(sh * scale)))
    im2 = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = max(0, int((nh - th) * 0.38))
    if top + th > nh:
        top = nh - th
    return im2.crop((left, top, left + tw, top + th))


def morph(mask: np.ndarray, radius: int, mode: str) -> np.ndarray:
    img = Image.fromarray((mask.astype(np.uint8) * 255), mode="L")
    k = radius * 2 + 1
    img = img.filter(ImageFilter.MinFilter(k) if mode == "erode" else ImageFilter.MaxFilter(k))
    return np.array(img) > 128


def main() -> None:
    frame_rgb = np.array(Image.open(FRAME_SRC).convert("RGB"))
    still = Image.open(STILL_SRC).convert("RGB")
    h, w = frame_rgb.shape[:2]
    r = frame_rgb[:, :, 0].astype(np.int16)
    g = frame_rgb[:, :, 1].astype(np.int16)
    b = frame_rgb[:, :, 2].astype(np.int16)
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    sat = maxc - minc

    magenta = (r > 140) & (g < 90) & (b > 90) & (r > g + 40)
    green = (g > 120) & (g > r + 45) & (g > b + 45)
    metal = (sat < 58) & (maxc > 18) & ~magenta & ~green
    # Drop chroma spill from the silhouette and the sight edge.
    metal = metal & ~morph(magenta, 2, "dilate")
    metal = metal & ~morph(green, 2, "dilate")

    ys, xs = np.where(green)
    x0, x1 = int(xs.min()), int(xs.max()) + 1
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    art = cover_crop(still, x1 - x0, y1 - y0)

    hanging = np.zeros((h, w, 4), dtype=np.uint8)
    hanging[y0:y1, x0:x1, :3] = np.array(art)
    hanging[y0:y1, x0:x1, 3] = 255

    overlay = np.zeros((h, w, 4), dtype=np.uint8)
    overlay[:, :, :3] = frame_rgb
    overlay[:, :, 3] = np.where(metal, 255, 0)

    hanging_img = Image.alpha_composite(Image.fromarray(hanging, "RGBA"), Image.fromarray(overlay, "RGBA"))

    # Soften only the outer silhouette; keep the well opaque.
    alpha = np.array(hanging_img.getchannel("A"))
    feat = np.array(Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(1.1)))
    mixed = np.where(alpha > 240, 255, np.maximum(alpha, feat // 2))
    # Re-punch dilated magenta so the blur cannot restore a pink halo.
    mixed = np.where(morph(magenta, 1, "dilate") & ~metal, 0, mixed)
    hanging_img.putalpha(Image.fromarray(mixed.astype(np.uint8), "L"))

    overlay_img = Image.fromarray(overlay, "RGBA")
    ov_a = np.array(overlay_img.getchannel("A"))
    ov_feat = np.array(Image.fromarray(ov_a, "L").filter(ImageFilter.GaussianBlur(1.0)))
    overlay_img.putalpha(Image.fromarray(np.where(ov_a > 240, 255, ov_feat).astype(np.uint8), "L"))

    FRAME_OUT.parent.mkdir(parents=True, exist_ok=True)
    HANGING_OUT.parent.mkdir(parents=True, exist_ok=True)
    overlay_img.save(FRAME_OUT, "PNG")
    hanging_img.save(HANGING_OUT, "PNG")

    out = np.array(hanging_img)
    rr, gg, bb, aa = [out[:, :, i].astype(np.int16) for i in range(4)]
    leftover_g = (aa > 40) & (gg > 140) & (gg > rr + 50) & (gg > bb + 50)
    leftover_m = (aa > 40) & (rr > 150) & (gg < 80) & (bb > 100)
    print("hanging bytes", HANGING_OUT.stat().st_size)
    print("art window", x0, y0, x1, y1)
    print(
        "insets %",
        {
            "top": round(100 * y0 / h, 1),
            "right": round(100 * (w - x1) / w, 1),
            "bottom": round(100 * (h - y1) / h, 1),
            "left": round(100 * x0 / w, 1),
        },
    )
    print("leftover green", int(leftover_g.sum()), "leftover magenta", int(leftover_m.sum()))
    print("opaque frac", float((aa > 8).mean()))
    print("corners", tuple(out[2, 2]), tuple(out[2, w - 3]), tuple(out[h - 3, 2]))
    print("center", tuple(out[h // 2, w // 2]))
    print("metal frac", float(metal.mean()))


if __name__ == "__main__":
    main()
