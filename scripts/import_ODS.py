import pathlib, json
import pandas as pd
import subprocess
import sys
import re
import unicodedata
from odf.opendocument import load
from odf.table import Table, TableCell, TableRow
from odf.teletype import extractText
from odf.text import P

ROOT = pathlib.Path(__file__).resolve().parents[1]
CATALOG_ROOT = ROOT / "src/data/products"
PUBLIC_IMAGES = ROOT / "public/images"
AUTO_PRODUCTS_FILE = ROOT / "src/data/productCatalog/autoProducts.ts"

def clean_text(v):
    """hoiab TEXT-ina, eemaldab .0 lõpu"""
    s = str(v).strip()
    if not s or s.lower() == 'nan':
        return ""
    # 340016.0 -> 340016
    if s.endswith('.0'):
        s = s[:-2]
    try:
        # 340016.0 (float) -> 340016
        if '.' in s:
            f = float(s)
            if f.is_integer():
                return str(int(f))
    except:
        pass
    return s


def parse_number(value):
    text = clean_text(value).replace(" ", "").replace(",", ".")
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def slugify(value):
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", normalized.lower())).strip("-")


def normalize_image_stem(name):
    return "".join(char.casefold() for char in pathlib.Path(name).stem if char.isalnum())


def refresh_image_maps():
    files = sorted(PUBLIC_IMAGES.glob("*.*"), key=lambda file: file.name.casefold())
    exact = {file.stem.casefold(): file.name for file in files}
    normalized = {}
    for file in files:
        normalized.setdefault(normalize_image_stem(file.name), []).append(file.name)
    return exact, normalized


stem_map, normalized_stem_map = refresh_image_maps()


def resolve_image(name):
    key = pathlib.Path(name).stem.casefold()
    real = stem_map.get(key)
    if not real:
        matches = normalized_stem_map.get(normalize_image_stem(name), [])
        if len(matches) == 1:
            real = matches[0]
    if not real:
        print(f"HOIATUS: pilti ei leitud: {name}; kasutan kohatäitjat.")
        return "/images/placeholder.webp"
    return f"/images/{real}"


def create_product(row, cols, images):
    value = lambda column: clean_text(row[cols[column]]) if column in cols else ""
    sku = value("sku")
    title = value("name")
    categories = [part.strip() for part in value("category").split(">") if part.strip()]
    category_l1 = categories[0] if categories else "Muu"
    category_l2 = categories[1] if len(categories) > 1 else ""
    category_l3 = categories[2] if len(categories) > 2 else ""
    price = parse_number(value("price"))
    sale_price = parse_number(value("s_price"))
    if price is None:
        price = sale_price if sale_price is not None else 0
        sale_price = None
    elif sale_price is not None and (sale_price <= 0 or sale_price >= price):
        sale_price = None
    stock = parse_number(value("stock"))
    specs = {
        key: value(column)
        for key, column in (("CPU", "cpu"), ("RAM", "ram"), ("Disk", "disk"), ("OS", "os"))
        if value(column)
    }
    slug = slugify(f"{title} {sku}") or sku
    primary_image = images[0] if images else "/images/placeholder.webp"
    product = {
        "id": sku,
        "sku": sku,
        "title": title or sku,
        "name": title or sku,
        "slug": slug,
        "brand": value("brand"),
        "price": price,
        "regularPrice": price,
        "salePrice": sale_price,
        "finalPrice": sale_price if sale_price is not None else price,
        "stock": int(stock) if stock is not None and stock.is_integer() else stock or 0,
        "condition": value("condition").lower() or "uus",
        "category": category_l1,
        "categories": " > ".join(categories),
        "categorySlug": "/".join(slugify(category) for category in categories),
        "categoryL1": category_l1,
        "topCategory": category_l1,
        "categoryL2": category_l2,
        "subCategory": category_l2,
        "categoryL3": category_l3,
        "categoryL4": categories[3] if len(categories) > 3 else "",
        "categoryPath": categories,
        "tags": value("tags"),
        "color": value("color"),
        "specs": specs,
        "shortDescription": value("product short description"),
        "description": value("description"),
        "images": images or ["/images/placeholder.webp"],
        "image": primary_image,
        "imageUrl": primary_image,
        "rawImages": [],
    }
    return product


