import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PasswordReset from "./components/PasswordReset";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import SingleFileReview from "./pages/SingleFileReview";
import MultipleFileReview from "./pages/MultipleFileReview";
import History from "./pages/History";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900 flex flex-col">
          {/* Background pattern */}
          <div className="fixed inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"></div>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            ></div>
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                color: "#f1f5f9",
                border: "1px solid #475569",
                borderRadius: "12px",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#1e293b",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#1e293b",
                },
              },
            }}
          />

          <Header />

          <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
            <Routes>
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<PasswordReset />} />

              {/* Protected Main App Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/single-file"
                element={
                  <PrivateRoute>
                    <SingleFileReview />
                  </PrivateRoute>
                }
              />
              <Route
                path="/multiple-files"
                element={
                  <PrivateRoute>
                    <MultipleFileReview />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <History />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>

          <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 mt-auto relative z-10">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-emerald-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  <span className="font-mono font-bold text-slate-200">
                    Code&lt;Review/&gt;
                  </span>
                </div>

                <p className="text-slate-400 mb-3 font-mono text-sm">
                  Advanced Static Analysis • AI-Powered Insights
                </p>

                <div className="flex items-center justify-center space-x-6 text-xs text-slate-500 font-mono">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                    React + FastAPI
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Google Gemini
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Supabase
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-500 font-mono">
                    © 2025 • Built for developers, by developers
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
