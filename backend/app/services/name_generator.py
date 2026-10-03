from __future__ import annotations

import json
import logging
import re

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are BizNameAI, an expert business name generator. Generate creative, memorable business names.

For each name, provide:
1. The business name (2-3 words max, catchy, easy to spell)
2. A short tagline (under 10 words)
3. Scores from 1-10 for: memorability, brandability, length_score

Return ONLY valid JSON array. No markdown, no explanation. Example:
[
  {"name": "CloudPeak", "tagline": "Elevate your business to new heights", "memorability": 8, "brandability": 9, "length_score": 8},
  {"name": "NovaBridge", "tagline": "Connecting ideas to innovation", "memorability": 7, "brandability": 8, "length_score": 7}
]"""


async def generate_names(
    keyword: str,
    industry: str = "",
    style: str = "modern",
    count: int = 10,
) -> list[dict]:
    industry_hint = f" in the {industry} industry" if industry else ""
    user_prompt = (
        f"Generate {count} creative business names for a company related to "
        f'"{keyword}"{industry_hint}. Style: {style}. '
        f"Make them unique, easy to pronounce, and domain-friendly (no spaces, short)."
    )

    if not settings.openrouter_api_key:
        logger.warning("No OpenRouter API key; returning fallback names")
        return _fallback_names(keyword, count)

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.openrouter_api_key}",
                    "HTTP-Referer": "https://bizname.doaide.com",
                    "X-Title": "DoAide BizName",
                },
                json={
                    "model": settings.openrouter_model,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.9,
                    "max_tokens": 2000,
                },
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
            return _parse_ai_response(content, count)
    except Exception:
        logger.exception("OpenRouter call failed, using fallback")
        return _fallback_names(keyword, count)


def _parse_ai_response(content: str, count: int) -> list[dict]:
    content = content.strip()
    json_match = re.search(r"\[.*\]", content, re.DOTALL)
    if json_match:
        content = json_match.group(0)
    try:
        names = json.loads(content)
        if isinstance(names, list):
            return [
                {
                    "name": n.get("name", "Unnamed"),
                    "tagline": n.get("tagline", ""),
                    "memorability": min(10, max(1, float(n.get("memorability", 5)))),
                    "brandability": min(10, max(1, float(n.get("brandability", 5)))),
                    "length_score": min(10, max(1, float(n.get("length_score", 5)))),
                }
                for n in names[:count]
            ]
    except (json.JSONDecodeError, ValueError):
        pass
    return _fallback_names("business", count)


_SUFFIXES = ["Hub", "Lab", "Flow", "Nest", "Spark", "Wave", "Core", "Edge", "Mint", "Peak"]
_PREFIXES = ["Nova", "Flux", "Aura", "Zen", "Vibe", "Pixel", "Cloud", "Bright", "Swift", "Bold"]


def _fallback_names(keyword: str, count: int) -> list[dict]:
    word = keyword.title().replace(" ", "")
    results = []
    for i in range(min(count, 10)):
        if i < len(_SUFFIXES):
            name = f"{word}{_SUFFIXES[i]}"
        else:
            name = f"{_PREFIXES[i % len(_PREFIXES)]}{word}"
        results.append({
            "name": name,
            "tagline": f"Your {keyword} partner for growth",
            "memorability": 6.0,
            "brandability": 6.0,
            "length_score": max(3.0, 10.0 - len(name) * 0.5),
        })
    return results
