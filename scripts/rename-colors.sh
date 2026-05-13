#!/bin/bash
# Targeted rename of color-name Tailwind classes to functional names.
# Only replaces when preceded by a Tailwind utility prefix or used as a CSS variable name.

find app -name '*.tsx' -not -path '*/.react-router/*' | while read -r file; do
  # Order matters: longer names first to avoid partial matches
  sed -i '' \
    -e 's/\(bg-\)forest-light/\1brand-light/g' \
    -e 's/\(bg-\)forest-dark/\1brand-dark/g' \
    -e 's/\(bg-\)forest/\1brand/g' \
    -e 's/\(bg-\)sage-light/\1accent-light/g' \
    -e 's/\(bg-\)sage/\1accent/g' \
    -e 's/\(bg-\)cream-dark/\1surface-dark/g' \
    -e 's/\(bg-\)cream/\1surface/g' \
    -e 's/\(bg-\)blush-deep/\1highlight-deep/g' \
    -e 's/\(bg-\)blush/\1highlight/g' \
    -e 's/\(bg-\)sand/\1surface/g' \
    -e 's/\(bg-\)off-white/\1surface-alt/g' \
    -e 's/\(text-\)forest-light/\1brand-light/g' \
    -e 's/\(text-\)forest-dark/\1brand-dark/g' \
    -e 's/\(text-\)forest/\1brand/g' \
    -e 's/\(text-\)sage-light/\1accent-light/g' \
    -e 's/\(text-\)sage/\1accent/g' \
    -e 's/\(text-\)cream/\1surface/g' \
    -e 's/\(text-\)blush/\1highlight/g' \
    -e 's/\(text-\)off-white/\1surface-alt/g' \
    -e 's/\(border-\)forest-light/\1brand-light/g' \
    -e 's/\(border-\)forest-dark/\1brand-dark/g' \
    -e 's/\(border-\)forest/\1brand/g' \
    -e 's/\(border-\)sage-light/\1accent-light/g' \
    -e 's/\(border-\)sage/\1accent/g' \
    -e 's/\(border-\)cream-dark/\1surface-dark/g' \
    -e 's/\(border-\)cream/\1surface/g' \
    -e 's/\(ring-\)forest/\1brand/g' \
    -e 's/\(ring-\)sage-light/\1accent-light/g' \
    -e 's/\(ring-\)sage/\1accent/g' \
    -e 's/\(ring-\)cream/\1surface/g' \
    -e 's/\(ring-offset-\)forest/\1brand/g' \
    -e 's/\(ring-offset-\)sage/\1accent/g' \
    -e 's/\(from-\)forest/\1brand/g' \
    -e 's/\(from-\)sage/\1accent/g' \
    -e 's/\(to-\)forest/\1brand/g' \
    -e 's/\(to-\)sage/\1accent/g' \
    -e 's/\(divide-\)sage/\1accent/g' \
    -e 's/\(gradient-to-l from-\)forest/\1brand/g' \
    "$file"
done

echo "Done."
