"""Database engine and session lifecycle for the Noggin API."""
from __future__ import annotations
import os
from collections.abc import Generator
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool
from backend.models import Base

def database_url() -> str:
    return os.getenv("DATABASE_URL", "sqlite:///./noggin.db")

def build_engine(url: str | None = None) -> Engine:
    resolved_url = url or database_url()
    options: dict = {"pool_pre_ping": True}
    if resolved_url.startswith("sqlite"):
        options["connect_args"] = {"check_same_thread": False}
        if resolved_url in {"sqlite://", "sqlite:///:memory:"}:
            options["poolclass"] = StaticPool
    return create_engine(resolved_url, **options)

engine = build_engine()
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

def get_db() -> Generator[Session, None, None]:
    """Yield one request-scoped session and always close it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_schema_for_tests(db_engine: Engine) -> None:
    """Create metadata on an explicitly supplied test engine only."""
    Base.metadata.create_all(bind=db_engine)
