from __future__ import annotations

import asyncio
import logging
import socket

logger = logging.getLogger(__name__)

TLDS = [".com", ".in", ".co.in", ".io", ".co"]


async def check_domain(name: str, tld: str) -> dict:
    domain = f"{name.lower().replace(' ', '')}{tld}"
    try:
        loop = asyncio.get_event_loop()
        await asyncio.wait_for(
            loop.run_in_executor(None, socket.gethostbyname, domain),
            timeout=3,
        )
        return {"domain": domain, "available": False}
    except (socket.gaierror, asyncio.TimeoutError):
        return {"domain": domain, "available": True}
    except Exception:
        return {"domain": domain, "available": None, "error": "Check failed"}


async def check_all_domains(name: str, tlds: list[str] | None = None) -> list[dict]:
    use_tlds = tlds if tlds is not None else TLDS
    tasks = [check_domain(name, tld) for tld in use_tlds]
    return await asyncio.gather(*tasks)
