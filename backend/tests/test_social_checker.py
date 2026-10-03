from app.services.social_checker import check_social_handle


def test_returns_all_platforms():
    result = check_social_handle("TestBrand")
    assert len(result) == 4
    platforms = {r["platform"] for r in result}
    assert "twitter" in platforms
    assert "instagram" in platforms


def test_handle_format():
    result = check_social_handle("My Brand")
    for r in result:
        assert r["handle"].startswith("@")
        assert " " not in r["handle"]
