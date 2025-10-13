from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List, Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application Settings
    app_name: str = Field(default="Code Review Assistant API", alias="APP_NAME")
    app_version: str = Field(default="1.0.0", alias="APP_VERSION")
    app_description: str = Field(default="An intelligent code review system using LLM", alias="APP_DESCRIPTION")
    debug: bool = Field(default=False, alias="DEBUG")
    environment: str = Field(default="production", alias="ENVIRONMENT")
    
    # Server Configuration
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    reload: bool = Field(default=False, alias="RELOAD")
    log_level: str = Field(default="info", alias="LOG_LEVEL")
    
    # Security Settings
    secret_key: str = Field(default="change-this-in-production", alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(default=30, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    algorithm: str = Field(default="HS256", alias="ALGORITHM")
    
    # CORS Configuration
    allowed_origins: List[str] = Field(
        default=["http://localhost:3000","http://code-review-assistant-one.vercel.app/","https://code-review-assistant-one.vercel.app/","https://code-review-assistant-git-master-andy210904s-projects.vercel.app/","https://code-review-assistant-oztcbu4wb-andy210904s-projects.vercel.app/"], 
        alias="ALLOWED_ORIGINS"
    )
    allow_credentials: bool = Field(default=True, alias="ALLOW_CREDENTIALS")
    
    
    # Alternative LLM Providers
    anthropic_api_key: Optional[str] = Field(default=None, alias="ANTHROPIC_API_KEY")
    anthropic_model: str = Field(default="claude-3-sonnet-20240229", alias="ANTHROPIC_MODEL")
    
    google_api_key: Optional[str] = Field(default=None, alias="GOOGLE_API_KEY")
    google_model: str = Field(default="gemini-2.5-flash-lite-preview-09-2025", alias="GOOGLE_MODEL")
    
    # Azure OpenAI
    azure_openai_endpoint: Optional[str] = Field(default=None, alias="AZURE_OPENAI_ENDPOINT")
    azure_openai_api_key: Optional[str] = Field(default=None, alias="AZURE_OPENAI_API_KEY")
    azure_openai_api_version: str = Field(default="2023-12-01-preview", alias="AZURE_OPENAI_API_VERSION")
    azure_openai_deployment_name: Optional[str] = Field(default=None, alias="AZURE_OPENAI_DEPLOYMENT_NAME")
    
    # Local LLM
    local_llm_endpoint: Optional[str] = Field(default=None, alias="LOCAL_LLM_ENDPOINT")
    local_llm_model: str = Field(default="llama2", alias="LOCAL_LLM_MODEL")
    
    # File Processing Configuration
    max_file_size_mb: int = Field(default=10, alias="MAX_FILE_SIZE_MB")
    max_files_per_request: int = Field(default=20, alias="MAX_FILES_PER_REQUEST")
    supported_extensions: str = Field(
        default=".py,.js,.ts,.java,.cpp,.c,.go,.rs,.php,.rb,.swift,.kt,.cs",
        alias="SUPPORTED_EXTENSIONS"
    )
    default_encoding: str = Field(default="utf-8", alias="DEFAULT_ENCODING")
    encoding_detection_confidence: float = Field(default=0.7, alias="ENCODING_DETECTION_CONFIDENCE")
    
    # Code Analysis Configuration
    default_analysis_depth: str = Field(default="standard", alias="DEFAULT_ANALYSIS_DEPTH")
    enable_suggestions: bool = Field(default=True, alias="ENABLE_SUGGESTIONS")
    max_issues_per_file: int = Field(default=50, alias="MAX_ISSUES_PER_FILE")
    max_suggestions_per_file: int = Field(default=10, alias="MAX_SUGGESTIONS_PER_FILE")
    
    # Scoring Configuration
    base_quality_score: float = Field(default=10.0, alias="BASE_QUALITY_SCORE")
    critical_issue_penalty: float = Field(default=3.0, alias="CRITICAL_ISSUE_PENALTY")
    high_issue_penalty: float = Field(default=2.0, alias="HIGH_ISSUE_PENALTY")
    medium_issue_penalty: float = Field(default=1.0, alias="MEDIUM_ISSUE_PENALTY")
    low_issue_penalty: float = Field(default=0.5, alias="LOW_ISSUE_PENALTY")
    
    # Complexity Thresholds
    max_line_length: int = Field(default=120, alias="MAX_LINE_LENGTH")
    high_complexity_threshold: int = Field(default=15, alias="HIGH_COMPLEXITY_THRESHOLD")
    maintainability_threshold: int = Field(default=60, alias="MAINTAINABILITY_THRESHOLD")
    
    # Database Configuration (Optional)
    database_url: Optional[str] = Field(default=None, alias="DATABASE_URL")
    db_pool_size: int = Field(default=10, alias="DB_POOL_SIZE")
    db_max_overflow: int = Field(default=20, alias="DB_MAX_OVERFLOW")
    
    # Supabase Configuration
    supabase_url: Optional[str] = Field(default=None, alias="SUPABASE_URL")
    supabase_key: Optional[str] = Field(default=None, alias="SUPABASE_KEY")
    supabase_service_key: Optional[str] = Field(default=None, alias="SUPABASE_SERVICE_KEY")
    
    # Redis Configuration (Optional)
    redis_url: Optional[str] = Field(default=None, alias="REDIS_URL")
    redis_password: Optional[str] = Field(default=None, alias="REDIS_PASSWORD")
    cache_ttl_seconds: int = Field(default=3600, alias="CACHE_TTL_SECONDS")
    
    # Logging Configuration
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        alias="LOG_FORMAT"
    )
    log_file_path: str = Field(default="logs/app.log", alias="LOG_FILE_PATH")
    log_file_max_size_mb: int = Field(default=10, alias="LOG_FILE_MAX_SIZE_MB")
    log_file_backup_count: int = Field(default=5, alias="LOG_FILE_BACKUP_COUNT")
    
    # Metrics and Monitoring
    enable_metrics: bool = Field(default=False, alias="ENABLE_METRICS")
    prometheus_port: int = Field(default=9090, alias="PROMETHEUS_PORT")
    health_check_timeout: int = Field(default=30, alias="HEALTH_CHECK_TIMEOUT")
    
    # Rate Limiting
    rate_limit_enabled: bool = Field(default=False, alias="RATE_LIMIT_ENABLED")
    rate_limit_requests_per_minute: int = Field(default=60, alias="RATE_LIMIT_REQUESTS_PER_MINUTE")
    rate_limit_burst: int = Field(default=10, alias="RATE_LIMIT_BURST")
    
    # Email Configuration
    smtp_server: Optional[str] = Field(default=None, alias="SMTP_SERVER")
    smtp_port: int = Field(default=587, alias="SMTP_PORT")
    smtp_username: Optional[str] = Field(default=None, alias="SMTP_USERNAME")
    smtp_password: Optional[str] = Field(default=None, alias="SMTP_PASSWORD")
    from_email: Optional[str] = Field(default=None, alias="FROM_EMAIL")
    
    # API Documentation
    docs_url: str = Field(default="/docs", alias="DOCS_URL")
    redoc_url: str = Field(default="/redoc", alias="REDOC_URL")
    openapi_url: str = Field(default="/openapi.json", alias="OPENAPI_URL")
    include_api_docs: bool = Field(default=True, alias="INCLUDE_API_DOCS")
    
    # Development Settings
    enable_debug_endpoints: bool = Field(default=False, alias="ENABLE_DEBUG_ENDPOINTS")
    mock_llm_responses: bool = Field(default=False, alias="MOCK_LLM_RESPONSES")
    save_request_logs: bool = Field(default=False, alias="SAVE_REQUEST_LOGS")
    
    # Testing
    test_database_url: str = Field(default="sqlite+aiosqlite:///./test.db", alias="TEST_DATABASE_URL")
    test_openai_api_key: str = Field(default="test-key-for-mocking", alias="TEST_OPENAI_API_KEY")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"
    
    @property
    def max_file_size_bytes(self) -> int:
        """Convert MB to bytes."""
        return self.max_file_size_mb * 1024 * 1024
    
    @property
    def supported_extensions_list(self) -> List[str]:
        """Get supported extensions as a list."""
        return [ext.strip() for ext in self.supported_extensions.split(",")]
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment.lower() in ["development", "dev", "local"]
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.environment.lower() in ["production", "prod"]
    
    def get_llm_provider(self) -> str:
        """Determine which LLM provider to use based on available API keys."""
        if self.openai_api_key:
            return "openai"
        elif self.anthropic_api_key:
            return "anthropic"
        elif self.google_api_key:
            return "google"
        elif self.azure_openai_api_key:
            return "azure_openai"
        elif self.local_llm_endpoint:
            return "local"
        else:
            return "mock"  # For development without API keys

# Global settings instance
settings = Settings()

def get_settings() -> Settings:
    """Get application settings (dependency injection for FastAPI)."""
    return settings