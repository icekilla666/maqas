from fastapi import APIRouter, status, UploadFile, File, Query
from uuid import UUID

from src.posts.dependencies import PostsServiceDep, PostCreateFormDep, PostUpdateFormDep
from src.common.schemas import ResponseSchema, PaginatedResponseSchema
from src.posts.schemas import PostCreate, PostOutFull, PostUpdate, PostOutShort, FeedType, FeedSort, PostTags
from src.auth.dependencies import AuthDep, OptionalAuthDep
from src.database import SessionDep

posts_router = APIRouter(prefix="/posts", tags=["posts"])

@posts_router.get("/feed", response_model=PaginatedResponseSchema[list[PostOutShort]], status_code=status.HTTP_200_OK)
async def get_feed(
    optional_user: OptionalAuthDep,
    session: SessionDep,
    posts_service: PostsServiceDep,
    feed_type: None | FeedType = Query(FeedType.all),
    search_query: None | str = Query(None, max_length=20),
    tags: None | list[PostTags] = Query(None),
    sort: None | FeedSort = Query(FeedSort.new),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    feed = await posts_service.get_feed(feed_type, search_query, tags, sort, skip, limit, optional_user, session)
    return feed

@posts_router.post("/create", response_model=ResponseSchema[PostOutFull], status_code=status.HTTP_201_CREATED)
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

@posts_router.get("/me", response_model=PaginatedResponseSchema[list[PostOutShort]], status_code=status.HTTP_200_OK)
async def get_my_posts(
    current_user: AuthDep,
    session: SessionDep,
    posts_service: PostsServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    posts = await posts_service.get_my_posts(current_user, skip, limit, session)
    return posts
    
@posts_router.get("/users/{user_id}", response_model=PaginatedResponseSchema[list[PostOutShort]], status_code=status.HTTP_200_OK)
async def get_users_posts(
    user_id: UUID,
    session: SessionDep,
    posts_service: PostsServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    posts = await posts_service.get_users_posts(user_id, skip, limit, session)
    return posts

@posts_router.patch("/{post_id}", response_model=ResponseSchema[PostOutFull], status_code=status.HTTP_200_OK)
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

@posts_router.get("/{post_id}", response_model=ResponseSchema[PostOutFull], status_code=status.HTTP_200_OK)
async def get_by_id(
    post_id: UUID,
    session: SessionDep,
    posts_service: PostsServiceDep
):
    post = await posts_service.get_by_id(post_id, session)
    return post

@posts_router.delete("/{post_id}", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def delete_post(
    post_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    posts_service: PostsServiceDep
):
    delete_post_data = await posts_service.delete_post(post_id, current_user, session)
    return delete_post_data

