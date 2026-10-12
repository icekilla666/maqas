from fastapi import Depends
from typing import Annotated

from src.users.repository import UsersRepository
from src.auth.repository import AuthRepository
from src.admins.repository import AdminsRepository
from src.posts.repository import PostsRepository
from src.comments.repository import CommentsRepository
from src.admins.service import AdminsService

def get_admins_repository():
    return AdminsRepository()

def get_auth_repository():
    return AuthRepository()

def get_users_repository():
    return UsersRepository()

def get_posts_repository():
    return PostsRepository()

def get_comments_repository():
    return CommentsRepository()

def get_admins_service(
    admins_repo: AdminsRepository = Depends(get_admins_repository),
    auth_repo: AuthRepository = Depends(get_auth_repository),
    users_repo: UsersRepository = Depends(get_users_repository),
    posts_repo: PostsRepository = Depends(get_posts_repository),
    comments_repo: CommentsRepository = Depends(get_comments_repository)
):
    return AdminsService(admins_repo, auth_repo, users_repo, posts_repo, comments_repo)

AdminsServiceDep = Annotated[AdminsService, Depends(get_admins_service)]
