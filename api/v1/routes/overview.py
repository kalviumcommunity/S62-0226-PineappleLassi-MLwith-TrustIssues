from fastapi import APIRouter
from schemas.overview import OverviewChartsResponse
from schemas.user import RiskyUserResponse
from services.overview import fetch_overview_charts, fetch_risky_users_details
from typing import List

router = APIRouter()

@router.get("/charts", response_model=OverviewChartsResponse)
def get_overview_charts():
    return fetch_overview_charts()

@router.get("/risky_users", response_model=List[RiskyUserResponse])
def get_overview_charts():
    return fetch_risky_users_details()