#!/usr/bin/env bash
# ------------------------------------------------------------------
# Brand logo pipeline (ImageMagick)
# Converts the source logo (white-on-black JPG) into:
#   1. public/images/logo.png  — transparent, trimmed, 1024² — used by
#      components/Logo.tsx inside the premium circular frame
#   2. app/icon.png            — 512² favicon on the brand dark color
#      (replaces the placeholder app/icon.svg — deleted automatically)
#
# Usage:  bash scripts/process-logo.sh [path-to-source-logo]
# ------------------------------------------------------------------
set -euo pipefail

SRC="${1:-/home/user/uploads/IMG_20260801_173134_383.jpg}"

if [ ! -f "$SRC" ]; then
  echo "✗ Source logo not found: $SRC"
  echo "  Pass the path:  bash scripts/process-logo.sh /path/to/logo.jpg"
  exit 1
fi

# 1 — trim black border, cut black background to transparency, normalize
convert "$SRC" -auto-level -trim +repage \
  -fuzz 14% -transparent black \
  -resize 1024x1024 \
  -gravity center -background none -extent 1024x1024 \
  public/images/logo.png
echo "✓ public/images/logo.png"

# 2 — favicon on brand background
convert public/images/logo.png -background '#030503' -flatten -resize 512x512 app/icon.png
rm -f app/icon.svg
echo "✓ app/icon.png (app/icon.svg removed)"

echo "Done — run: npm run build"
