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
    { id: "overview", label: "Project Overview", icon: "🏗️" },
    { id: "relationships", label: "File Relationships", icon: "🔗" },
    { id: "individual", label: "Individual Files", icon: "📄" },
    { id: "summary", label: "Quality Summary", icon: "📊" },
  ];

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getScoreColor = (score) => {
    // For 100-point scale
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.text("Multiple Files Code Review Report", 20, 20);

      // Project Summary
      doc.setFontSize(14);
      doc.text(`Files Analyzed: ${project_summary.total_files}`, 20, 40);
      doc.text(
        `Languages: ${project_summary.languages_detected.join(", ")}`,
        20,
        50
      );
      doc.text(
        `Average Score: ${Math.round(project_summary.average_score)}/100`,
        20,
        60
      );

      // Issues Summary
      let yPos = 80;
      doc.text("Issues Summary:", 20, yPos);
      doc.text(`Critical: ${project_summary.critical_issues}`, 30, yPos + 10);
      doc.text(`High: ${project_summary.high_issues}`, 30, yPos + 20);
      doc.text(`Medium: ${project_summary.medium_issues}`, 30, yPos + 30);
      doc.text(`Low: ${project_summary.low_issues}`, 30, yPos + 40);

      doc.save("multiple-files-review-report.pdf");
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
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              📋 Multiple Files Analysis Report
            </h2>
            <p className="text-gray-600 mt-1">
              {project_summary.total_files} files analyzed •{" "}
              {successfulReviews.length} successful reviews
            </p>
          </div>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>📄</span>
            <span>Download Report</span>
          </button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
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
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Average Score
                    </h3>
                    <div
                      className={`text-3xl font-bold ${getScoreColor(
                        project_summary.average_score
                      )}`}
                    >
                      {Math.round(project_summary.average_score)}/100
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-1">
                      {project_summary.languages_detected.map((lang, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Total Issues */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Total Issues</h3>
                    <div className="text-3xl font-bold text-gray-800">
                      {project_summary.critical_issues +
                        project_summary.high_issues +
                        project_summary.medium_issues +
                        project_summary.low_issues}
                    </div>
                  </div>

                  {/* Files Processed */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Files</h3>
                    <div className="text-3xl font-bold text-gray-800">
                      {successfulReviews.length}/{project_summary.total_files}
                    </div>
                  </div>
                </div>

                {/* Architecture Overview */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    🏛️ Architecture Overview
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-800">
                      {project_summary.architecture_overview}
                    </p>
                  </div>
                </div>

                {/* Key Recommendations */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    💡 Key Recommendations
                  </h3>
                  <div className="space-y-2">
                    {project_summary.key_recommendations.map(
                      (recommendation, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                        >
                          <span className="text-yellow-600 mt-0.5">💡</span>
                          <p className="text-gray-800">{recommendation}</p>
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
                  <h3 className="text-xl font-semibold mb-4">
                    🔗 Relationship Summary
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-gray-800">
                      {project_summary.relationship_summary}
                    </p>
                  </div>
                </div>

                {/* Individual Relationships */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    📋 File Relationships
                  </h3>
                  <div className="space-y-4">
                    {project_summary.relationships &&
                      project_summary.relationships.map(
                        (relationship, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <span className="text-blue-600 font-mono text-sm">
                                  {relationship.file1}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span className="text-purple-600 font-mono text-sm">
                                  {relationship.file2}
                                </span>
                              </div>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-700`}
                              >
                                {relationship.relationship_type}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">
                              {relationship.description}
                            </p>
                          </div>
                        )
                      )}
                    {(!project_summary.relationships ||
                      project_summary.relationships.length === 0) && (
                      <p className="text-gray-500 italic">
                        No specific relationships identified between files.
                      </p>
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
                <h3 className="text-xl font-semibold mb-4">
                  📄 Individual File Analysis
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {file_reviews.map((fileReview, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFileIndex(index)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedFileIndex === index
                          ? "bg-blue-500 text-white"
                          : fileReview.review
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
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
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-2">
                          Analysis Failed
                        </h4>
                        <p className="text-red-600">
                          {file_reviews[selectedFileIndex].error}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* File Header */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                📄 {file_reviews[selectedFileIndex].filename}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Language:{" "}
                                {file_reviews[selectedFileIndex].language}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Scores */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-semibold mb-2">
                              Overall Score
                            </h5>
                            <div
                              className={`text-2xl font-bold ${getScoreColor(
                                file_reviews[selectedFileIndex].review
                                  ?.overall_score || 0
                              )}`}
                            >
                              {Math.round(
                                file_reviews[selectedFileIndex].review
                                  ?.overall_score || 0
                              )}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-semibold mb-2">Readability</h5>
                            <div
                              className={`text-2xl font-bold ${getScoreColor(
                                file_reviews[selectedFileIndex].review
                                  ?.readability_score || 0
                              )}`}
                            >
                              {Math.round(
                                file_reviews[selectedFileIndex].review
                                  ?.readability_score || 0
                              )}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-semibold mb-2">
                              Maintainability
                            </h5>
                            <div
                              className={`text-2xl font-bold ${getScoreColor(
                                file_reviews[selectedFileIndex].review
                                  ?.maintainability_score || 0
                              )}`}
                            >
                              {Math.round(
                                file_reviews[selectedFileIndex].review
                                  ?.maintainability_score || 0
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div>
                          <h5 className="text-lg font-semibold mb-3">
                            Summary
                          </h5>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-gray-800">
                              {file_reviews[selectedFileIndex].review
                                ?.summary || "No summary available"}
                            </p>
                          </div>
                        </div>

                        {/* Issues */}
                        <div>
                          <h5 className="text-lg font-semibold mb-3">
                            Issues Found
                          </h5>
                          {(!file_reviews[selectedFileIndex].review?.issues ||
                            file_reviews[selectedFileIndex].review?.issues
                              .length === 0) && (
                            <p className="text-gray-500 italic">
                              No issues found in this file.
                            </p>
                          )}
                          {file_reviews[selectedFileIndex].review?.issues?.map(
                            (issue, index) => (
                              <div
                                key={index}
                                className="mb-3 p-4 rounded-lg border"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                                      issue.severity
                                    )}`}
                                  >
                                    {issue.severity?.toUpperCase()}
                                  </span>
                                </div>
                                <p className="font-medium text-gray-900 mb-1">
                                  {issue.message}
                                </p>
                                {issue.line_number && (
                                  <p className="text-sm text-gray-600">
                                    Line {issue.line_number}
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>

                        {/* Suggestions */}
                        <div>
                          <h5 className="text-lg font-semibold mb-3">
                            Suggestions
                          </h5>
                          {(!file_reviews[selectedFileIndex].review
                            ?.suggestions ||
                            file_reviews[selectedFileIndex].review?.suggestions
                              .length === 0) && (
                            <p className="text-gray-500 italic">
                              No suggestions available.
                            </p>
                          )}
                          {file_reviews[
                            selectedFileIndex
                          ].review?.suggestions?.map((suggestion, index) => (
                            <div
                              key={index}
                              className="mb-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                            >
                              <p className="text-gray-800">💡 {suggestion}</p>
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
                <h3 className="text-xl font-semibold mb-6">Quality Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Issues Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">
                      Issues Breakdown
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          Critical
                        </span>
                        <span className="font-bold">
                          {project_summary.critical_issues}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                          High
                        </span>
                        <span className="font-bold">
                          {project_summary.high_issues}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          Medium
                        </span>
                        <span className="font-bold">
                          {project_summary.medium_issues}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          Low
                        </span>
                        <span className="font-bold">
                          {project_summary.low_issues}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* File Status */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">File Status</h4>
                    <div className="space-y-4">
                      {file_reviews.map((fileReview, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-mono">
                            {fileReview.filename}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              fileReview.review
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
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
