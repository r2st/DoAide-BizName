from app.services.scoring import calculate_overall_score


def test_overall_score():
    assert calculate_overall_score(10, 10, 10) == 10.0
    assert calculate_overall_score(5, 5, 5) == 5.0
    assert calculate_overall_score(8, 6, 10) == 7.6


def test_weighted_correctly():
    score = calculate_overall_score(10, 0, 0)
    assert score == 4.0
