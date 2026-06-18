from fastapi import Depends
from typing import Annotated

from src.posts.repository import PostsRepository
from src.likes.repository import LikesRepository
from src.likes.service import LikesService

def get_likes_repository():
    return LikesRepository()

def get_posts_repository():
    return PostsRepository()

def get_likes_service(
    likes_repo: LikesRepository = Depends(get_likes_repository),
    posts_repo: PostsRepository = Depends(get_posts_repository)
):
    return LikesService(likes_repo, posts_repo)

LikesServiceDep = Annotated[LikesService, Depends(get_likes_service)]
