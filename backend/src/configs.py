from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent  

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int 
    EMAIL_VERIFY_TOKEN_EXPIRE_MiNUTES: int 

    VERIFY_EMAIL_URL: str
    
    SMTP_SERVER: str
    SMTP_PORT: int 
    SMTP_USER: str
    SMTP_PASSWORD: str
    EMAIL_FROM: str

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8"
    )

settings = Settings()