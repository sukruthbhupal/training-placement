from pathlib import Path
from typing import Final

ALLOWED_EXTENSIONS: Final[set[str]] = {".png", ".jpg", ".jpeg", ".webp"}
MAX_FILE_SIZE: Final[int] = 5 * 1024 * 1024


def is_valid_image(filename: str) -> bool:
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS
