#!/usr/bin/env python3
"""run_import.py - Full import pipeline for Canman product data.

Steps:
1. Convert images from incoming/ to public/images/ (WebP via convert-to-webp.py)
2. Normalize ODS "Images" column: separator becomes ", " and every filename ends with .webp
3. Import ODS data based on ID field commands (ID=n new product, ID=p price update, ID=i images only)
"""

import pathlib
import re
import subprocess
import sys

import pandas as pd
from odf.opendocument import load
from odf.table import Table, TableCell, TableRow
from odf.teletype import extractText
from odf.text import P

ROOT = pathlib.Path(__file__).resolve().parents[1]
INCOMING = ROOT / "incoming"
PUBLIC_IMAGES = ROOT / "public/images"
SCRIPTS = ROOT / "scripts"


# ---------------------------------------------------------------------------
# ODS helper functions (same as in import_ODS.py)
# ---------------------------------------------------------------------------

def clean_text(v):
    """hoiab TEXT-ina, eemaldab .0 lõpu"""
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


def get_cell_at(row, target_column, row_number):
    column_index = 0
    for cell in list(row.childNodes):
        if not getattr(cell, "qname", None) or cell.qname[1] not in (
            "table-cell",
            "covered-table-cell",
        ):
            continue
        repeat = int(cell.getAttribute("numbercolumnsrepeated") or 1)
        if column_index <= target_column < column_index + repeat:
            if repeat == 1:
                return cell
            offset = target_column - column_index
            target = TableCell()
            style = cell.getAttribute("stylename")
            if style:
                target.setAttribute("stylename", style)
            after_count = repeat - offset - 1
            if offset:
                cell.setAttribute("numbercolumnsrepeated", str(offset))
                row.insertBefore(target, cell.nextSibling)
            else:
                row.insertBefore(target, cell)
                if after_count:
                    cell.setAttribute("numbercolumnsrepeated", str(after_count))
                else:
                    row.removeChild(cell)
            if offset and after_count:
                after = TableCell()
                if style:
                    after.setAttribute("stylename", style)
                after.setAttribute("numbercolumnsrepeated", str(after_count))
                row.insertBefore(after, target.nextSibling)
            return target
        column_index += repeat
    raise ValueError(f"Lahtrit {target_column + 1} ei leitud ODS real {row_number}")


def set_cell_text(cell, value):
    for child in list(cell.childNodes):
        cell.removeChild(child)
    cell.setAttribute("valuetype", "string")
    if value:
        cell.addElement(P(text=value))


# ---------------------------------------------------------------------------
# Step 1: Image conversion
# ---------------------------------------------------------------------------

def convert_images():
    """Convert images from incoming/ to public/images/ via convert-to-webp.py."""
    converter = SCRIPTS / "convert-to-webp.py"
    print(f"Käivitame piltide teisenduse: {converter.name}")
    result = subprocess.run([sys.executable, str(converter)], cwd=ROOT, check=False)
    if result.returncode == 0:
        print("Piltide teisendamine valmis.")
    else:
        print(f"Piltide teisendamine lõpetas koodiga {result.returncode}.")
    return result.returncode


# ---------------------------------------------------------------------------
# Step 2: ODS Images column normalization
# ---------------------------------------------------------------------------

def normalize_image_name(name):
    """Ensure filename ends with .webp extension.

    - Strips whitespace
    - Replaces any existing extension with .webp
    - Appends .webp if no extension is present
    """
    name = name.strip()
    if not name:
        return name
    stem = pathlib.Path(name).stem
    return stem + ".webp"


def fix_ods_images_column(ods_path):
    """Normalize the "Images" column in an ODS file:
    - Split values by comma or semicolon
    - Strip whitespace from each filename
    - Ensure every filename ends with .webp
    - Rejoin with ", " separator (comma + space)
    """
    document = load(str(ods_path))
    tables = document.spreadsheet.getElementsByType(Table)
    if not tables:
        print(f"  {ods_path.name}: töölehte ei leitud, jätame vahele")
        return

    table = tables[0]
    rows = list(table.getElementsByType(TableRow))
    if not rows:
        return

    # Locate "Images" column in header row
    header_row = rows[0]
    images_col = None
    col_index = 0
    for cell in list(header_row.childNodes):
        if not getattr(cell, "qname", None) or cell.qname[1] not in (
            "table-cell",
            "covered-table-cell",
        ):
            continue
        text = extractText(cell).strip().lower()
        if text == "images":
            images_col = col_index
            break
        col_index += 1

    if images_col is None:
        print(f"  {ods_path.name}: 'Images' veergu ei leitud, jätame vahele")
        return

    changed = 0
    for row_index, row in enumerate(rows[1:], start=1):
        cell = get_cell_at(row, images_col, row_index + 1)
        raw = extractText(cell).strip()
        if not raw:
            continue

        # Split by comma or semicolon, strip each part
        parts = [x.strip() for x in re.split(r"[,;]", raw) if x.strip()]

        # Normalize each filename: ensure .webp extension
        normalized_parts = [normalize_image_name(p) for p in parts]

        # Rejoin with ", " separator
        new_value = ", ".join(normalized_parts)

        if new_value != raw:
            set_cell_text(cell, new_value)
            changed += 1
            print(f"  {ods_path.name}: rida {row_index + 1} pildid normalizeeritud: {new_value}")

    if changed:
        try:
            document.save(str(ods_path))
            print(f"  {ods_path.name}: salvestatud, {changed} rida uuendatud")
        except PermissionError as error:
            raise PermissionError(
                f"Cannot update {ods_path}; close the spreadsheet in Excel/LibreOffice and retry."
            ) from error
    else:
        print(f"  {ods_path.name}: muudatusi ei tarvitud")


# ---------------------------------------------------------------------------
# Step 3: ODS data import (delegates to import_ODS.py)
# ---------------------------------------------------------------------------

def import_ods_data(ods_files):
    """Run import_ODS.py on the given ODS files."""
    importer = SCRIPTS / "import_ODS.py"
    ods_paths = [str(ods) for ods in ods_files]
    print(f"Käivitame andmeimporti: {importer.name} {' '.join(ods_paths)}")
    result = subprocess.run([sys.executable, str(importer), *ods_paths], cwd=ROOT, check=True)
    return result.returncode


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def main():
    # Determine which ODS files to process
    ods_files = [
        pathlib.Path(arg) if pathlib.Path(arg).is_absolute() else ROOT / arg
        for arg in sys.argv[1:]
    ] or [ROOT / "scripts" / "WPI_Notebooks.ods"]

    for ods in ods_files:
        if not ods.is_file():
            raise FileNotFoundError(f"ODS-faili ei leitud: {ods}")

    # Step 1: Convert images from incoming/ to public/images/
    print("=" * 60)
    print("Samm 1/3: Piltide teisendamine incoming/ -> public/images/")
    print("=" * 60)
    convert_images()

    # Step 2: Normalize ODS Images columns
    print("\n" + "=" * 60)
    print("Samm 2/3: ODS 'Images' veergu normalizeerimine (', ' ja .webp)")
    print("=" * 60)
    for ods in ods_files:
        fix_ods_images_column(ods)

    # Step 3: Import ODS data
    print("\n" + "=" * 60)
    print("Samm 3/3: ODS andmete importimine")
    print("=" * 60)
    import_ods_data(ods_files)

    print("\nKogu importi voog valmis.")


if __name__ == "__main__":
    main()