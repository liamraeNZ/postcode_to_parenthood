#!/usr/bin/env python3
"""
Combine England ICB boundaries (from existing TopoJSON) with Scotland, Wales,
and Northern Ireland GeoJSON files into a single UK-wide TopoJSON file.

Normalises all features to use unified property names:
  - board_cd: the board code matching our health_boards.id column
  - board_nm: the board name

Source of truth for codes:
  - Scotland: 2021 HB codes (S08000015–S08000032) — GeoJSON has older codes, mapped here
  - Wales: ONS LHB23CD codes from GeoJSON (W11000023–W11000031) — these ARE the DB codes
  - NI: N09 codes in DB — GeoJSON uses abbreviations (BHSCT etc.), mapped here
"""

import json
import subprocess
import sys
from pathlib import Path

# --- Scotland: map old GeoJSON codes to current 2021 codes ---
# GeoJSON uses S08000001-S08000014 (pre-2014), DB uses S08000015-S08000032 (2021)
SCOTLAND_GEOJSON_TO_DB = {
    "S08000001": "S08000015",  # Ayrshire and Arran
    "S08000002": "S08000016",  # Borders
    "S08000003": "S08000017",  # Dumfries and Galloway
    "S08000004": "S08000029",  # Fife (2021 code)
    "S08000005": "S08000019",  # Forth Valley
    "S08000006": "S08000020",  # Grampian
    "S08000007": "S08000031",  # Greater Glasgow and Clyde
    "S08000008": "S08000022",  # Highland
    "S08000009": "S08000032",  # Lanarkshire
    "S08000010": "S08000024",  # Lothian
    "S08000011": "S08000025",  # Orkney
    "S08000012": "S08000026",  # Shetland
    "S08000013": "S08000030",  # Tayside (2021 code)
    "S08000014": "S08000028",  # Western Isles
}

# --- Wales: GeoJSON codes ARE the official ONS codes, use directly ---
# No mapping needed — GeoJSON LHB23CD codes match what we'll use in the DB

# --- NI: map GeoJSON abbreviations to N09 codes ---
NI_GEOJSON_TO_DB = {
    "BHSCT": "N09000003",   # Belfast
    "NHSCT": "N09000004",   # Northern
    "SEHSCT": "N09000005",  # South Eastern
    "SHSCT": "N09000006",   # Southern
    "WHSCT": "N09000007",   # Western
}

# Board names for display
BOARD_NAMES = {
    # Scotland (2021 codes)
    "S08000015": "NHS Ayrshire and Arran",
    "S08000016": "NHS Borders",
    "S08000017": "NHS Dumfries and Galloway",
    "S08000029": "NHS Fife",
    "S08000019": "NHS Forth Valley",
    "S08000020": "NHS Grampian",
    "S08000031": "NHS Greater Glasgow and Clyde",
    "S08000022": "NHS Highland",
    "S08000032": "NHS Lanarkshire",
    "S08000024": "NHS Lothian",
    "S08000025": "NHS Orkney",
    "S08000026": "NHS Shetland",
    "S08000030": "NHS Tayside",
    "S08000028": "NHS Western Isles",
    # Wales (ONS LHB23CD codes)
    "W11000023": "Betsi Cadwaladr University Health Board",
    "W11000024": "Powys Teaching Health Board",
    "W11000025": "Hywel Dda University Health Board",
    "W11000028": "Aneurin Bevan University Health Board",
    "W11000029": "Cardiff and Vale University Health Board",
    "W11000030": "Cwm Taf Morgannwg University Health Board",
    "W11000031": "Swansea Bay University Health Board",
    # Northern Ireland (N09 codes)
    "N09000003": "Belfast Health and Social Care Trust",
    "N09000004": "Northern Health and Social Care Trust",
    "N09000005": "South Eastern Health and Social Care Trust",
    "N09000006": "Southern Health and Social Care Trust",
    "N09000007": "Western Health and Social Care Trust",
}


def normalize_scotland():
    """Load Scotland GeoJSON and map old codes to current 2021 codes."""
    with open("public/geojson/Healthcare_NHS_Health_Boards__Scotland__-7934748834827795620.geojson", "r") as f:
        data = json.load(f)

    features = []
    for feat in data["features"]:
        old_code = feat["properties"]["h06_se_cod"]
        db_code = SCOTLAND_GEOJSON_TO_DB.get(old_code)
        if not db_code:
            print(f"  WARNING: Unknown Scotland code {old_code}, skipping")
            continue

        feat["properties"] = {
            "board_cd": db_code,
            "board_nm": BOARD_NAMES[db_code],
        }
        features.append(feat)

    print(f"  Scotland: {len(features)} features")
    return features


