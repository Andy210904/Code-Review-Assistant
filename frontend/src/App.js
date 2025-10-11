import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import SingleFileReview from "./pages/SingleFileReview";
import MultipleFileReview from "./pages/MultipleFileReview";
import ApiStatus from "./components/ApiStatus";
import { codeReviewAPI } from "./services/api";

function App() {
  const [apiStatus, setApiStatus] = useState({
    isConnected: false,
    loading: true,
  });

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      await codeReviewAPI.healthCheck();
      setApiStatus({ isConnected: true, loading: false });
    } catch (error) {
      setApiStatus({
        isConnected: false,
        loading: false,
        error: error.message,
      });
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />

        <Header />

        <main className="container mx-auto px-4 py-8">
          <ApiStatus status={apiStatus} onRetry={checkApiStatus} />

          <Routes>
            <Route path="/" element={<Dashboard apiStatus={apiStatus} />} />
            <Route path="/single-file" element={<SingleFileReview />} />
            <Route path="/multiple-files" element={<MultipleFileReview />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                Code Review Assistant - AI-Powered Code Analysis
              </p>
              <p className="text-sm">
                Built with ❤️ using React & FastAPI | Powered by Google Gemini
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
