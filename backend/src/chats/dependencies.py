from fastapi import Depends
from typing import Annotated

from src.chats.service import ChatsService
from src.chats.repository import ChatsRepository
from src.users.repository import UsersRepository
from src.realtime.service import RealtimeService
from src.realtime.dependencies import get_realtime_service

def get_chats_repository():
    return ChatsRepository()

def get_users_repository():
    return UsersRepository()

def get_chats_service(
    chats_repo: ChatsRepository = Depends(get_chats_repository),
    users_repo: UsersRepository = Depends(get_users_repository),
    realtime_service: RealtimeService = Depends(get_realtime_service)
):
    return ChatsService(chats_repo, users_repo, realtime_service)

ChatsServiceDep = Annotated[ChatsService, Depends(get_chats_service)]
