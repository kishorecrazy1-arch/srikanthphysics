from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import catalog, generate, questions


def create_app() -> FastAPI:
    app = FastAPI(title="Srikanth Academy — Daily Question Engine", version="1.0.0")
    origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins if origins else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(catalog.router, prefix="/v1/catalog", tags=["catalog"])
    app.include_router(generate.router, prefix="/v1", tags=["generate"])
    app.include_router(questions.router, prefix="/v1", tags=["questions"])

    @app.get("/", include_in_schema=False)
    def root():
        return {"service": "daily-question-engine", "health": "/health", "docs": "/docs"}

    @app.get("/health")
    def health():
        return {"status": "ok", "service": "daily-question-engine"}

    return app


app = create_app()
