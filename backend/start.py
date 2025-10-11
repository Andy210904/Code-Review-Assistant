#!/usr/bin/env python3
"""
Startup script for Code Review Assistant API
"""

import asyncio
import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
sys.path.insert(0, str(Path(__file__).parent))

async def test_llm_connection():
    """Test LLM connection and configuration."""
    try:
        from app.services.llm_client import LLMClientFactory
        from app.config import settings
        
        print("🔍 Testing LLM Configuration...")
        
        # Get the configured LLM provider
        provider = settings.get_llm_provider()
        print(f"   Detected LLM Provider: {provider}")
        
        # Test connection
        client = LLMClientFactory.get_client()
        
        if client.is_available():
            print(f"   ✅ {provider.upper()} client is available and configured")
            
            # Test a simple request
            test_response = await client.generate_response(
                "Respond with just 'OK' if you can understand this message.",
                max_tokens=10
            )
            print(f"   ✅ Test request successful: {test_response.strip()}")
            
        else:
            print(f"   ⚠️  {provider.upper()} client not available - using mock responses")
            
    except Exception as e:
        print(f"   ❌ LLM connection test failed: {str(e)}")
        print("   📝 Check your API keys in the .env file")

def check_dependencies():
    """Check if required dependencies are installed."""
    print("📦 Checking Dependencies...")
    
    required_packages = [
        ('fastapi', 'FastAPI'),
        ('uvicorn', 'Uvicorn'),
        ('pydantic', 'Pydantic'),
        ('openai', 'OpenAI (optional)')
    ]
    
    missing_packages = []
    
    for package, name in required_packages:
        try:
            __import__(package)
            print(f"   ✅ {name}")
        except ImportError:
            print(f"   ❌ {name} - Missing")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("📥 Install with: pip install -r requirements.txt")
        return False
    
    return True

def check_environment():
    """Check environment configuration."""
    print("🔧 Checking Environment Configuration...")
    
    from app.config import settings
    
    # Check basic settings
    print(f"   Environment: {settings.environment}")
    print(f"   Debug Mode: {settings.debug}")
    print(f"   Server: {settings.host}:{settings.port}")
    
    # Check LLM configuration
    if settings.openai_api_key and settings.openai_api_key != "your-openai-api-key-here":
        print("   ✅ OpenAI API Key configured")
    else:
        print("   ⚠️  OpenAI API Key not configured - will use mock responses")
    
    # Check file limits
    print(f"   Max file size: {settings.max_file_size_mb}MB")
    print(f"   Max files per request: {settings.max_files_per_request}")
    
    return True

async def main():
    """Main startup function."""
    print("🚀 Code Review Assistant API - Startup Check\n")
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    print()
    
    # Check environment
    check_environment()
    
    print()
    
    # Test LLM connection
    await test_llm_connection()
    
    print("\n✅ Startup check completed!")
    print("🎯 Ready to start the API server")
    print("\n📚 Usage:")
    print("   Development: python -m uvicorn app.main:app --reload")
    print("   Production:  python -m uvicorn app.main:app --host 0.0.0.0 --port 8000")
    print("   Direct:      python app/main.py")
    print("\n📖 API Documentation will be available at:")
    print("   http://localhost:8000/docs")

if __name__ == "__main__":
    asyncio.run(main())