from fastapi import Depends, Form
from typing import Annotated

from src.posts.repository import PostsRepository
from src.posts.service import PostsService
from src.posts.schemas import PostTags
from src.users.repository import UsersRepository

def get_posts_repository():
    return PostsRepository()

def get_users_repository():
    return UsersRepository()

def get_posts_service(
    posts_repo: PostsRepository = Depends(get_posts_repository),
    users_repo: UsersRepository = Depends(get_users_repository)
):
    return PostsService(posts_repo, users_repo)

PostsServiceDep = Annotated[PostsService, Depends(get_posts_service)]

class PostCreateForm:
    def __init__(self, title: str = Form(...), content: str = Form(...), tags: list[PostTags] = Form(...)):
        self.title = title
        self.content = content
        self.tags = tags 

PostCreateFormDep = Annotated[PostCreateForm, Depends()]

class PostUpdateForm:
    def __init__(self, title: None | str = Form(None), content: None | str = Form(None), tags: None| list[PostTags] = Form(None)):
        self.title = title
        self.content = content
        self.tags = tags 

PostUpdateFormDep = Annotated[PostUpdateForm, Depends()]