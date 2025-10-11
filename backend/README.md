# Code Review Assistant Backend

## Quick Start

1. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**

   ```bash
   # Copy and edit the environment file
   cp .env.example .env
   # Add your Google API key and Supabase credentials to .env
   ```

3. **Setup Supabase Database**

   ```bash
   # 1. Create a Supabase project at https://supabase.com
   # 2. Run the SQL schema from setup_supabase_schema.py in your Supabase SQL editor
   # 3. Add SUPABASE_URL and SUPABASE_KEY to your .env file
   
   # Test the database connection
   python test_supabase.py
   ```

4. **Test Configuration**

   ```bash
   python start.py
   ```

4. **Start the API Server**

   ```bash
   # Development (with auto-reload)
   python -m uvicorn app.main:app --reload

   # Or directly
   python app/main.py
   ```

5. **Access API Documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
   - Health Check: http://localhost:8000/health

## Features

### 🔍 Intelligent Code Analysis

- **Multi-language Support**: Python, JavaScript, Java, C++, Go, Rust, and more
- **LLM-Powered Reviews**: Uses OpenAI GPT-4 for intelligent code analysis
- **Multiple Analysis Depths**: Basic, Standard, and Detailed reviews
- **Issue Detection**: Identifies bugs, style issues, security concerns, and performance problems

### 📊 Comprehensive Reporting

- **Quality Scores**: Overall, readability, and maintainability metrics
- **Detailed Issues**: Line-by-line issue identification with severity levels
- **Actionable Suggestions**: Specific improvement recommendations
- **Project Summaries**: Cross-file analysis and architectural insights

### 🛡️ Robust Architecture

- **Multi-LLM Support**: OpenAI, Anthropic Claude, Google AI, Azure OpenAI
- **Fallback Mechanisms**: Static analysis when LLM is unavailable
- **Error Handling**: Graceful degradation and comprehensive error reporting
- **Configuration Management**: Environment-based settings with validation

## API Endpoints

### Code Review

- `POST /api/v1/review/single-file` - Review a single file
- `POST /api/v1/review/multiple-files` - Review multiple files with project analysis
- `GET /api/v1/review/supported-languages` - List supported programming languages
- `GET /api/v1/review/analysis-options` - Get available analysis configurations

### System

- `GET /` - API information and status
- `GET /health` - Health check endpoint

## Configuration

### Environment Variables (.env)

```env
# LLM Configuration - Google Gemini (Primary)
GOOGLE_API_KEY=your-google-api-key-here
GOOGLE_MODEL=gemini-2.5-flash-lite-preview-09-2025

# Supabase Database Configuration (REQUIRED)
SUPABASE_URL=your-supabase-project-url-here
SUPABASE_KEY=your-supabase-anon-key-here

# Server Configuration
DEBUG=True
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000

# File Processing
MAX_FILE_SIZE_MB=10
MAX_FILES_PER_REQUEST=20

# Analysis Configuration
DEFAULT_ANALYSIS_DEPTH=standard
ENABLE_SUGGESTIONS=True
```

### Supported File Types

- **Python**: `.py`
- **JavaScript/TypeScript**: `.js`, `.ts`, `.jsx`, `.tsx`
- **Java**: `.java`
- **C/C++**: `.c`, `.cpp`, `.h`, `.hpp`
- **Go**: `.go`
- **Rust**: `.rs`
- **PHP**: `.php`
- **Ruby**: `.rb`
- **Swift**: `.swift`
- **Kotlin**: `.kt`
- **C#**: `.cs`
- **And more...**

## Usage Examples

### Single File Review

```bash
curl -X POST "http://localhost:8000/api/v1/review/single-file" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@example.py" \
     -F "analysis_depth=standard" \
     -F "include_suggestions=true"
```

### Multiple Files Review

```bash
curl -X POST "http://localhost:8000/api/v1/review/multiple-files" \
     -H "Content-Type: multipart/form-data" \
     -F "files=@file1.py" \
     -F "files=@file2.js" \
     -F "analysis_depth=detailed"
```

## Response Format

```json
{
  "success": true,
  "message": "File reviewed successfully",
  "data": {
    "filename": "example.py",
    "language": "python",
    "overall_score": 8.5,
    "readability_score": 9.0,
    "maintainability_score": 8.0,
    "issues": [
      {
        "line_number": 25,
        "issue_type": "style",
        "severity": "medium",
        "message": "Line too long (>120 characters)",
        "suggestion": "Consider breaking this line into multiple lines"
      }
    ],
    "suggestions": [
      "Follow PEP 8 style guidelines",
      "Add type hints for better documentation"
    ],
    "summary": "Well-structured code with minor style improvements needed",
    "reviewed_at": "2025-10-10T12:00:00Z"
  }
}
```

## Development

### Project Structure

```
backend/
├── app/
│   ├── api/              # API routes and endpoints
│   ├── models/           # Pydantic data models
│   ├── services/         # Business logic and LLM integration
│   │   ├── code_analyzer.py    # Main analysis service
│   │   ├── llm_client.py       # LLM client factory
│   │   ├── prompt_templates.py # Analysis prompts
│   │   └── file_handler.py     # File processing
│   ├── utils/            # Helper utilities
│   ├── config.py         # Configuration management
│   └── main.py           # FastAPI application
├── requirements.txt      # Production dependencies
├── requirements-dev.txt  # Development dependencies
├── start.py             # Startup validation script
└── .env                 # Environment configuration
```

### Adding New LLM Providers

1. Create a new client class inheriting from `BaseLLMClient`
2. Implement the required methods: `generate_response()` and `is_available()`
3. Add the client to `LLMClientFactory.get_client()`
4. Add configuration settings to `config.py`

### Testing

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## Deployment

### Docker (Coming Soon)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Considerations

- Set `ENVIRONMENT=production` in `.env`
- Use a proper WSGI server like Gunicorn
- Configure proper logging and monitoring
- Set up rate limiting for API endpoints
- Use environment variables for sensitive configuration

## Troubleshooting

### Common Issues

1. **"Import errors"**

   - Ensure all dependencies are installed: `pip install -r requirements.txt`
   - Check Python path and virtual environment

2. **"LLM API errors"**

   - Verify API keys are correctly set in `.env`
   - Check network connectivity and API quotas
   - Review API key permissions

3. **"File upload errors"**

   - Check file size limits (default: 10MB)
   - Verify file extensions are supported
   - Ensure proper file encoding (UTF-8 recommended)

4. **"Configuration errors"**
   - Run `python start.py` to validate configuration
   - Check `.env` file format and values
   - Verify all required environment variables are set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure code passes linting and tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
