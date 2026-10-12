from fastapi import APIRouter, status
from uuid import UUID

from src.common.schemas import ResponseSchema
from src.auth.dependencies import AdminsAuthDep
from src.database import SessionDep
from src.admins.dependencies import AdminsServiceDep

admins_router = APIRouter(prefix="/admins", tags=["admins"])

@admins_router.post("/users/{user_id}/ban", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def ban_user(
    user_id: UUID,
    admin: AdminsAuthDep,
    session: SessionDep,
    admins_service: AdminsServiceDep
):
    ban_user_data = await admins_service.ban_user(user_id, session)
    return ban_user_data

@admins_router.post("/users/{user_id}/unban", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def unban_user(
    user_id: UUID,
    admin: AdminsAuthDep,
    session: SessionDep,
    admins_service: AdminsServiceDep
):
    unban_user_data = await admins_service.unban_user(user_id, session)
    return unban_user_data
