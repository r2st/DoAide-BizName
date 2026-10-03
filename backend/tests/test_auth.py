def test_register_and_login(client):
    resp = client.post(
        "/api/auth/register",
        json={"email": "new@test.com", "password": "pass123", "name": "New User"},
    )
    assert resp.status_code == 201
    assert "access_token" in resp.json()

    resp = client.post(
        "/api/auth/login",
        json={"email": "new@test.com", "password": "pass123"},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_register_duplicate(client):
    client.post(
        "/api/auth/register",
        json={"email": "dup@test.com", "password": "pass123"},
    )
    resp = client.post(
        "/api/auth/register",
        json={"email": "dup@test.com", "password": "pass123"},
    )
    assert resp.status_code == 409


def test_login_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={"email": "wp@test.com", "password": "correct"},
    )
    resp = client.post(
        "/api/auth/login",
        json={"email": "wp@test.com", "password": "wrong"},
    )
    assert resp.status_code == 401


def test_me(client, auth_headers):
    resp = client.get("/api/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "test@example.com"


def test_me_no_token(client):
    resp = client.get("/api/auth/me")
    assert resp.status_code == 401
