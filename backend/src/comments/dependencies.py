from fastapi import Depends
from typing import Annotated

from src.posts.repository import PostsRepository
from src.comments.repository import CommentsRepository
from src.comments.service import CommentsService
from src.users.repository import UsersRepository

def get_comments_repository():
    return CommentsRepository()

def get_posts_repository():
    return PostsRepository()

def get_users_repository():
    return UsersRepository()

def get_comments_service(
    comments_repo: CommentsRepository = Depends(get_comments_repository),
    posts_repo: PostsRepository = Depends(get_posts_repository),
    users_repo: UsersRepository = Depends(get_users_repository)
):
    return CommentsService(comments_repo, posts_repo, users_repo)

CommentsServiceDep = Annotated[CommentsService, Depends(get_comments_service)]
