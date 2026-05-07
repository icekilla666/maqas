from pydantic import BaseModel, Field, EmailStr, model_validator

class UserRegister(BaseModel):
    username: str = Field(min_length=1, max_length=20)
    name: str = Field(min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    password_confirm: str = Field(min_length=8, max_length=72)
    
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

class UserEmail(BaseModel):
    email: EmailStr