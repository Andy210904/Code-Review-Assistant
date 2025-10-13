import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  // Developer-focused features with technical icons
  const features = [
    {
      title: "Single File Review",
      description:
        "Deep analysis of individual source files with detailed metrics and suggestions",
      icon: (
        <svg
          className="w-8 h-8"
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
      path: "/single-file",
      gradient: "from-slate-800 via-slate-700 to-slate-900",
      accent: "from-emerald-400 to-emerald-500",
      disabled: false,
    },
    {
      title: "Multiple Files Review",
      description:
        "Cross-file analysis with dependency mapping and architecture insights",
      icon: (
        <svg
          className="w-8 h-8"
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
      path: "/multiple-files",
      gradient: "from-slate-800 via-indigo-900 to-slate-900",
      accent: "from-blue-400 to-cyan-400",
      disabled: false,
    },
  ];

  // Technical metrics with code-themed icons
  const stats = [
    {
      label: "Supported Languages",
      value: "25+",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      accent: "text-emerald-400",
    },
    {
      label: "Analysis Depth",
      value: "AST+",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      ),
      accent: "text-blue-400",
    },
    {
      label: "AI Engine",
      value: "Gemini",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      accent: "text-purple-400",
    },
    {
      label: "Avg. Latency",
      value: "<2s",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      accent: "text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="space-y-16 pb-20">
        {/* Hero Section */}
        <motion.div
          className="text-center pt-16 px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 blur-3xl opacity-20 rounded-full"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <svg
                  className="w-16 h-16 text-emerald-400 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-mono font-bold mb-8 tracking-tight">
            <span className="text-slate-100">Code</span>
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block mt-2">
              &lt;Review/&gt;
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Advanced static analysis engine with AI-powered insights.
            <br className="hidden md:block" />
            Parse, analyze, and optimize your codebase with enterprise-grade
            precision.
          </p>

          <div className="flex justify-center">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 font-mono text-sm text-slate-400">
              <span className="text-emerald-400">$</span> npx
              @codeassist/analyzer --scan ./src
            </div>
          </div>
        </motion.div>

        {/* Metrics Divider */}
        <div className="px-6">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1"></div>
            <span className="text-slate-400 font-mono text-sm px-4">
              {"// system.metrics"}
            </span>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1"></div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 transition-all duration-300 hover:border-slate-600/50 hover:shadow-lg hover:shadow-slate-900/25"
              whileHover={{
                scale: 1.02,
                rotateX: 5,
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center">
                <div
                  className={`${stat.accent} mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-mono font-bold text-slate-100 mb-2 group-hover:text-white transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>

              {/* Subtle grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                  backgroundSize: "16px 16px",
                }}
              ></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Analysis Tools Divider */}
        <div className="px-6">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1"></div>
            <span className="text-slate-400 font-mono text-sm px-4">
              {"// analysis.tools"}
            </span>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1"></div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                feature.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-2xl hover:shadow-slate-900/50"
              }`}
              whileHover={{
                scale: feature.disabled ? 1 : 1.02,
                rotateY: feature.disabled ? 0 : 3,
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glassmorphism background */}
              <div
                className={`bg-gradient-to-br ${feature.gradient} p-8 text-white relative`}
              >
                {/* Frosted glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"></div>

                {/* Circuit pattern background */}
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
                  }}
                ></div>

                <div className="relative z-10">
                  {/* Icon with glow effect */}
                  <div
                    className={`text-white mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.accent} shadow-lg`}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 font-mono tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-slate-200 mb-8 leading-relaxed font-light">
                    {feature.description}
                  </p>

                  <Link
                    to={feature.path}
                    className={`inline-flex items-center space-x-2 bg-gradient-to-r ${feature.accent} text-slate-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105 hover:shadow-emerald-500/25`}
                  >
                    <span>Initialize</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Language Support Section */}
        <motion.div
          className="mx-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/60 transition-all duration-300"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center mb-8">
            <svg
              className="w-6 h-6 text-emerald-400 mr-3"
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
            <h2 className="text-2xl md:text-3xl font-mono font-bold text-slate-100">
              Language Matrix
            </h2>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {[
              "Python",
              "JavaScript",
              "Java",
              "C++",
              "C#",
              "Go",
              "Rust",
              "TypeScript",
              "PHP",
              "Ruby",
              "Swift",
              "Kotlin",
              "Scala",
              "C",
              "Dart",
              "R",
              "Julia",
              "Perl",
              "Haskell",
              "Lua",
              "Shell",
              "SQL",
              "HTML",
              "CSS",
            ].map((language, index) => (
              <motion.div
                key={language}
                className="group bg-slate-700/30 hover:bg-slate-600/50 border border-slate-600/30 hover:border-slate-500/50 rounded-lg p-3 text-center transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/25"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.02, duration: 0.5 }}
              >
                <div className="text-sm font-mono font-medium text-slate-300 group-hover:text-white transition-colors duration-300">
                  {language}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process Flow Section */}
        <motion.div
          className="text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center mb-12">
            <svg
              className="w-6 h-6 text-blue-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-slate-100">
              Process.Flow
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Source Ingestion",
                description:
                  "Upload source files with automatic language detection and syntax validation",
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                ),
                color: "from-emerald-400 to-teal-400",
              },
              {
                step: "02",
                title: "AST Analysis",
                description:
                  "Deep parsing with abstract syntax trees, dependency graphs, and complexity metrics",
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                ),
                color: "from-blue-400 to-cyan-400",
              },
              {
                step: "03",
                title: "Report Generation",
                description:
                  "Comprehensive insights with actionable recommendations and exportable reports",
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                ),
                color: "from-purple-400 to-pink-400",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.2, duration: 0.6 }}
              >
                <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-slate-900/25">
                  {/* Step indicator */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-slate-900 text-lg font-mono font-bold mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="text-slate-300 mb-4 flex justify-center group-hover:text-white group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-mono font-semibold text-slate-100 mb-4 group-hover:text-white transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-light group-hover:text-slate-300 transition-colors duration-300">
                    {item.description}
                  </p>

                  {/* Connection line to next step */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-slate-600 to-transparent transform -translate-y-1/2"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
