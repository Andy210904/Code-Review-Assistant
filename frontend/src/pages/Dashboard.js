import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const features = [
    {
      title: "Single File Review",
      description:
        "Upload and analyze a single code file for detailed feedback",
      icon: "📄",
      path: "/single-file",
      color: "from-blue-500 to-blue-600",
      disabled: false,
    },
    {
      title: "Multiple Files Review",
      description:
        "Analyze multiple files at once for comprehensive project review",
      icon: "📁",
      path: "/multiple-files",
      color: "from-purple-500 to-purple-600",
      disabled: false,
    },
  ];

  const stats = [
    { label: "Supported Languages", value: "25+", icon: "🔧" },
    { label: "Analysis Types", value: "5", icon: "🔍" },
    { label: "AI Models", value: "Gemini", icon: "🤖" },
    { label: "Response Time", value: "<30s", icon: "⚡" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          AI-Powered
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
            Code Review
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Get intelligent code analysis, suggestions for improvements, and
          detailed feedback powered by advanced AI models. Support for 25+
          programming languages.
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="grid md:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`relative overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 ${
              feature.disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105"
            }`}
          >
            <div
              className={`bg-gradient-to-br ${feature.color} p-8 text-white`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-blue-100 mb-6">{feature.description}</p>

              <Link
                to={feature.path}
                className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started →
              </Link>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Supported Languages Section */}
      <motion.div
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Supported Programming Languages
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
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
          ].map((language) => (
            <div
              key={language}
              className="bg-gray-50 rounded-lg p-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {language}
            </div>
          ))}
        </div>
      </motion.div>

      {/* How it Works Section */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Upload Your Code",
              description:
                "Upload single or multiple files in any supported programming language",
              icon: "📤",
            },
            {
              step: "2",
              title: "AI Analysis",
              description:
                "Our AI analyzes your code for quality, bugs, security, and best practices",
              icon: "🧠",
            },
            {
              step: "3",
              title: "Get Feedback",
              description:
                "Receive detailed reports with suggestions and improvement recommendations",
              icon: "📋",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                {item.step}
              </div>
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
