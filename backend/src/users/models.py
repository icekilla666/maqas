from sqlalchemy.orm import mapped_column, Mapped, relationship, column_property
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Enum, Integer, ForeignKey, UniqueConstraint
from uuid import uuid4

from src.database import Base
from src.users.schemas import UserStatus

class UsersModel(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    avatar_url: Mapped[str] = mapped_column(String(500), nullable=True)
    avatar_file_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=True)
    email: Mapped[str] = mapped_column(String(254), unique=True, nullable=False)
    bio: Mapped[str | None] = mapped_column(String(200), nullable=True)
    followers_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    followings_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    followers: Mapped[list["FollowsModel"]] = relationship("FollowsModel", foreign_keys="FollowsModel.following_id", back_populates="following_user")
    followings: Mapped[list["FollowsModel"]] = relationship("FollowsModel", foreign_keys="FollowsModel.follower_id", back_populates="follower_user")
    hashed_password: Mapped[str] = mapped_column(String(255))
    blocking: Mapped[list["BlackListModel"]] = relationship("BlackListModel", foreign_keys="BlackListModel.blocker_id", back_populates="blocker_user")
    blocked: Mapped[list["BlackListModel"]] = relationship("BlackListModel", foreign_keys="BlackListModel.blocking_id", back_populates="blocked_user")
    status: Mapped[Enum] = mapped_column(Enum(UserStatus, name="user_status_enum", native_enum=False), nullable=False, default=UserStatus.pending)
    refresh_tokens: Mapped[list["RefreshTokenModel"]] = relationship("RefreshTokenModel", back_populates="user", cascade="all, delete-orphan")
    @property
    def is_banned(self):
        if self.status == UserStatus.banned:
            return True
        return False
    

class FollowsModel(Base):
    __tablename__ = "follows"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    follower_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    following_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    follower_user: Mapped["UsersModel"] = relationship("UsersModel", foreign_keys=[follower_id], back_populates="followings")
    following_user: Mapped["UsersModel"] = relationship("UsersModel", foreign_keys=[following_id], back_populates="followers")
    __table_args__ = (UniqueConstraint('follower_id', 'following_id', name='unique_follow'),)

class BlackListModel(Base):
    __tablename__ = "black_list"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    blocker_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)  
    blocking_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False) 
    blocker_user: Mapped["UsersModel"] = relationship("UsersModel", foreign_keys=[blocker_id], back_populates="blocking")
    blocked_user: Mapped["UsersModel"] = relationship("UsersModel", foreign_keys=[blocking_id], back_populates="blocked")
    __table_args__ = (UniqueConstraint('blocker_id', 'blocking_id', name='unique_black_list'),)