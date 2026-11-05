import subprocess
from pathlib import Path
import sys


project_dir = Path(__file__).resolve().parent.parent
converter = project_dir / "scripts" / "convert-to-webp.mjs"
result = subprocess.run(["node", str(converter)], cwd=project_dir, check=False)
sys.exit(result.returncode)