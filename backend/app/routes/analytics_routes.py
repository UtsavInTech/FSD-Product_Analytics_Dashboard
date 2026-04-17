from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv

from ..database import get_db
from ..models import FeatureClick, User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@router.get("/analytics")
def get_analytics(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    age: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    feature_name: Optional[str] = Query(None),
    scope: Optional[str] = Query("user"),  # ⭐ NEW
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    # ⭐ GLOBAL vs USER MODE
    if scope == "global":
        base_query = db.query(FeatureClick).join(User)
    else:
        base_query = db.query(FeatureClick).filter(
            FeatureClick.user_id == user_id
        ).join(User)

    # DATE FILTERS
    if start_date:
        base_query = base_query.filter(
            FeatureClick.timestamp >= datetime.fromisoformat(start_date)
        )

    if end_date:
        base_query = base_query.filter(
            FeatureClick.timestamp <= datetime.fromisoformat(end_date)
        )

    # DEMOGRAPHIC FILTERS
    if age == "lt18":
        base_query = base_query.filter(User.age < 18)

    elif age == "18to40":
        base_query = base_query.filter(User.age >= 18).filter(User.age <= 40)

    elif age == "gt40":
        base_query = base_query.filter(User.age > 40)

    if gender is not None:
        base_query = base_query.filter(User.gender == gender)

    feature_results = base_query.all()

    feature_counts = {}

    for click in feature_results:
        feature_counts[click.feature_name] = (
            feature_counts.get(click.feature_name, 0) + 1
        )

    timeline_query = base_query

    if feature_name:
        timeline_query = timeline_query.filter(
            FeatureClick.feature_name == feature_name
        )

    timeline_results = timeline_query.all()

    timeline_counts = {}

    for click in timeline_results:
        date_str = click.timestamp.date().isoformat()

        timeline_counts[date_str] = (
            timeline_counts.get(date_str, 0) + 1
        )

    return {
        "feature_usage": feature_counts,
        "timeline_usage": timeline_counts,
        "total_clicks": len(feature_results),
    }