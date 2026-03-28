from fastapi import APIRouter
from schemas.overview import OverviewChartsResponse
from services.overview import fetch_overview_charts

router = APIRouter()

@router.get("/charts", response_model=OverviewChartsResponse)
def get_overview_charts():
    return fetch_overview_charts()