def apply_price_update(product, row, cols):
    updates = {}
    for column, field in (("stock", "stock"), ("price", "price"), ("s_price", "sale")):
        raw = clean_text(row[cols[column]]) if column in cols else ""
        if not raw:
            continue
        value = parse_number(raw)
        if value is None:
            print(f"HOIATUS: vigane {column} väärtus SKU {clean_text(row[cols['sku']])}: {raw}")
            return False
        updates[field] = value
    if not updates:
        print(f"HOIATUS: ID=p real SKU {clean_text(row[cols['sku']])} puuduvad hinna/lao väärtused.")
        return False

    if "stock" in updates:
        stock = updates["stock"]
        product["stock"] = int(stock) if stock.is_integer() else stock
    if "price" in updates:
        product["price"] = updates["price"]
        product["regularPrice"] = updates["price"]
    if "sale" in updates:
        sale_price = updates["sale"]
        regular_price = product.get("regularPrice", product.get("price"))
        if sale_price <= 0 or regular_price is None or sale_price >= regular_price:
            product.pop("sale_price", None)
            product["salePrice"] = None
        else:
            product["sale_price"] = sale_price
            product["salePrice"] = sale_price

    sale_price = product.get("salePrice", product.get("sale_price"))
    product["finalPrice"] = sale_price if sale_price else product.get(
        "regularPrice", product.get("price")
    )
    return True


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


def move_processed_ids(ods, processed_rows, id_column, ido_column):
    if not processed_rows:
        return

    document = load(str(ods))
    tables = document.spreadsheet.getElementsByType(Table)
    if not tables:
        raise ValueError(f"Töölehte ei leitud: {ods}")
    rows = tables[0].getElementsByType(TableRow)
    for data_index, action in processed_rows.items():
        row_index = data_index + 1
        if row_index >= len(rows):
            raise ValueError(f"ODS-rida {row_index + 1} puudub failis {ods}")
        row = rows[row_index]
        id_cell = get_cell_at(row, id_column, row_index + 1)
        ido_cell = get_cell_at(row, ido_column, row_index + 1)
        previous = extractText(ido_cell).strip()
        actions = [item.strip() for item in previous.split(",") if item.strip()]
        if action.casefold() not in {item.casefold() for item in actions}:
            actions.append(action)
        set_cell_text(ido_cell, ",".join(actions))
        set_cell_text(id_cell, "")

    try:
        document.save(str(ods))
    except PermissionError as error:
        raise PermissionError(
            f"Cannot update {ods}; close the spreadsheet in Excel/LibreOffice and retry."
        ) from error
    print(f"{ods.name}: moved {len(processed_rows)} processed ID marker(s) to ido")


