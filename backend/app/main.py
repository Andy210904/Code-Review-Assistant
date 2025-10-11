from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import review_router
from app.config import settings
from app.utils.logging import setup_logging
import logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    
    app = FastAPI(
        title=settings.app_name,
        description=settings.app_description,
        version=settings.app_version,
        docs_url=settings.docs_url if settings.include_api_docs else None,
        redoc_url=settings.redoc_url if settings.include_api_docs else None,
        openapi_url=settings.openapi_url if settings.include_api_docs else None
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=settings.allow_credentials,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include API routers
    app.include_router(
        review_router.router,
        prefix="/api/v1/review",
        tags=["Code Review"]
    )
    
    @app.get("/")
    async def root():
        """Root endpoint with API information."""
        return {
            "message": settings.app_name,
            "version": settings.app_version,
            "environment": settings.environment,
            "docs": settings.docs_url if settings.include_api_docs else "disabled",
            "status": "active"
        }
    
    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "message": "API is running successfully"}
    
    # Global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request, exc):
        logger.error(f"Global exception: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"message": "Internal server error", "detail": str(exc)}
        )
    
    return app

# Create the app instance
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        log_level=settings.log_level
    )