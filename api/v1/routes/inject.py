from fastapi import APIRouter
from schemas.sessions import SessionsResponse
from schemas.inject import InjectRequest
from services.inject import inject_and_predict

router = APIRouter()

@router.post("/", response_model=SessionsResponse)
def inject_session(req: InjectRequest):
    return inject_and_predict(req.user_id, req.anomaly_type)