from fastapi import APIRouter
from api.v1.routes import sessions, inject, user

api_router = APIRouter()

api_router.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])
api_router.include_router(inject.router, prefix="/inject", tags=["Inject"])
api_router.include_router(user.router, prefix="/user", tags=["User"])