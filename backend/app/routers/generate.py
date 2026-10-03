from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_optional_user
from app.models.name import GeneratedName, SearchHistory
from app.models.user import User
from app.schemas.name import (
    DomainStatus,
    GeneratedNameResponse,
    GenerateRequest,
    GenerateResponse,
    NameScore,
    SocialStatus,
)
from app.services.domain_checker import check_all_domains
from app.services.name_generator import generate_names
from app.services.scoring import calculate_overall_score
from app.services.social_checker import check_social_handle

router = APIRouter(prefix="/api/generate", tags=["generate"])


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post("", response_model=GenerateResponse)
async def generate_business_names(
    body: GenerateRequest,
    request: Request,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    ip = _get_client_ip(request)

    if user is None or user.plan == "free":
        from datetime import datetime, timezone
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        count = (
            db.query(SearchHistory)
            .filter(
                SearchHistory.ip_address == ip,
                SearchHistory.created_at >= today_start,
            )
            .count()
        )
        if count >= settings.free_searches_per_day:
            raise HTTPException(
                status.HTTP_429_TOO_MANY_REQUESTS,
                f"Free limit of {settings.free_searches_per_day} searches/day reached. "
                "Sign up for Pro for unlimited searches.",
            )

    search = SearchHistory(
        keyword=body.keyword,
        industry=body.industry,
        style=body.style,
        ip_address=ip,
        user_id=user.id if user else None,
    )
    db.add(search)
    db.commit()
    db.refresh(search)

    raw_names = await generate_names(
        keyword=body.keyword,
        industry=body.industry,
        style=body.style,
        count=body.count,
    )

    name_responses = []
    for raw in raw_names:
        domains = await check_all_domains(raw["name"])
        socials = check_social_handle(raw["name"])
        overall = calculate_overall_score(
            raw["memorability"], raw["brandability"], raw["length_score"]
        )

        gen = GeneratedName(
            search_id=search.id,
            name=raw["name"],
            tagline=raw["tagline"],
            domain_availability={d["domain"]: d.get("available") for d in domains},
            social_availability={s["platform"]: s["likely_available"] for s in socials},
            score_memorability=raw["memorability"],
            score_brandability=raw["brandability"],
            score_length=raw["length_score"],
            score_overall=overall,
        )
        db.add(gen)
        db.commit()
        db.refresh(gen)

        name_responses.append(
            GeneratedNameResponse(
                id=gen.id,
                name=gen.name,
                tagline=gen.tagline,
                domains=[DomainStatus(**d) for d in domains],
                socials=[SocialStatus(**s) for s in socials],
                scores=NameScore(
                    memorability=gen.score_memorability,
                    brandability=gen.score_brandability,
                    length=gen.score_length,
                    overall=gen.score_overall,
                ),
            )
        )

    return GenerateResponse(
        search_id=search.id,
        keyword=body.keyword,
        industry=body.industry,
        names=name_responses,
    )


@router.get("/name/{name}", response_model=GeneratedNameResponse | None)
async def get_name_details(name: str, db: Session = Depends(get_db)):
    gen = db.query(GeneratedName).filter(GeneratedName.name == name).first()
    if gen is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Name not found")

    domains = [
        DomainStatus(domain=k, available=v)
        for k, v in (gen.domain_availability or {}).items()
    ]
    socials = [
        SocialStatus(platform=k, handle=f"@{gen.name.lower()}", likely_available=v)
        for k, v in (gen.social_availability or {}).items()
    ]

    return GeneratedNameResponse(
        id=gen.id,
        name=gen.name,
        tagline=gen.tagline,
        domains=domains,
        socials=socials,
        scores=NameScore(
            memorability=gen.score_memorability,
            brandability=gen.score_brandability,
            length=gen.score_length,
            overall=gen.score_overall,
        ),
    )
