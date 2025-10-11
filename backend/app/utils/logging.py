import os
import logging
import logging.handlers
from pathlib import Path
from app.config import settings

def setup_logging():
    """Configure logging for the application."""
    
    # Create logs directory if it doesn't exist
    log_dir = Path(settings.log_file_path).parent
    log_dir.mkdir(exist_ok=True)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.log_level.upper(), logging.INFO))
    
    # Clear any existing handlers
    root_logger.handlers.clear()
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(console_formatter)
    root_logger.addHandler(console_handler)
    
    # File handler with rotation
    if settings.log_file_path:
        file_handler = logging.handlers.RotatingFileHandler(
            settings.log_file_path,
            maxBytes=settings.log_file_max_size_mb * 1024 * 1024,
            backupCount=settings.log_file_backup_count
        )
        file_formatter = logging.Formatter(settings.log_format)
        file_handler.setFormatter(file_formatter)
        root_logger.addHandler(file_handler)
    
    # Set specific logger levels
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("fastapi").setLevel(logging.INFO)
    
    if settings.debug:
        logging.getLogger("app").setLevel(logging.DEBUG)
    
    return root_logger


def get_logger(name: str = None) -> logging.Logger:
    """Get a logger instance with the specified name."""
    if name is None:
        name = __name__
    return logging.getLogger(name)