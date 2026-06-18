from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey, UniqueConstraint
from uuid import uuid4

from src.database import Base

class LikesModel(Base):
    __tablename__ = "likes"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    post_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    post: Mapped["PostsModel"] = relationship("PostsModel", back_populates="likes")
    user: Mapped["UsersModel"] = relationship("UsersModel", back_populates="likes")
    __table_args__ = (UniqueConstraint('post_id', 'user_id', name='unique_like'),)