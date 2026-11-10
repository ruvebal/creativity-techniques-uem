#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd -- "$script_dir/.." && pwd)"
icon_dir="$repo_root/docs/assets/icons"
source_svg="$icon_dir/favicon.svg"

if [[ -f "$icon_dir/fava-mark-static.svg" ]]; then
	source_svg="$icon_dir/fava-mark-static.svg"
fi

if ! command -v magick >/dev/null 2>&1; then
	echo "ImageMagick 7 (magick) is required to build the favicon family." >&2
	exit 1
fi

render_icon() {
	local size="$1"
	local output="$2"
	magick -background none "$source_svg" -resize "${size}x${size}" -gravity center -extent "${size}x${size}" "$output"
}

render_icon 16 "$icon_dir/favicon-16x16.png"
render_icon 32 "$icon_dir/favicon-32x32.png"
render_icon 48 "$icon_dir/favicon-48x48.png"
render_icon 180 "$icon_dir/apple-touch-icon.png"
render_icon 192 "$icon_dir/icon-192.png"
render_icon 512 "$icon_dir/icon-512.png"
magick "$icon_dir/favicon-16x16.png" "$icon_dir/favicon-32x32.png" "$icon_dir/favicon-48x48.png" "$icon_dir/favicon.ico"

echo "Built SVG-derived favicon family in $icon_dir"

