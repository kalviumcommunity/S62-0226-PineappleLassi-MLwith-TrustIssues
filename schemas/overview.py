from pydantic import BaseModel
from typing import List


class AlertTrendPoint(BaseModel):
    day: str
    alerts: int


class RiskDistributionItem(BaseModel):
    name: str
    value: int


class SystemStats(BaseModel):
    totalUsers: int
    highRiskUsers: int
    alertsToday: int
    avgRiskScore: float


class OverviewChartsResponse(BaseModel):
    alert_trend: List[AlertTrendPoint]
    risk_distribution: List[RiskDistributionItem]
    system_stats: SystemStats