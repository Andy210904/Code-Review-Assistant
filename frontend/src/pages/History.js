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
        <LoadingSpinner message="Loading analysis archive..." />
      </div>
    );
  }

  if (selectedAnalysis) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <motion.button
          onClick={() => setSelectedAnalysis(null)}
          className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-mono font-medium"
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
          <span>← back_to_archive</span>
        </motion.button>

        {/* Analysis Header */}
        <motion.div
          className="bg-slate-800 rounded-xl shadow-2xl border border-slate-600 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100 mb-2 font-mono">
                {selectedAnalysis.filename}
              </h1>
              <p className="text-slate-400 font-mono text-sm">
                scan_timestamp: {formatDate(selectedAnalysis.createdAt)} •
                <span className="capitalize">
                  {" "}
                  mode_{selectedAnalysis.fileType}_analysis
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 font-mono">
                  {selectedAnalysis.qualityScore}
                </div>
                <div className="text-sm text-emerald-300/70 font-mono uppercase tracking-wider">
                  Quality
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 font-mono">
                  {selectedAnalysis.securityScore}
                </div>
                <div className="text-sm text-blue-300/70 font-mono uppercase tracking-wider">
                  Security
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400 font-mono">
                  {selectedAnalysis.performanceScore}
                </div>
                <div className="text-sm text-amber-300/70 font-mono uppercase tracking-wider">
                  Performance
                </div>
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
        <div className="flex items-center justify-center space-x-3 mb-4">
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
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 font-mono">
            Analysis Archive
          </h1>
        </div>
        <p className="text-lg text-slate-300 font-mono">
          $ query --history --format=detailed
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
        <div className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-600">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2 font-mono">
              {analyses.length}
            </div>
            <div className="text-sm text-slate-400 font-mono uppercase tracking-wider">
              Total Reviews
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-600">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2 font-mono">
              {Math.round(
                analyses.reduce((acc, a) => acc + a.qualityScore, 0) /
                  analyses.length
              ) || 0}
            </div>
            <div className="text-sm text-slate-400 font-mono uppercase tracking-wider">
              Avg Quality
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-600">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2 font-mono">
              {analyses.filter((a) => a.fileType === "single").length}
            </div>
            <div className="text-sm text-slate-400 font-mono uppercase tracking-wider">
              Single Files
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-600">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2 font-mono">
              {analyses.filter((a) => a.fileType === "multiple").length}
            </div>
            <div className="text-sm text-slate-400 font-mono uppercase tracking-wider">
              Multi-File Projects
            </div>
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
          <svg
            className="w-16 h-16 text-slate-400 mx-auto mb-4"
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
          <h3 className="text-xl font-semibold text-slate-100 mb-2 font-mono">
            ARCHIVE_EMPTY
          </h3>
          <p className="text-slate-400 mb-6 font-mono text-sm">
            $ no_previous_analyses_found
          </p>
          <motion.a
            href="/single-file"
            className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-mono font-medium transition-colors duration-200 border border-slate-600 hover:border-emerald-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>initialize_first_scan</span>
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
              className="bg-slate-800 rounded-xl shadow-2xl border border-slate-600 p-6 hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedAnalysis(analysis)}
              whileHover={{ y: -2 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-slate-100 font-mono truncate">
                      {analysis.filename}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-medium border flex-shrink-0 ${
                        analysis.fileType === "single"
                          ? "bg-blue-900/50 text-blue-300 border-blue-500/50"
                          : "bg-purple-900/50 text-purple-300 border-purple-500/50"
                      }`}
                    >
                      {analysis.fileType === "single"
                        ? "Single File"
                        : "Multiple Files"}
                    </span>
                  </div>

                  <div className="text-slate-300 mb-3 font-mono text-sm bg-slate-900/50 p-3 rounded border border-slate-700 leading-relaxed">
                    <div className="line-clamp-3 break-words">
                      {analysis.summary}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-mono">
                    <span className="truncate">
                      {formatDate(analysis.createdAt)}
                    </span>
                    <span className="flex items-center space-x-1 flex-shrink-0">
                      <span>issues_found:</span>
                      <span className="font-medium text-red-400">
                        {analysis.issues.length}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Quality Scores */}
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold font-mono text-emerald-400">
                        {analysis.qualityScore}
                      </div>
                      <div className="text-xs text-emerald-300/70 font-mono uppercase tracking-wider">
                        Quality
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold font-mono text-blue-400">
                        {analysis.securityScore}
                      </div>
                      <div className="text-xs text-blue-300/70 font-mono uppercase tracking-wider">
                        Security
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold font-mono text-amber-400">
                        {analysis.performanceScore}
                      </div>
                      <div className="text-xs text-amber-300/70 font-mono uppercase tracking-wider">
                        Performance
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <svg
                    className="w-5 h-5 text-slate-400 hidden lg:block"
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
                    className="flex items-center justify-center w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg border border-transparent hover:border-red-500/50 transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
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
