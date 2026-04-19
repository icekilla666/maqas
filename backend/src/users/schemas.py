from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from enum import Enum

class UserStatus(str, Enum):
    active = "active"
    deactivated = "deactivated"
    banned = "banned"
    pending = "pending"
    
class UserOut(BaseModel):
    display_username: str = Field(min_length=1, max_length=20)
    name: str = Field(min_length=1, max_length=50)
    bio: None | str = Field(default=None, max_length=200)
    class Config:
        from_attributes = True

class UserOutMe(UserOut):
    email: EmailStr

class UserUpdateMe(BaseModel):
    username: Optional[str] = Field(default=None, min_length=1, max_length=20)
    name: Optional[str] = Field(default=None, min_length=1, max_length=50)
    bio: Optional[str] = Field(default=None, max_length=200)