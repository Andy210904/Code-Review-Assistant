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
    {
      id: "summary",
      label: "Summary",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "readability",
      label: "Readability",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },
    {
      id: "issues",
      label: "Issues Found",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
    },
    {
      id: "suggestions",
      label: "Suggestions",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      id: "modularity",
      label: "Modularity",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
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
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-600">
        <h3 className="text-xl font-semibold text-slate-100 mb-4 font-mono flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          System Analysis
        </h3>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-300 leading-relaxed break-words font-mono text-sm bg-slate-800/50 p-4 rounded border border-slate-600">
            {analysisData.summary ||
              analysisData.analysis ||
              "Analysis completed successfully."}
          </p>
        </div>

        {/* Key Insights */}
        {analysisData.best_practices &&
          analysisData.best_practices.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-slate-100 mb-2 font-mono text-sm">
                KEY_INSIGHTS:
              </h4>
              <ul className="list-none space-y-2 text-slate-300">
                {analysisData.best_practices
                  .slice(0, 3)
                  .map((practice, index) => (
                    <li
                      key={index}
                      className="text-sm font-mono flex items-start"
                    >
                      <span className="text-emerald-400 mr-2">→</span>
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
            score: analysisData.quality_score || 0,
            color: "emerald",
            bgColor: "bg-emerald-900/30",
            borderColor: "border-emerald-500/50",
          },
          {
            label: "Security",
            value: analysisData.security_score
              ? `${analysisData.security_score}/100`
              : "N/A",
            score: analysisData.security_score || 0,
            color: "blue",
            bgColor: "bg-blue-900/30",
            borderColor: "border-blue-500/50",
          },
          {
            label: "Performance",
            value: analysisData.performance_score
              ? `${analysisData.performance_score}/100`
              : "N/A",
            score: analysisData.performance_score || 0,
            color: "purple",
            bgColor: "bg-purple-900/30",
            borderColor: "border-purple-500/50",
          },
          {
            label: "Maintainability",
            value: analysisData.modularity_score
              ? `${analysisData.modularity_score}/100`
              : "N/A",
            score: analysisData.modularity_score || 0,
            color: "orange",
            bgColor: "bg-orange-900/30",
            borderColor: "border-orange-500/50",
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            className={`${metric.bgColor} rounded-lg p-4 shadow-lg border ${metric.borderColor} backdrop-blur-sm`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold font-mono mb-1 text-slate-100">
                {metric.value}
              </div>
              <div className="text-sm text-slate-300 font-mono uppercase tracking-wider mb-3">
                {metric.label}
              </div>
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-500 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.score}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
              <div
                className={`text-xs text-${metric.color}-400 font-mono mt-1`}
              >
                {metric.score}%
              </div>
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
          <svg
            className="w-16 h-16 text-emerald-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-slate-100 mb-2 font-mono">
            SYSTEM_CLEAN
          </h3>
          <p className="text-slate-400 font-mono text-sm">
            $ scan_complete --no-issues-detected
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {issues.map((issue, index) => (
          <motion.div
            key={index}
            className="bg-slate-800 border border-red-500/30 rounded-lg p-4 shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-red-400 text-sm font-mono font-semibold">
                    {index + 1}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-100 mb-2 break-words font-mono">
                  ERROR: {issue.title || issue.category || "Issue Detected"}
                </h4>
                <p className="text-slate-300 mb-2 break-words font-mono text-sm bg-slate-900/50 p-2 rounded border border-slate-700">
                  {issue.description || issue.message || issue}
                </p>
                {issue.line && (
                  <div className="text-sm text-slate-400 font-mono">
                    → line_{issue.line}
                  </div>
                )}
                {issue.suggestion && (
                  <div className="text-sm text-emerald-400 mt-2 break-words font-mono bg-slate-900/50 p-2 rounded border border-emerald-500/30">
                    <strong>FIX:</strong> {issue.suggestion}
                  </div>
                )}
                {issue.severity && (
                  <div
                    className={`inline-block px-3 py-1 rounded-lg text-xs font-mono font-medium mt-2 border ${
                      issue.severity === "high"
                        ? "bg-red-900/50 text-red-300 border-red-500/50"
                        : issue.severity === "medium"
                        ? "bg-yellow-900/50 text-yellow-300 border-yellow-500/50"
                        : "bg-blue-900/50 text-blue-300 border-blue-500/50"
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
          <svg
            className="w-16 h-16 text-emerald-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-slate-100 mb-2 font-mono">
            OPTIMIZATION_COMPLETE
          </h3>
          <p className="text-slate-400 font-mono text-sm">
            $ no_additional_improvements_detected
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            className="bg-slate-800 border border-emerald-500/30 rounded-lg p-4 shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-900/50 border border-emerald-500/50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-100 mb-2 font-mono">
                  OPTIMIZE: {suggestion.title || "Performance Enhancement"}
                  {suggestion.priority && (
                    <span
                      className={`ml-2 px-3 py-1 rounded-lg text-xs font-mono font-medium border ${
                        suggestion.priority === "high"
                          ? "bg-red-900/50 text-red-300 border-red-500/50"
                          : suggestion.priority === "medium"
                          ? "bg-yellow-900/50 text-yellow-300 border-yellow-500/50"
                          : "bg-emerald-900/50 text-emerald-300 border-emerald-500/50"
                      }`}
                    >
                      {suggestion.priority.toUpperCase()}
                    </span>
                  )}
                </h4>
                <p className="text-slate-300 mb-2 break-words font-mono text-sm bg-slate-900/50 p-2 rounded border border-slate-700">
                  {suggestion.description || suggestion.message || suggestion}
                </p>
                {suggestion.impact && (
                  <div className="text-sm text-blue-400 mb-2 break-words font-mono">
                    <strong>IMPACT:</strong> {suggestion.impact}
                  </div>
                )}
                {suggestion.example && (
                  <div className="mt-3 p-3 bg-slate-900/50 rounded border-l-4 border-emerald-500">
                    <div className="text-sm text-slate-400 mb-1 font-mono">
                      EXAMPLE_CODE:
                    </div>
                    <pre className="text-sm text-slate-200 font-mono overflow-x-auto whitespace-pre-wrap break-words max-w-full bg-slate-950/50 p-2 rounded">
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
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center font-mono">
            <svg
              className="w-5 h-5 mr-2 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Readability Analysis
          </h3>

          {/* Readability Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300 font-mono">
                readability_score
              </span>
              <span className="text-sm text-slate-400 font-mono">
                {analysisData.readability_score || "N/A"}/100
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
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
                icon: (
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a1 1 0 01-1-1V3a1 1 0 011-1z"
                    />
                  </svg>
                ),
              },
              {
                key: "comments",
                label: "Comments & Documentation",
                icon: (
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                ),
              },
              {
                key: "formatting",
                label: "Code Formatting",
                icon: (
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                ),
              },
              {
                key: "conventions",
                label: "Naming Conventions",
                icon: (
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                ),
              },
            ].map(({ key, label, icon }) => (
              <div
                key={key}
                className="p-4 bg-slate-900/50 rounded-lg border border-slate-600"
              >
                <h4 className="font-medium text-slate-100 mb-2 flex items-center font-mono">
                  <span className="mr-2">{icon}</span>
                  {label}
                </h4>
                <p className="text-slate-300 text-sm font-mono">
                  {readability[key] || "No specific feedback available"}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Metrics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-900/50 rounded-lg border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400 font-mono">
                {analysisData.comment_ratio || 0}%
              </div>
              <div className="text-sm text-slate-400 font-mono uppercase tracking-wider">
                Comment Ratio
              </div>
            </div>
            <div className="text-center p-3 bg-emerald-900/50 rounded-lg border border-emerald-500/30">
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                {analysisData.total_lines || 0}
              </div>
              <div className="text-sm text-slate-400 font-mono uppercase tracking-wider">
                Total Lines
              </div>
            </div>
            <div className="text-center p-3 bg-purple-900/50 rounded-lg border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400 font-mono">
                {analysisData.function_count || 0}
              </div>
              <div className="text-sm text-slate-400 font-mono uppercase tracking-wider">
                Functions
              </div>
            </div>
            <div className="text-center p-3 bg-orange-900/50 rounded-lg border border-orange-500/30">
              <div className="text-2xl font-bold text-orange-400 font-mono">
                {analysisData.complexity_score || 0}
              </div>
              <div className="text-sm text-slate-400 font-mono uppercase tracking-wider">
                Complexity
              </div>
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
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center font-mono">
            <svg
              className="w-5 h-5 mr-2 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Modularity & Structure Analysis
          </h3>

          {/* Modularity Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300 font-mono">
                modularity_score
              </span>
              <span className="text-sm text-slate-400 font-mono">
                {analysisData.modularity_score || "N/A"}/100
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${analysisData.modularity_score || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                key: "structure",
                label: "Code Structure",
                icon: (
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                ),
              },
              {
                key: "reusability",
                label: "Code Reusability",
                icon: (
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                ),
              },
              {
                key: "cohesion",
                label: "Function Cohesion",
                icon: (
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
              },
              {
                key: "coupling",
                label: "Code Coupling",
                icon: (
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                ),
              },
            ].map(({ key, label, icon }) => (
              <div
                key={key}
                className="p-4 bg-slate-900/50 rounded-lg border border-slate-600"
              >
                <h4 className="font-medium text-slate-100 mb-2 flex items-center font-mono">
                  <span className="mr-2">{icon}</span>
                  {label}
                </h4>
                <p className="text-slate-300 text-sm font-mono">
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
      className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="border-b border-slate-700 p-6 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <svg
                className="w-8 h-8 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <h2 className="text-2xl font-bold text-slate-100 font-mono">
                Analysis Report
              </h2>
            </div>
            <p className="text-slate-300 font-mono text-sm">
              $ comprehensive_code_analysis --output=detailed
            </p>
          </div>

          {/* Download Button */}
          <button
            onClick={downloadPDF}
            className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg font-mono font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl border border-slate-600 hover:border-emerald-500"
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
            <span>export --format=pdf</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700 bg-slate-800">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-mono font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-400 bg-slate-700/50"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500 hover:bg-slate-700/30"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-hidden bg-slate-900">
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
      <div className="bg-slate-800 px-6 py-4 rounded-b-xl border-t border-slate-700">
        <div className="text-sm text-slate-400 text-center font-mono">
          <span className="text-emerald-400">✓</span> analysis_complete •
          powered_by: gemini-ai • timestamp: {new Date().toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewResults;
