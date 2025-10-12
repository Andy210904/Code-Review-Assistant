import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

const ReviewResults = ({ results }) => {
  console.log("ReviewResults: Component rendered with results:", results);

  const [activeTab, setActiveTab] = useState("summary");

  if (!results) {
    console.log("ReviewResults: No results provided, returning null");
    return null;
  }

  // Extract the actual analysis data from the API response
  const analysisData = results.data || results;
  console.log("ReviewResults: Extracted analysis data:", analysisData);

  // Debug logging to see what we're getting
  console.log("Full results:", results);
  console.log("Analysis data:", analysisData);

  // Log all the fields we're trying to access
  console.log("Quality score fields:", {
    quality_score: analysisData.quality_score,
    overall_score: analysisData.overall_score,
    security_score: analysisData.security_score,
    performance_score: analysisData.performance_score,
    best_practices_score: analysisData.best_practices_score,
    maintainability_score: analysisData.maintainability_score,
  });

  // Log all available fields
  console.log(
    "All available fields in analysisData:",
    Object.keys(analysisData || {})
  );

  const tabs = [
    { id: "summary", label: "Summary", icon: "📋" },
    { id: "readability", label: "Readability", icon: "👀" },
    { id: "issues", label: "Issues Found", icon: "⚠️" },
    { id: "suggestions", label: "Suggestions", icon: "💡" },
    { id: "modularity", label: "Modularity", icon: "🧱" },
  ];

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const filename = analysisData.filename || "code-review";
      const timestamp = new Date().toLocaleString();

      // PDF Configuration
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = 30;

      // Helper function to add text with automatic page breaks
      const addText = (
        text,
        fontSize = 12,
        isBold = false,
        leftMargin = margin
      ) => {
        doc.setFontSize(fontSize);
        if (isBold) {
          doc.setFont(undefined, "bold");
        } else {
          doc.setFont(undefined, "normal");
        }

        const lines = doc.splitTextToSize(
          text,
          maxWidth - (leftMargin - margin)
        );

        for (let i = 0; i < lines.length; i++) {
          if (yPosition > 280) {
            // Check if we need a new page
            doc.addPage();
            yPosition = 30;
          }
          doc.text(lines[i], leftMargin, yPosition);
          yPosition += fontSize * 0.5 + 2;
        }
        yPosition += 5; // Add extra spacing after text blocks
      };

      // Header
      doc.setFillColor(59, 130, 246); // Blue background
      doc.rect(0, 0, pageWidth, 25, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      doc.text("CODE REVIEW REPORT", margin, 17);

      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPosition = 35;

      // File Information
      addText(`Generated: ${timestamp}`, 10, false);
      addText(`File: ${filename}`, 10, false);
      addText(`Language: ${analysisData.language || "Unknown"}`, 10, false);
      yPosition += 5;

      // Summary Section
      addText("SUMMARY", 16, true);
      addText(analysisData.summary || "No summary available", 11, false);
      yPosition += 5;

      // Quality Scores Section
      addText("QUALITY SCORES", 16, true);
      const scores = [
        `Code Quality: ${analysisData.quality_score || "N/A"}/100`,
        `Security: ${analysisData.security_score || "N/A"}/100`,
        `Performance: ${analysisData.performance_score || "N/A"}/100`,
        `Maintainability: ${analysisData.modularity_score || "N/A"}/100`,
        `Readability: ${analysisData.readability_score || "N/A"}/100`,
      ];

      scores.forEach((score) => {
        addText(`• ${score}`, 11, false, margin + 5);
      });
      yPosition += 5;

      // Issues Section
      if (analysisData.issues && analysisData.issues.length > 0) {
        addText("ISSUES FOUND", 16, true);
        analysisData.issues.forEach((issue, index) => {
          addText(
            `${index + 1}. ${issue.title || issue.category || "Issue"} (${
              issue.severity || "medium"
            })`,
            12,
            true,
            margin + 5
          );
          addText(
            `Description: ${
              issue.description || issue.message || "No description"
            }`,
            10,
            false,
            margin + 10
          );
          if (issue.line) {
            addText(`Line: ${issue.line}`, 10, false, margin + 10);
          }
          if (issue.suggestion) {
            addText(`Suggestion: ${issue.suggestion}`, 10, false, margin + 10);
          }
          yPosition += 3;
        });
      }

      // Recommendations Section
      if (
        analysisData.recommendations &&
        analysisData.recommendations.length > 0
      ) {
        yPosition += 5;
        addText("RECOMMENDATIONS", 16, true);
        analysisData.recommendations.forEach((rec, index) => {
          addText(
            `${index + 1}. ${rec.title || "Recommendation"}`,
            12,
            true,
            margin + 5
          );
          addText(
            `Priority: ${rec.priority || "medium"}`,
            10,
            false,
            margin + 10
          );
          addText(
            `Description: ${
              rec.description || rec.message || "No description"
            }`,
            10,
            false,
            margin + 10
          );
          if (rec.impact) {
            addText(`Impact: ${rec.impact}`, 10, false, margin + 10);
          }
          if (rec.example && rec.example.length < 200) {
            // Only include short examples
            addText(`Example: ${rec.example}`, 9, false, margin + 10);
          }
          yPosition += 3;
        });
      }

      // Readability Analysis
      if (
        analysisData.readability_analysis &&
        Object.keys(analysisData.readability_analysis).length > 0
      ) {
        yPosition += 5;
        addText("READABILITY ANALYSIS", 16, true);
        Object.entries(analysisData.readability_analysis).forEach(
          ([key, value]) => {
            addText(
              `${key.replace(/_/g, " ").toUpperCase()}: ${value}`,
              10,
              false,
              margin + 5
            );
          }
        );
      }

      // Modularity Analysis
      if (
        analysisData.modularity_analysis &&
        Object.keys(analysisData.modularity_analysis).length > 0
      ) {
        yPosition += 5;
        addText("MODULARITY ANALYSIS", 16, true);
        Object.entries(analysisData.modularity_analysis).forEach(
          ([key, value]) => {
            addText(
              `${key.replace(/_/g, " ").toUpperCase()}: ${value}`,
              10,
              false,
              margin + 5
            );
          }
        );
      }

      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          "Generated by Code Review Assistant with Google Gemini AI",
          margin,
          290
        );
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - 50, 290);
      }

      // Save the PDF
      doc.save(
        `${filename}-review-${new Date().toISOString().split("T")[0]}.pdf`
      );

      console.log("PDF report downloaded successfully");
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    }
  };

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Overall Assessment
        </h3>
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 leading-relaxed break-words">
            {analysisData.summary ||
              analysisData.analysis ||
              "Analysis completed successfully."}
          </p>
        </div>

        {/* Key Insights */}
        {analysisData.best_practices &&
          analysisData.best_practices.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Key Insights:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {analysisData.best_practices
                  .slice(0, 3)
                  .map((practice, index) => (
                    <li key={index} className="text-sm">
                      {practice.description || practice}
                    </li>
                  ))}
              </ul>
            </div>
          )}
      </div>

      {/* Quality Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          {
            label: "Code Quality",
            value: analysisData.quality_score
              ? `${analysisData.quality_score}/100`
              : "N/A",
            color: "blue",
          },
          {
            label: "Security",
            value: analysisData.security_score
              ? `${analysisData.security_score}/100`
              : "N/A",
            color: "green",
          },
          {
            label: "Performance",
            value: analysisData.performance_score
              ? `${analysisData.performance_score}/100`
              : "N/A",
            color: "purple",
          },
          {
            label: "Maintainability",
            value: analysisData.modularity_score
              ? `${analysisData.modularity_score}/100`
              : "N/A",
            color: "orange",
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-center">
              <div
                className={`text-2xl font-bold text-${metric.color}-600 mb-1`}
              >
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderIssues = () => {
    const issues = analysisData.issues || analysisData.problems || [];

    if (!Array.isArray(issues) || issues.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Issues Found!
          </h3>
          <p className="text-gray-600">
            Your code looks clean and well-structured.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {issues.map((issue, index) => (
          <motion.div
            key={index}
            className="bg-white border border-red-200 rounded-lg p-4 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-semibold">
                    {index + 1}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2 break-words">
                  {issue.title || issue.category || "Issue Found"}
                </h4>
                <p className="text-gray-700 mb-2 break-words">
                  {issue.description || issue.message || issue}
                </p>
                {issue.line && (
                  <div className="text-sm text-gray-500">
                    Line: {issue.line}
                  </div>
                )}
                {issue.suggestion && (
                  <div className="text-sm text-blue-600 mt-2 break-words">
                    <strong>Suggestion:</strong> {issue.suggestion}
                  </div>
                )}
                {issue.severity && (
                  <div
                    className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
                      issue.severity === "high"
                        ? "bg-red-100 text-red-800"
                        : issue.severity === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {issue.severity.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderSuggestions = () => {
    const suggestions =
      analysisData.recommendations || analysisData.suggestions || [];

    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            All Good!
          </h3>
          <p className="text-gray-600">No specific suggestions at this time.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            className="bg-white border border-green-200 rounded-lg p-4 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">💡</span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">
                  {suggestion.title || "Improvement Suggestion"}
                  {suggestion.priority && (
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        suggestion.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : suggestion.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {suggestion.priority.toUpperCase()}
                    </span>
                  )}
                </h4>
                <p className="text-gray-700 mb-2 break-words">
                  {suggestion.description || suggestion.message || suggestion}
                </p>
                {suggestion.impact && (
                  <div className="text-sm text-blue-600 mb-2 break-words">
                    <strong>Impact:</strong> {suggestion.impact}
                  </div>
                )}
                {suggestion.example && (
                  <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-green-400">
                    <div className="text-sm text-gray-600 mb-1">Example:</div>
                    <pre className="text-sm text-gray-800 font-mono overflow-x-auto whitespace-pre-wrap break-words max-w-full">
                      {suggestion.example}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderSecurityAnalysis = () => {
    const security = results.security_analysis || results.security || {};

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🔒</span>
            Security Analysis
          </h3>

          {security.vulnerabilities && security.vulnerabilities.length > 0 ? (
            <div className="space-y-3">
              {security.vulnerabilities.map((vuln, index) => (
                <div
                  key={index}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="font-medium text-red-800">{vuln.type}</div>
                  <div className="text-red-700 mt-1">{vuln.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🛡️</div>
              <p className="text-gray-600">
                No security vulnerabilities detected
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPerformanceAnalysis = () => {
    const performance =
      results.performance_analysis || results.performance || {};

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">⚡</span>
            Performance Analysis
          </h3>

          {performance.optimizations && performance.optimizations.length > 0 ? (
            <div className="space-y-3">
              {performance.optimizations.map((opt, index) => (
                <div
                  key={index}
                  className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="font-medium text-blue-800">{opt.type}</div>
                  <div className="text-blue-700 mt-1">{opt.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🚀</div>
              <p className="text-gray-600">No performance issues detected</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReadabilityAnalysis = () => {
    const readability = analysisData.readability_analysis || {};

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">📖</span>
            Readability Analysis
          </h3>

          {/* Readability Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Readability Score
              </span>
              <span className="text-sm text-gray-600">
                {analysisData.readability_score || "N/A"}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${analysisData.readability_score || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                key: "variable_naming",
                label: "Variable & Function Names",
                icon: "🏷️",
              },
              {
                key: "comments",
                label: "Comments & Documentation",
                icon: "💬",
              },
              { key: "formatting", label: "Code Formatting", icon: "📐" },
              { key: "conventions", label: "Naming Conventions", icon: "📝" },
            ].map(({ key, label, icon }) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <span className="mr-2">{icon}</span>
                  {label}
                </h4>
                <p className="text-gray-700 text-sm">
                  {readability[key] || "No specific feedback available"}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Metrics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {analysisData.comment_ratio || 0}%
              </div>
              <div className="text-sm text-gray-600">Comment Ratio</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analysisData.total_lines || 0}
              </div>
              <div className="text-sm text-gray-600">Total Lines</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analysisData.function_count || 0}
              </div>
              <div className="text-sm text-gray-600">Functions</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {analysisData.complexity_score || 0}
              </div>
              <div className="text-sm text-gray-600">Complexity</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderModularityAnalysis = () => {
    const modularity = analysisData.modularity_analysis || {};

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">🧱</span>
            Modularity & Structure Analysis
          </h3>

          {/* Modularity Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Modularity Score
              </span>
              <span className="text-sm text-gray-600">
                {analysisData.modularity_score || "N/A"}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${analysisData.modularity_score || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { key: "structure", label: "Code Structure", icon: "🏗️" },
              { key: "reusability", label: "Code Reusability", icon: "♻️" },
              { key: "cohesion", label: "Function Cohesion", icon: "🎯" },
              { key: "coupling", label: "Code Coupling", icon: "🔗" },
            ].map(({ key, label, icon }) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <span className="mr-2">{icon}</span>
                  {label}
                </h4>
                <p className="text-gray-700 text-sm">
                  {modularity[key] || "No specific feedback available"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return renderSummary();
      case "readability":
        return renderReadabilityAnalysis();
      case "issues":
        return renderIssues();
      case "suggestions":
        return renderSuggestions();
      case "modularity":
        return renderModularityAnalysis();
      default:
        return renderSummary();
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Code Review Results
            </h2>
            <p className="text-gray-600">
              AI-powered analysis and recommendations for your code
            </p>
          </div>

          {/* Download Button */}
          <button
            onClick={downloadPDF}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
        <div className="text-sm text-gray-500 text-center">
          Analysis completed with Google Gemini AI • Generated at{" "}
          {new Date().toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewResults;
