# Dear Future: 
# 1: create list of assets from the ASEST_DIR 
# 2: walk the source, skip poison dirs ( like node_modules )
# 3: look at each file that we care about for each of the asssets 
# 4: a full path of file wherein a give asset appears
# 5: print out
# 6: profit!
# 
# Change ASSETS_DIR and SRC_DIR to match your system. 
# Because using full paths you can place this script anywhere on your system 

import os
from pathlib import Path

ASSETS_DIR = Path(r"C:\Users\squar\telos\tsapre.desktop\telos\apps\twe\src\assets")
SRC_DIR = Path(r"C:\Users\squar\telos\tsapre.desktop\telos\apps\twe\src")

asset_files = [p.name for p in ASSETS_DIR.iterdir() if p.is_file()]
refs = {asset: set() for asset in asset_files}
# walk
for root, dirs, files in os.walk(SRC_DIR, topdown=True):
    dirs[:] = [d for d in dirs if d not in ("node_modules", "__test__")]
    for fname in files:
        if Path(fname).suffix in (".ts", ".vue", ".css", ".scss", ".js"):
            fpath = Path(root) / fname
            try:
                text = fpath.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue

            for asset in asset_files:
                if asset in text:
                    refs[asset].add(str(fpath))

# print
for asset, paths in sorted(refs.items(), key=lambda kv: len(kv[1]), reverse=True):
    print(f"\nAsset: {asset} found in {len(paths)} file(s):")
    for p in sorted(paths):
        print(f"  {p}")