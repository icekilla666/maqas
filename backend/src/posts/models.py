from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Enum, TIMESTAMP
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone

from src.database import Base
from src.posts.schemas import PostTags

class PostsModel(Base):
    __tablename__ = "posts"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(String(5000), nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    image_file_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=True)
    tags: Mapped[list["TagsModel"]] = relationship(secondary="post_tag", back_populates="posts")
    hashtags: Mapped[list["HashtagsModel"]] = relationship(secondary="post_hashtag", back_populates="posts")
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    user: Mapped["UsersModel"] = relationship("UsersModel", back_populates="posts")

class PostTagModel(Base):
    __tablename__ = "post_tag"
    post_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True, nullable=False)
    tag_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True, nullable=False)


class TagsModel(Base):
    __tablename__ = "tags"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tag: Mapped[Enum] = mapped_column(Enum(PostTags, name="post_tags_enum", native_enum=False), unique=True, nullable=False)
    posts: Mapped[list["PostsModel"]] = relationship(secondary="post_tag", back_populates="tags")

class PostHashtagModel(Base):
    __tablename__ = "post_hashtag"
    post_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True, nullable=False)
    hashtag_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("hashtags.id", ondelete="CASCADE"), primary_key=True, nullable=False)

class HashtagsModel(Base):
    __tablename__ = "hashtags"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    hashtag: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    posts: Mapped[list["PostsModel"]] = relationship(secondary="post_hashtag", back_populates="hashtags")