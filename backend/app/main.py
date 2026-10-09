"""DoAide BizName FastAPI application entrypoint."""
from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.core.config import settings
from app.routers import auth, domain, feedback, generate, saved, trademark

logger = logging.getLogger(__name__)

app = FastAPI(
    title="DoAide BizName API",
    description="AI-powered business name generator with domain and social handle checks.",
    version="1.0.0",
)

app.add_middleware(GZipMiddleware, minimum_size=500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router)
app.include_router(auth.router)
app.include_router(saved.router)
app.include_router(feedback.router)
app.include_router(domain.router)
app.include_router(trademark.router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/pricing")
def pricing():
    return {
        "plans": [
            {
                "name": "Free",
                "price": 0,
                "currency": "INR",
                "features": [
                    "5 searches per day",
                    "10 name suggestions per search",
                    "Domain availability check",
                    "Social handle check",
                    "Name scoring",
                    "Copy & share",
                ],
            },
            {
                "name": "Pro",
                "price": 299,
                "currency": "INR",
                "period": "month",
                "features": [
                    "Unlimited searches",
                    "20 name suggestions per search",
                    "Save favorites",
                    "Logo generation",
                    "Priority AI models",
                    "Export results",
                ],
            },
            {
                "name": "Business",
                "price": 799,
                "currency": "INR",
                "period": "month",
                "features": [
                    "Everything in Pro",
                    "Trademark search",
                    "Brand kit generation",
                    "Custom domain suggestions",
                    "API access",
                    "Priority support",
                ],
            },
        ]
    }
