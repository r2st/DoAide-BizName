from __future__ import annotations


def calculate_overall_score(memorability: float, brandability: float, length_score: float) -> float:
    return round((memorability * 0.4 + brandability * 0.4 + length_score * 0.2), 1)
