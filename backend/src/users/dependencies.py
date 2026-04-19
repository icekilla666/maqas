from fastapi import Depends
from typing import Annotated

from src.users.repository import UsersRepository
from src.users.service import UsersService
from src.auth.repository import AuthRepository

def get_users_repository():
    return UsersRepository()

def get_auth_repository():
    return AuthRepository()

def get_users_service(
    users_repo: UsersRepository = Depends(get_users_repository),
    auth_repo: AuthRepository = Depends(get_auth_repository),
):
    return UsersService(users_repo, auth_repo)

UsersServiceDep = Annotated[UsersService, Depends(get_users_service)]
