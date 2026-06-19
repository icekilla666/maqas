from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey, String, TIMESTAMP, Integer, Boolean
from uuid import uuid4
from datetime import datetime, timezone

from src.database import Base

class CommentsModel(Base):
    __tablename__ = "comments"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    content: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    replies_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    post_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    parent_id: Mapped[None | UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("comments.id"), nullable=True)
    post: Mapped["PostsModel"] = relationship("PostsModel", back_populates="comments")
    user: Mapped["UsersModel"] = relationship("UsersModel", back_populates="comments")
    parent: Mapped["CommentsModel"] = relationship("CommentsModel", remote_side=[id], back_populates="replies")
    replies: Mapped[list["CommentsModel"]] = relationship("CommentsModel", back_populates="parent")