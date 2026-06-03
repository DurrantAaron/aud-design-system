#!/usr/bin/env python3
"""Fetch and self-host the AuD brand fonts (latin woff2 subsets) from Google Fonts.

All four families are SIL OFL licensed, so self-hosting is permitted. We pull the
`latin` subset only (these apps are English/AU) to keep the payload small. Output
lands in ../fonts/ as <slug>-<weight>.woff2.
"""
import os
import re
import sys
import urllib.request

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

# (Google Fonts family, output slug, [weights], use_wght_axis)
FAMILIES = [
    ("Bebas Neue", "bebas-neue", [400], False),
    ("Barlow", "barlow", [400, 500, 600, 700], True),
    ("Barlow Condensed", "barlow-condensed", [300, 400, 600], True),
    ("Share Tech Mono", "share-tech-mono", [400], False),
]

FONTS_DIR = os.path.join(os.path.dirname(__file__), "..", "fonts")


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8")


def download(url: str, dest: str) -> int:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    with open(dest, "wb") as f:
        f.write(data)
    return len(data)


def latin_url(css: str) -> str:
    """Pick the woff2 url from the `/* latin */` block (not latin-ext)."""
    blocks = re.split(r"/\*\s*", css)
    chosen = None
    for b in blocks:
        m = re.match(r"([a-z0-9-]+)\s*\*/", b)
        if not m:
            continue
        subset = m.group(1)
        url_m = re.search(r"src:\s*url\((https://[^)]+\.woff2)\)", b)
        if not url_m:
            continue
        if subset == "latin":
            return url_m.group(1)
        if chosen is None:
            chosen = url_m.group(1)  # fallback to first available
    return chosen


def main() -> int:
    os.makedirs(FONTS_DIR, exist_ok=True)
    ok = True
    for family, slug, weights, axis in FAMILIES:
        fam_q = family.replace(" ", "+")
        for w in weights:
            if axis:
                api = f"https://fonts.googleapis.com/css2?family={fam_q}:wght@{w}&display=swap"
            else:
                api = f"https://fonts.googleapis.com/css2?family={fam_q}&display=swap"
            try:
                css = fetch(api)
            except Exception as e:
                print(f"FAIL css  {family} {w}: {e}")
                ok = False
                continue
            url = latin_url(css)
            if not url:
                print(f"FAIL parse {family} {w}: no woff2 url found")
                ok = False
                continue
            dest = os.path.join(FONTS_DIR, f"{slug}-{w}.woff2")
            try:
                size = download(url, dest)
            except Exception as e:
                print(f"FAIL dl   {family} {w}: {e}")
                ok = False
                continue
            print(f"OK   {slug}-{w}.woff2  {size:>6} bytes")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
