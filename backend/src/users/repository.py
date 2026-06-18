from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update, exists, literal
from sqlalchemy.orm import contains_eager

from src.users.models import UsersModel, FollowsModel, BlackListModel

class UsersRepository:
    async def get_by_email(self, email: str, session: AsyncSession):
        query = select(UsersModel).where(UsersModel.email == email)
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        return user
    
    async def get_by_id(self, id: UUID, session: AsyncSession):
        query = select(UsersModel).where(UsersModel.id == id)
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        return user
    
    async def get_by_username(self, username: str, session: AsyncSession):
        query = select(UsersModel).where(UsersModel.username == username)
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        return user
    
    async def get_by_similar_username(self, username: str, skip: int, limit: int, session: AsyncSession):
        query = select(UsersModel).where(func.similarity(UsersModel.username, username) > 0.3).order_by(func.similarity(UsersModel.username, username).desc()).offset(skip).limit(limit)
        result = await session.execute(query)
        users = result.scalars().all()
        return users
    
    async def get_follow(self, follower_id: UUID, following_id: UUID, session: AsyncSession):
        query = select(FollowsModel).where(FollowsModel.follower_id == follower_id, FollowsModel.following_id == following_id)
        result = await session.execute(query)
        follow = result.scalar_one_or_none()
        return follow
    
    async def follow_user(self, follow: FollowsModel, session: AsyncSession):
        follower_query = update(UsersModel).where(UsersModel.id == follow.follower_id).values(followings_count=UsersModel.followings_count + 1)
        await session.execute(follower_query)
        following_query = update(UsersModel).where(UsersModel.id == follow.following_id).values(followers_count=UsersModel.followers_count + 1)
        await session.execute(following_query)
        session.add(follow)
        await session.commit()
        await session.refresh(follow)

    async def unfollow_user(self, follow: FollowsModel, session: AsyncSession):
        follower_query = update(UsersModel).where(UsersModel.id == follow.follower_id).values(followings_count=UsersModel.followings_count - 1)
        await session.execute(follower_query)
        following_query = update(UsersModel).where(UsersModel.id == follow.following_id).values(followers_count=UsersModel.followers_count - 1)
        await session.execute(following_query)
        await session.delete(follow)
        await session.commit()

    async def get_followers(self, user_id: UUID, skip: int, limit: int, session: AsyncSession):
        query = select(UsersModel).join(FollowsModel, UsersModel.id == FollowsModel.follower_id).where(FollowsModel.following_id == user_id).options(contains_eager(UsersModel.followers)).offset(skip).limit(limit)
        result = await session.execute(query)
        followers = result.unique().scalars().all()
        return followers
    
    async def get_followings(self, user_id: UUID, skip: int, limit: int, session: AsyncSession):
        query = select(UsersModel).join(FollowsModel, UsersModel.id == FollowsModel.following_id).where(FollowsModel.follower_id == user_id).options(contains_eager(UsersModel.followings)).offset(skip).limit(limit)
        result = await session.execute(query)
        followings = result.unique().scalars().all()
        return followings
    
    async def get_block(self, blocker_id: UUID, blocking_id: UUID, session):
        query = select(BlackListModel).where(BlackListModel.blocker_id == blocker_id, BlackListModel.blocking_id == blocking_id)
        result = await session.execute(query)
        block = result.scalar_one_or_none()
        return block
    
    async def block_user(self, block: BlackListModel, session: AsyncSession):
        session.add(block)
        await session.commit()
        await session.refresh(block)

    async def unblock_user(self, block: BlackListModel, session: AsyncSession):
        await session.delete(block)
        await session.commit()

    async def get_my_blacklist(self, user_id: UUID, skip: int, limit: int, session: AsyncSession):
        query = select(UsersModel).join(BlackListModel, UsersModel.id == BlackListModel.blocking_id).where(BlackListModel.blocker_id == user_id).options(contains_eager(UsersModel.blocked)).offset(skip).limit(limit)
        result = await session.execute(query)
        blacklist = result.unique().scalars()
        total_query = select(func.count()).select_from(BlackListModel).where(BlackListModel.blocker_id == user_id)
        total_result = await session.execute(total_query)
        total = total_result.scalar()
        return blacklist, total
    
    async def get_by_id_with_follow_status(self, user_id: UUID, current_user_id: UUID, session: AsyncSession):
        is_following = exists().where(FollowsModel.follower_id == current_user_id, FollowsModel.following_id == UsersModel.id).label("is_following")
        query = select(UsersModel, is_following).where(UsersModel.id == user_id)
        result = await session.execute(query)
        return result.one_or_none()