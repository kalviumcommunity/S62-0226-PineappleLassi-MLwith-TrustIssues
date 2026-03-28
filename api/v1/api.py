from fastapi import APIRouter
from api.v1.routes import sessions, inject, user, overview, intelligence

api_router = APIRouter()

api_router.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])
api_router.include_router(inject.router, prefix="/inject", tags=["Inject"])
api_router.include_router(user.router, prefix="/user", tags=["User"])
api_router.include_router(overview.router, prefix="/overview", tags=["Overview"])
api_router.include_router(intelligence.router, prefix="/intelligence", tags=["Intelligence"])