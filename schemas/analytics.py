from pydantic import BaseModel
from typing import List


class RiskPoint(BaseModel):
    day: str
    risk: float


class DeviceRisk(BaseModel):
    device_type: str
    count: int


class DepartmentRisk(BaseModel):
    department: str
    score: int


class AnalyticsResponse(BaseModel):
    risk_over_time: List[RiskPoint]
    device_risk: List[DeviceRisk]
    department_risk: List[DepartmentRisk]