def main():
    global stem_map, normalized_stem_map
    ods_files = [
        pathlib.Path(arg) if pathlib.Path(arg).is_absolute() else ROOT / arg
        for arg in sys.argv[1:]
    ] or [ROOT / "scripts/WPI_Notebooks.ods"]
    for ods in ods_files:
        if not ods.is_file():
            raise FileNotFoundError(f"ODS-faili ei leitud: {ods}")

    spreadsheets = []
    image_rows_found = False
    for ods in ods_files:
        df = pd.read_excel(ods, engine='odf', dtype=str).fillna("")
        cols = {c.lower(): c for c in df.columns}
        c_id = cols.get("id")
        c_images = cols.get("images")
        if c_id and df[c_id].str.strip().str.lower().isin(["i", "n", "p"]).any():
            if "ido" not in cols:
                raise ValueError(f"ODS-failis puudub ido veerg: {ods}")
            try:
                with ods.open("r+b"):
                    pass
            except OSError as error:
                raise PermissionError(
                    f"Cannot update {ods}; close the spreadsheet in Excel/LibreOffice and retry."
                ) from error
        if c_id and c_images:
            image_rows = (
                df[c_id].str.strip().str.lower().isin(["i", "n"])
                & df[c_images].str.strip().ne("")
            )
            image_rows_found = image_rows_found or image_rows.any()
        spreadsheets.append((ods, df, cols))

    if image_rows_found:
        converter = ROOT / "scripts" / "convert-to-webp.py"
        subprocess.run([sys.executable, str(converter)], cwd=ROOT, check=True)
        stem_map, normalized_stem_map = refresh_image_maps()
    
    sku_map = {}
    file_cache = {}
    updated_json_files = set()
    for jf in CATALOG_ROOT.rglob("*.json"):
        try:
            data = json.loads(jf.read_text(encoding='utf-8'))
            if isinstance(data, list):
                file_cache[jf] = data
                for idx, prod in enumerate(data):
                    sku = clean_text(prod.get("sku",""))
                    if sku:
                        prod["sku"] = sku  # veendu et catalogis on TEXT
                        sku_map.setdefault(sku, []).append(("json", jf, idx))
        except Exception as e:
            pass

    auto_products_content = AUTO_PRODUCTS_FILE.read_text(encoding='utf-8')
    array_start = auto_products_content.index("[", auto_products_content.index("=", auto_products_content.index("export const autoProducts")))
    array_end = auto_products_content.rfind("];")
    if array_end < array_start:
        raise ValueError(f"Vigane automaatse tootekataloogi fail: {AUTO_PRODUCTS_FILE}")
    auto_products = json.loads(auto_products_content[array_start:array_end + 1])
    for idx, product in enumerate(auto_products):
        sku = clean_text(product.get("sku", ""))
        if sku:
            sku_map.setdefault(sku, []).append(("auto", auto_products, idx))

    print(f"Catalogis {len(sku_map)} SKU")

    updated_auto_products = False
    processed_ids = {}
    for ods, df, cols in spreadsheets:
        c_id = cols.get("id")
        c_sku = cols.get("sku")
        c_images = cols.get("images")
        if not c_id or not c_sku or not c_images:
            continue

        for row_index, row in df.iterrows():
            action = clean_text(row[c_id]).lower()
            if action not in ("i", "n", "p"):
                continue
            sku = clean_text(row[c_sku])
            if not sku:
                continue
            if action == "p":
                if sku not in sku_map:
                    print(f"HOIATUS: ID=p SKU {sku} ({ods.name}) ei leidu tootekataloogis.")
                    continue
                updated = False
                for catalog_type, catalog_ref, idx in sku_map[sku]:
                    catalog = file_cache[catalog_ref] if catalog_type == "json" else catalog_ref
                    if apply_price_update(catalog[idx], row, cols):
                        updated = True
                        if catalog_type == "json":
                            updated_json_files.add(catalog_ref)
                        else:
                            updated_auto_products = True
                if updated:
                    processed = processed_ids.setdefault(
                        ods,
                        {
                            "rows": {},
                            "id_column": list(df.columns).index(c_id),
                            "ido_column": list(df.columns).index(cols["ido"]),
                        },
                    )
                    processed["rows"][row_index] = action
                    print(f"{ods.name}: {sku} p -> hind/ladu uuendatud")
                continue
            raw = str(row[c_images]).strip()
            parts = [x.strip() for x in raw.replace(";", ",").split(",") if x.strip()]
            if action == "n" and sku not in sku_map:
                product = create_product(row, cols, [resolve_image(name) for name in parts])
                auto_products.append(product)
                sku_map[sku] = [("auto", auto_products, len(auto_products) - 1)]
                updated_auto_products = True
                processed = processed_ids.setdefault(
                    ods,
                    {
                        "rows": {},
                        "id_column": list(df.columns).index(c_id),
                        "ido_column": list(df.columns).index(cols["ido"]),
                    },
                )
                processed["rows"][row_index] = action
                print(f"{ods.name}: {sku} n -> uus toode lisatud")
                continue
            if sku not in sku_map:
                print(f"HOIATUS: ID={action} SKU {sku} ({ods.name}) ei leidu tootekataloogis.")
                continue
            if not raw:
                continue
            if not parts:
                continue

            imgs = [resolve_image(x) for x in parts]
            for catalog_type, catalog_ref, idx in sku_map[sku]:
                catalog = file_cache[catalog_ref] if catalog_type == "json" else catalog_ref
                catalog[idx]["images"] = imgs
                if catalog_type == "json":
                    updated_json_files.add(catalog_ref)
                else:
                    catalog[idx]["image"] = imgs[0]
                    catalog[idx]["imageUrl"] = imgs[0]
                    updated_auto_products = True
            processed = processed_ids.setdefault(
                ods,
                {
                    "rows": {},
                    "id_column": list(df.columns).index(c_id),
                    "ido_column": list(df.columns).index(cols["ido"]),
                },
            )
            processed["rows"][row_index] = action
            print(f"{ods.name}: {sku} {action} -> {imgs}")

    for jf in updated_json_files:
        jf.write_text(json.dumps(file_cache[jf], ensure_ascii=False, indent=2), encoding='utf-8')

    if updated_auto_products:
        serialized = json.dumps(auto_products, ensure_ascii=False, indent=2)
        updated_count = re.sub(
            r"(?m)^// (.+ failist, )\d+ toodet$",
            lambda match: f"// {match.group(1)}{len(auto_products)} toodet",
            auto_products_content,
            count=1,
        )
        updated_array_start = updated_count.index(
            "[",
            updated_count.index("=", updated_count.index("export const autoProducts")),
        )
        AUTO_PRODUCTS_FILE.write_text(
            updated_count[:updated_array_start] + serialized + auto_products_content[array_end + 1:],
            encoding='utf-8',
        )

    for ods, processed in processed_ids.items():
        move_processed_ids(
            ods,
            processed["rows"],
            processed["id_column"],
            processed["ido_column"],
        )

if __name__ == "__main__":
    main()