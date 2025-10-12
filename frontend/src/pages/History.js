import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { codeReviewAPI } from "../services/api";
import ReviewResults from "../components/ReviewResults";
import MultipleFileResults from "../components/MultipleFileResults";
import LoadingSpinner from "../components/Load_past";

const History = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAnalysisHistory();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnalysisHistory = async () => {
    try {
      setLoading(true);
      // Try to fetch from API, fall back to mock data if it fails
      let analyses = [];
      try {
        const response = await codeReviewAPI.getAnalysisHistory(user.id);
        analyses = response.analyses || [];
      } catch (apiError) {
        console.warn("API not available, using mock data:", apiError);
        // Fall back to mock data for development/demo purposes
        const mockAnalyses = [
          {
            id: "1",
            filename: "calculator.py",
            fileType: "single",
            createdAt: "2024-10-11T10:30:00Z",
            summary:
              "Python calculator with basic arithmetic operations. Good code structure but could benefit from better error handling.",
            qualityScore: 85,
            securityScore: 90,
            performanceScore: 78,
            issues: [
              { title: "Missing error handling", severity: "medium" },
              { title: "No input validation", severity: "low" },
            ],
            results: {
              summary:
                "Python calculator with basic arithmetic operations. Good code structure but could benefit from better error handling.",
              quality_score: 85,
              security_score: 90,
              performance_score: 78,
              issues: [
                {
                  title: "Missing error handling",
                  severity: "medium",
                  description:
                    "The calculator does not handle division by zero or invalid input types.",
                  line: 42,
                },
                {
                  title: "No input validation",
                  severity: "low",
                  description: "User input is not validated before processing.",
                },
              ],
              suggestions: [
                {
                  title: "Add input validation",
                  description:
                    "Implement proper input validation to handle edge cases and invalid inputs.",
                  priority: "medium",
                },
                {
                  title: "Implement error handling",
                  description:
                    "Add try-catch blocks for division by zero and type errors.",
                  priority: "high",
                },
              ],
            },
          },
          {
            id: "2",
            filename: "user-auth-system",
            fileType: "multiple",
            createdAt: "2024-10-10T15:45:00Z",
            summary:
              "Authentication system with JWT tokens. Well-structured but has potential security vulnerabilities.",
            qualityScore: 78,
            securityScore: 65,
            performanceScore: 82,
            issues: [
              { title: "Weak password validation", severity: "high" },
              { title: "SQL injection risk", severity: "critical" },
              { title: "Missing rate limiting", severity: "medium" },
            ],
            results: {
              summary:
                "Authentication system with JWT tokens. Well-structured but has potential security vulnerabilities.",
              quality_score: 78,
              security_score: 65,
              performance_score: 82,
              issues: [
                {
                  title: "Weak password validation",
                  severity: "high",
                  description:
                    "Password requirements are too weak, allowing easily guessable passwords.",
                },
                {
                  title: "SQL injection risk",
                  severity: "critical",
                  description:
                    "Direct SQL queries without parameterization detected in login function.",
                },
                {
                  title: "Missing rate limiting",
                  severity: "medium",
                  description:
                    "No rate limiting on login attempts, vulnerable to brute force attacks.",
                },
              ],
              suggestions: [
                {
                  title: "Strengthen password policy",
                  description:
                    "Implement stronger password requirements including special characters and minimum length.",
                  priority: "high",
                },
                {
                  title: "Use parameterized queries",
                  description:
                    "Replace direct SQL concatenation with parameterized queries to prevent SQL injection.",
                  priority: "critical",
                },
              ],
            },
          },
          {
            id: "3",
            filename: "data-processor.js",
            fileType: "single",
            createdAt: "2024-10-09T09:15:00Z",
            summary:
              "JavaScript data processing utility. Clean code with good performance but lacks documentation.",
            qualityScore: 92,
            securityScore: 88,
            performanceScore: 95,
            issues: [{ title: "Missing JSDoc comments", severity: "low" }],
            results: {
              summary:
                "JavaScript data processing utility. Clean code with good performance but lacks documentation.",
              quality_score: 92,
              security_score: 88,
              performance_score: 95,
              issues: [
                {
                  title: "Missing JSDoc comments",
                  severity: "low",
                  description: "Functions lack proper documentation comments.",
                },
              ],
              suggestions: [
                {
                  title: "Add comprehensive documentation",
                  description:
                    "Add JSDoc comments for all functions to improve code maintainability.",
                  priority: "low",
                },
              ],
            },
          },
        ];
        analyses = mockAnalyses;
      }

      setAnalyses(analyses);
      setLoading(false);
    } catch (err) {
      setError("Failed to load analysis history");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const handleDeleteAnalysis = async (analysisId, event) => {
    // Stop event propagation to prevent card click
    event.stopPropagation();

    // Get analysis details for better confirmation message
    const analysisToDelete = analyses.find((a) => a.id === analysisId);
    const confirmMessage = `Are you sure you want to delete the analysis for "${analysisToDelete?.filename}"?\n\nThis action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setDeletingId(analysisId);
    try {
      await codeReviewAPI.deleteAnalysis(analysisId, user.id);

      // Remove the analysis from the local state
      setAnalyses((prev) =>
        prev.filter((analysis) => analysis.id !== analysisId)
      );

      // Show success message
      toast.success("Analysis deleted successfully");
    } catch (err) {
      console.error("Failed to delete analysis:", err);
      toast.error("Failed to delete analysis. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading your analysis history..." />
      </div>
    );
  }

  if (selectedAnalysis) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <motion.button
          onClick={() => setSelectedAnalysis(null)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to History</span>
        </motion.button>

        {/* Analysis Header */}
        <motion.div
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedAnalysis.filename}
              </h1>
              <p className="text-gray-600">
                Analyzed on {formatDate(selectedAnalysis.createdAt)} •
                <span className="capitalize">
                  {" "}
                  {selectedAnalysis.fileType} file analysis
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    selectedAnalysis.qualityScore
                  )}`}
                >
                  {selectedAnalysis.qualityScore}
                </div>
                <div className="text-sm text-gray-600">Quality</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    selectedAnalysis.securityScore
                  )}`}
                >
                  {selectedAnalysis.securityScore}
                </div>
                <div className="text-sm text-gray-600">Security</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    selectedAnalysis.performanceScore
                  )}`}
                >
                  {selectedAnalysis.performanceScore}
                </div>
                <div className="text-sm text-gray-600">Performance</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full Analysis Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {selectedAnalysis.fileType === "multiple" ? (
            <MultipleFileResults results={selectedAnalysis.results} />
          ) : (
            <ReviewResults results={selectedAnalysis.results} />
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Analysis History
        </h1>
        <p className="text-lg text-gray-600">
          View and revisit your past code reviews and analysis results
        </p>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Statistics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analyses.length}
            </div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.round(
                analyses.reduce((acc, a) => acc + a.qualityScore, 0) /
                  analyses.length
              ) || 0}
            </div>
            <div className="text-sm text-gray-600">Avg Quality</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {analyses.filter((a) => a.fileType === "single").length}
            </div>
            <div className="text-sm text-gray-600">Single Files</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {analyses.filter((a) => a.fileType === "multiple").length}
            </div>
            <div className="text-sm text-gray-600">Multi-File Projects</div>
          </div>
        </div>
      </motion.div>

      {/* Analysis List */}
      {analyses.length === 0 ? (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Analysis History Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start reviewing your code to see your analysis history here
          </p>
          <motion.a
            href="/single-file"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Start Your First Review</span>
          </motion.a>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedAnalysis(analysis)}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {analysis.filename}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        analysis.fileType === "single"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {analysis.fileType === "single"
                        ? "Single File"
                        : "Multiple Files"}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {analysis.summary}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>{formatDate(analysis.createdAt)}</span>
                    <span className="flex items-center space-x-1">
                      <span>Issues:</span>
                      <span className="font-medium">
                        {analysis.issues.length}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 ml-6">
                  {/* Quality Scores */}
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div
                        className={`text-xl font-bold ${getScoreColor(
                          analysis.qualityScore
                        )}`}
                      >
                        {analysis.qualityScore}
                      </div>
                      <div className="text-xs text-gray-500">Quality</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-xl font-bold ${getScoreColor(
                          analysis.securityScore
                        )}`}
                      >
                        {analysis.securityScore}
                      </div>
                      <div className="text-xs text-gray-500">Security</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-xl font-bold ${getScoreColor(
                          analysis.performanceScore
                        )}`}
                      >
                        {analysis.performanceScore}
                      </div>
                      <div className="text-xs text-gray-500">Performance</div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteAnalysis(analysis.id, e)}
                    disabled={deletingId === analysis.id}
                    className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200 disabled:opacity-50"
                    title="Delete analysis"
                  >
                    {deletingId === analysis.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default History;
