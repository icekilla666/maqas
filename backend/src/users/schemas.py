from pydantic import BaseModel, Field, EmailStr
from enum import Enum
from uuid import UUID

class UserStatus(str, Enum):
    active = "active"
    deactivated = "deactivated"
    banned = "banned"
    pending = "pending"
    
class UserOutShort(BaseModel):
    id: UUID
    username: str = Field(min_length=1, max_length=20)
    name: str = Field(min_length=1, max_length=50)
    avatar_url: None | str = Field(default=None, max_length=500)
    status: UserStatus

class UserOutMe(UserOutShort):
    email: EmailStr
    bio: None | str = Field(default=None, max_length=200)
    followers_count: int
    followings_count: int
    class Config:
        from_attributes = True

class UserOutFull(UserOutShort):
    bio: None | str = Field(default=None, max_length=200)
    followers_count: int
    followings_count: int
    is_blocked: bool = Field(default=False)
    class Config:
        from_attributes = True

class UserOutList(UserOutShort):
    total: int = Field(default=0, ge=0)

class UserUpdateMe(BaseModel):
    username: None | str = Field(default=None, min_length=1, max_length=20)
    name: None | str= Field(default=None, min_length=1, max_length=50)
    bio: None | str = Field(default=None, max_length=200)