from fastapi import FastAPI
from .database import engine, Base
from . import models
from .routes import auth_routes, tracking_routes
from .routes.analytics_routes import router as analytics_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create tables automatically
Base.metadata.create_all(bind=engine)
app.include_router(auth_routes.router)
app.include_router(tracking_routes.router)
app.include_router(analytics_router)


@app.get("/")
def read_root():
    return {"message": "Vigility Dashboard Backend Running "}