import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

const MultipleFileResults = ({ results }) => {
  console.log("MultipleFileResults: Component rendered with results:", results);

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  if (!results) {
    console.log("MultipleFileResults: No results provided, returning null");
    return null;
  }

  // Extract the enhanced analysis data from the API response
  const analysisData = results;
  console.log("MultipleFileResults: Extracted analysis data:", analysisData);

  // Check if we have the enhanced structure from enhanced endpoint
  const hasEnhancedStructure =
    analysisData.file_reviews && analysisData.enhanced_project_summary;

  if (!hasEnhancedStructure) {
    console.log(
      "MultipleFileResults: Missing enhanced structure, showing error"
    );
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Enhanced multiple file analysis data is not available. Please try
          again.
        </p>
      </div>
    );
  }

  // Use enhanced data structure
  const file_reviews = analysisData.file_reviews;
  const project_summary = analysisData.enhanced_project_summary;
  const successfulReviews = file_reviews.filter(
    (review) => review.review !== null
  );

  const tabs = [
    {
      id: "overview",
      label: "Project Overview",
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
    {
      id: "relationships",
      label: "File Relationships",
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
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
    },
    {
      id: "individual",
      label: "Individual Files",
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
      id: "summary",
      label: "Quality Summary",
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 6;

      // Helper function to add new page if needed
      const checkPageBreak = (neededSpace = 20) => {
        if (yPos + neededSpace > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
      };

      // Helper function to add wrapped text
      const addWrappedText = (text, maxWidth = 170) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line) => {
          checkPageBreak();
          doc.text(line, margin, yPos);
          yPos += lineHeight;
        });
      };

      // Title
      doc.setFontSize(20);
      doc.setFont(undefined, "bold");
      doc.text("Multiple Files Code Review Report", margin, yPos);
      yPos += 15;

      // Generated date
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPos);
      yPos += 15;

      // Project Overview Section
      checkPageBreak(40);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Project Overview", margin, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(`Files Analyzed: ${project_summary.total_files}`, margin, yPos);
      yPos += lineHeight;
      doc.text(
        `Languages: ${project_summary.languages_detected.join(", ")}`,
        margin,
        yPos
      );
      yPos += lineHeight;
      doc.text(
        `Average Score: ${Math.round(project_summary.average_score)}/100`,
        margin,
        yPos
      );
      yPos += lineHeight;
      doc.text(
        `Total Issues: ${
          project_summary.critical_issues +
          project_summary.high_issues +
          project_summary.medium_issues +
          project_summary.low_issues
        }`,
        margin,
        yPos
      );
      yPos += 15;

      // Issues Summary
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Issues Summary", margin, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(
        `Critical Issues: ${project_summary.critical_issues}`,
        margin + 10,
        yPos
      );
      yPos += lineHeight;
      doc.text(
        `High Priority: ${project_summary.high_issues}`,
        margin + 10,
        yPos
      );
      yPos += lineHeight;
      doc.text(
        `Medium Priority: ${project_summary.medium_issues}`,
        margin + 10,
        yPos
      );
      yPos += lineHeight;
      doc.text(
        `Low Priority: ${project_summary.low_issues}`,
        margin + 10,
        yPos
      );
      yPos += 15;

      // Architecture Overview
      if (project_summary?.architecture_analysis) {
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text("Architecture Overview", margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, "normal");
        addWrappedText(project_summary.architecture_analysis);
        yPos += 10;
      }

      // File Relationships
      if (
        analysisData.file_relationships &&
        analysisData.file_relationships.length > 0
      ) {
        checkPageBreak(40);
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text("File Relationships", margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, "normal");
        analysisData.file_relationships.forEach((rel, index) => {
          checkPageBreak(20);
          doc.text(
            `${index + 1}. ${rel.file1} ↔ ${rel.file2}`,
            margin + 5,
            yPos
          );
          yPos += lineHeight;
          doc.text(
            `   Type: ${rel.relationship_type} | Score: ${rel.relationship_score}/100`,
            margin + 5,
            yPos
          );
          yPos += lineHeight;
          if (rel.description) {
            addWrappedText(`   ${rel.description}`, 160);
          }
          yPos += 5;
        });
        yPos += 10;
      }

      // Individual File Analyses
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Individual File Analyses", margin, yPos);
      yPos += 15;

      successfulReviews.forEach((fileReview, index) => {
        const review = fileReview.review;

        checkPageBreak(50);
        doc.setFontSize(13);
        doc.setFont(undefined, "bold");
        doc.text(`${index + 1}. ${fileReview.filename}`, margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, "normal");

        // Scores
        doc.text(
          `Overall Score: ${review.overall_score}/100`,
          margin + 5,
          yPos
        );
        yPos += lineHeight;
        doc.text(
          `Readability: ${review.readability_score}/100 | Maintainability: ${review.maintainability_score}/100`,
          margin + 5,
          yPos
        );
        yPos += lineHeight;
        doc.text(
          `Security: ${review.security_score}/100 | Performance: ${review.performance_score}/100`,
          margin + 5,
          yPos
        );
        yPos += 10;

        // Summary
        if (review.summary) {
          doc.setFont(undefined, "bold");
          doc.text("Summary:", margin + 5, yPos);
          yPos += lineHeight;
          doc.setFont(undefined, "normal");
          addWrappedText(review.summary, 160);
          yPos += 5;
        }

        // Issues
        if (review.issues && review.issues.length > 0) {
          doc.setFont(undefined, "bold");
          doc.text(`Issues Found (${review.issues.length}):`, margin + 5, yPos);
          yPos += lineHeight;
          doc.setFont(undefined, "normal");

          review.issues.slice(0, 5).forEach((issue, issueIndex) => {
            checkPageBreak(15);
            doc.text(
              `• ${issue.severity.toUpperCase()}: ${issue.title}`,
              margin + 10,
              yPos
            );
            yPos += lineHeight;
            if (issue.message) {
              addWrappedText(`  ${issue.message}`, 150);
            }
            yPos += 3;
          });

          if (review.issues.length > 5) {
            doc.text(
              `... and ${review.issues.length - 5} more issues`,
              margin + 10,
              yPos
            );
            yPos += lineHeight;
          }
          yPos += 5;
        }

        // Suggestions
        if (review.suggestions && review.suggestions.length > 0) {
          doc.setFont(undefined, "bold");
          doc.text("Top Suggestions:", margin + 5, yPos);
          yPos += lineHeight;
          doc.setFont(undefined, "normal");

          review.suggestions.slice(0, 3).forEach((suggestion) => {
            checkPageBreak(10);
            doc.text(`• ${suggestion}`, margin + 10, yPos);
            yPos += lineHeight;
          });
          yPos += 5;
        }

        yPos += 10;
      });

      // Summary & Recommendations
      if (project_summary?.overall_recommendations) {
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text("Overall Recommendations", margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, "normal");
        project_summary.overall_recommendations.forEach((rec) => {
          checkPageBreak(10);
          doc.text(`• ${rec}`, margin + 5, yPos);
          yPos += lineHeight;
        });
      }

      doc.save("comprehensive-multiple-files-review-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      import("react-hot-toast").then((toast) => {
        toast.default.error("Failed to generate PDF report");
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h2 className="text-2xl font-bold text-slate-100 font-mono">
                Multi-File Analysis
              </h2>
            </div>
            <p className="text-slate-300 font-mono text-sm">
              {project_summary.total_files} files analyzed •{" "}
              {successfulReviews.length} successful reviews
            </p>
          </div>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors flex items-center space-x-2 font-mono border border-slate-600 hover:border-emerald-500"
          >
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>export_report</span>
          </button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700">
        <div className="flex border-b border-slate-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-mono font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-emerald-400 border-b-2 border-emerald-400 bg-slate-800"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 bg-slate-900">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Average Score */}
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                    <h3 className="text-lg font-semibold mb-2 text-slate-200 font-mono">
                      Average Score
                    </h3>
                    <div className="text-3xl font-bold text-emerald-400 font-mono">
                      {Math.round(project_summary.average_score)}/100
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                    <h3 className="text-lg font-semibold mb-2 text-slate-200 font-mono">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {project_summary.languages_detected.map((lang, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full border border-blue-500/50 font-mono"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Total Issues */}
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                    <h3 className="text-lg font-semibold mb-2 text-slate-200 font-mono">
                      Total Issues
                    </h3>
                    <div className="text-3xl font-bold text-slate-100 font-mono">
                      {project_summary.critical_issues +
                        project_summary.high_issues +
                        project_summary.medium_issues +
                        project_summary.low_issues}
                    </div>
                  </div>

                  {/* Files Processed */}
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                    <h3 className="text-lg font-semibold mb-2 text-slate-200 font-mono">
                      Files
                    </h3>
                    <div className="text-3xl font-bold text-slate-100 font-mono">
                      {successfulReviews.length}/{project_summary.total_files}
                    </div>
                  </div>
                </div>

                {/* Architecture Overview */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg
                      className="w-5 h-5 text-emerald-400"
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
                    <h3 className="text-xl font-semibold text-slate-100 font-mono">
                      Architecture Overview
                    </h3>
                  </div>
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                    <p className="text-slate-300 font-mono text-sm leading-relaxed">
                      {project_summary.architecture_overview}
                    </p>
                  </div>
                </div>

                {/* Key Recommendations */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <svg
                      className="w-5 h-5 text-amber-400"
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
                    <h3 className="text-xl font-semibold text-slate-100 font-mono">
                      Key Recommendations
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {project_summary.key_recommendations.map(
                      (recommendation, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-slate-800 border border-amber-500/30 rounded-lg"
                        >
                          <span className="text-amber-400 mt-0.5 flex-shrink-0">
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
                          </span>
                          <p className="text-slate-300 font-mono text-sm leading-relaxed">
                            {recommendation}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "relationships" && (
              <motion.div
                key="relationships"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Relationship Summary */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg
                      className="w-5 h-5 text-emerald-400"
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
                    <h3 className="text-xl font-semibold text-slate-100 font-mono">
                      Relationship Summary
                    </h3>
                  </div>
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                    <p className="text-slate-300 font-mono text-sm leading-relaxed">
                      {project_summary.relationship_summary}
                    </p>
                  </div>
                </div>

                {/* Individual Relationships */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <svg
                      className="w-5 h-5 text-blue-400"
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
                    <h3 className="text-xl font-semibold text-slate-100 font-mono">
                      File Relationships
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {project_summary.relationships &&
                      project_summary.relationships.map(
                        (relationship, index) => (
                          <div
                            key={index}
                            className="bg-slate-800 border border-slate-600 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <span className="text-blue-400 font-mono text-sm">
                                  {relationship.file1}
                                </span>
                                <span className="text-slate-400">→</span>
                                <span className="text-purple-400 font-mono text-sm">
                                  {relationship.file2}
                                </span>
                              </div>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600 font-mono">
                                {relationship.relationship_type}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm font-mono leading-relaxed">
                              {relationship.description}
                            </p>
                          </div>
                        )
                      )}
                    {(!project_summary.relationships ||
                      project_summary.relationships.length === 0) && (
                      <div className="text-center py-8">
                        <svg
                          className="w-12 h-12 text-slate-500 mx-auto mb-4"
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
                        <p className="text-slate-500 font-mono text-sm">
                          No specific relationships identified between files.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "individual" && (
              <motion.div
                key="individual"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <svg
                    className="w-5 h-5 text-emerald-400"
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
                  <h3 className="text-xl font-semibold text-slate-100 font-mono">
                    Individual File Analysis
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {file_reviews.map((fileReview, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFileIndex(index)}
                      className={`px-4 py-2 rounded-lg font-mono font-medium transition-colors border ${
                        selectedFileIndex === index
                          ? "bg-emerald-600 text-white border-emerald-500"
                          : fileReview.review
                          ? "bg-slate-800 text-emerald-300 border-emerald-500/50 hover:bg-slate-700 hover:border-emerald-400"
                          : "bg-slate-800 text-red-300 border-red-500/50 hover:bg-slate-700 hover:border-red-400"
                      }`}
                    >
                      {fileReview.filename}
                    </button>
                  ))}
                </div>

                {/* Selected File Analysis */}
                {file_reviews[selectedFileIndex] && (
                  <div>
                    {file_reviews[selectedFileIndex].error ? (
                      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                        <h4 className="font-semibold text-red-300 mb-2 font-mono">
                          Analysis Failed
                        </h4>
                        <p className="text-red-400 font-mono text-sm">
                          {file_reviews[selectedFileIndex].error}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* File Header */}
                        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="w-5 h-5 text-emerald-400"
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
                                <h4 className="text-lg font-semibold text-slate-100 font-mono">
                                  {file_reviews[selectedFileIndex].filename}
                                </h4>
                              </div>
                              <p className="text-sm text-slate-400 font-mono mt-1">
                                Language:{" "}
                                {file_reviews[selectedFileIndex].language}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Scores */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                            <h5 className="font-semibold mb-2 text-slate-200 font-mono">
                              Overall Score
                            </h5>
                            <div className="text-2xl font-bold text-emerald-400 font-mono">
                              {Math.round(
                                file_reviews[selectedFileIndex].review
                                  ?.overall_score || 0
                              )}
                            </div>
                          </div>
                          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                            <h5 className="font-semibold mb-2 text-slate-200 font-mono">
                              Readability
                            </h5>
                            <div className="text-2xl font-bold text-blue-400 font-mono">
                              {Math.round(
                                file_reviews[selectedFileIndex].review
                                  ?.readability_score || 0
                              )}
                            </div>
                          </div>
                          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                            <h5 className="font-semibold mb-2 text-slate-200 font-mono">
                              Maintainability
                            </h5>
                            <div className="text-2xl font-bold text-amber-400 font-mono">
                              {Math.round(
                                file_reviews[selectedFileIndex].review
                                  ?.maintainability_score || 0
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div>
                          <h5 className="text-lg font-semibold mb-3 text-slate-200 font-mono">
                            Summary
                          </h5>
                          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                            <p className="text-slate-300 font-mono text-sm leading-relaxed">
                              {file_reviews[selectedFileIndex].review
                                ?.summary || "No summary available"}
                            </p>
                          </div>
                        </div>

                        {/* Issues */}
                        <div>
                          <h5 className="text-lg font-semibold mb-3 text-slate-200 font-mono">
                            Issues Found
                          </h5>
                          {(!file_reviews[selectedFileIndex].review?.issues ||
                            file_reviews[selectedFileIndex].review?.issues
                              .length === 0) && (
                            <div className="text-center py-6">
                              <svg
                                className="w-8 h-8 text-emerald-400 mx-auto mb-2"
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
                              <p className="text-slate-400 font-mono text-sm">
                                No issues found in this file.
                              </p>
                            </div>
                          )}
                          {file_reviews[selectedFileIndex].review?.issues?.map(
                            (issue, index) => (
                              <div
                                key={index}
                                className="mb-3 p-4 bg-slate-800 border border-slate-600 rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium font-mono ${
                                      issue.severity?.toLowerCase() ===
                                      "critical"
                                        ? "bg-red-900/50 text-red-300 border border-red-500/50"
                                        : issue.severity?.toLowerCase() ===
                                          "high"
                                        ? "bg-orange-900/50 text-orange-300 border border-orange-500/50"
                                        : issue.severity?.toLowerCase() ===
                                          "medium"
                                        ? "bg-yellow-900/50 text-yellow-300 border border-yellow-500/50"
                                        : "bg-blue-900/50 text-blue-300 border border-blue-500/50"
                                    }`}
                                  >
                                    {issue.severity?.toUpperCase()}
                                  </span>
                                </div>
                                <p className="font-medium text-slate-200 mb-1 font-mono text-sm">
                                  {issue.message}
                                </p>
                                {issue.line_number && (
                                  <p className="text-sm text-slate-400 font-mono">
                                    Line {issue.line_number}
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>

                        {/* Suggestions */}
                        <div>
                          <h5 className="text-lg font-semibold mb-3 text-slate-200 font-mono">
                            Suggestions
                          </h5>
                          {(!file_reviews[selectedFileIndex].review
                            ?.suggestions ||
                            file_reviews[selectedFileIndex].review?.suggestions
                              .length === 0) && (
                            <div className="text-center py-6">
                              <svg
                                className="w-8 h-8 text-amber-400 mx-auto mb-2"
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
                              <p className="text-slate-400 font-mono text-sm">
                                No suggestions available.
                              </p>
                            </div>
                          )}
                          {file_reviews[
                            selectedFileIndex
                          ].review?.suggestions?.map((suggestion, index) => (
                            <div
                              key={index}
                              className="mb-3 p-4 bg-slate-800 border border-amber-500/30 rounded-lg"
                            >
                              <div className="flex items-start space-x-3">
                                <svg
                                  className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0"
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
                                <p className="text-slate-300 font-mono text-sm leading-relaxed">
                                  {suggestion}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "summary" && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <svg
                    className="w-5 h-5 text-emerald-400"
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
                  <h3 className="text-xl font-semibold text-slate-100 font-mono">
                    Quality Summary
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Issues Breakdown */}
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4 text-slate-200 font-mono">
                      Issues Breakdown
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center font-mono text-slate-300">
                          <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                          Critical
                        </span>
                        <span className="font-bold text-red-400 font-mono">
                          {project_summary.critical_issues}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center font-mono text-slate-300">
                          <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                          High
                        </span>
                        <span className="font-bold text-orange-400 font-mono">
                          {project_summary.high_issues}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center font-mono text-slate-300">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                          Medium
                        </span>
                        <span className="font-bold text-yellow-400 font-mono">
                          {project_summary.medium_issues}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center font-mono text-slate-300">
                          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                          Low
                        </span>
                        <span className="font-bold text-blue-400 font-mono">
                          {project_summary.low_issues}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* File Status */}
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4 text-slate-200 font-mono">
                      File Status
                    </h4>
                    <div className="space-y-4">
                      {file_reviews.map((fileReview, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-mono text-slate-300">
                            {fileReview.filename}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium font-mono border ${
                              fileReview.review
                                ? "bg-emerald-900/50 text-emerald-300 border-emerald-500/50"
                                : "bg-red-900/50 text-red-300 border-red-500/50"
                            }`}
                          >
                            {fileReview.review ? "Success" : "Failed"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MultipleFileResults;
