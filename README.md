# DoAide BizName — AI Business Name Generator

AI-powered business name generator with domain availability checking, social handle verification, and name scoring. Part of the [DoAide](https://doaide.com) product family.

## Features

- **Free tool**: Enter keyword/industry → AI generates 10 creative business names
- **Domain check**: Instant .com, .in, .io, .co availability
- **Social handles**: Twitter, Instagram, LinkedIn, Facebook handle check
- **Name scoring**: Memorability, brandability, length scoring
- **Share**: One-click copy, WhatsApp, Twitter sharing
- **Save favorites** (Pro): Save and manage your favorite names
- **Pricing**: Free (5/day) / Pro ₹299/mo / Business ₹799/mo

## Tech Stack

- **Backend**: Python FastAPI + SQLAlchemy + Alembic + PostgreSQL
- **Frontend**: React + Vite + Tailwind CSS
- **AI**: OpenRouter (meta-llama/llama-4-maverick:free)

## Quick Start

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # edit with your keys
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Docker

```bash
docker compose up
```

## Tests

```bash
cd backend && python -m pytest
cd frontend && npm test
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENROUTER_MODEL` | AI model (default: meta-llama/llama-4-maverick:free) |
| `JWT_SECRET` | JWT signing secret |
| `FREE_SEARCHES_PER_DAY` | Rate limit for free users (default: 5) |
