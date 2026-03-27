from fastapi import APIRouter
from schemas.sessions import SessionsResponse
from schemas.user import UserResponse
from typing import List
from services.user import fetch_user_sessions, fetch_all_users

router = APIRouter()

@router.get("/sessions", response_model=List[SessionsResponse])
def get_user_sessions(user_id: str):
    return fetch_user_sessions(user_id)

@router.get("/", response_model=List[UserResponse])
def get_all_users():
    return fetch_all_users()

