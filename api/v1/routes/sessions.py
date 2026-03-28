from fastapi import APIRouter
from schemas.sessions import SessionsResponse
from services.sessions import fetch_all_sessions, fetch_anomaly_sessions
from schemas.analytics import AnalyticsResponse
from services.analytics import fetch_analytics
from typing import List

router = APIRouter()

@router.get("/",response_model=List[SessionsResponse])
def get_all_sessions():
    return fetch_all_sessions()

@router.get("/anomaly",response_model=List[SessionsResponse])
def get_anomaly_sessions():
    return fetch_anomaly_sessions()

@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics():
    return fetch_analytics()