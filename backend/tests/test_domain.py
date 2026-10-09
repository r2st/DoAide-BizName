from unittest.mock import AsyncMock, patch


def test_domain_check_endpoint(client):
    with patch("app.routers.domain.check_all_domains", new_callable=AsyncMock) as mock:
        mock.return_value = [
            {"domain": "testbiz.com", "available": True},
            {"domain": "testbiz.in", "available": False},
            {"domain": "testbiz.co.in", "available": True},
        ]
        resp = client.post("/api/domain/check", json={"name": "testbiz"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"] == "testbiz"
        assert len(data["results"]) == 3
        assert data["results"][0]["domain"] == "testbiz.com"
        assert data["results"][0]["available"] is True
        assert data["results"][1]["available"] is False


def test_domain_check_empty_name_rejected(client):
    resp = client.post("/api/domain/check", json={"name": ""})
    assert resp.status_code == 422


def test_domain_check_passes_public_tlds(client):
    with patch("app.routers.domain.check_all_domains", new_callable=AsyncMock) as mock:
        mock.return_value = []
        client.post("/api/domain/check", json={"name": "foo"})
        mock.assert_called_once_with("foo", tlds=[".com", ".in", ".co.in"])
