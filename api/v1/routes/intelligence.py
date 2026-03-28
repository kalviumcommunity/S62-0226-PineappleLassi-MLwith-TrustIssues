from fastapi import APIRouter
from schemas.intelligence import IntelligenceResponse
from services.intelligence import fetch_user_intelligence

router = APIRouter()

@router.get("/{user_id}", response_model=IntelligenceResponse)
def get_user_intelligence(user_id: str):
    return fetch_user_intelligence(user_id)