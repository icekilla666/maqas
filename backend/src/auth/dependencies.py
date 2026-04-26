from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Annotated
from uuid import UUID

from src.users.models import UsersModel
from src.database import SessionDep
from src.auth.jwt import decode_token
from src.auth.repository import AuthRepository
from src.users.schemas import UserStatus
from src.auth.service import AuthService
from src.users.repository import UsersRepository

security = HTTPBearer()

async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    session: SessionDep
) -> UsersModel:
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный или просроченный токен доступа"
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный тип токена"
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверная структура токена"
        )

    try:
        user_uuid = UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный идентификатор пользователя в токене"
        )

    repo = UsersRepository()
    user = await repo.get_by_id(user_uuid, session)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )

    if user.status != UserStatus.active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Аккаунт деактивирован"
        )

    return user

AuthDep = Annotated[UsersModel, Depends(get_current_user)]

def get_auth_repository():
    return AuthRepository()

def get_users_repository():
    return UsersRepository()

def get_auth_service(
    auth_repo: AuthRepository = Depends(get_auth_repository),
    users_repo: UsersRepository = Depends(get_users_repository)
):
    return AuthService(auth_repo, users_repo)

AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]