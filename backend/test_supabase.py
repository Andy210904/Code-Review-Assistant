"""
Test script to verify Supabase database integration
Run this after setting up your Supabase credentials in .env
"""
import asyncio
import sys
import os
from datetime import datetime

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.config import get_settings
from app.services.database import db_service
from app.services.history_service import analysis_history_service
from app.models.history_models import AnalysisHistoryCreate


async def test_database_connection():
    """Test basic database connection"""
    print("🔍 Testing Supabase connection...")
    
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        print("❌ SUPABASE_URL and SUPABASE_KEY must be set in .env file")
        return False
    
    try:
        # Test connection
        is_connected = await db_service.test_connection()
        if is_connected:
            print("✅ Database connection successful!")
            return True
        else:
            print("❌ Database connection failed")
            return False
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return False


async def test_analysis_operations():
    """Test CRUD operations for analysis history"""
    print("\n📝 Testing analysis CRUD operations...")
    
    # Test user ID (in real app, this would come from authentication)
    test_user_id = "test-user-123"
    
    try:
        # Test 1: Create analysis
        print("1️⃣ Testing analysis creation...")
        analysis_data = AnalysisHistoryCreate(
            user_id=test_user_id,
            filename="test_file.py",
            file_type="single",
            summary="Test analysis for database integration",
            results={
                "summary": "Test analysis summary",
                "quality_score": 85,
                "security_score": 90,
                "performance_score": 78,
                "issues": [
                    {"title": "Test issue", "severity": "low", "line": 10}
                ],
                "suggestions": [
                    {"title": "Test suggestion", "priority": "medium"}
                ]
            },
            quality_score=85,
            security_score=90,
            performance_score=78,
            issues=[{"title": "Test issue", "severity": "low"}]
        )
        
        created_analysis = await analysis_history_service.save_analysis(analysis_data)
        print(f"✅ Analysis created with ID: {created_analysis.id}")
        
        # Test 2: Retrieve analysis by ID
        print("2️⃣ Testing analysis retrieval by ID...")
        retrieved_analysis = await analysis_history_service.get_analysis_by_id(
            created_analysis.id, test_user_id
        )
        if retrieved_analysis:
            print(f"✅ Analysis retrieved: {retrieved_analysis.filename}")
        else:
            print("❌ Failed to retrieve analysis")
            return False
        
        # Test 3: Get user analyses (pagination)
        print("3️⃣ Testing user analyses list...")
        user_analyses = await analysis_history_service.get_user_analyses(test_user_id)
        print(f"✅ Found {user_analyses['total']} analyses for user")
        
        # Test 4: Get user statistics
        print("4️⃣ Testing user statistics...")
        stats = await analysis_history_service.get_user_statistics(test_user_id)
        print(f"✅ User stats - Total: {stats['total_analyses']}, Avg Quality: {stats['avg_quality_score']}")
        
        # Test 5: Delete analysis
        print("5️⃣ Testing analysis deletion...")
        deleted = await analysis_history_service.delete_analysis(
            created_analysis.id, test_user_id
        )
        if deleted:
            print("✅ Analysis deleted successfully")
        else:
            print("❌ Failed to delete analysis")
            return False
        
        print("\n🎉 All database operations completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        return False


async def main():
    """Main test function"""
    print("🚀 Starting Supabase Database Integration Test")
    print("=" * 50)
    
    # Test connection
    connection_ok = await test_database_connection()
    if not connection_ok:
        print("\n❌ Database connection failed. Please check:")
        print("1. Your Supabase project is set up")
        print("2. You've run the SQL schema from setup_supabase_schema.py")
        print("3. SUPABASE_URL and SUPABASE_KEY are set in .env")
        return
    
    # Test operations
    operations_ok = await test_analysis_operations()
    
    if operations_ok:
        print("\n🎉 All tests passed! Your Supabase integration is working.")
        print("\nNext steps:")
        print("1. Update your frontend to use the new database-backed API")
        print("2. Test the full application flow")
        print("3. Your analysis history will now persist in Supabase!")
    else:
        print("\n❌ Some tests failed. Please check your Supabase configuration.")


if __name__ == "__main__":
    asyncio.run(main())