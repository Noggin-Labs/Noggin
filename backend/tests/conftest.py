"""Make the project package and upstream legacy top-level imports available."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
for entry in (ROOT, ROOT / "backend" / "noggimigo"):
    if str(entry) not in sys.path:
        sys.path.insert(0, str(entry))
