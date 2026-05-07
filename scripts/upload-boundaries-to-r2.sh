#!/bin/bash
# Upload the UK care board boundaries TopoJSON to R2.
# Usage:
#   Local:  ./scripts/upload-boundaries-to-r2.sh --local
#   Remote: ./scripts/upload-boundaries-to-r2.sh

set -euo pipefail

FILE="uk-care-board-boundaries.topojson"
R2_KEY="geodata/uk-care-board-boundaries.topojson"
BUCKET="fertilityfund"

if [ ! -f "$FILE" ]; then
  echo "Error: $FILE not found."
  echo "If you have the file elsewhere, update the FILE variable."
  exit 1
fi

if [[ "${1:-}" == "--local" ]]; then
  echo "Uploading to local R2 emulator..."
  npx wrangler r2 object put "$BUCKET/$R2_KEY" --file="$FILE" --content-type="application/json" --local
else
  echo "Uploading to remote R2..."
  npx wrangler r2 object put "$BUCKET/$R2_KEY" --file="$FILE" --content-type="application/json"
fi

echo "✓ Uploaded $FILE → r2://$BUCKET/$R2_KEY"
