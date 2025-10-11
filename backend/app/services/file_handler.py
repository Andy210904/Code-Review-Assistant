from fastapi import UploadFile, HTTPException
from typing import Dict, List, Optional
import os
import chardet
from app.models.review_models import FileInfo

class FileHandler:
    """Handles file upload, validation, and processing."""
    
    # Supported file extensions and their corresponding languages
    SUPPORTED_EXTENSIONS = {
        '.py': 'python',
        '.cpp': 'cpp',
        '.c': 'c',
        '.java': 'java',
        '.js': 'javascript',
        '.ts': 'typescript',
        '.cs': 'csharp',
        '.go': 'go',
        '.rs': 'rust',
        '.php': 'php',
        '.rb': 'ruby',
        '.swift': 'swift',
        '.kt': 'kotlin',
        '.scala': 'scala',
        '.r': 'r',
        '.sql': 'sql',
        '.sh': 'bash',
        '.ps1': 'powershell',
        '.html': 'html',
        '.css': 'css',
        '.jsx': 'javascript',
        '.tsx': 'typescript',
        '.vue': 'javascript',
        '.dart': 'dart'
    }
    
    # Maximum file size (10MB)
    MAX_FILE_SIZE = 10 * 1024 * 1024
    
    def __init__(self):
        """Initialize the file handler."""
        pass
    
    async def process_uploaded_file(self, file: UploadFile) -> FileInfo:
        """
        Process an uploaded file and extract relevant information.
        
        Args:
            file: The uploaded file from FastAPI
            
        Returns:
            FileInfo: Processed file information
            
        Raises:
            HTTPException: If file validation fails
        """
        # Validate file
        self._validate_file(file)
        
        # Read file content
        content = await file.read()
        
        # Check file size
        if len(content) > self.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {self.MAX_FILE_SIZE / (1024*1024):.1f}MB"
            )
        
        # Detect encoding
        encoding = self._detect_encoding(content)
        
        # Decode content
        try:
            decoded_content = content.decode(encoding)
        except UnicodeDecodeError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to decode file: {str(e)}"
            )
        
        # Detect language
        language = self._detect_language(file.filename)
        
        # Reset file position for potential future reads
        await file.seek(0)
        
        return FileInfo(
            filename=file.filename,
            content=decoded_content,
            language=language,
            size_bytes=len(content),
            encoding=encoding
        )
    
    def _validate_file(self, file: UploadFile) -> None:
        """
        Validate the uploaded file.
        
        Args:
            file: The uploaded file
            
        Raises:
            HTTPException: If validation fails
        """
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No filename provided"
            )
        
        # Check if file extension is supported
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in self.SUPPORTED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file_ext}. Supported types: {list(self.SUPPORTED_EXTENSIONS.keys())}"
            )
        
        # Check content type if available
        if file.content_type:
            # Allow text files and some specific types
            allowed_content_types = [
                'text/plain',
                'text/x-python',
                'text/x-java-source',
                'text/x-c',
                'text/x-c++',
                'application/javascript',
                'application/typescript',
                'text/html',
                'text/css'
            ]
            
            # Be flexible with content type checking
            if not any(allowed_type in file.content_type for allowed_type in ['text/', 'application/']) and file.content_type != 'application/octet-stream':
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid content type: {file.content_type}"
                )
    
    def _detect_encoding(self, content: bytes) -> str:
        """
        Detect the encoding of file content.
        
        Args:
            content: Raw file content as bytes
            
        Returns:
            str: Detected encoding, defaults to 'utf-8'
        """
        try:
            # Use chardet to detect encoding
            detected = chardet.detect(content)
            encoding = detected.get('encoding', 'utf-8')
            
            # Fallback to utf-8 if detection is uncertain
            if not encoding or detected.get('confidence', 0) < 0.7:
                encoding = 'utf-8'
                
            return encoding
        except Exception:
            # If detection fails, default to utf-8
            return 'utf-8'
    
    def _detect_language(self, filename: str) -> str:
        """
        Detect programming language from filename.
        
        Args:
            filename: Name of the file
            
        Returns:
            str: Detected programming language
        """
        file_ext = os.path.splitext(filename)[1].lower()
        return self.SUPPORTED_EXTENSIONS.get(file_ext, 'unknown')
    
    def get_supported_languages(self) -> Dict[str, List[str]]:
        """
        Get supported programming languages and their extensions.
        
        Returns:
            Dict mapping languages to their file extensions
        """
        languages = {}
        for ext, lang in self.SUPPORTED_EXTENSIONS.items():
            if lang not in languages:
                languages[lang] = []
            languages[lang].append(ext)
        
        return languages
    
    def is_supported_file(self, filename: str) -> bool:
        """
        Check if a file is supported for review.
        
        Args:
            filename: Name of the file to check
            
        Returns:
            bool: True if file is supported, False otherwise
        """
        file_ext = os.path.splitext(filename)[1].lower()
        return file_ext in self.SUPPORTED_EXTENSIONS