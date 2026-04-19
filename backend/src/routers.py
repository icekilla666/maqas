from fastapi import APIRouter

from src.auth.router import auth_router
from src.users.router import users_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(users_router)