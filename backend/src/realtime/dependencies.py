from fastapi import Depends
from typing import Annotated

from src.realtime.manager import realtime_manager
from src.realtime.service import RealtimeService
from src.users.repository import UsersRepository
from src.users.dependencies import get_users_repository


def get_realtime_service(
    users_repo: UsersRepository = Depends(get_users_repository),
):
    return RealtimeService(manager=realtime_manager, users_repo=users_repo)

RealtimeServiceDep = Annotated[RealtimeService, Depends(get_realtime_service)]