from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Dict, Any, Optional
from app.models.history_models import AnalysisHistoryCreate, AnalysisHistoryResponse
from app.services.history_service import analysis_history_service
from app.utils.logging import get_logger

# Create router
router = APIRouter()
logger = get_logger(__name__)


@router.post("/save", response_model=AnalysisHistoryResponse)
async def save_analysis(analysis_data: AnalysisHistoryCreate):
    """Save a new analysis to the history"""
    try:
        logger.info(f"Saving analysis for user {analysis_data.user_id}: {analysis_data.filename}")
        
        result = await analysis_history_service.save_analysis(analysis_data)
        
        logger.info(f"Analysis saved successfully with ID: {result.id}")
        return result
        
    except Exception as e:
        logger.error(f"Error saving analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save analysis: {str(e)}")


@router.get("/user/{user_id}")
async def get_user_analyses(
    user_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page")
):
    """Get all analyses for a specific user with pagination"""
    try:
        logger.info(f"Retrieving analyses for user {user_id}, page {page}")
        
        result = await analysis_history_service.get_user_analyses(user_id, page, per_page)
        
        logger.info(f"Retrieved {len(result['analyses'])} analyses for user {user_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error retrieving user analyses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve analyses: {str(e)}")


@router.get("/{analysis_id}")
async def get_analysis_by_id(
    analysis_id: str,
    user_id: str = Query(..., description="User ID for verification")
):
    """Get a specific analysis by ID"""
    try:
        logger.info(f"Retrieving analysis {analysis_id} for user {user_id}")
        
        result = await analysis_history_service.get_analysis_by_id(analysis_id, user_id)
        
        if not result:
            raise HTTPException(status_code=404, detail="Analysis not found or access denied")
        
        logger.info(f"Analysis {analysis_id} retrieved successfully")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve analysis: {str(e)}")


@router.delete("/{analysis_id}")
async def delete_analysis(
    analysis_id: str,
    user_id: str = Query(..., description="User ID for verification")
):
    """Delete a specific analysis"""
    try:
        logger.info(f"Deleting analysis {analysis_id} for user {user_id}")
        
        success = await analysis_history_service.delete_analysis(analysis_id, user_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Analysis not found or access denied")
        
        logger.info(f"Analysis {analysis_id} deleted successfully")
        return {"message": "Analysis deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete analysis: {str(e)}")


@router.get("/user/{user_id}/statistics")
async def get_user_statistics(user_id: str):
    """Get statistics for a user's analyses"""
    try:
        logger.info(f"Retrieving statistics for user {user_id}")
        
        result = await analysis_history_service.get_user_statistics(user_id)
        
        logger.info(f"Statistics retrieved for user {user_id}: {result['total_analyses']} analyses")
        return result
        
    except Exception as e:
        logger.error(f"Error retrieving statistics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve statistics: {str(e)}")