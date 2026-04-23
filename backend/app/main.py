from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from . import models
from .routes import auth_routes, tracking_routes
from .routes.analytics_routes import router as analytics_router


app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://fsd-product-analytics-dashboard.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_routes.router)
app.include_router(tracking_routes.router)
app.include_router(analytics_router)


@app.get("/")
def read_root():
    return {"message": "Vigility Dashboard Backend Running"}
