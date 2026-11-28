#!/usr/bin/env python3
"""check_products.py - Validate and clean product catalog.

Checks:
- Only SKUs listed in ODS files are valid
- Removes unauthorized SKUs with underscore+number pattern
- Removes products whose SKU is not in any ODS file
- Deduplicates products (keeps first occurrence per SKU)
- Cleans both autoProducts.ts and JSON files under src/data/products/
"""

import json
import pathlib
import re
import sys

import pandas as pd

ROOT = pathlib.Path(__file__).resolve().parents[1]
AUTO_PRODUCTS_FILE = ROOT / "src/data/productCatalog/autoProducts.ts"
CATALOG_ROOT = ROOT / "src/data/products"
ODS_FILES = [
    ROOT / "scripts" / "WPI_Notebooks.ods",
    ROOT / "scripts" / "WPI_Desktops.ods",
    ROOT / "scripts" / "WPI_Arvutiosad.ods",
    ROOT / "scripts" / "WPI_Connectors.ods",
    ROOT / "scripts" / "WPI_NotebookU.ods",
]

UNDERSCORE_SKU_RE = re.compile(r"^.*_\d+$")


def clean_text(v):
    s = str(v).strip()
    if not s or s.lower() == "nan":
        return ""
    if s.endswith(".0"):
        s = s[:-2]
    try:
        if "." in s:
            f = float(s)
            if f.is_integer():
                return str(int(f))
    except:
        pass
    return s


def get_valid_skus_from_ods():
    """Return set of all SKUs found in ODS files (rows with ID=i,n,p)."""
    valid_skus = set()
    for ods in ODS_FILES:
        if not ods.is_file():
            print(f"HOIATUS: ODS-faili ei leitud: {ods}")
            continue
        try:
            df = pd.read_excel(ods, engine="odf", dtype=str).fillna("")
        except Exception as e:
            print(f"HOIATUS: ei saanud lugeda {ods}: {e}")
            continue
        cols = {c.lower(): c for c in df.columns}
        c_id = cols.get("id")
        c_sku = cols.get("sku")
        if not c_id or not c_sku:
            continue
        for _, row in df.iterrows():
            action = clean_text(row[c_id]).lower()
            if action not in ("i", "n", "p"):
                continue
            sku = clean_text(row[c_sku])
            if sku:
                valid_skus.add(sku)
    return valid_skus


def parse_auto_products_ts(path):
    """Parse autoProducts.ts into products list plus original text for writing back."""
    text = path.read_text(encoding="utf-8")
    array_start = text.index("[", text.index("export const autoProducts"))
    array_end = text.rfind("];")
    if array_end < array_start:
        raise ValueError("Vigane autoProducts.ts fail")
    array_text = text[array_start : array_end + 1]
    products = json.loads(array_text)
    return products, text, array_start, array_end


def write_auto_products_ts(path, products, original_text, array_start, array_end):
    """Write updated products back to autoProducts.ts."""
    serialized = json.dumps(products, ensure_ascii=False, indent=2)
    count_comment_match = re.search(
        r"(?m)^// (.+ failist, )\d+ toodet$", original_text
    )
    if count_comment_match:
        original_text = re.sub(
            r"(?m)^// (.+ failist, )\d+ toodet$",
            lambda m: f"// {m.group(1)}{len(products)} toodet",
            original_text,
            count=1,
        )
    new_text = (
        original_text[:array_start] + serialized + original_text[array_end + 1 :]
    )
    path.write_text(new_text, encoding="utf-8")


def clean_json_product_files(valid_skus):
    """Remove products with invalid SKUs from JSON files under src/data/products/."""
    removed = 0
    for jf in CATALOG_ROOT.rglob("*.json"):
        try:
            data = json.loads(jf.read_text(encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(data, list):
            continue
        original_len = len(data)
        data[:] = [p for p in data if clean_text(p.get("sku", "")) in valid_skus]
        if len(data) < original_len:
            removed += original_len - len(data)
            jf.write_text(
                json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
            )
            print(f"  {jf.relative_to(ROOT)}: eemaldatud {original_len - len(data)} toodet")
    return removed


def main():
    print("=" * 60)
    print("Kontrollin ja puhastan tootekataloogi")
    print("=" * 60)

    # 1. Get valid SKUs from ODS files
    print("\n--- Lugem ODS failid ---")
    valid_skus = get_valid_skus_from_ods()
    print(f"Valid SKU-d ODS failides: {len(valid_skus)}")
    if valid_skus:
        print(f"  Näited: {sorted(list(valid_skus))[:10]}")

    # 2. Load autoProducts.ts
    print("\n--- Töötle autoProducts.ts ---")
    products, original_text, array_start, array_end = parse_auto_products_ts(AUTO_PRODUCTS_FILE)
    print(f"Tooteid enne puhastust: {len(products)}")

    # 3. Remove unauthorized SKUs with underscore+number pattern
    underscore_skus = []
    cleaned = []
    seen_skus = set()
    duplicates_removed = 0

    for p in products:
        sku = clean_text(p.get("sku", ""))
        pid = clean_text(p.get("id", ""))
        is_underscore = bool(UNDERSCORE_SKU_RE.match(sku)) or bool(
            UNDERSCORE_SKU_RE.match(pid)
        )

        if is_underscore:
            underscore_skus.append(sku or pid)
            continue

        # SKU must be in valid ODS set
        if sku and sku not in valid_skus:
            print(f"  Eemaldatud (ei ODS-is): SKU={sku}")
            continue

        # Deduplicate by SKU
        if sku in seen_skus:
            duplicates_removed += 1
            print(f"  Topitud SKU eemaldatud: SKU={sku}")
            continue
        seen_skus.add(sku)
        cleaned.append(p)

    print(f"  Eemaldatud aluse SKU-d (numbri järele): {len(underscore_skus)}")
    for sku in underscore_skus:
        print(f"    - {sku}")
    print(f"  Eemaldatud topitud SKU-d: {duplicates_removed}")
    print(f"  Tooteid puhastamise järel: {len(cleaned)}")

    # 4. Write back autoProducts.ts
    write_auto_products_ts(AUTO_PRODUCTS_FILE, cleaned, original_text, array_start, array_end)
    print(f"  Kirjutatud: {AUTO_PRODUCTS_FILE}")

    # 5. Clean JSON product files
    print("\n--- Puhasta JSON failid src/data/products/ ---")
    json_removed = clean_json_product_files(valid_skus)
    print(f"  JSON failidest eemaldatud kokku: {json_removed}")

    print("\n" + "=" * 60)
    print("Kataloogi puhastamine valmis.")
    print("=" * 60)


if __name__ == "__main__":
    main()