def normalize_wales():
    """Load Wales GeoJSON. Codes are already the official ONS LHB23CD codes."""
    with open("public/geojson/Local_Health_Boards_December_2023_WA_BUC_6316072156263394611.geojson", "r") as f:
        data = json.load(f)

    features = []
    for feat in data["features"]:
        code = feat["properties"]["LHB23CD"]
        name = BOARD_NAMES.get(code, feat["properties"]["LHB23NM"])

        feat["properties"] = {
            "board_cd": code,
            "board_nm": name,
        }
        features.append(feat)

    print(f"  Wales: {len(features)} features")
    return features


def normalize_ni():
    """Load NI GeoJSON and map abbreviations to N09 codes."""
    with open("public/geojson/trustboundaries.geojson", "r") as f:
        data = json.load(f)

    features = []
    for feat in data["features"]:
        abbrev = feat["properties"]["TrustCode"]
        db_code = NI_GEOJSON_TO_DB.get(abbrev)
        if not db_code:
            print(f"  WARNING: Unknown NI code {abbrev}, skipping")
            continue

        feat["properties"] = {
            "board_cd": db_code,
            "board_nm": BOARD_NAMES[db_code],
        }
        features.append(feat)

    print(f"  NI: {len(features)} features")
    return features


def normalize_england():
    """
    Extract England features from existing TopoJSON via Node.js topojson-client,
    then normalize properties to board_cd/board_nm.
    """
    result = subprocess.run(
        ["node", "-e", """
const fs = require('fs');
const topojson = require('topojson-client');
const topo = JSON.parse(fs.readFileSync('public/data/icb-boundaries.topojson', 'utf8'));
const objectKey = Object.keys(topo.objects)[0];
const fc = topojson.feature(topo, topo.objects[objectKey]);
process.stdout.write(JSON.stringify(fc));
"""],
        capture_output=True, text=True
    )

    if result.returncode != 0:
        print(f"  ERROR converting England TopoJSON: {result.stderr}")
        sys.exit(1)

    data = json.loads(result.stdout)

    features = []
    for feat in data["features"]:
        props = feat["properties"]
        ons_code = props.get("icb23cd") or props.get("ICB23CD") or ""
        icb_name = props.get("icb23nm") or props.get("ICB23NM") or "Unknown"

        # For England, keep the ONS code as board_cd (the ons-to-board-code.json handles
        # the translation to ODS codes used as DB primary keys)
        feat["properties"] = {
            "board_cd": ons_code,
            "board_nm": icb_name,
        }
        features.append(feat)

    print(f"  England: {len(features)} features")
    return features


def main():
    print("Building UK-wide care board boundaries TopoJSON...\n")

    print("Normalizing features...")
    england_features = normalize_england()
    scotland_features = normalize_scotland()
    wales_features = normalize_wales()
    ni_features = normalize_ni()

    all_features = england_features + scotland_features + wales_features + ni_features
    combined_geojson = {
        "type": "FeatureCollection",
        "features": all_features,
    }

    total = len(all_features)
    print(f"\nTotal features: {total} (England: {len(england_features)}, Scotland: {len(scotland_features)}, Wales: {len(wales_features)}, NI: {len(ni_features)})")

    # Write combined GeoJSON temporarily
    temp_geojson = "public/data/_tmp_uk_boards.geojson"
    with open(temp_geojson, "w") as f:
        json.dump(combined_geojson, f)

    # Convert to TopoJSON using geo2topo
    output_topojson = "public/data/uk-care-board-boundaries.topojson"
    print(f"\nConverting to TopoJSON...")
    result = subprocess.run(
        ["npx", "geo2topo", f"boards={temp_geojson}", "-o", output_topojson, "-q", "1e5"],
        capture_output=True, text=True
    )

    if result.returncode != 0:
        print(f"  geo2topo with quantization failed, trying without: {result.stderr}")
        result = subprocess.run(
            ["npx", "geo2topo", f"boards={temp_geojson}", "-o", output_topojson],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            print(f"  ERROR: {result.stderr}")
            sys.exit(1)

    # Clean up temp file
    Path(temp_geojson).unlink(missing_ok=True)

    # Verify output
    with open(output_topojson, "r") as f:
        topo = json.load(f)

    obj_key = list(topo["objects"].keys())[0]
    num_geoms = len(topo["objects"][obj_key]["geometries"])
    file_size = Path(output_topojson).stat().st_size

    print(f"\n✓ Written: {output_topojson}")
    print(f"  Object key: '{obj_key}'")
    print(f"  Geometries: {num_geoms}")
    print(f"  File size: {file_size / 1024 / 1024:.2f} MB")

    if num_geoms != total:
        print(f"  WARNING: Expected {total} geometries but got {num_geoms}")


if __name__ == "__main__":
    main()
