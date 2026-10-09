"""Feedback endpoint – appends entries to feedback.json."""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api", tags=["feedback"])

FEEDBACK_FILE = Path(os.environ.get("FEEDBACK_FILE", "feedback.json"))


class FeedbackIn(BaseModel):
    type: str = Field(..., pattern="^(suggestion|bug|praise)$")
    message: str = Field(..., min_length=1, max_length=2000)
    page: str = ""


@router.post("/feedback", status_code=201)
def submit_feedback(payload: FeedbackIn):
    entry = {
        "type": payload.type,
        "message": payload.message,
        "page": payload.page,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    entries: list[dict] = []
    if FEEDBACK_FILE.exists():
        try:
            entries = json.loads(FEEDBACK_FILE.read_text())
        except (json.JSONDecodeError, OSError):
            entries = []

    entries.append(entry)
    FEEDBACK_FILE.write_text(json.dumps(entries, indent=2))

    return {"status": "ok"}
