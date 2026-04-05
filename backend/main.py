from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from src.database import engine, Base
from src.routers import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        yield

app = FastAPI(
    lifespan=lifespan,
    servers=[{"url": "http://localhost:8000", "description": "Local"}],
    root_path="/api"
    )

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)

"""
cd backend
source .venv/bin/activate
uvicorn main:app --reload
"""