"""Trademark search helper — no login required."""
from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.trademark_search import search_trademark_classes

router = APIRouter(prefix="/api/trademark", tags=["trademark"])


class TrademarkSearchRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    industry: str = Field(default="", max_length=100)


class TrademarkClassResult(BaseModel):
    class_number: int
    title: str
    relevance_score: int
    matched_keywords: list[str]


class TrademarkSearchResponse(BaseModel):
    name: str
    industry: str
    classes: list[TrademarkClassResult]
    filing_fee_individual: int = 4500
    filing_fee_other: int = 9000


@router.post("/search", response_model=TrademarkSearchResponse)
async def trademark_search(body: TrademarkSearchRequest):
    results = search_trademark_classes(body.name, body.industry)
    return TrademarkSearchResponse(
        name=body.name,
        industry=body.industry,
        classes=[TrademarkClassResult(**r) for r in results],
    )
