from app.services.name_generator import _fallback_names, _parse_ai_response


def test_fallback_names_count():
    names = _fallback_names("coffee", 5)
    assert len(names) == 5
    assert all("coffee" in n["name"].lower() for n in names)


def test_fallback_names_have_scores():
    names = _fallback_names("tech", 3)
    for n in names:
        assert "memorability" in n
        assert "brandability" in n
        assert "length_score" in n


def test_parse_valid_json():
    content = '[{"name": "FooBar", "tagline": "hi", "memorability": 8, "brandability": 7, "length_score": 9}]'
    result = _parse_ai_response(content, 10)
    assert len(result) == 1
    assert result[0]["name"] == "FooBar"


def test_parse_json_with_markdown():
    content = '```json\n[{"name": "A", "tagline": "b", "memorability": 5, "brandability": 5, "length_score": 5}]\n```'
    result = _parse_ai_response(content, 10)
    assert len(result) == 1


def test_parse_invalid_json_returns_fallback():
    result = _parse_ai_response("not json at all", 5)
    assert len(result) == 5
