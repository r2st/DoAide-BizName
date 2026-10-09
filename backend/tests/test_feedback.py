import json
from pathlib import Path

import pytest


@pytest.fixture(autouse=True)
def feedback_file(tmp_path, monkeypatch):
    f = tmp_path / "feedback.json"
    import app.routers.feedback as fb
    monkeypatch.setattr(fb, "FEEDBACK_FILE", f)
    return f


def test_submit_feedback(client, feedback_file):
    resp = client.post("/api/feedback", json={
        "type": "suggestion",
        "message": "Add dark mode",
        "page": "/",
    })
    assert resp.status_code == 201
    assert resp.json()["status"] == "ok"

    entries = json.loads(feedback_file.read_text())
    assert len(entries) == 1
    assert entries[0]["type"] == "suggestion"
    assert entries[0]["message"] == "Add dark mode"
    assert entries[0]["page"] == "/"
    assert "timestamp" in entries[0]


def test_submit_feedback_appends(client, feedback_file):
    client.post("/api/feedback", json={"type": "bug", "message": "Broken link", "page": "/tools"})
    client.post("/api/feedback", json={"type": "praise", "message": "Love it!", "page": "/"})

    entries = json.loads(feedback_file.read_text())
    assert len(entries) == 2
    assert entries[0]["type"] == "bug"
    assert entries[1]["type"] == "praise"


def test_submit_feedback_invalid_type(client):
    resp = client.post("/api/feedback", json={"type": "invalid", "message": "test"})
    assert resp.status_code == 422


def test_submit_feedback_empty_message(client):
    resp = client.post("/api/feedback", json={"type": "suggestion", "message": ""})
    assert resp.status_code == 422


def test_submit_feedback_message_too_long(client):
    resp = client.post("/api/feedback", json={"type": "suggestion", "message": "x" * 2001})
    assert resp.status_code == 422
