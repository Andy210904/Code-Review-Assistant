from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ReviewRequest(BaseModel):
    """Request model for code review."""
    include_suggestions: bool = Field(True, description="Whether to include improvement suggestions")
    analysis_depth: str = Field("standard", description="Level of analysis: basic, standard, or detailed")

class CodeIssue(BaseModel):
    """Model for a single code issue."""
    line_number: Optional[int] = Field(None, description="Line number where issue occurs")
    issue_type: str = Field(..., description="Type of issue (e.g., 'bug', 'style', 'performance')")
    severity: str = Field(..., description="Severity level: 'low', 'medium', 'high', 'critical'")
    message: str = Field(..., description="Description of the issue")
    suggestion: Optional[str] = Field(None, description="Suggested fix or improvement")

class CodeMetrics(BaseModel):
    """Model for code quality metrics."""
    lines_of_code: int = Field(..., description="Total lines of code")
    cyclomatic_complexity: Optional[int] = Field(None, description="Cyclomatic complexity score")
    maintainability_index: Optional[float] = Field(None, description="Maintainability index (0-100)")
    code_duplication: Optional[float] = Field(None, description="Percentage of duplicated code")

class CodeReview(BaseModel):
    """Model for code review results."""
    filename: str = Field(..., description="Name of the reviewed file")
    language: str = Field(..., description="Programming language detected")
    overall_score: float = Field(..., description="Overall code quality score (0-10)")
    readability_score: float = Field(..., description="Code readability score (0-10)")
    maintainability_score: float = Field(..., description="Code maintainability score (0-10)")
    issues: List[CodeIssue] = Field(default_factory=list, description="List of identified issues")
    suggestions: List[str] = Field(default_factory=list, description="General improvement suggestions")
    metrics: Optional[CodeMetrics] = Field(None, description="Code quality metrics")
    summary: str = Field(..., description="Summary of the review")
    reviewed_at: datetime = Field(default_factory=datetime.now, description="Timestamp of review")

class FileReviewResponse(BaseModel):
    """Response model for individual file review."""
    filename: str = Field(..., description="Name of the file")
    language: str = Field(..., description="Programming language")
    review: Optional[CodeReview] = Field(None, description="Review results")
    error: Optional[str] = Field(None, description="Error message if review failed")

class ProjectSummary(BaseModel):
    """Model for project-level summary."""
    total_files: int = Field(..., description="Total number of files reviewed")
    languages_detected: List[str] = Field(..., description="List of programming languages found")
    average_score: float = Field(..., description="Average quality score across all files")
    critical_issues: int = Field(..., description="Number of critical issues found")
    high_issues: int = Field(..., description="Number of high severity issues")
    medium_issues: int = Field(..., description="Number of medium severity issues")
    low_issues: int = Field(..., description="Number of low severity issues")
    key_recommendations: List[str] = Field(default_factory=list, description="Key project-level recommendations")

class ReviewResponse(BaseModel):
    """Standard API response model."""
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Response message")
    data: Optional[Any] = Field(None, description="Response data")
    timestamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")

class FileInfo(BaseModel):
    """Model for processed file information."""
    filename: str = Field(..., description="Original filename")
    content: str = Field(..., description="File content as string")
    language: str = Field(..., description="Detected programming language")
    size_bytes: int = Field(..., description="File size in bytes")
    encoding: str = Field(default="utf-8", description="File encoding")

# NEW MODELS FOR ENHANCED MULTIPLE FILE ANALYSIS (ADDITION ONLY)
class FileRelationship(BaseModel):
    """Model for describing relationships between files."""
    file1: str = Field(..., description="First file in the relationship")
    file2: str = Field(..., description="Second file in the relationship")
    relationship_type: str = Field(..., description="Type of relationship (imports, calls, inherits, etc.)")
    description: str = Field(..., description="Detailed description of the relationship")

class EnhancedProjectSummary(BaseModel):
    """Enhanced model for project-level summary with relationship analysis."""
    total_files: int = Field(..., description="Total number of files reviewed")
    languages_detected: List[str] = Field(..., description="List of programming languages found")
    average_score: float = Field(..., description="Average quality score (100-point scale)")
    security_score: float = Field(default=80.0, description="Average security score (100-point scale)")
    performance_score: float = Field(default=75.0, description="Average performance score (100-point scale)")
    critical_issues: int = Field(..., description="Number of critical issues found")
    high_issues: int = Field(..., description="Number of high priority issues found")
    medium_issues: int = Field(..., description="Number of medium priority issues found")
    low_issues: int = Field(..., description="Number of low priority issues found")
    key_recommendations: List[str] = Field(..., description="Key recommendations for the project")
    relationships: List[FileRelationship] = Field(..., description="Relationships between files")
    relationship_summary: str = Field(..., description="Overall summary of file relationships")
    architecture_overview: str = Field(..., description="High-level architecture and design overview")

class MultipleFileReviewResponse(BaseModel):
    """Enhanced response model for multiple file reviews with relationships."""
    success: bool = Field(..., description="Whether the review was successful")
    message: str = Field(..., description="Response message")
    file_reviews: List[FileReviewResponse] = Field(..., description="Individual file review results")
    enhanced_project_summary: EnhancedProjectSummary = Field(..., description="Enhanced project summary with relationships")
    total_files: int = Field(..., description="Total number of files processed")
    successful_reviews: int = Field(..., description="Number of successfully reviewed files")
    timestamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")