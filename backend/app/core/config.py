from __future__ import annotations

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "DoAide BizName"
    debug: bool = False

    database_url: str = "postgresql+psycopg://bizname:bizname@localhost:5432/bizname"
    openrouter_api_key: str = ""
    openrouter_model: str = "meta-llama/llama-4-maverick:free"

    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.8-flash"

    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7

    free_searches_per_day: int = 5
    cors_origins: list[str] = ["http://localhost:5173", "https://bizname.doaide.com"]

    class Config:
        env_file = ".env"


settings = Settings()
