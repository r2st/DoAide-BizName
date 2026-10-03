from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.name import GeneratedName, SavedName
from app.models.user import User
from app.schemas.name import NameScore, SavedNameResponse, SaveNameRequest

router = APIRouter(prefix="/api/saved", tags=["saved"])


@router.post("", response_model=SavedNameResponse, status_code=201)
def save_name(
    body: SaveNameRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    gen = db.query(GeneratedName).filter(GeneratedName.id == body.generated_name_id).first()
    if gen is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Generated name not found")

    existing = (
        db.query(SavedName)
        .filter(SavedName.user_id == user.id, SavedName.generated_name_id == gen.id)
        .first()
    )
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Already saved")

    saved = SavedName(user_id=user.id, generated_name_id=gen.id, notes=body.notes)
    db.add(saved)
    db.commit()
    db.refresh(saved)

    return SavedNameResponse(
        id=saved.id,
        name=gen.name,
        tagline=gen.tagline,
        notes=saved.notes,
        scores=NameScore(
            memorability=gen.score_memorability,
            brandability=gen.score_brandability,
            length=gen.score_length,
            overall=gen.score_overall,
        ),
    )


@router.get("", response_model=list[SavedNameResponse])
def list_saved(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = (
        db.query(SavedName, GeneratedName)
        .join(GeneratedName, SavedName.generated_name_id == GeneratedName.id)
        .filter(SavedName.user_id == user.id)
        .order_by(SavedName.created_at.desc())
        .all()
    )
    return [
        SavedNameResponse(
            id=s.id,
            name=g.name,
            tagline=g.tagline,
            notes=s.notes,
            scores=NameScore(
                memorability=g.score_memorability,
                brandability=g.score_brandability,
                length=g.score_length,
                overall=g.score_overall,
            ),
        )
        for s, g in rows
    ]


@router.delete("/{saved_id}", status_code=204)
def delete_saved(
    saved_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    saved = (
        db.query(SavedName)
        .filter(SavedName.id == saved_id, SavedName.user_id == user.id)
        .first()
    )
    if saved is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    db.delete(saved)
    db.commit()
