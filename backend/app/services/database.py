"""
Database service for Supabase integration using PostgREST
"""
import logging
from typing import Optional
from postgrest import APIResponse
import httpx
from app.config import get_settings

logger = logging.getLogger(__name__)

class DatabaseService:
    """Service for managing Supabase database operations using PostgREST"""
    
    def __init__(self):
        self._settings = get_settings()
        self._base_url = None
        self._headers = None
        
    def _initialize(self):
        """Initialize connection parameters"""
        if self._base_url is None:
            if not self._settings.supabase_url or not self._settings.supabase_key:
                raise ValueError(
                    "Supabase URL and Key are required. Please set SUPABASE_URL and SUPABASE_KEY environment variables."
                )
            
            self._base_url = f"{self._settings.supabase_url}/rest/v1"
            # Use service key if available for admin operations, otherwise use anon key
            auth_key = self._settings.supabase_service_key or self._settings.supabase_key
            
            self._headers = {
                "apikey": self._settings.supabase_key,
                "Authorization": f"Bearer {auth_key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
            logger.info("Database service initialized successfully")
    
    async def _make_request(self, method: str, endpoint: str, data=None, params=None):
        """Make HTTP request to Supabase PostgREST API"""
        self._initialize()
        
        url = f"{self._base_url}{endpoint}"
        
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=method,
                url=url,
                headers=self._headers,
                json=data,
                params=params
            )
            response.raise_for_status()
            return response
    
    async def insert(self, table_name: str, data: dict):
        """Insert data into table"""
        response = await self._make_request("POST", f"/{table_name}", data=data)
        return response.json()
    
    async def select(self, table_name: str, columns="*", filters=None, order=None, limit=None, offset=None):
        """Select data from table"""
        params = {}
        if columns != "*":
            params["select"] = columns
        if filters:
            for key, value in filters.items():
                params[f"{key}"] = f"eq.{value}"
        if order:
            params["order"] = order
        if limit:
            params["limit"] = limit
        if offset:
            params["offset"] = offset
            
        response = await self._make_request("GET", f"/{table_name}", params=params)
        return response.json()
    
    async def update(self, table_name: str, data: dict, filters: dict):
        """Update data in table"""
        params = {}
        for key, value in filters.items():
            params[f"{key}"] = f"eq.{value}"
            
        response = await self._make_request("PATCH", f"/{table_name}", data=data, params=params)
        return response.json()
    
    async def delete(self, table_name: str, filters: dict):
        """Delete data from table"""
        params = {}
        for key, value in filters.items():
            params[f"{key}"] = f"eq.{value}"
            
        response = await self._make_request("DELETE", f"/{table_name}", params=params)
        return response.json()
    
    async def count(self, table_name: str, filters=None):
        """Count rows in table"""
        self._initialize()
        
        params = {"select": "*"}
        if filters:
            for key, value in filters.items():
                params[f"{key}"] = f"eq.{value}"
        
        # Add Prefer header to get count
        headers = self._headers.copy()
        headers["Prefer"] = "count=exact"
                
        url = f"{self._base_url}/{table_name}"
        
        async with httpx.AsyncClient() as client:
            response = await client.head(
                url=url,
                headers=headers,
                params=params
            )
            response.raise_for_status()
            
            # Count is returned in the Content-Range header
            content_range = response.headers.get("Content-Range", "")
            if "/" in content_range:
                total_str = content_range.split("/")[1]
                # Handle the case where total might be '*' (unknown) or a number
                if total_str.isdigit():
                    return int(total_str)
                else:
                    # Fallback: do a regular select to count manually
                    fallback_data = await self.select(table_name, columns="id", filters=filters)
                    return len(fallback_data) if fallback_data else 0
            return 0
    
    async def test_connection(self) -> bool:
        """Test the database connection"""
        try:
            # Try to execute a simple query
            await self.select("analysis_history", columns="id", limit=1)
            logger.info("Database connection test successful")
            return True
        except Exception as e:
            logger.error(f"Database connection test failed: {e}")
            return False

# Global database service instance
db_service = DatabaseService()