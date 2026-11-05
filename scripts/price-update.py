import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
ODS_FILES = (
    "WPI_Arvutiosad.ods",
    "WPI_Connectors.ods",
    "WPI_Desktops.ods",
    "WPI_Notebooks.ods",
    "WPI_NotebookU.ods",
)


def main():
    importer = ROOT / "scripts" / "import_ODS.py"
    ods_paths = [str(ROOT / "scripts" / name) for name in ODS_FILES]
    subprocess.run([sys.executable, str(importer), *ods_paths], cwd=ROOT, check=True)


if __name__ == "__main__":
    main()
