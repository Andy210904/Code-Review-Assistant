import json
import uuid
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
from app.models.history_models import AnalysisHistoryCreate, AnalysisHistoryResponse, AnalysisHistoryDB
from app.services.database import db_service

logger = logging.getLogger(__name__)


class AnalysisHistoryService:
    """Service for managing analysis history using Supabase database"""
    
    def __init__(self):
        self.table_name = "analysis_history"
    
    async def save_analysis(self, analysis_data: AnalysisHistoryCreate) -> AnalysisHistoryResponse:
        """Save a new analysis to Supabase database"""
        try:
            # Generate unique ID
            analysis_id = str(uuid.uuid4())
            
            # Set creation timestamp if not provided
            created_at = datetime.utcnow()
            if analysis_data.created_at:
                try:
                    if isinstance(analysis_data.created_at, str):
                        created_at = datetime.fromisoformat(analysis_data.created_at.replace('Z', '+00:00'))
                    else:
                        created_at = analysis_data.created_at
                except (ValueError, TypeError):
                    created_at = datetime.utcnow()
            
            # Prepare data for Supabase (snake_case fields)
            db_data = {
                "id": analysis_id,
                "user_id": analysis_data.user_id,
                "filename": analysis_data.filename,
                "file_type": analysis_data.file_type,
                "summary": analysis_data.summary,
                "results": analysis_data.results,
                "quality_score": analysis_data.quality_score or 0,
                "security_score": analysis_data.security_score or 0,
                "performance_score": analysis_data.performance_score or 0,
                "issues": analysis_data.issues or [],
                "file_count": analysis_data.file_count or 1,
                "file_names": analysis_data.file_names or [],
                "created_at": created_at.isoformat()
            }
            
            # Insert into Supabase
            result = await db_service.insert(self.table_name, db_data)
            
            if not result:
                raise Exception("Failed to insert analysis into database")
            
            # Return the inserted data as response model
            inserted_data = result[0] if isinstance(result, list) else result
            return AnalysisHistoryResponse(
                id=inserted_data["id"],
                userId=inserted_data["user_id"],
                filename=inserted_data["filename"],
                fileType=inserted_data["file_type"],
                summary=inserted_data["summary"],
                results=inserted_data["results"],
                qualityScore=inserted_data["quality_score"],
                securityScore=inserted_data["security_score"],
                performanceScore=inserted_data["performance_score"],
                issues=inserted_data["issues"],
                fileCount=inserted_data["file_count"],
                fileNames=inserted_data["file_names"],
                createdAt=datetime.fromisoformat(inserted_data["created_at"])
            )
            
        except Exception as e:
            logger.error(f"Failed to save analysis: {str(e)}")
            raise Exception(f"Failed to save analysis: {str(e)}")
    
    async def get_user_analyses(self, user_id: str, page: int = 1, per_page: int = 10) -> Dict[str, Any]:
        """Get all analyses for a user with pagination from Supabase"""
        try:
            # Calculate offset for pagination
            offset = (page - 1) * per_page
            
            # Get total count
            total_count = await db_service.count(self.table_name, {"user_id": user_id})
            
            # Get paginated results ordered by created_at descending
            result = await db_service.select(
                self.table_name,
                columns="*",
                filters={"user_id": user_id},
                order="created_at.desc",
                limit=per_page,
                offset=offset
            )
            
            # Convert to response models
            analyses = []
            for row in result:
                analyses.append(AnalysisHistoryResponse(
                    id=row["id"],
                    userId=row["user_id"],
                    filename=row["filename"],
                    fileType=row["file_type"],
                    summary=row["summary"],
                    results=row["results"],
                    qualityScore=row["quality_score"],
                    securityScore=row["security_score"],
                    performanceScore=row["performance_score"],
                    issues=row["issues"],
                    fileCount=row["file_count"],
                    fileNames=row["file_names"],
                    createdAt=datetime.fromisoformat(row["created_at"])
                ))
            
            total_pages = (total_count + per_page - 1) // per_page
            
            return {
                "analyses": analyses,
                "total": total_count,
                "page": page,
                "per_page": per_page,
                "total_pages": total_pages
            }
            
        except Exception as e:
            logger.error(f"Failed to retrieve analyses: {str(e)}")
            raise Exception(f"Failed to retrieve analyses: {str(e)}")
    
    async def get_analysis_by_id(self, analysis_id: str, user_id: str) -> Optional[AnalysisHistoryResponse]:
        """Get a specific analysis by ID (with user verification) from Supabase"""
        try:
            result = await db_service.select(
                self.table_name,
                columns="*",
                filters={"id": analysis_id, "user_id": user_id}
            )
            
            if not result:
                return None
            
            row = result[0]
            return AnalysisHistoryResponse(
                id=row["id"],
                userId=row["user_id"],
                filename=row["filename"],
                fileType=row["file_type"],
                summary=row["summary"],
                results=row["results"],
                qualityScore=row["quality_score"],
                securityScore=row["security_score"],
                performanceScore=row["performance_score"],
                issues=row["issues"],
                fileCount=row["file_count"],
                fileNames=row["file_names"],
                createdAt=datetime.fromisoformat(row["created_at"])
            )
            
        except Exception as e:
            logger.error(f"Failed to retrieve analysis: {str(e)}")
            raise Exception(f"Failed to retrieve analysis: {str(e)}")
    
    async def delete_analysis(self, analysis_id: str, user_id: str) -> bool:
        """Delete an analysis (with user verification) from Supabase"""
        try:
            # Delete from Supabase with user verification
            result = await db_service.delete(
                self.table_name,
                filters={"id": analysis_id, "user_id": user_id}
            )
            
            # Check if any rows were affected
            return len(result) > 0 if result else False
            
        except Exception as e:
            logger.error(f"Failed to delete analysis: {str(e)}")
            raise Exception(f"Failed to delete analysis: {str(e)}")
    
    async def get_user_statistics(self, user_id: str) -> Dict[str, Any]:
        """Get statistics for a user's analyses from Supabase"""
        try:
            # Get all user analyses
            result = await db_service.select(
                self.table_name,
                columns="quality_score,security_score,performance_score,file_type,issues",
                filters={"user_id": user_id}
            )
            
            if not result:
                return {
                    "total_analyses": 0,
                    "avg_quality_score": 0,
                    "avg_security_score": 0,
                    "avg_performance_score": 0,
                    "single_file_count": 0,
                    "multiple_file_count": 0,
                    "total_issues": 0
                }
            
            analyses = result
            total_analyses = len(analyses)
            
            quality_scores = [a["quality_score"] for a in analyses if a["quality_score"]]
            security_scores = [a["security_score"] for a in analyses if a["security_score"]]
            performance_scores = [a["performance_score"] for a in analyses if a["performance_score"]]
            
            single_file_count = len([a for a in analyses if a["file_type"] == "single"])
            multiple_file_count = len([a for a in analyses if a["file_type"] == "multiple"])
            total_issues = sum(len(a["issues"]) for a in analyses if a["issues"])
            
            return {
                "total_analyses": total_analyses,
                "avg_quality_score": sum(quality_scores) / len(quality_scores) if quality_scores else 0,
                "avg_security_score": sum(security_scores) / len(security_scores) if security_scores else 0,
                "avg_performance_score": sum(performance_scores) / len(performance_scores) if performance_scores else 0,
                "single_file_count": single_file_count,
                "multiple_file_count": multiple_file_count,
                "total_issues": total_issues
            }
            
        except Exception as e:
            logger.error(f"Failed to get statistics: {str(e)}")
            raise Exception(f"Failed to get statistics: {str(e)}")


# Global instance
analysis_history_service = AnalysisHistoryService()