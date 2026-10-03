from __future__ import annotations

import re

PLATFORMS = ["twitter", "instagram", "linkedin", "facebook"]


def check_social_handle(name: str) -> list[dict]:
    handle = re.sub(r"[^a-zA-Z0-9]", "", name).lower()
    results = []
    for platform in PLATFORMS:
        likely_available = len(handle) >= 4 and len(handle) <= 15
        results.append({
            "platform": platform,
            "handle": f"@{handle}",
            "likely_available": likely_available,
        })
    return results
