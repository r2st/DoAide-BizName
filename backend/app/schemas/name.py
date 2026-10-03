from __future__ import annotations

from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    keyword: str = Field(..., min_length=1, max_length=100)
    industry: str = Field(default="", max_length=100)
    style: str = Field(default="modern", max_length=50)
    count: int = Field(default=10, ge=1, le=20)


class NameScore(BaseModel):
    memorability: float = Field(ge=0, le=10)
    brandability: float = Field(ge=0, le=10)
    length: float = Field(ge=0, le=10)
    overall: float = Field(ge=0, le=10)


class DomainStatus(BaseModel):
    domain: str
    available: bool | None = None
    error: str | None = None


class SocialStatus(BaseModel):
    platform: str
    handle: str
    likely_available: bool


class GeneratedNameResponse(BaseModel):
    id: int
    name: str
    tagline: str
    domains: list[DomainStatus]
    socials: list[SocialStatus]
    scores: NameScore

    class Config:
        from_attributes = True


class GenerateResponse(BaseModel):
    search_id: int
    keyword: str
    industry: str
    names: list[GeneratedNameResponse]


class SaveNameRequest(BaseModel):
    generated_name_id: int
    notes: str = ""


class SavedNameResponse(BaseModel):
    id: int
    name: str
    tagline: str
    notes: str
    scores: NameScore

    class Config:
        from_attributes = True
