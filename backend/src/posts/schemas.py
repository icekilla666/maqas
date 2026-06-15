from pydantic import BaseModel, Field, ConfigDict
from enum import Enum
from uuid import UUID
from datetime import datetime

from src.users.schemas import UserOutShort

class PostTags(str, Enum):
    sports = "спорт"
    art = "искусство"  
    music = "музыка"
    movies = "кино"
    games = "игры"
    books = "книги"
    science = "наука"
    tech = "технологии"
    business = "бизнес"
    travel = "путешествия"
    food = "еда"
    fashion = "мода"
    photo = "фотография"
    fitness = "фитнес"
    health = "здоровье"
    family = "семья"
    relationships = "отношения"
    humor = "юмор"
    lifehacks = "лайфхаки"
    news = "новости"
    politics = "политика"

class TagOut(BaseModel):
    tag: PostTags
    model_config = ConfigDict(from_attributes=True)

class HashtagOut(BaseModel):
    hashtag: str
    model_config = ConfigDict(from_attributes=True)

class PostCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    content: str = Field(min_length=1, max_length=5000)
    tags: list[PostTags]

class PostOutFull(BaseModel):
    id: UUID
    title: str = Field(min_length=1, max_length=100)
    content: str = Field(min_length=1, max_length=5000)
    tags: list[TagOut]
    hashtags: None | list[HashtagOut] = Field(default_factory=list)
    image_url: None | str = Field(default=None)
    created_at: datetime
    user: UserOutShort
    model_config = ConfigDict(from_attributes=True)

class PostOutShort(BaseModel):
    id: UUID
    title: str = Field(min_length=1, max_length=100)
    preview: str = Field(min_length=1, max_length=150)
    tags: list[TagOut]
    hashtags: None | list[HashtagOut] = Field(default_factory=list)
    image_url: None | str = Field(default=None)
    created_at: datetime
    user: UserOutShort
    model_config = ConfigDict(from_attributes=True)

class PostUpdate(BaseModel):
    title: None | str= Field(default=None, min_length=1, max_length=100)
    content: None | str= Field(default=None, min_length=1, max_length=5000)
    tags: None | list[PostTags] = Field(default=None)

class FeedType(Enum):
    all = "all"
    following = "following"

class FeedSort(Enum):
    old = "old"
    new = "new"
    popular = "popular"


