"""Make the package and upstream legacy top-level imports available."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
# Keep the backend package ahead of its contents so `noggimigo` resolves to
# the package directory, not the legacy noggimigo.py compatibility module.
for entry in (ROOT / "backend" / "noggimigo", ROOT / "backend", ROOT):
    if str(entry) not in sys.path:
        sys.path.insert(0, str(entry))