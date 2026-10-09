from app.services.trademark_search import search_trademark_classes


def test_trademark_search_finds_tech_classes():
    results = search_trademark_classes("CloudApp", "technology")
    class_numbers = [r["class_number"] for r in results]
    assert 9 in class_numbers or 42 in class_numbers


def test_trademark_search_finds_food_classes():
    results = search_trademark_classes("SpiceKitchen", "restaurant")
    class_numbers = [r["class_number"] for r in results]
    assert any(n in class_numbers for n in [29, 30, 43])


def test_trademark_search_returns_limited_results():
    results = search_trademark_classes("general business consulting services")
    assert len(results) <= 10


def test_trademark_search_empty_returns_empty():
    results = search_trademark_classes("zzxqwpfl")
    assert len(results) == 0


def test_trademark_search_has_required_fields():
    results = search_trademark_classes("software", "tech")
    for r in results:
        assert "class_number" in r
        assert "title" in r
        assert "relevance_score" in r
        assert "matched_keywords" in r


def test_trademark_endpoint(client):
    resp = client.post(
        "/api/trademark/search",
        json={"name": "CloudKitchen", "industry": "food"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "CloudKitchen"
    assert "classes" in data
    assert data["filing_fee_individual"] == 4500
    assert data["filing_fee_other"] == 9000


def test_trademark_endpoint_empty_name_rejected(client):
    resp = client.post("/api/trademark/search", json={"name": ""})
    assert resp.status_code == 422
