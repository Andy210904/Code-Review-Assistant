# Code Review Assistant

<div align = "center">
    <h3>AI-Powered Code Review and Analysis Tool</h3>
    <p>Enhance your code quality with intelligent analysis, suggestions, and comprehensive reporting</p>
    <p>Frontend Deployment : https://code-review-assistant-one.vercel.app</p>
    <p>Backend Deployment : https://code-review-assistant-s55r.onrender.com</p>
    <p>API Documentation : https://code-review-assistant-s55r.onrender.com/docs</p>
</div>

## 🎥 DEMO 
[![Watch the video](/Thumbnail.png)](https://www.youtube.com/watch?v=5FmutZIuh4s)

## 🌟 Overview

The Code Review Assistant is a comprehensive web application that leverages AI to analyze source code files and provide detailed reviews, suggestions, and quality assessments. It supports both single file and multiple file analysis, offering insights into code quality, security, performance, and maintainability.

### Key Capabilities

- **Single File Analysis**: Deep dive into individual code files with detailed metrics
- **Multiple File Analysis**: Project-wide analysis with relationship detection between files
- **AI-Powered Insights**: Leverages LLM for intelligent code understanding
- **Quality Metrics**: Comprehensive scoring for readability, maintainability, security, and performance
- **Issue Detection**: Identifies potential problems with severity levels
- **History Tracking**: Save and revisit past analyses
- **PDF Reports**: Generate comprehensive analysis reports
- **User Authentication**: Secure user management with Supabase

## ✨ Features

### Code Analysis

- 📊 **Quality Metrics**: Overall score, readability, maintainability, complexity analysis
- 🔒 **Security Assessment**: Security vulnerability detection and scoring
- ⚡ **Performance Analysis**: Performance bottleneck identification
- 🐛 **Issue Detection**: Critical, high, medium, and low priority issues
- 💡 **Suggestions**: AI-generated improvement recommendations
- 🎯 **Best Practices**: Code quality and standard compliance checking

### Multi-File Analysis

- 🔗 **File Relationships**: Detect dependencies and connections between files
- 🏗️ **Architecture Overview**: High-level project structure analysis
- 📈 **Project Summary**: Aggregated metrics across all files
- 🎨 **Language Detection**: Automatic programming language identification
- 📊 **Comparative Analysis**: Cross-file quality comparisons

### User Experience

- 🎨 **Modern UI**: Clean, responsive React interface with animations
- 📱 **Mobile Friendly**: Responsive design for all devices
- 🌓 **Dark Mode**: Eye-friendly dark theme support
- 📥 **Drag & Drop**: Easy file upload interface
- 📋 **History Management**: Track and revisit past analyses
- 📄 **PDF Export**: Comprehensive report generation

## 🛠 Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **jsPDF** - PDF generation
- **React Hot Toast** - Notification system

### Backend

- **FastAPI** - Modern Python web framework
- **Python 3.8+** - Core language
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server
- **Supabase** - Database and authentication
- **Gemini AI/LLM Integration** - AI-powered analysis

### Database

- **Supabase** - PostgreSQL with real-time features
- **User Authentication** - Built-in auth system
- **Analysis History** - Persistent storage

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **Python** (v3.8.0 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Andy210904/Code-Review-Assistant.git
cd Code-Review-Assistant
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
# or
yarn install
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# LLM Configuration

# Primary LLM: Google Gemini
GOOGLE_API_KEY=Your_api_key
GOOGLE_MODEL=your_model_name

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Application Settings
APP_NAME=Code Review Assistant
DEBUG=True
LOG_LEVEL=INFO
ENVIRONMENT=development
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=.py,.js,.ts,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.swift,.kt
```

### Frontend Configuration

Create a `.env.local` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Database Schema

The application uses the following main table:

```sql
-- Analysis History Table
CREATE TABLE analysis_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    filename TEXT NOT NULL,
    file_type TEXT DEFAULT 'single',
    summary TEXT,
    results JSONB,
    quality_score INTEGER DEFAULT 0,
    security_score INTEGER DEFAULT 0,
    performance_score INTEGER DEFAULT 0,
    issues JSONB DEFAULT '[]',
    file_count INTEGER DEFAULT 1,
    file_names TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 Usage

### Starting the Application

1. **Start the Backend Server**:

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. **Start the Frontend Development Server**:

```bash
cd frontend
npm start
```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Using the Code Review Features

#### Single File Analysis

1. Navigate to "Single File" tab
2. Upload a code file (drag & drop or click to browse)
3. Adjust analysis settings if needed
4. Click "Start Review"
5. View detailed analysis results
6. Download PDF report if desired

#### Multiple File Analysis

1. Navigate to "Multiple Files" tab
2. Upload multiple related code files
3. Click "Start Review"
4. View:
   - Project Overview with aggregated metrics
   - File Relationships and dependencies
   - Individual file analyses
   - Quality Summary across all files
5. Download comprehensive PDF report

#### Analysis History

1. Navigate to "Past Analysis" tab
2. View all previous analyses
3. Click on any analysis to view detailed results
4. Filter by single/multiple file analyses
5. Delete analyses if needed

## 📚 API Documentation

### Core Endpoints

#### Single File Review

```http
POST /api/v1/review/single-file
Content-Type: multipart/form-data

Parameters:
- file: UploadFile (required)
- include_suggestions: bool (default: true)
- analysis_depth: str (default: "standard")
```

#### Multiple File Review

```http
POST /api/v1/review/multiple-files
Content-Type: multipart/form-data

Parameters:
- files: List[UploadFile] (required)
- include_suggestions: bool (default: true)
- analysis_depth: str (default: "standard")
```

#### Enhanced Multiple File Review

```http
POST /api/v1/review/multiple-files/enhanced
Content-Type: multipart/form-data

Parameters:
- files: List[UploadFile] (required)
- include_suggestions: bool (default: true)
- analysis_depth: str (default: "standard")
```

#### Analysis History

```http
GET /api/v1/history/user/{user_id}
POST /api/v1/history/save
GET /api/v1/history/{analysis_id}
DELETE /api/v1/history/{analysis_id}
```

### Response Formats

#### Single File Analysis Response

```json
{
  "success": true,
  "message": "File reviewed successfully",
  "data": {
    "filename": "example.py",
    "language": "python",
    "summary": "Analysis summary...",
    "overall_score": 85,
    "readability_score": 90,
    "maintainability_score": 80,
    "security_score": 85,
    "performance_score": 88,
    "issues": [...],
    "suggestions": [...],
    "metrics": {...}
  }
}
```

#### Multiple File Analysis Response

```json
{
  "success": true,
  "message": "Multiple files reviewed successfully",
  "data": {
    "file_reviews": [...],
    "project_summary": {...},
    "file_relationships": [...],
    "enhanced_project_summary": {
      "architecture_overview": "...",
      "average_score": 85,
      "security_score": 88,
      "performance_score": 82,
      "critical_issues": 0,
      "high_issues": 2,
      "medium_issues": 5,
      "low_issues": 8
    }
  }
}
```

## 📁 Project Structure

```
Code-Review-Assistant/
├── README.md
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── config.py            # Configuration settings
│   │   ├── api/
│   │   │   ├── review_router.py # Code review endpoints
│   │   │   └── history_router.py # Analysis history endpoints
│   │   ├── models/
│   │   │   ├── review_models.py # Pydantic models for reviews
│   │   │   └── history_models.py # Pydantic models for history
│   │   ├── services/
│   │   │   ├── code_analyzer.py # Core analysis logic
│   │   │   ├── llm_client.py    # LLM integration
│   │   │   ├── prompt_templates.py # AI prompts
│   │   │   ├── file_handler.py  # File processing
│   │   │   ├── database.py      # Database operations
│   │   │   └── history_service.py # History management
│   │   └── utils/
│   │       └── logging.py       # Logging configuration
│   ├── requirements.txt         # Python dependencies
│   ├── requirements-dev.txt     # Development dependencies
│   └── .env                     # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js               # Main React component
│   │   ├── index.js             # React entry point
│   │   ├── components/
│   │   │   ├── FileUpload.js    # File upload component
│   │   │   ├── ReviewResults.js # Single file results
│   │   │   ├── MultipleFileResults.js # Multiple file results
│   │   │   ├── Header.js        # Navigation header
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.js     # Main dashboard
│   │   │   ├── SingleFileReview.js # Single file page
│   │   │   ├── MultipleFileReview.js # Multiple file page
│   │   │   └── History.js       # Analysis history page
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── contexts/
│   │   │   └── AuthContext.js   # Authentication context
│   │   └── config/
│   │       └── supabase.js      # Supabase configuration
│   ├── package.json             # Node.js dependencies
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── .env.local               # Environment variables
└── docs/                        # Additional documentation
```

## 🤝 Contributing

We welcome contributions to the Code Review Assistant! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write clear, concise commit messages
- Add appropriate comments and documentation
- Test your changes thoroughly
- Update the README if you add new features

### Areas for Contribution

- 🌍 **Language Support**: Add support for more programming languages
- 🔍 **Analysis Rules**: Implement additional code quality checks
- 🎨 **UI/UX**: Improve the user interface and experience
- 📊 **Reporting**: Enhance PDF reports and add new export formats
- 🔧 **Performance**: Optimize analysis speed and accuracy
- 📚 **Documentation**: Improve documentation and add tutorials

## 🙏 Acknowledgments

- **Gemini AI** for providing the LLM capabilities
- **Supabase** for the backend infrastructure
- **FastAPI** and **React** communities for excellent frameworks
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. **Check the Issues**: Look through existing GitHub issues
2. **Create an Issue**: Report bugs or request features
3. **Documentation**: Review the API documentation at `/docs`

---

<div align="center">
  <p>Made with ❤️ by Aditya Dhane</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
