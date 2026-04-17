from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv

from ..database import get_db
from ..models import FeatureClick
from ..schemas import FeatureClickCreate

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@router.post("/track")
def track_feature(
    feature: FeatureClickCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    new_click = FeatureClick(
        user_id=user_id,
        feature_name=feature.feature_name,
    )

    db.add(new_click)
    db.commit()

    return {"message": "Feature tracked successfully"}