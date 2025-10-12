import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

// API endpoints
export const codeReviewAPI = {
  // Health check
  healthCheck: async () => {
    const response = await api.get("/health");
    return response.data;
  },

  // Get API info
  getApiInfo: async () => {
    const response = await api.get("/");
    return response.data;
  },

  // Review single file
  reviewSingleFile: async (file, options = {}) => {
    console.log("API: Starting single file review", {
      file: file.name,
      options,
    });

    const formData = new FormData();
    formData.append("file", file);

    if (options.analysisDepth) {
      formData.append("analysis_depth", options.analysisDepth);
    }

    if (options.includeSuggestions !== undefined) {
      formData.append(
        "include_suggestions",
        options.includeSuggestions.toString()
      );
    }

    const response = await api.post("/api/v1/review/single-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("API: Received response from backend", response.data);
    return response.data;
  },

  // Review multiple files
  reviewMultipleFiles: async (files, options = {}) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    if (options.analysisDepth) {
      formData.append("analysis_depth", options.analysisDepth);
    }

    if (options.includeSuggestions !== undefined) {
      formData.append(
        "include_suggestions",
        options.includeSuggestions.toString()
      );
    }

    const response = await api.post("/api/v1/review/multiple-files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // NEW METHOD: Review multiple files with enhanced relationship analysis
  reviewMultipleFilesEnhanced: async (files, options = {}) => {
    console.log("API: Starting enhanced multiple files review", {
      fileCount: files.length,
      options,
    });

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    if (options.analysisDepth) {
      formData.append("analysis_depth", options.analysisDepth);
    }

    if (options.includeSuggestions !== undefined) {
      formData.append(
        "include_suggestions",
        options.includeSuggestions.toString()
      );
    }

    const response = await api.post(
      "/api/v1/review/multiple-files/enhanced",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("API: Enhanced multiple files review completed", response.data);
    return response.data;
  },

  // Get supported languages
  getSupportedLanguages: async () => {
    const response = await api.get("/api/v1/review/supported-languages");
    return response.data;
  },

  // Get analysis options
  getAnalysisOptions: async () => {
    const response = await api.get("/api/v1/review/analysis-options");
    return response.data;
  },

  // Analysis History methods
  saveAnalysis: async (analysisData, userId) => {
    const response = await api.post("/api/v1/history/save", {
      ...analysisData,
      user_id: userId,
    });
    return response.data;
  },

  getAnalysisHistory: async (userId) => {
    const response = await api.get(`/api/v1/history/user/${userId}`);
    return response.data;
  },

  getAnalysisById: async (analysisId, userId) => {
    const response = await api.get(`/api/v1/history/${analysisId}`, {
      params: { user_id: userId },
    });
    return response.data;
  },

  deleteAnalysis: async (analysisId, userId) => {
    const response = await api.delete(`/api/v1/history/${analysisId}`, {
      params: { user_id: userId },
    });
    return response.data;
  },
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const errorMessage =
        error.response.data?.detail ||
        error.response.data?.message ||
        "Server error occurred";
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request made but no response
      throw new Error(
        "No response from server. Please check if the API is running."
      );
    } else {
      // Other error
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
);

export default api;
