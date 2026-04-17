import random
from datetime import datetime, timedelta

from app.database import SessionLocal
from app.models import User, FeatureClick
from app.auth import hash_password


db = SessionLocal()

print("Seeding users...")

users_data = [
    ("amrita", 17, "Female"),
    ("Sumit", 24, "Male"),
    ("charlie", 32, "Male"),
    ("Ayushi", 45, "Female"),
    ("Atul", 52, "Male"),
]

users = []

for username, age, gender in users_data:

    existing = db.query(User).filter(User.username == username).first()

    if not existing:
        user = User(
            username=username,
            password=hash_password("1234"),
            age=age,
            gender=gender,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        users.append(user)

    else:
        users.append(existing)

print("Users ready.")

features = [
    "date_picker",
    "filter_gender",
    "filter_age",
    "chart_bar",
    "export_csv",
    "search",
]

print("Generating feature clicks...")

for _ in range(120):  # generates 120 records

    random_user = random.choice(users)

    click = FeatureClick(
        user_id=random_user.id,
        feature_name=random.choice(features),
        timestamp=datetime.utcnow()
        - timedelta(days=random.randint(0, 30))
    )

    db.add(click)

db.commit()

print("Seed data inserted successfully.")