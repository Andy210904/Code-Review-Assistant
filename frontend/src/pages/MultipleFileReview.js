import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { codeReviewAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import FileUpload from "../components/FileUpload";
import ReviewResults from "../components/ReviewResults";
import LoadingSpinner from "../components/LoadingSpinner";

const MultipleFileReview = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [reviewResults, setReviewResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFilesSelect = (selectedFiles) => {
    setFiles(selectedFiles);
    setReviewResults(null);
  };

  const handleReview = async () => {
    if (!files || files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setLoading(true);
    try {
      const result = await codeReviewAPI.reviewMultipleFiles(files);
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
              result.data?.quality_score || result.quality_score || 0,
            securityScore:
              result.data?.security_score || result.security_score || 0,
            performanceScore:
              result.data?.performance_score || result.performance_score || 0,
            issues: result.data?.issues || result.issues || [],
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Multiple Files Code Review
        </h1>
        <p className="text-lg text-gray-600">
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
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Selected Files ({files.length})
          </h2>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {file.name.endsWith(".py")
                      ? "🐍"
                      : file.name.endsWith(".js") || file.name.endsWith(".jsx")
                      ? "📜"
                      : file.name.endsWith(".java")
                      ? "☕"
                      : file.name.endsWith(".cpp") || file.name.endsWith(".c")
                      ? "⚙️"
                      : file.name.endsWith(".go")
                      ? "🔷"
                      : file.name.endsWith(".rs")
                      ? "🦀"
                      : file.name.endsWith(".php")
                      ? "🐘"
                      : file.name.endsWith(".rb")
                      ? "💎"
                      : file.name.endsWith(".swift")
                      ? "🍎"
                      : file.name.endsWith(".kt")
                      ? "🎯"
                      : "📄"}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 p-2"
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
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Start Review ({files.length} files)</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Reset
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
          <ReviewResults results={reviewResults} />
        </motion.div>
      )}
    </div>
  );
};

export default MultipleFileReview;
