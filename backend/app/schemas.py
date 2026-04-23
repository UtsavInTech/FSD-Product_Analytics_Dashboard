from pydantic import BaseModel
from datetime import datetime


# USER SCHEMAS

class UserCreate(BaseModel):
    username: str
    password: str
    age: int
    gender: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    age: int
    gender: str

    class Config:
        from_attributes = True


# FEATURE CLICK SCHEMAS

class FeatureClickCreate(BaseModel):
    feature_name: str


class FeatureClickResponse(BaseModel):
    id: int
    user_id: int
    feature_name: str
    timestamp: datetime

    class Config:
        from_attributes = True
