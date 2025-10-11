from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from app.config import settings
import logging
import json

logger = logging.getLogger(__name__)

class BaseLLMClient(ABC):
    """Abstract base class for LLM clients."""
    
    @abstractmethod
    async def generate_response(
        self, 
        prompt: str, 
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> str:
        """Generate a response from the LLM."""
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """Check if the LLM client is properly configured and available."""
        pass

class OpenAIClient(BaseLLMClient):
    """OpenAI GPT client."""
    
    def __init__(self):
        self.api_key = settings.openai_api_key
        self.model = settings.openai_model
        self.max_tokens = settings.openai_max_tokens
        self.temperature = settings.openai_temperature
        
        if self.is_available():
            try:
                import openai
                self.client = openai.AsyncOpenAI(api_key=self.api_key)
            except ImportError:
                logger.error("OpenAI library not installed. Run: pip install openai")
                self.client = None
        else:
            self.client = None
    
    def is_available(self) -> bool:
        """Check if OpenAI client is available."""
        return bool(self.api_key and self.api_key != "your-openai-api-key-here")
    
    async def generate_response(
        self, 
        prompt: str, 
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> str:
        """Generate response using OpenAI GPT."""
        if not self.client:
            raise Exception("OpenAI client not available")
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert code reviewer and software engineer."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens or self.max_tokens,
                temperature=temperature or self.temperature,
                **kwargs
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise Exception(f"Failed to generate response: {str(e)}")

class GoogleGeminiClient(BaseLLMClient):
    """Google Gemini client."""
    
    def __init__(self):
        self.api_key = settings.google_api_key
        self.model = settings.google_model
        self.client = None
        
        # Initialize client if API key is available
        if self.api_key and self.api_key != "your-google-key":
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                # Use the model from environment variable
                # Add models/ prefix if not already present
                model_name = self.model if self.model.startswith("models/") else f"models/{self.model}"
                self.client = genai.GenerativeModel(model_name)
                logger.info(f"Google Gemini client initialized successfully with model: {self.model}")
            except ImportError:
                logger.error("Google Generative AI library not installed. Run: pip install google-generativeai")
                self.client = None
            except Exception as e:
                logger.error(f"Failed to initialize Google Gemini client: {str(e)}")
                self.client = None
    
    def is_available(self) -> bool:
        """Check if Google Gemini client is available."""
        return bool(self.api_key and self.api_key != "your-google-key" and self.client is not None)
    
    async def generate_response(
        self, 
        prompt: str, 
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> str:
        """Generate response using Google Gemini."""
        if not self.client:
            raise Exception("Google Gemini client not available")
        
        try:
            # Configure generation parameters with higher token limit for comprehensive analysis
            generation_config = {
                "temperature": temperature or 0.3,
                "max_output_tokens": max_tokens or 10000,  # Increased from 2000 to handle comprehensive analysis
            }
            
            import asyncio
            response = await asyncio.get_event_loop().run_in_executor(
                None, 
                lambda: self.client.generate_content(
                    prompt,
                    generation_config=generation_config
                )
            )
            
            if response and response.text:
                return response.text.strip()
            else:
                raise Exception("Empty response from Gemini")
        
        except Exception as e:
            logger.error(f"Google Gemini API error: {str(e)}")
            raise Exception(f"Failed to generate response: {str(e)}")

class AnthropicClient(BaseLLMClient):
    """Anthropic Claude client."""
    
    def __init__(self):
        self.api_key = settings.anthropic_api_key
        self.model = settings.anthropic_model
        
        if self.is_available():
            try:
                import anthropic
                self.client = anthropic.AsyncAnthropic(api_key=self.api_key)
            except ImportError:
                logger.error("Anthropic library not installed. Run: pip install anthropic")
                self.client = None
        else:
            self.client = None
    
    def is_available(self) -> bool:
        """Check if Anthropic client is available."""
        return bool(self.api_key and self.api_key != "your-anthropic-key")
    
    async def generate_response(
        self, 
        prompt: str, 
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> str:
        """Generate response using Anthropic Claude."""
        if not self.client:
            raise Exception("Anthropic client not available")
        
        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens or 8000,
                temperature=temperature or 0.3,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            return response.content[0].text.strip()
        
        except Exception as e:
            logger.error(f"Anthropic API error: {str(e)}")
            raise Exception(f"Failed to generate response: {str(e)}")

class MockLLMClient(BaseLLMClient):
    """Mock LLM client for testing and development."""
    
    def is_available(self) -> bool:
        """Mock client is always available."""
        return True
    
    async def generate_response(
        self, 
        prompt: str, 
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> str:
        """Generate a mock response."""
        logger.info("Using mock LLM response")
        
        # Simple mock response based on prompt content
        if "issues" in prompt.lower():
            return json.dumps({
                "issues": [
                    {
                        "line_number": 10,
                        "issue_type": "style",
                        "severity": "medium",
                        "message": "Line too long - consider breaking into multiple lines",
                        "suggestion": "Break this line at logical points to improve readability"
                    },
                    {
                        "line_number": 25,
                        "issue_type": "maintenance", 
                        "severity": "low",
                        "message": "Consider adding type hints for better code documentation",
                        "suggestion": "Add type hints to function parameters and return values"
                    }
                ],
                "overall_assessment": "The code is well-structured but could benefit from some style improvements.",
                "readability_score": 7.5,
                "maintainability_score": 8.0,
                "suggestions": [
                    "Consider following PEP 8 style guidelines more strictly",
                    "Add docstrings to public methods",
                    "Use more descriptive variable names"
                ]
            })
        
        return json.dumps({
            "summary": "Mock analysis completed successfully",
            "score": 8.5
        })

class LLMClientFactory:
    """Factory for creating LLM clients."""
    
    _clients: Dict[str, BaseLLMClient] = {}
    
    @classmethod
    def get_client(cls, provider: Optional[str] = None) -> BaseLLMClient:
        """Get an LLM client instance."""
        
        # Determine provider
        if not provider:
            provider = settings.get_llm_provider()
        
        # Return cached client if available
        if provider in cls._clients:
            return cls._clients[provider]
        
        # Create new client
        if provider == "openai":
            client = OpenAIClient()
        elif provider == "google":
            client = GoogleGeminiClient()
        elif provider == "anthropic":
            client = AnthropicClient()
        elif provider == "mock":
            client = MockLLMClient()
        else:
            logger.warning(f"Unknown provider '{provider}', falling back to mock")
            client = MockLLMClient()
        
        # Validate client
        if not client.is_available():
            logger.warning(f"Provider '{provider}' not available, falling back to mock")
            client = MockLLMClient()
        
        # Cache and return
        cls._clients[provider] = client
        return client
    
    @classmethod
    def clear_cache(cls):
        """Clear the client cache (useful for testing)."""
        cls._clients.clear()