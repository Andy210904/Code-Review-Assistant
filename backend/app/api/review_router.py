from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List, Optional
import logging
from app.services.code_analyzer import CodeAnalyzer
from app.services.file_handler import FileHandler
from app.models.review_models import ReviewRequest, ReviewResponse, FileReviewResponse

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize services
code_analyzer = CodeAnalyzer()
file_handler = FileHandler()

@router.post("/single-file", response_model=ReviewResponse)
async def review_single_file(
    file: UploadFile = File(...),
    include_suggestions: bool = True,
    analysis_depth: str = "standard"
):
    """
    Review a single source code file.
    
    Args:
        file: The source code file to review
        include_suggestions: Whether to include improvement suggestions
        analysis_depth: Level of analysis - 'basic', 'standard', or 'detailed'
    
    Returns:
        ReviewResponse: Detailed review report with analysis and suggestions
    """
    try:
        logger.info(f"Reviewing single file: {file.filename}")
        
        # Validate file
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file provided"
            )
        
        # Process file
        file_info = await file_handler.process_uploaded_file(file)
        
        # Analyze code
        review_result = await code_analyzer.analyze_code(
            code_content=file_info.content,
            language=file_info.language,
            filename=file_info.filename,
            include_suggestions=include_suggestions,
            analysis_depth=analysis_depth
        )
        
        return ReviewResponse(
            success=True,
            message="File reviewed successfully",
            data=review_result
        )
        
    except Exception as e:
        logger.error(f"Error reviewing file {file.filename}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to review file: {str(e)}"
        )

@router.post("/multiple-files", response_model=ReviewResponse)
async def review_multiple_files(
    files: List[UploadFile] = File(...),
    include_suggestions: bool = True,
    analysis_depth: str = "standard"
):
    """
    Review multiple source code files.
    
    Args:
        files: List of source code files to review
        include_suggestions: Whether to include improvement suggestions
        analysis_depth: Level of analysis - 'basic', 'standard', or 'detailed'
    
    Returns:
        ReviewResponse: Combined review report for all files
    """
    try:
        logger.info(f"Reviewing {len(files)} files")
        
        if not files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No files provided"
            )
        
        # Enforce file limit to prevent LLM prompt overload
        max_files = 3
        if len(files) > max_files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Maximum {max_files} files allowed for analysis. Current request has {len(files)} files."
            )
        
        file_reviews = []
        
        # Process each file
        for file in files:
            try:
                # Process file
                file_info = await file_handler.process_uploaded_file(file)
                
                # Analyze code
                review_result = await code_analyzer.analyze_code(
                    code_content=file_info.content,
                    language=file_info.language,
                    filename=file_info.filename,
                    include_suggestions=include_suggestions,
                    analysis_depth=analysis_depth
                )
                
                file_reviews.append(FileReviewResponse(
                    filename=file_info.filename,
                    language=file_info.language,
                    review=review_result
                ))
                
            except Exception as e:
                logger.error(f"Error processing file {file.filename}: {str(e)}")
                # Continue with other files, but log the error
                file_reviews.append(FileReviewResponse(
                    filename=file.filename,
                    language="unknown",
                    review=None,
                    error=str(e)
                ))
        
        # Generate summary
        summary = await code_analyzer.generate_project_summary(file_reviews)
        
        return ReviewResponse(
            success=True,
            message=f"Successfully reviewed {len(file_reviews)} files",
            data={
                "file_reviews": file_reviews,
                "project_summary": summary,
                "total_files": len(files),
                "successful_reviews": len([fr for fr in file_reviews if fr.review is not None])
            }
        )
        
    except Exception as e:
        logger.error(f"Error reviewing multiple files: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to review files: {str(e)}"
        )

@router.get("/supported-languages")
async def get_supported_languages():
    """
    Get list of supported programming languages.
    
    Returns:
        List of supported languages with their file extensions
    """
    return {
        "supported_languages": file_handler.get_supported_languages(),
        "message": "List of supported programming languages and their extensions"
    }

@router.get("/analysis-options")
async def get_analysis_options():
    """
    Get available analysis options and configurations.
    
    Returns:
        Available analysis depths and options
    """
    return {
        "analysis_depths": ["basic", "standard", "detailed"],
        "options": {
            "include_suggestions": {
                "type": "boolean",
                "default": True,
                "description": "Include improvement suggestions in the review"
            },
            "analysis_depth": {
                "type": "string",
                "options": ["basic", "standard", "detailed"],
                "default": "standard",
                "description": "Level of code analysis detail"
            }
        }
    }