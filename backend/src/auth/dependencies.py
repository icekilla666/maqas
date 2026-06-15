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

security = HTTPBearer(auto_error=False)

async def get_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    session: SessionDep
):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "message": "Не выполнен вход в аккаунт",
                "error": "INVALID_TOKEN"
            }
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "message": "Не выполнен вход в аккаунт",
                "error": "WRONG_TOKEN_TYPE"
            }
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "message": "Не выполнен вход в аккаунт",
                "error": "INVALID_TOKEN_STRUCTURE"
            }
        )

    try:
        user_uuid = UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "message": "Не выполнен вход в аккаунт",
                "error": "INVALID_ID_IN_TOKEN"
            }
        )

    repo = UsersRepository()
    user = await repo.get_by_id(user_uuid, session)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "message": "Не выполнен вход в аккаунт",
                "error": "USER_NOT_FOUND"
            }
        )

    if user.status == UserStatus.banned:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "message": "Аккаунт заблокирован",
                "error": "ACCOUNT_BANNED"
            }
        )
    
    if user.status == UserStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "message": "Аккаунт не подтвержден",
                "error": "ACCOUNT_PENDING"
            }
        )
    
    return user

async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    session: SessionDep
):
    current_user = await get_user(credentials, session)
    return current_user

AuthDep = Annotated[UsersModel, Depends(get_current_user)]

async def get_optional_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
    session: SessionDep
):
    print("1. get_optional_user вызван")
    print("2. credentials:", credentials)
    
    if not credentials:
        print("3. Нет credentials, возвращаю None")
        return None
    
    try:
        optional_user = await get_user(credentials, session)
        print("4. Пользователь получен:", optional_user.id if optional_user else None)
        return optional_user
    except HTTPException as e:
        print("5. Ошибка:", e.status_code, e.detail)
        return None
    

OptionalAuthDep = Annotated[UsersModel | None, Depends(get_optional_user)]

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