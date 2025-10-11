import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_gemini_models():
    """Test Google Gemini API and list available models."""
    
    # Configure API key from environment
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ GOOGLE_API_KEY not found in environment variables")
        return
    
    try:
        genai.configure(api_key=api_key)
        print("🔍 Testing Google Gemini API Connection...")
        print("✅ API Key configured successfully")
        
        print("\n📋 Available Models that support generateContent:")
        print("-" * 50)
        
        available_models = []
        for m in genai.list_models():
            if "generateContent" in m.supported_generation_methods:
                available_models.append(m.name)
                print(f"✅ {m.name}")
        
        if not available_models:
            print("❌ No models found that support generateContent")
            return
        
        # Test with the first available model or a specific one
        test_model = "models/gemini-1.5-flash"  # Try this model first
        if test_model not in available_models:
            test_model = available_models[0]  # Use first available
        
        print(f"\n🧪 Testing with model: {test_model}")
        
        # Initialize model
        model = genai.GenerativeModel(test_model)
        
        # Test generation
        test_prompt = "Say 'Hello, I am Google Gemini!' if you can understand this message."
        print(f"📝 Test prompt: {test_prompt}")
        
        response = model.generate_content(test_prompt)
        
        if response and response.text:
            print(f"✅ Response: {response.text.strip()}")
            print("\n🎉 Google Gemini integration is working!")
            
            # Update .env with working model
            print(f"\n💡 Recommended .env configuration:")
            print(f"GOOGLE_MODEL={test_model}")
            
        else:
            print("❌ Empty response from model")
            
    except Exception as e:
        print(f"❌ Error testing Gemini API: {str(e)}")
        print("\n🔧 Troubleshooting:")
        print("1. Check your API key is valid")
        print("2. Ensure you have Google AI Studio access")
        print("3. Try a different model name")

def test_code_analysis():
    """Test code analysis with Gemini."""
    
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ GOOGLE_API_KEY not found")
        return
    
    try:
        genai.configure(api_key=api_key)
        
        # Use a working model
        model = genai.GenerativeModel("models/gemini-1.5-flash")
        
        test_code = '''
def calculate_area(length, width):
    print("Calculating area...")  # Debug statement - should be removed
    area = length * width
    return area

# TODO: Add input validation
result = calculate_area(10, 5)
print(f"Area is: {result}")
'''
        
        prompt = f"""
Analyze this Python code and provide a JSON response with issues and suggestions:

```python
{test_code}
```

Return JSON format:
{{
    "issues": [
        {{
            "line_number": 2,
            "issue_type": "maintenance",
            "severity": "low",
            "message": "Debug print statement should be removed",
            "suggestion": "Remove debug print for production code"
        }}
    ],
    "overall_score": 8.5,
    "summary": "Code analysis summary"
}}
"""
        
        print("\n🔬 Testing Code Analysis...")
        response = model.generate_content(prompt)
        
        if response and response.text:
            print("✅ Code Analysis Response:")
            print(response.text)
        else:
            print("❌ No response from code analysis")
            
    except Exception as e:
        print(f"❌ Code analysis test failed: {str(e)}")

if __name__ == "__main__":
    print("🚀 Google Gemini API Test\n")
    
    # Test 1: List models and basic connectivity
    test_gemini_models()
    
    print("\n" + "="*60 + "\n")
    
    # Test 2: Code analysis functionality
    test_code_analysis()