"""Public domain availability checker — no login required."""
from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.domain_checker import check_all_domains

router = APIRouter(prefix="/api/domain", tags=["domain"])

PUBLIC_TLDS = [".com", ".in", ".co.in"]


class DomainCheckRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class DomainResult(BaseModel):
    domain: str
    available: bool | None = None
    error: str | None = None


class DomainCheckResponse(BaseModel):
    name: str
    results: list[DomainResult]


@router.post("/check", response_model=DomainCheckResponse)
async def check_domains(body: DomainCheckRequest):
    results = await check_all_domains(body.name, tlds=PUBLIC_TLDS)
    return DomainCheckResponse(
        name=body.name,
        results=[DomainResult(**r) for r in results],
    )
