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
        <div className="min-h-screen bg-gray-50 flex flex-col">
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

          <main className="flex-1 container mx-auto px-4 py-8">
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

          <footer className="bg-white border-t border-gray-200 mt-auto">
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
    </AuthProvider>
  );
}

export default App;
