from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "images" / "source"
OUTPUT = ROOT / "assets" / "images" / "optimized"
OUTPUT.mkdir(parents=True, exist_ok=True)


def save_variant(image: Image.Image, path: Path, width: int) -> None:
    if image.width > width:
        height = round(image.height * width / image.width)
        resized = image.resize((width, height), Image.Resampling.LANCZOS)
    else:
        resized = image.copy()

    resized.save(path.with_suffix(".jpg"), "JPEG", quality=84, optimize=True, progressive=True)
    resized.save(path.with_suffix(".webp"), "WEBP", quality=80, method=6)
    resized.save(path.with_suffix(".avif"), "AVIF", quality=62)


for source_path in sorted(SOURCE.glob("*")):
    if source_path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        continue

    with Image.open(source_path) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        widths = [min(960, image.width)]
        if image.width > 960:
            widths.append(min(1600, image.width))

        for width in sorted(set(widths)):
            suffix = "-wide" if width > 960 else ""
            save_variant(image, OUTPUT / f"{source_path.stem}{suffix}", width)

print(f"Optimized {len(list(SOURCE.glob('*')))} source images into {OUTPUT}")
