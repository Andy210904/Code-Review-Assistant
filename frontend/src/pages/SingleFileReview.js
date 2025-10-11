import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { codeReviewAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import FileUpload from "../components/FileUpload";
import ReviewResults from "../components/ReviewResults";
import LoadingSpinner from "../components/LoadingSpinner";

const SingleFileReview = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [reviewResults, setReviewResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setReviewResults(null);
  };

  const handleReview = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    console.log("SingleFileReview: Starting review for file:", file.name);
    setLoading(true);
    try {
      const result = await codeReviewAPI.reviewSingleFile(file);
      console.log("SingleFileReview: API result received:", result);
      setReviewResults(result);

      // Save analysis to history (only if user is authenticated)
      if (user && result) {
        try {
          const analysisData = {
            filename: file.name,
            fileType: "single",
            summary:
              result.data?.summary ||
              result.summary ||
              "Code analysis completed",
            results: result,
            qualityScore:
              result.data?.quality_score || result.quality_score || 0,
            securityScore:
              result.data?.security_score || result.security_score || 0,
            performanceScore:
              result.data?.performance_score || result.performance_score || 0,
            issues: result.data?.issues || result.issues || [],
            createdAt: new Date().toISOString(),
          };

          await codeReviewAPI.saveAnalysis(analysisData, user.id);
          console.log("Analysis saved to history successfully");
        } catch (saveError) {
          console.warn("Failed to save analysis to history:", saveError);
          // Don't show error to user as this is not critical for the main flow
        }
      }

      console.log(
        "SingleFileReview: Review results set, component should re-render"
      );
      toast.success("Code review completed successfully!");
    } catch (error) {
      console.error("Review error:", error);
      toast.error(error.message || "Failed to review code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setReviewResults(null);
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
          Single File Code Review
        </h1>
        <p className="text-lg text-gray-600">
          Upload a single code file for detailed AI-powered analysis and
          feedback
        </p>
      </motion.div>

      {/* File Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FileUpload
          onFileSelect={handleFileSelect}
          selectedFile={file}
          multiple={false}
        />
      </motion.div>

      {/* Action Buttons */}
      {file && (
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
                <span>Start Review</span>
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
          <LoadingSpinner message="Analyzing your code with AI..." />
        </motion.div>
      )}

      {/* Results */}
      {reviewResults && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ReviewResults results={reviewResults} />
        </motion.div>
      )}
    </div>
  );
};

export default SingleFileReview;
