def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_pricing(client):
    resp = client.get("/api/pricing")
    assert resp.status_code == 200
    plans = resp.json()["plans"]
    assert len(plans) == 3
    assert plans[0]["name"] == "Free"
    assert plans[1]["price"] == 299
    assert plans[2]["price"] == 799
