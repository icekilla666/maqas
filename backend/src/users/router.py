from fastapi import APIRouter, status, Response, UploadFile

from src.users.schemas import UserOutMe, UserUpdateMe
from src.auth.dependencies import AuthDep
from src.database import SessionDep
from src.users.dependencies import UsersServiceDep

users_router = APIRouter(prefix="/users", tags=["users"])

@users_router.get("/me", response_model=UserOutMe, status_code=status.HTTP_200_OK)
async def get_me(
    current_user: AuthDep
):
    return current_user

@users_router.patch("/me", response_model=UserOutMe, status_code=status.HTTP_200_OK)
async def update_me(
    update_data: UserUpdateMe,
    current_user: AuthDep,
    session: SessionDep,
    users_service: UsersServiceDep
):
    updated_user = await users_service.update_me(update_data, current_user, session)
    return updated_user

@users_router.post("/me", status_code=status.HTTP_200_OK)
async def delete_me(
    current_user: AuthDep,
    response: Response,
    session: SessionDep,
    users_service: UsersServiceDep
):
    delete_data = await users_service.delete_me(response, current_user, session)
    return delete_data

@users_router.post("/me/avatar", status_code=status.HTTP_200_OK)
async def upload_avatar(
    file: UploadFile,
    current_user: AuthDep,
    session: SessionDep,
    users_service: UsersServiceDep
):
    file_url = await users_service.upload_avatar(file, current_user, session)
    return file_url

@users_router.delete("/me/avatar", status_code=status.HTTP_200_OK)
async def delete_avatar(
    current_user: AuthDep,
    session: SessionDep,
    users_service: UsersServiceDep
):
    delete_avatar_data = await users_service.delete_avatar(current_user, session)
    return delete_avatar_data