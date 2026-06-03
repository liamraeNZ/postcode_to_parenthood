"""
Scrape policy document URLs from the PET NHS Fertility Funding Tracker.
Each ICB page at progress.org.uk has a "Full policy" link pointing to the
actual PDF/document on the ICB's own website.

Usage:
  python3 scripts/scrape-policy-urls.py

Appends results to urls.txt in the project root.
"""

import re
import time
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.progress.org.uk/fertility-policy-tracker"

# ICB slugs as they appear on progress.org.uk
# These are the remaining ICBs after "NHS Hampshire and Isle of Wight"
# (alphabetical order as listed on the tracker)
ICB_SLUGS = [
    "nhs-herefordshire-and-worcestershire",
    "nhs-hertfordshire-and-west-essex",
    "nhs-humber-and-north-yorkshire",
    "nhs-kent-and-medway",
    "nhs-lancashire-and-south-cumbria",
    "nhs-leicester-leicestershire-and-rutland",
    "nhs-lincolnshire",
    "nhs-mid-and-south-essex",
    "nhs-norfolk-and-waveney",
    "nhs-north-central-london",
    "nhs-north-east-and-north-cumbria",
    "nhs-north-east-london",
    "nhs-north-west-london",
    "nhs-northamptonshire",
    "nhs-nottingham-and-nottinghamshire",
    "nhs-shropshire-telford-and-wrekin",
    "nhs-somerset",
    "nhs-south-east-london",
    "nhs-south-west-london",
    "nhs-south-yorkshire",
    "nhs-staffordshire-and-stoke-on-trent",
    "nhs-suffolk-and-north-east-essex",
    "nhs-surrey-heartlands",
    "nhs-sussex",
    "nhs-west-yorkshire",
]

OUTPUT_FILE = "urls.txt"


def get_policy_url(slug: str) -> str | None:
    """Fetch an ICB page and extract the 'Full policy' link."""
    url = f"{BASE_URL}/{slug}/"
    try:
        resp = requests.get(url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        })
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERROR fetching {url}: {e}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")

    # Look for a link with text "Full policy"
    link = soup.find("a", string=re.compile(r"full\s*policy", re.IGNORECASE))
    if link and link.get("href"):
        return link["href"]

    # Fallback: look for links near the "See full policy" text
    for text_node in soup.find_all(string=re.compile(r"See full policy", re.IGNORECASE)):
        parent = text_node.find_parent()
        if parent:
            nearby_link = parent.find("a", href=True)
            if nearby_link:
                return nearby_link["href"]

    print(f"  WARNING: No 'Full policy' link found on {url}")
    return None


def main():
    print(f"Scraping {len(ICB_SLUGS)} ICB pages from progress.org.uk...")
    print(f"Results will be appended to {OUTPUT_FILE}\n")

    results: list[tuple[str, str]] = []

    for slug in ICB_SLUGS:
        print(f"  {slug}...", end=" ", flush=True)
        policy_url = get_policy_url(slug)
        if policy_url:
            results.append((slug, policy_url))
            print(f"✓ {policy_url}")
        else:
            print("✗ not found")
        # Be polite
        time.sleep(1.5)

    # Append to urls.txt
    with open(OUTPUT_FILE, "a") as f:
        for slug, url in results:
            f.write(f"{url}\n")

    print(f"\nDone. {len(results)}/{len(ICB_SLUGS)} URLs found and appended to {OUTPUT_FILE}")

    if len(results) < len(ICB_SLUGS):
        missing = [s for s in ICB_SLUGS if s not in [r[0] for r in results]]
        print(f"\nMissing ({len(missing)}):")
        for s in missing:
            print(f"  - {s}")


if __name__ == "__main__":
    main()
