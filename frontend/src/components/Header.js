import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14l-4-2-4 2V5z"
          />
        </svg>
      ),
    },
    {
      name: "Single File",
      href: "/single-file",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "Multiple Files",
      href: "/multiple-files",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      name: "Past Analysis",
      href: "/history",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
      setIsProfileOpen(false);
    }
  };

  // Show different header for authentication pages
  const isAuthPage = ["/login", "/signup", "/reset-password"].includes(
    location.pathname
  );

  if (isAuthPage) {
    return (
      <motion.header
        className="bg-slate-900 border-b border-slate-700/50 backdrop-blur-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-400"
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
                </div>
              </div>
              <span className="text-xl font-mono font-bold text-slate-100 group-hover:text-white transition-colors duration-300">
                Code&lt;Review/&gt;
              </span>
            </Link>
          </div>
        </div>
      </motion.header>
    );
  }

  return (
    <motion.header
      className="bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-80"></div>
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl flex items-center justify-center group-hover:border-slate-600 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300"
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
              </div>
            </div>
            <span className="text-xl font-mono font-bold text-slate-100 group-hover:text-white transition-colors duration-300">
              Code&lt;Review/&gt;
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-slate-800/80 text-emerald-400 shadow-lg shadow-slate-900/25"
                        : "text-slate-100 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-lg border border-emerald-400/20"></div>
                    )}

                    <span
                      className={`relative transition-colors duration-300 ${
                        isActive
                          ? "text-emerald-400"
                          : "text-slate-100 group-hover:text-white"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="relative font-mono">{item.name}</span>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-blue-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="group flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-full flex items-center justify-center group-hover:border-slate-500 transition-colors duration-300">
                      <span className="text-emerald-400 text-sm font-mono font-bold">
                        {user.email?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-300">
                      {user.user_metadata?.fullName?.split(" ")[0] || "User"}
                    </div>
                  </div>

                  <svg
                    className={`w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-all duration-300 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-72 bg-slate-800/95 backdrop-blur-lg rounded-xl border border-slate-700/50 shadow-2xl shadow-slate-900/50 z-50"
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-4 border-b border-slate-700/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-full flex items-center justify-center">
                            <span className="text-emerald-400 font-mono font-bold">
                              {user.email?.[0]?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-100 font-mono">
                              {user.user_metadata?.fullName || "Developer"}
                            </p>
                            <p className="text-xs text-slate-400 truncate font-mono">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/history"
                          className="group flex items-center px-4 py-3 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 transition-all duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg
                            className="mr-3 h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          <span className="font-mono">Analysis History</span>
                        </Link>

                        <div className="mx-4 my-2 h-px bg-slate-700/50"></div>

                        <button
                          onClick={handleSignOut}
                          disabled={isSigningOut}
                          className="group flex items-center w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
                        >
                          <svg
                            className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-mono">
                            {isSigningOut ? "Terminating..." : "Sign out"}
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4 border-t border-slate-700/50">
          <div className="flex flex-col space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-800/80 text-emerald-400"
                      : "text-slate-100 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-lg border border-emerald-400/20"></div>
                  )}

                  <span
                    className={`relative ${
                      isActive
                        ? "text-emerald-400"
                        : "group-hover:text-slate-100"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="relative font-mono">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
