import pathlib
import subprocess
import sys
import time

ROOT = pathlib.Path(__file__).resolve().parents[1]


def main():
    importer = ROOT / "scripts" / "import_ODS.py"
    one_hour_ago = time.time() - 3600
    ods_paths = sorted(
        str(p) for p in ROOT.glob("**/*.ods")
        if p.stat().st_mtime >= one_hour_ago
    )
    if not ods_paths:
        print("HOIATUS: Viimase tunni jooksul muudatud ODS-faile ei leitud.")
        return
    subprocess.run([sys.executable, str(importer), *ods_paths], cwd=ROOT, check=True)


if __name__ == "__main__":
    main()
