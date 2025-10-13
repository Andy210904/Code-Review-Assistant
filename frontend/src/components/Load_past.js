import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = ({
  message = "Loading analysis archive...",
  size = "default",
}) => {
  const isSmall = size === "small";

  if (isSmall) {
    return (
      <motion.div
        className="inline-flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Terminal-style loading animation */}
      <div className="relative mb-8">
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg flex items-center justify-center border border-slate-600 shadow-xl"
          animate={{
            boxShadow: [
              "0 0 20px rgba(16, 185, 129, 0.1)",
              "0 0 30px rgba(16, 185, 129, 0.3)",
              "0 0 20px rgba(16, 185, 129, 0.1)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Code icon with animation */}
          <motion.svg
            className="w-8 h-8 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </motion.svg>
        </motion.div>

        {/* Circuit-like connecting lines */}
        <motion.div
          className="absolute -inset-4 opacity-30"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full border border-emerald-400/30 rounded-xl"></div>
        </motion.div>

        <motion.div
          className="absolute -inset-6 opacity-20"
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <div className="w-full h-full border border-emerald-400/20 rounded-xl"></div>
        </motion.div>
      </div>

      {/* Loading text */}
      <motion.h3
        className="text-xl font-mono font-semibold text-slate-200 mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.h3>

      {/* Terminal-style progress indicators */}
      <div className="flex space-x-1 mb-6">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          />
        ))}
      </div>

      {/* System status messages */}
      <div className="text-center max-w-sm space-y-3">
        <motion.div
          className="font-mono text-sm text-slate-400 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="flex items-center justify-center space-x-2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-emerald-400">{">"}</span>
            <span>Accessing database...</span>
          </motion.div>

          <motion.div
            className="flex items-center justify-center space-x-2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            <span className="text-emerald-400">{">"}</span>
            <span>Retrieving analysis logs...</span>
          </motion.div>

          <motion.div
            className="flex items-center justify-center space-x-2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
          >
            <span className="text-emerald-400">{">"}</span>
            <span>Compiling results...</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Progress bar */}
      <motion.div
        className="w-80 h-1 bg-slate-700 rounded-full overflow-hidden mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;
