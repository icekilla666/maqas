from fastapi import APIRouter, status, UploadFile, File
from uuid import UUID

from src.posts.dependencies import PostsServiceDep, PostCreateFormDep, PostUpdateFormDep
from src.common.schemas import ResponseSchema
from src.posts.schemas import PostCreate, PostOut, PostUpdate
from src.auth.dependencies import AuthDep
from src.database import SessionDep

posts_router = APIRouter(prefix="/posts", tags=["posts"])

@posts_router.post("/create", response_model=ResponseSchema[PostOut], status_code=status.HTTP_201_CREATED)
async def create_post(
    post: PostCreateFormDep,
    current_user: AuthDep,
    session: SessionDep,
    posts_service: PostsServiceDep,
    image: UploadFile | None = File(None)
):
    post_schema = PostCreate(
        title=post.title,
        content=post.content,
        tags=post.tags
    )
    created_post = await posts_service.create_post(post_schema, image, current_user, session)
    return created_post

@posts_router.patch("/{post_id}", response_model=ResponseSchema[PostOut], status_code=status.HTTP_200_OK)
async def update_post(
    post_id: UUID,
    update_data: PostUpdateFormDep,
    current_user: AuthDep,
    session: SessionDep,
    posts_service: PostsServiceDep,
    image_removed: bool,
    image: UploadFile | None = File(None)
):
    update_schema = PostUpdate(
        title=update_data.title,
        content=update_data.content,
        tags=update_data.tags
    )
    updated_post = await posts_service.update_post(post_id, update_schema, image_removed, image, current_user, session)
    return updated_post