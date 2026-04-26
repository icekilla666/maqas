from pydantic import BaseModel, Field, EmailStr, model_validator

class UserRegister(BaseModel):
    username: str = Field(min_length=1, max_length=20)
    name: str = Field(min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    password_confirm: str
    @model_validator(mode="after")
    def check_password_match(self):
        if self.password != self.password_confirm:
            raise ValueError("Passwords do not match")
        return self
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

class UserEmail(BaseModel):
    email: EmailStr