from typing import Dict, List, Optional
from app.config import settings
import json

class PromptTemplates:
    """Templates for different types of code analysis prompts."""
    
    @staticmethod
    def get_code_analysis_prompt(
        code: str, 
        language: str, 
        filename: str, 
        analysis_depth: str = "standard"
    ) -> str:
        """Generate a comprehensive code analysis prompt."""
        
        base_prompt = f"""
You are an expert code reviewer. Analyze the following {language} code from '{filename}' and provide a comprehensive review covering all aspects of code quality.

CODE TO ANALYZE:
```{language}
{code}
```

Provide a detailed analysis covering:
1. Overall Summary & Quality Assessment
2. Readability (variable names, comments, formatting, conventions)  
3. Modularity & Structure (function organization, reusability)
4. Best Practices (language-specific standards)
5. Potential Bugs & Logic Issues
6. Security Vulnerabilities
7. Performance Optimization Opportunities
8. Specific Recommendations with Examples

CRITICAL: Return ONLY valid JSON. Follow these formatting rules:
- Escape all quotes in string values using \"
- Replace newlines in strings with \\n
- Replace tabs in strings with \\t  
- Do not include any markdown or code blocks
- Ensure all strings are properly quoted and escaped

Return JSON in this exact format:
{{
    "summary": "Brief overall assessment of code quality and main observations",
    "quality_score": 85,
    "readability_score": 78,
    "modularity_score": 65,
    "complexity_score": 12,
    "comment_ratio": 4,
    "best_practices_score": 72,
    "security_score": 90,
    "performance_score": 80,
    "total_lines": 120,
    "function_count": 5,
    "readability_analysis": {{
        "variable_naming": "Assessment of variable and function names",
        "comments": "Analysis of code documentation and comments",
        "formatting": "Code indentation, spacing, and style consistency",
        "conventions": "Adherence to language-specific naming conventions"
    }},
    "modularity_analysis": {{
        "structure": "Organization of functions and classes",
        "reusability": "Code reuse and DRY principle adherence", 
        "cohesion": "How well functions focus on single responsibilities",
        "coupling": "Dependencies between different parts of code"
    }},
    "issues": [
        {{
            "category": "Bug/Style/Logic/Security/Performance",
            "severity": "high/medium/low",
            "line": 15,
            "title": "Brief issue description", 
            "description": "Detailed explanation of the issue",
            "suggestion": "How to fix this issue"
        }}
    ],
    "best_practices": [
        {{
            "rule": "Specific best practice rule",
            "status": "followed/violated",
            "description": "Explanation of the practice and current adherence"
        }}
    ],
    "recommendations": [
        {{
            "category": "Readability/Modularity/Performance/Security/Best Practices",
            "priority": "high/medium/low",
            "title": "Improvement suggestion",
            "description": "Detailed explanation of the recommendation", 
            "example": "Code example or specific implementation guidance",
            "impact": "Expected benefit of implementing this change"
        }}
    ],
    "strengths": [
        "Positive aspects and good practices found in the code"
    ]
}}

ANALYSIS FOCUS for {analysis_depth} depth:
"""
        
        if analysis_depth == "basic":
            base_prompt += """
- Focus on obvious syntax issues and basic style problems
- Identify critical bugs and security vulnerabilities
- Provide 3-5 key suggestions
"""
        elif analysis_depth == "detailed":
            base_prompt += """
- Perform deep analysis of algorithm efficiency and complexity
- Examine error handling and edge cases thoroughly
- Analyze architectural patterns and design principles
- Review security implications in detail
- Suggest performance optimizations
- Check for comprehensive testing coverage needs
- Evaluate documentation and naming conventions
"""
        else:  # standard
            base_prompt += """
- Check for common bugs and potential issues
- Evaluate code style and readability
- Assess maintainability and structure
- Identify security concerns
- Suggest improvements for best practices
"""

        # Add language-specific guidance
        language_guidance = PromptTemplates.get_language_specific_guidance(language)
        if language_guidance:
            base_prompt += f"\n\nLANGUAGE-SPECIFIC GUIDANCE for {language}:\n{language_guidance}"
        
        base_prompt += """

IMPORTANT:
- Be specific about line numbers when possible
- Prioritize issues by severity (critical > high > medium > low)
- Provide actionable suggestions, not just problem identification
- Consider the context and purpose of the code
- Return ONLY valid JSON, no additional text, no markdown formatting, no explanations
- Start your response with { and end with }
- Ensure all strings are properly quoted and escaped
- Use null for missing values, not undefined or empty
"""
        
        return base_prompt
    
    @staticmethod
    def get_language_specific_guidance(language: str) -> str:
        """Get language-specific analysis guidance."""
        
        guidance = {
            "python": """
- Check PEP 8 compliance (line length, naming conventions, imports)
- Look for proper use of list comprehensions vs loops
- Verify exception handling best practices
- Check for proper use of context managers (with statements)
- Evaluate type hints usage
- Look for potential issues with mutable default arguments
- Check for proper use of f-strings vs .format()
""",
            "javascript": """
- Check for var vs let/const usage
- Look for proper async/await usage
- Verify error handling in promises
- Check for potential memory leaks in closures
- Evaluate modern ES6+ feature usage
- Look for proper null/undefined handling
- Check console.log statements (should be removed in production)
""",
            "java": """
- Check naming conventions (camelCase, PascalCase)
- Verify proper exception handling
- Look for resource leak potential (try-with-resources)
- Check for proper use of generics
- Evaluate thread safety considerations
- Look for potential NullPointerException issues
- Check for proper equals() and hashCode() implementation
""",
            "cpp": """
- Check for memory leak potential (new/delete, malloc/free)
- Verify proper RAII usage
- Look for buffer overflow possibilities
- Check for proper const usage
- Evaluate smart pointer usage vs raw pointers
- Look for potential undefined behavior
- Check for proper header include guards
""",
            "go": """
- Check proper error handling patterns
- Verify goroutine and channel usage
- Look for potential race conditions
- Check for proper defer usage
- Evaluate interface usage and implementation
- Look for potential memory leaks in goroutines
- Check for proper package naming and structure
"""
        }
        
        return guidance.get(language.lower(), "")
    
    @staticmethod
    def get_project_summary_prompt(file_reviews: List[Dict]) -> str:
        """Generate a prompt for project-level summary."""
        
        return f"""
You are analyzing a software project with multiple files. Based on the individual file reviews below, provide a comprehensive project-level summary.

INDIVIDUAL FILE REVIEWS:
{json.dumps(file_reviews, indent=2)}

Please analyze the overall project and return a JSON response with this structure:
{{
    "project_quality_score": <0-10>,
    "critical_issues_count": <number>,
    "high_issues_count": <number>,
    "medium_issues_count": <number>,
    "low_issues_count": <number>,
    "languages_analysis": {{
        "<language>": {{
            "file_count": <number>,
            "average_score": <0-10>,
            "common_issues": ["<issue1>", "<issue2>"],
            "recommendations": ["<rec1>", "<rec2>"]
        }}
    }},
    "key_recommendations": [
        "<most important project-wide improvements>"
    ],
    "architectural_concerns": [
        "<any architectural or design pattern issues>"
    ],
    "security_summary": "<overall security assessment>",
    "maintainability_assessment": "<long-term maintainability evaluation>",
    "next_steps": [
        "<prioritized action items for improvement>"
    ]
}}

Focus on:
- Cross-file consistency and patterns
- Overall architecture and design quality
- Security implications across the project
- Maintainability and scalability concerns
- Most critical issues that need immediate attention
"""

    @staticmethod
    def get_suggestion_refinement_prompt(
        code: str,
        language: str, 
        existing_issues: List[Dict],
        focus_area: str = "general"
    ) -> str:
        """Generate a prompt for refined suggestions based on identified issues."""
        
        return f"""
You are an expert {language} developer. Based on the code analysis below, provide specific, actionable improvement suggestions.

CODE:
```{language}
{code}
```

IDENTIFIED ISSUES:
{json.dumps(existing_issues, indent=2)}

FOCUS AREA: {focus_area}

Please provide a JSON response with:
{{
    "refactored_code_snippets": [
        {{
            "original_line_range": "<start>-<end>",
            "issue_addressed": "<which issue this fixes>",
            "improved_code": "<actual code improvement>",
            "explanation": "<why this is better>"
        }}
    ],
    "best_practices": [
        "<specific best practices for this language/context>"
    ],
    "performance_tips": [
        "<performance improvement suggestions>"
    ],
    "security_enhancements": [
        "<security-related improvements>"
    ]
}}

Make suggestions concrete and implementable, with actual code examples where helpful.
"""