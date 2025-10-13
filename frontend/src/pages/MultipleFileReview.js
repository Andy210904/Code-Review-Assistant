import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { codeReviewAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import FileUpload from "../components/FileUpload";
import MultipleFileResults from "../components/MultipleFileResults";
import LoadingSpinner from "../components/LoadingSpinner";

const MultipleFileReview = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [reviewResults, setReviewResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFilesSelect = (selectedFiles) => {
    const maxFiles = 3;
    if (selectedFiles && selectedFiles.length > maxFiles) {
      toast.error(
        `Maximum ${maxFiles} files allowed for analysis to ensure optimal LLM performance.`
      );
      setFiles(selectedFiles.slice(0, maxFiles));
    } else {
      setFiles(selectedFiles);
    }
    setReviewResults(null);
  };

  const handleReview = async () => {
    if (!files || files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    const maxFiles = 3;
    if (files.length > maxFiles) {
      toast.error(
        `Maximum ${maxFiles} files allowed for analysis. Please remove some files.`
      );
      return;
    }

    setLoading(true);
    try {
      // Use enhanced multiple file analysis with relationship detection
      const result = await codeReviewAPI.reviewMultipleFilesEnhanced(files);
      setReviewResults(result);

      // Save analysis to history (only if user is authenticated)
      if (user && result) {
        try {
          const analysisData = {
            filename:
              files.length > 1
                ? `${files[0].name} + ${files.length - 1} more`
                : files[0].name,
            fileType: "multiple",
            summary:
              result.data?.summary ||
              result.summary ||
              "Multi-file code analysis completed",
            results: result,
            qualityScore:
              result.enhanced_project_summary?.average_score ||
              result.data?.quality_score ||
              result.quality_score ||
              0,
            securityScore:
              result.enhanced_project_summary?.security_score ||
              result.data?.security_score ||
              result.security_score ||
              0,
            performanceScore:
              result.enhanced_project_summary?.performance_score ||
              result.data?.performance_score ||
              result.performance_score ||
              0,
            issues: result.file_reviews
              ? result.file_reviews.flatMap(
                  (fileReview) => fileReview.review?.issues || []
                )
              : result.data?.issues || result.issues || [],
            createdAt: new Date().toISOString(),
            fileCount: files.length,
            fileNames: files.map((f) => f.name),
          };

          await codeReviewAPI.saveAnalysis(analysisData, user.id);
          console.log("Multi-file analysis saved to history successfully");
        } catch (saveError) {
          console.warn("Failed to save analysis to history:", saveError);
          // Don't show error to user as this is not critical for the main flow
        }
      }

      toast.success("Code review completed successfully!");
    } catch (error) {
      console.error("Review error:", error);
      toast.error(error.message || "Failed to review code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setReviewResults(null);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 font-mono">
            Multiple Files Code Review
          </h1>
        </div>
        <p className="text-lg text-slate-300 font-mono">
          $ upload --multiple --target=project_analyzer
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Upload multiple code files for comprehensive project analysis and
          cross-file insights
        </p>
      </motion.div>

      {/* File Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FileUpload
          onFileSelect={handleFilesSelect}
          selectedFile={files}
          multiple={true}
        />
      </motion.div>

      {/* Selected Files List */}
      {files && files.length > 0 && (
        <motion.div
          className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-4 font-mono">
            $ files_queued --count={files.length}
          </h2>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-emerald-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {file.name.endsWith(".py") ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      ) : file.name.endsWith(".js") ||
                        file.name.endsWith(".jsx") ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      )}
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-slate-100 font-mono">
                      {file.name}
                    </div>
                    <div className="text-sm text-slate-400 font-mono">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded border border-transparent hover:border-red-500/50 transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      {files && files.length > 0 && (
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleReview}
            disabled={loading}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-3 rounded-lg font-mono font-medium hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 border border-emerald-500/50 shadow-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>$ analyzing...</span>
              </>
            ) : (
              <>
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>$ execute_batch_analysis --files={files.length}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="bg-slate-700 text-slate-200 px-8 py-3 rounded-lg font-mono font-medium hover:bg-slate-600 transition-colors duration-200 border border-slate-600"
          >
            $ reset
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <LoadingSpinner message="Analyzing your files with AI..." />
        </motion.div>
      )}

      {/* Results */}
      {reviewResults && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MultipleFileResults results={reviewResults} />
        </motion.div>
      )}
    </div>
  );
};

export default MultipleFileReview;
