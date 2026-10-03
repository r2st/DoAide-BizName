from unittest.mock import AsyncMock, patch


def test_generate_names_returns_results(client):
    with patch("app.routers.generate.generate_names", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = [
            {
                "name": "TestBiz",
                "tagline": "Test tagline",
                "memorability": 8.0,
                "brandability": 7.0,
                "length_score": 9.0,
            }
        ]
        with patch("app.routers.generate.check_all_domains", new_callable=AsyncMock) as mock_dom:
            mock_dom.return_value = [
                {"domain": "testbiz.com", "available": True},
                {"domain": "testbiz.in", "available": False},
                {"domain": "testbiz.io", "available": True},
                {"domain": "testbiz.co", "available": None, "error": "timeout"},
            ]

            resp = client.post(
                "/api/generate",
                json={"keyword": "test", "industry": "tech"},
            )
            assert resp.status_code == 200
            data = resp.json()
            assert data["keyword"] == "test"
            assert len(data["names"]) == 1
            assert data["names"][0]["name"] == "TestBiz"
            assert len(data["names"][0]["domains"]) == 4
            assert len(data["names"][0]["socials"]) == 4


def test_generate_empty_keyword_rejected(client):
    resp = client.post("/api/generate", json={"keyword": ""})
    assert resp.status_code == 422


def test_get_name_details_not_found(client):
    resp = client.get("/api/generate/name/nonexistent")
    assert resp.status_code == 404
