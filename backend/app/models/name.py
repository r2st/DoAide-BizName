from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class SearchHistory(Base):
    __tablename__ = "search_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    keyword: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    industry: Mapped[str] = mapped_column(String(255), default="")
    style: Mapped[str] = mapped_column(String(100), default="")
    ip_address: Mapped[str] = mapped_column(String(45), default="")
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class GeneratedName(Base):
    __tablename__ = "generated_names"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    search_id: Mapped[int] = mapped_column(Integer, ForeignKey("search_history.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    tagline: Mapped[str] = mapped_column(Text, default="")
    domain_availability: Mapped[dict | None] = mapped_column(JSONB, default=dict)
    social_availability: Mapped[dict | None] = mapped_column(JSONB, default=dict)
    score_memorability: Mapped[float] = mapped_column(Float, default=0.0)
    score_brandability: Mapped[float] = mapped_column(Float, default=0.0)
    score_length: Mapped[float] = mapped_column(Float, default=0.0)
    score_overall: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class SavedName(Base):
    __tablename__ = "saved_names"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    generated_name_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("generated_names.id"), nullable=False
    )
    notes: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
