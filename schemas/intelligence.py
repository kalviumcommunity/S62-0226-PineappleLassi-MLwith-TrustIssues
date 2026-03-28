from pydantic import BaseModel
from typing import List


class RiskPoint(BaseModel):
    day: str
    risk: float


class LoginDeviationPoint(BaseModel):
    hour: int


class DataAccessItem(BaseModel):
    name: str
    value: int


class ComplianceItem(BaseModel):
    name: str
    value: float


class FeatureImportanceItem(BaseModel):
    feature: str
    impact: float


class RadarItem(BaseModel):
    subject: str
    A: float


class IntelligenceResponse(BaseModel):
    risk_trend: List[RiskPoint]
    login_deviation: List[LoginDeviationPoint]
    data_access: List[DataAccessItem]
    compliance: List[ComplianceItem]
    feature_importance: List[FeatureImportanceItem]
    radar_profile: List[RadarItem]