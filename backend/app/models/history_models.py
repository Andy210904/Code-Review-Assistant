from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class AnalysisHistoryCreate(BaseModel):
    """Schema for creating a new analysis record"""
    user_id: str
    filename: str
    file_type: str = Field(alias="fileType")
    summary: str
    results: Dict[str, Any]  # Store the complete analysis results as JSON
    quality_score: Optional[int] = Field(default=0, alias="qualityScore")
    security_score: Optional[int] = Field(default=0, alias="securityScore")
    performance_score: Optional[int] = Field(default=0, alias="performanceScore")
    issues: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    file_count: Optional[int] = Field(default=1, alias="fileCount")
    file_names: Optional[List[str]] = Field(default_factory=list, alias="fileNames")
    created_at: Optional[str] = Field(default=None, alias="createdAt")

    class Config:
        populate_by_name = True  # Allow both alias and field name


class AnalysisHistoryResponse(BaseModel):
    """Schema for analysis history response"""
    id: str
    user_id: str = Field(alias="userId")
    filename: str
    file_type: str = Field(alias="fileType")
    summary: str
    results: Dict[str, Any]
    quality_score: int = Field(alias="qualityScore")
    security_score: int = Field(alias="securityScore")
    performance_score: int = Field(alias="performanceScore")
    issues: List[Dict[str, Any]]
    file_count: int = Field(alias="fileCount")
    file_names: List[str] = Field(alias="fileNames")
    created_at: datetime = Field(alias="createdAt")

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class AnalysisHistoryDB(BaseModel):
    """Schema for database operations (snake_case fields)"""
    id: Optional[str] = None
    user_id: str
    filename: str
    file_type: str
    summary: str
    results: Dict[str, Any]
    quality_score: int = 0
    security_score: int = 0
    performance_score: int = 0
    issues: List[Dict[str, Any]] = Field(default_factory=list)
    file_count: int = 1
    file_names: List[str] = Field(default_factory=list)
    created_at: Optional[datetime] = None


class AnalysisHistoryList(BaseModel):
    """Schema for list of analysis history"""
    analyses: List[AnalysisHistoryResponse]
    total: int
    page: int = 1
    per_page: int = 10