from typing import List, Optional, Dict, Any
import logging
import json
from datetime import datetime
from app.models.review_models import (
    CodeReview, CodeIssue, CodeMetrics, ProjectSummary, FileReviewResponse,
    EnhancedProjectSummary, FileRelationship, MultipleFileReviewResponse
)
from app.services.llm_client import LLMClientFactory
from app.services.prompt_templates import PromptTemplates
from app.config import settings

logger = logging.getLogger(__name__)

class CodeAnalyzer:
    """Service for analyzing source code and generating reviews."""
    
    def __init__(self):
        """Initialize the code analyzer."""
        self.llm_client = LLMClientFactory.get_client()
        self.prompt_templates = PromptTemplates()
        
    async def analyze_code(
        self,
        code_content: str,
        language: str,
        filename: str,
        include_suggestions: bool = True,
        analysis_depth: str = "standard"
    ) -> Dict[str, Any]:
        """
        Analyze source code and generate a review report.
        
        Args:
            code_content: The source code to analyze
            language: Programming language of the code
            filename: Name of the file being analyzed
            include_suggestions: Whether to include improvement suggestions
            analysis_depth: Level of analysis detail
            
        Returns:
            CodeReview: Detailed code review results
        """
        logger.info(f"Analyzing code file: {filename} (Language: {language})")
        
        try:
            # Use LLM for intelligent code analysis and return raw JSON
            llm_analysis = await self._analyze_with_llm(
                code_content, language, filename, analysis_depth
            )
            
            # Return the raw LLM analysis JSON with some additional metadata
            llm_analysis.update({
                "filename": filename,
                "language": language,
                "analyzed_at": datetime.now().isoformat()
            })
            
            return llm_analysis
            
        except Exception as e:
            logger.error(f"Error analyzing code: {str(e)}")
            # Return a basic analysis with error information in JSON format
            return {
                "filename": filename,
                "language": language,
                "analyzed_at": datetime.now().isoformat(),
                "summary": f"Analysis failed for {filename}: {str(e)}",
                "quality_score": 0,
                "readability_score": 0,
                "modularity_score": 0,
                "complexity_score": 0,
                "comment_ratio": 0,
                "best_practices_score": 0,
                "security_score": 0,
                "performance_score": 0,
                "total_lines": 0,
                "function_count": 0,
                "issues": [{
                    "category": "Error",
                    "severity": "critical",
                    "line": None,
                    "title": "Analysis Failed",
                    "description": f"Analysis failed: {str(e)}",
                    "suggestion": "Please check the code syntax and try again"
                }],
                "recommendations": [],
                "strengths": [],
                "readability_analysis": {},
                "modularity_analysis": {}
            }
    
    async def _analyze_with_llm(
        self, 
        code_content: str, 
        language: str, 
        filename: str, 
        analysis_depth: str
    ) -> Dict[str, Any]:
        """Analyze code using LLM."""
        try:
            # Generate analysis prompt
            prompt = self.prompt_templates.get_code_analysis_prompt(
                code_content, language, filename, analysis_depth
            )
            
            # Get LLM response with higher token limit for comprehensive analysis
            response = await self.llm_client.generate_response(prompt, max_tokens=8000)
            logger.debug(f"Raw LLM response: {response[:200]}...")
            
            # Clean and parse JSON response
            analysis_result = self._parse_llm_json_response(response)
            return analysis_result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response as JSON: {str(e)}")
            logger.error(f"Raw response: {response[:500] if 'response' in locals() else 'No response'}")
            # Fallback to basic analysis
            return await self._fallback_analysis(code_content, language)
            
        except Exception as e:
            logger.error(f"LLM analysis failed: {str(e)}")
            # Fallback to basic analysis
            return await self._fallback_analysis(code_content, language)
    
    def _parse_llm_json_response(self, response: str) -> Dict[str, Any]:
        """Parse LLM response with better error handling and cleaning."""
        # Log the full response for debugging
        logger.debug(f"Raw LLM response length: {len(response)} chars")
        logger.debug(f"Raw LLM response first 500 chars: {response[:500]}")
        
        # Remove common markdown formatting
        cleaned_response = response.strip()
        
        # Remove markdown code blocks if present
        if cleaned_response.startswith('```'):
            lines = cleaned_response.split('\n')
            # Find first line that's not markdown syntax
            start_idx = 0
            for i, line in enumerate(lines):
                if line.strip() and not line.startswith('```'):
                    start_idx = i
                    break
            
            # Find last line that's not markdown syntax  
            end_idx = len(lines) - 1
            for i in range(len(lines) - 1, -1, -1):
                if lines[i].strip() and not lines[i].startswith('```'):
                    end_idx = i
                    break
            
            cleaned_response = '\n'.join(lines[start_idx:end_idx + 1])
        
        # Remove any leading/trailing text that's not JSON
        start_brace = cleaned_response.find('{')
        end_brace = cleaned_response.rfind('}')
        
        if start_brace != -1 and end_brace != -1:
            cleaned_response = cleaned_response[start_brace:end_brace + 1]
        
        logger.debug(f"Cleaned JSON response: {cleaned_response[:200]}...")
        
        try:
            # More robust JSON cleaning approach
            import re
            
            # Remove any non-JSON content before and after
            json_start = cleaned_response.find('{')
            json_end = cleaned_response.rfind('}')
            if json_start != -1 and json_end != -1 and json_end > json_start:
                cleaned_response = cleaned_response[json_start:json_end + 1]
            
            # Fix common JSON formatting issues with simpler approach
            # Replace problematic characters in a safer way
            
            # First, let's handle newlines and tabs inside strings more carefully
            # We'll do this by processing character by character to avoid regex issues
            result = []
            in_string = False
            escaped = False
            
            for i, char in enumerate(cleaned_response):
                if char == '"' and not escaped:
                    in_string = not in_string
                    result.append(char)
                elif in_string:
                    if char == '\n':
                        result.append('\\n')
                    elif char == '\t':
                        result.append('\\t')
                    elif char == '\r':
                        result.append('\\r')
                    elif char == '"' and not escaped:
                        result.append('\\"')
                    else:
                        result.append(char)
                else:
                    result.append(char)
                
                escaped = (char == '\\' and not escaped)
            
            cleaned_response = ''.join(result)
            
            # Ensure JSON ends properly
            if not cleaned_response.endswith('}'):
                # Count braces and brackets to balance
                open_braces = cleaned_response.count('{') - cleaned_response.count('}')
                open_brackets = cleaned_response.count('[') - cleaned_response.count(']')
                
                # Add missing closing characters
                cleaned_response += ']' * open_brackets + '}' * open_braces
            
            result = json.loads(cleaned_response)
            logger.debug("Successfully parsed JSON response")
            return result
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error at line {getattr(e, 'lineno', 'unknown')}, column {getattr(e, 'colno', 'unknown')}: {e}")
            logger.error(f"Error position in text: {cleaned_response[max(0, e.pos-50):e.pos+50] if hasattr(e, 'pos') else 'N/A'}")
            
            # Try to parse just the part before the error
            if hasattr(e, 'pos') and e.pos > 0:
                logger.info("Attempting to parse partial JSON before error position")
                partial_json = cleaned_response[:e.pos]
                # Find the last complete object
                last_brace = partial_json.rfind('}')
                if last_brace > 0:
                    partial_json = partial_json[:last_brace + 1]
                    try:
                        result = json.loads(partial_json)
                        logger.info("Successfully parsed partial JSON")
                        return result
                    except:
                        pass
            
            # If still failing, try to extract a simpler structure
            logger.warning("Failed to parse complex JSON, attempting simple extraction")
            return self._extract_simple_analysis(response)
    
    async def _fallback_analysis(self, code_content: str, language: str) -> Dict[str, Any]:
        """Fallback analysis when LLM is unavailable."""
        logger.info("Using fallback analysis (basic static analysis)")
        
        # Use the original static analysis methods
        issues = await self._identify_issues_static(code_content, language, "standard")
        
        return {
            "issues": [
                {
                    "line_number": issue.line_number,
                    "issue_type": issue.issue_type,
                    "severity": issue.severity,
                    "message": issue.message,
                    "suggestion": issue.suggestion or "Consider reviewing this code section"
                } for issue in issues
            ],
            "metrics": {
                "complexity_assessment": "Basic static analysis completed",
                "readability_score": 7.0,
                "maintainability_score": 7.0,
                "performance_notes": "No performance analysis available in fallback mode"
            },
            "suggestions": [
                "Follow language-specific best practices",
                "Add comprehensive error handling",
                "Include unit tests for better reliability"
            ],
            "summary": "Code analysis completed using basic static analysis (LLM unavailable)",
            "strengths": ["Code structure appears organized"]
        }
    
    def _parse_llm_response(self, llm_analysis: Dict[str, Any]) -> tuple:
        """Parse LLM analysis response into structured data."""
        # Extract issues
        issues = []
        for issue_data in llm_analysis.get("issues", []):
            issues.append(CodeIssue(
                line_number=issue_data.get("line_number"),
                issue_type=issue_data.get("issue_type", "maintenance"),
                severity=issue_data.get("severity", "medium"),
                message=issue_data.get("message", "Issue detected"),
                suggestion=issue_data.get("suggestion")
            ))
        
        # Extract suggestions
        suggestions = llm_analysis.get("suggestions", [])
        
        # Extract summary
        summary = llm_analysis.get("summary", "Code analysis completed")
        
        # Extract strengths
        strengths = llm_analysis.get("strengths", [])
        
        return issues, suggestions, summary, strengths
    
    def _calculate_scores_from_llm(
        self, 
        llm_analysis: Dict[str, Any], 
        issues: List[CodeIssue], 
        metrics: CodeMetrics
    ) -> Dict[str, float]:
        """Calculate scores based on LLM analysis."""
        
        # Get scores from LLM if available
        llm_metrics = llm_analysis.get("metrics", {})
        readability_score = llm_metrics.get("readability_score", 7.0)
        maintainability_score = llm_metrics.get("maintainability_score", 7.0)
        
        # Calculate overall score based on issues
        base_score = 10.0
        critical_count = len([i for i in issues if i.severity == 'critical'])
        high_count = len([i for i in issues if i.severity == 'high'])
        medium_count = len([i for i in issues if i.severity == 'medium'])
        low_count = len([i for i in issues if i.severity == 'low'])
        
        # Apply penalties
        penalty = (
            critical_count * settings.critical_issue_penalty +
            high_count * settings.high_issue_penalty +
            medium_count * settings.medium_issue_penalty +
            low_count * settings.low_issue_penalty
        )
        
        overall_score = max(0.0, base_score - penalty)
        
        return {
            'overall': round(overall_score, 1),
            'readability': round(float(readability_score), 1),
            'maintainability': round(float(maintainability_score), 1)
        }
    
    async def _generate_detailed_suggestions(
        self,
        code_content: str,
        language: str,
        issues: List[CodeIssue]
    ) -> List[str]:
        """Generate additional detailed suggestions using LLM."""
        try:
            # Convert issues to dict format for the prompt
            issues_data = [
                {
                    "line_number": issue.line_number,
                    "issue_type": issue.issue_type,
                    "severity": issue.severity,
                    "message": issue.message
                } for issue in issues
            ]
            
            prompt = self.prompt_templates.get_suggestion_refinement_prompt(
                code_content, language, issues_data, "detailed"
            )
            
            response = await self.llm_client.generate_response(prompt)
            refinement_data = json.loads(response)
            
            additional_suggestions = []
            additional_suggestions.extend(refinement_data.get("best_practices", []))
            additional_suggestions.extend(refinement_data.get("performance_tips", []))
            additional_suggestions.extend(refinement_data.get("security_enhancements", []))
            
            return additional_suggestions[:5]  # Limit to avoid overwhelming
            
        except Exception as e:
            logger.error(f"Failed to generate detailed suggestions: {str(e)}")
            return []
    
    def _calculate_basic_metrics(self, code_content: str, language: str) -> CodeMetrics:
        """Calculate basic code metrics."""
        lines = code_content.split('\n')
        
        # Count non-empty lines
        lines_of_code = len([line for line in lines if line.strip()])
        
        # Basic cyclomatic complexity (simplified)
        complexity = self._calculate_cyclomatic_complexity(code_content, language)
        
        # Basic maintainability index (simplified formula)
        maintainability = max(0, min(100, 171 - 5.2 * complexity - 0.23 * lines_of_code))
        
        return CodeMetrics(
            lines_of_code=lines_of_code,
            cyclomatic_complexity=complexity,
            maintainability_index=maintainability,
            code_duplication=0.0  # TODO: Implement duplication detection
        )
    
    def _calculate_cyclomatic_complexity(self, code_content: str, language: str) -> int:
        """Calculate basic cyclomatic complexity."""
        # Simplified complexity calculation based on control flow keywords
        complexity_keywords = {
            'python': ['if', 'elif', 'for', 'while', 'except', 'and', 'or'],
            'java': ['if', 'else if', 'for', 'while', 'catch', '&&', '||', 'case'],
            'javascript': ['if', 'else if', 'for', 'while', 'catch', '&&', '||', 'case'],
            'cpp': ['if', 'else if', 'for', 'while', 'catch', '&&', '||', 'case'],
            'c': ['if', 'else if', 'for', 'while', '&&', '||', 'case']
        }
        
        keywords = complexity_keywords.get(language, ['if', 'for', 'while'])
        complexity = 1  # Base complexity
        
        for keyword in keywords:
            complexity += code_content.lower().count(keyword)
        
        return complexity
    
    async def _identify_issues_static(
        self, 
        code_content: str, 
        language: str, 
        analysis_depth: str
    ) -> List[CodeIssue]:
        """Identify code issues through basic static analysis (fallback method)."""
        issues = []
        
        lines = code_content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Check for common issues
            
            # Long lines
            if len(line) > 120:
                issues.append(CodeIssue(
                    line_number=i,
                    issue_type="style",
                    severity="low",
                    message="Line too long (>120 characters)",
                    suggestion="Consider breaking this line into multiple lines"
                ))
            
            # TODO comments
            if 'TODO' in line.upper():
                issues.append(CodeIssue(
                    line_number=i,
                    issue_type="maintenance",
                    severity="medium",
                    message="TODO comment found",
                    suggestion="Consider completing or removing this TODO"
                ))
            
            # Language-specific checks
            if language == 'python':
                issues.extend(self._check_python_specific(line, i))
            elif language == 'java':
                issues.extend(self._check_java_specific(line, i))
            elif language == 'javascript':
                issues.extend(self._check_javascript_specific(line, i))
        
        return issues
    
    def _check_python_specific(self, line: str, line_number: int) -> List[CodeIssue]:
        """Check Python-specific issues."""
        issues = []
        
        # Check for bare except
        if 'except:' in line:
            issues.append(CodeIssue(
                line_number=line_number,
                issue_type="bug",
                severity="medium",
                message="Bare except clause",
                suggestion="Specify the exception type to catch"
            ))
        
        # Check for print statements (might be debugging)
        if line.strip().startswith('print('):
            issues.append(CodeIssue(
                line_number=line_number,
                issue_type="maintenance",
                severity="low",
                message="Print statement found",
                suggestion="Consider using logging instead of print"
            ))
        
        return issues
    
    def _check_java_specific(self, line: str, line_number: int) -> List[CodeIssue]:
        """Check Java-specific issues."""
        issues = []
        
        # Check for System.out.println
        if 'System.out.println' in line:
            issues.append(CodeIssue(
                line_number=line_number,
                issue_type="maintenance",
                severity="low",
                message="System.out.println found",
                suggestion="Consider using a logging framework"
            ))
        
        return issues
    
    def _check_javascript_specific(self, line: str, line_number: int) -> List[CodeIssue]:
        """Check JavaScript-specific issues."""
        issues = []
        
        # Check for console.log
        if 'console.log' in line:
            issues.append(CodeIssue(
                line_number=line_number,
                issue_type="maintenance",
                severity="low",
                message="console.log found",
                suggestion="Remove debug console.log statements"
            ))
        
        # Check for var usage
        if line.strip().startswith('var '):
            issues.append(CodeIssue(
                line_number=line_number,
                issue_type="style",
                severity="medium",
                message="Using 'var' declaration",
                suggestion="Consider using 'let' or 'const' instead"
            ))
        
        return issues
    

    
    def _calculate_scores(
        self, 
        issues: List[CodeIssue], 
        metrics: CodeMetrics, 
        code_content: str
    ) -> Dict[str, float]:
        """Calculate quality scores."""
        # Base scores
        base_score = 10.0
        
        # Deduct points for issues
        critical_issues = len([i for i in issues if i.severity == 'critical'])
        high_issues = len([i for i in issues if i.severity == 'high'])
        medium_issues = len([i for i in issues if i.severity == 'medium'])
        low_issues = len([i for i in issues if i.severity == 'low'])
        
        # Calculate deductions
        deductions = (
            critical_issues * 3.0 +
            high_issues * 2.0 +
            medium_issues * 1.0 +
            low_issues * 0.5
        )
        
        overall_score = max(0.0, base_score - deductions)
        
        # Readability score (based on line length and complexity)
        lines = code_content.split('\n')
        avg_line_length = sum(len(line) for line in lines) / len(lines) if lines else 0
        readability_deduction = max(0, (avg_line_length - 80) / 40)  # Deduct for long lines
        readability_score = max(0.0, base_score - readability_deduction - (deductions * 0.5))
        
        # Maintainability score (based on complexity and metrics)
        maintainability_score = overall_score
        if metrics and metrics.maintainability_index:
            maintainability_score = metrics.maintainability_index / 10
        
        return {
            'overall': round(overall_score, 1),
            'readability': round(readability_score, 1),
            'maintainability': round(maintainability_score, 1)
        }
    
    def _generate_summary(
        self, 
        scores: Dict[str, float], 
        issues: List[CodeIssue], 
        line_count: int
    ) -> str:
        """Generate a summary of the code review."""
        critical_count = len([i for i in issues if i.severity == 'critical'])
        high_count = len([i for i in issues if i.severity == 'high'])
        total_issues = len(issues)
        
        if scores['overall'] >= 8.0:
            quality = "excellent"
        elif scores['overall'] >= 6.0:
            quality = "good"
        elif scores['overall'] >= 4.0:
            quality = "fair"
        else:
            quality = "needs improvement"
        
        summary = f"Code review completed for {line_count} lines. "
        summary += f"Overall quality: {quality} (Score: {scores['overall']}/10). "
        
        if total_issues > 0:
            summary += f"Found {total_issues} issue(s)"
            if critical_count > 0 or high_count > 0:
                summary += f" including {critical_count + high_count} high-priority issue(s)"
            summary += ". "
        else:
            summary += "No major issues detected. "
        
        summary += f"Readability: {scores['readability']}/10, Maintainability: {scores['maintainability']}/10."
        
        return summary
    
    async def generate_project_summary(
        self, 
        file_reviews: List[FileReviewResponse]
    ) -> ProjectSummary:
        """Generate a project-level summary from multiple file reviews."""
        successful_reviews = [fr for fr in file_reviews if fr.review is not None]
        
        if not successful_reviews:
            return ProjectSummary(
                total_files=len(file_reviews),
                languages_detected=[],
                average_score=0.0,
                critical_issues=0,
                high_issues=0,
                medium_issues=0,
                low_issues=0,
                key_recommendations=["No files could be successfully analyzed"]
            )
        
        try:
            # Prepare data for LLM analysis
            review_data = []
            for fr in successful_reviews:
                review_data.append({
                    "filename": fr.filename,
                    "language": fr.language,
                    "overall_score": fr.review.overall_score,
                    "readability_score": fr.review.readability_score,
                    "maintainability_score": fr.review.maintainability_score,
                    "issues_count": len(fr.review.issues),
                    "critical_issues": len([i for i in fr.review.issues if i.severity == 'critical']),
                    "high_issues": len([i for i in fr.review.issues if i.severity == 'high']),
                    "summary": fr.review.summary,
                    "suggestions": fr.review.suggestions[:3]  # Limit for LLM context
                })
            
            # Generate LLM-powered project summary
            prompt = self.prompt_templates.get_project_summary_prompt(review_data)
            llm_response = await self.llm_client.generate_response(prompt)
            llm_summary = json.loads(llm_response)
            
            # Extract data from LLM response
            return ProjectSummary(
                total_files=len(file_reviews),
                languages_detected=list(llm_summary.get("languages_analysis", {}).keys()),
                average_score=llm_summary.get("project_quality_score", 7.0),
                critical_issues=llm_summary.get("critical_issues_count", 0),
                high_issues=llm_summary.get("high_issues_count", 0),
                medium_issues=llm_summary.get("medium_issues_count", 0),
                low_issues=llm_summary.get("low_issues_count", 0),
                key_recommendations=llm_summary.get("key_recommendations", [])[:5]
            )
            
        except Exception as e:
            logger.error(f"Failed to generate LLM project summary: {str(e)}")
            # Fallback to basic summary
            return self._generate_basic_project_summary(successful_reviews, len(file_reviews))
    
    def _generate_basic_project_summary(
        self, 
        successful_reviews: List[FileReviewResponse], 
        total_files: int
    ) -> ProjectSummary:
        """Generate a basic project summary without LLM."""
        
        # Collect basic statistics
        languages = list(set(fr.language for fr in successful_reviews))
        scores = [fr.review.overall_score for fr in successful_reviews]
        average_score = sum(scores) / len(scores) if scores else 0.0
        
        # Count issues by severity
        all_issues = []
        for fr in successful_reviews:
            if fr.review and fr.review.issues:
                all_issues.extend(fr.review.issues)
        
        critical_issues = len([i for i in all_issues if i.severity == 'critical'])
        high_issues = len([i for i in all_issues if i.severity == 'high'])
        medium_issues = len([i for i in all_issues if i.severity == 'medium'])
        low_issues = len([i for i in all_issues if i.severity == 'low'])
        
        # Generate basic recommendations
        recommendations = []
        if critical_issues > 0:
            recommendations.append(f"Address {critical_issues} critical issue(s) immediately")
        if high_issues > 0:
            recommendations.append(f"Fix {high_issues} high-priority issue(s)")
        if average_score < 6.0:
            recommendations.append("Focus on improving overall code quality")
        
        return ProjectSummary(
            total_files=total_files,
            languages_detected=languages,
            average_score=round(average_score, 1),
            critical_issues=critical_issues,
            high_issues=high_issues,
            medium_issues=medium_issues,
            low_issues=low_issues,
            key_recommendations=recommendations[:5]
        )
    
    def _extract_simple_analysis(self, response: str) -> Dict[str, Any]:
        """Extract basic analysis from free-form LLM response when JSON parsing fails."""
        logger.info("Extracting simple analysis from free-form response")
        
        # Create a basic structure with extracted information
        analysis = {
            "issues": [],
            "metrics": {
                "complexity_assessment": "Analysis completed with text extraction",
                "readability_score": 7.0,
                "maintainability_score": 7.0,
                "performance_notes": "See summary for performance notes"
            },
            "suggestions": [],
            "summary": "",
            "strengths": []
        }
        
        # Try to extract some basic information from the response
        response_lower = response.lower()
        
        # Extract summary - use the first substantial paragraph
        lines = response.split('\n')
        for line in lines:
            if len(line.strip()) > 50 and not line.strip().startswith(('```', '#', '-', '*')):
                analysis["summary"] = line.strip()[:200] + "..."
                break
        
        if not analysis["summary"]:
            analysis["summary"] = "Code analysis completed. See full response for details."
        
        # Look for common issue indicators
        if any(word in response_lower for word in ['error', 'bug', 'issue', 'problem']):
            analysis["issues"].append({
                "line_number": None,
                "issue_type": "maintenance",
                "severity": "medium",
                "message": "Potential issues detected in code review",
                "suggestion": "Review the detailed analysis for specific recommendations"
            })
        
        # Look for positive indicators
        if any(word in response_lower for word in ['good', 'well', 'clean', 'clear']):
            analysis["strengths"].append("Code shows good structure and clarity")
        
        # Add basic suggestions
        analysis["suggestions"] = [
            "Review the full analysis response for detailed recommendations",
            "Consider improving code documentation",
            "Follow language-specific best practices"
        ]
        
        return analysis
    
    # NEW METHOD FOR ENHANCED MULTIPLE FILE ANALYSIS (ADDITION ONLY)
    async def generate_enhanced_project_summary(
        self, 
        file_reviews: List[FileReviewResponse]
    ) -> EnhancedProjectSummary:
        """Generate enhanced project summary with relationship analysis for multiple files."""
        from ..models.review_models import EnhancedProjectSummary, FileRelationship
        
        successful_reviews = [fr for fr in file_reviews if fr.review is not None]
        
        if not successful_reviews:
            return EnhancedProjectSummary(
                total_files=len(file_reviews),
                languages_detected=[],
                average_score=0.0,
                critical_issues=0,
                high_issues=0,
                medium_issues=0,
                low_issues=0,
                key_recommendations=["No files could be successfully analyzed"],
                relationships=[],
                relationship_summary="No relationships could be analyzed due to failed file reviews.",
                architecture_overview="Architecture analysis unavailable - no files successfully reviewed."
            )
        
        try:
            # Prepare enhanced data for LLM analysis with file content snippets
            enhanced_review_data = []
            for fr in successful_reviews:
                enhanced_review_data.append({
                    "filename": fr.filename,
                    "language": fr.language,
                    "overall_score": fr.review.overall_score,
                    "readability_score": fr.review.readability_score,
                    "maintainability_score": fr.review.maintainability_score,
                    "issues_count": len(fr.review.issues),
                    "critical_issues": len([i for i in fr.review.issues if i.severity == 'critical']),
                    "high_issues": len([i for i in fr.review.issues if i.severity == 'high']),
                    "summary": fr.review.summary,
                    "suggestions": fr.review.suggestions[:3]
                })
            
            # Generate enhanced LLM analysis with relationships
            prompt = self.prompt_templates.get_enhanced_project_summary_prompt(enhanced_review_data)
            llm_response = await self.llm_client.generate_response(prompt)
            llm_summary = json.loads(llm_response)
            
            # Parse relationships
            relationships = []
            for rel_data in llm_summary.get("relationships", []):
                relationships.append(FileRelationship(
                    file1=rel_data.get("file1", ""),
                    file2=rel_data.get("file2", ""),
                    relationship_type=rel_data.get("relationship_type", "unknown"),
                    description=rel_data.get("description", "")
                ))
            
            # Calculate actual issue counts from file reviews
            all_issues = []
            for fr in successful_reviews:
                all_issues.extend(fr.review.issues)
            
            critical_count = len([i for i in all_issues if i.severity == 'critical'])
            high_count = len([i for i in all_issues if i.severity == 'high'])
            medium_count = len([i for i in all_issues if i.severity == 'medium'])
            low_count = len([i for i in all_issues if i.severity == 'low'])
            
            # Extract enhanced data from LLM response
            return EnhancedProjectSummary(
                total_files=len(file_reviews),
                languages_detected=list(llm_summary.get("languages_analysis", {}).keys()),
                average_score=llm_summary.get("average_score", 70.0),
                security_score=llm_summary.get("security_score", 80.0),
                performance_score=llm_summary.get("performance_score", 75.0),
                critical_issues=critical_count,
                high_issues=high_count,
                medium_issues=medium_count,
                low_issues=low_count,
                key_recommendations=llm_summary.get("key_recommendations", [])[:5],
                relationships=relationships,
                relationship_summary=llm_summary.get("relationship_summary", "No relationship analysis available."),
                architecture_overview=llm_summary.get("architecture_overview", "Architecture analysis not available.")
            )
            
        except Exception as e:
            logger.error(f"Failed to generate enhanced project summary: {str(e)}")
            # Fallback to basic summary structure with enhanced fields
            basic_summary = await self.generate_project_summary(file_reviews)
            return EnhancedProjectSummary(
                total_files=basic_summary.total_files,
                languages_detected=basic_summary.languages_detected,
                average_score=basic_summary.average_score * 10,  # Convert to 100-point scale
                critical_issues=basic_summary.critical_issues,
                high_issues=basic_summary.high_issues,
                medium_issues=basic_summary.medium_issues,
                low_issues=basic_summary.low_issues,
                key_recommendations=basic_summary.key_recommendations,
                relationships=[],
                relationship_summary="Relationship analysis failed, but basic analysis completed successfully.",
                architecture_overview="Architecture analysis not available due to processing error."
            )
    
    # NEW METHOD FOR INDIVIDUAL FILE ANALYSIS IN MULTIPLE FILE CONTEXT (ADDITION ONLY)
    async def analyze_code_for_multiple_files(
        self,
        code_content: str,
        language: str,
        filename: str,
        include_suggestions: bool = True,
        analysis_depth: str = "standard"
    ) -> Optional[CodeReview]:
        """Analyze individual code file specifically for multiple file reviews with correct field names."""
        
        try:
            logger.info(f"Analyzing code file for multiple files context: {filename} (Language: {language})")
            
            # Use the NEW prompt template for multiple file individual analysis
            prompt = self.prompt_templates.get_multiple_file_individual_analysis_prompt(
                code=code_content,
                language=language,
                filename=filename,
                analysis_depth=analysis_depth
            )
            
            # Get response from LLM
            response = await self.llm_client.generate_response(prompt)
            logger.debug(f"Raw LLM response: {response[:500]}...")
            logger.debug(f"Raw LLM response length: {len(response)} chars")
            
            # Clean and parse response using existing method
            parsed_response = self._parse_llm_json_response(response)
            logger.debug("Successfully parsed JSON response")
            
            # Create CodeReview object with the correct field mapping including required fields
            code_review = CodeReview(
                filename=filename,  # Required field
                language=language,  # Required field
                summary=parsed_response.get("summary", "Analysis completed"),
                overall_score=int(parsed_response.get("overall_score", 70)),
                readability_score=int(parsed_response.get("readability_score", 70)),
                maintainability_score=int(parsed_response.get("maintainability_score", 70)),
                complexity_score=int(parsed_response.get("complexity_score", 5)),
                comment_ratio=float(parsed_response.get("comment_ratio", 0.0)),
                best_practices_score=int(parsed_response.get("best_practices_score", 70)),
                security_score=int(parsed_response.get("security_score", 80)),
                performance_score=int(parsed_response.get("performance_score", 75)),
                
                # Parse issues with correct field names (issue_type, message)
                issues=[
                    CodeIssue(
                        issue_type=issue.get("issue_type", "General"),
                        severity=issue.get("severity", "medium"),
                        line=issue.get("line", 0),
                        title=issue.get("title", "Issue found"),
                        message=issue.get("message", "Issue description"),
                        suggestion=issue.get("suggestion", "Consider reviewing this code")
                    )
                    for issue in parsed_response.get("issues", [])
                ],
                
                suggestions=parsed_response.get("suggestions", []),
                strengths=parsed_response.get("strengths", []),
                
                # Parse metrics with correct field names
                metrics=CodeMetrics(
                    lines_of_code=int(parsed_response.get("total_lines", len(code_content.split('\n')))),
                    cyclomatic_complexity=parsed_response.get("complexity_score"),
                    maintainability_index=parsed_response.get("maintainability_score"),
                    code_duplication=parsed_response.get("code_duplication")
                )
            )
            
            logger.info(f"Successfully analyzed {filename} for multiple files context")
            return code_review
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error for {filename}: {str(e)}")
            logger.debug(f"Raw response that failed to parse: {response}")
            return None
            
        except Exception as e:
            logger.error(f"Error analyzing code for multiple files context {filename}: {str(e)}")
            return None