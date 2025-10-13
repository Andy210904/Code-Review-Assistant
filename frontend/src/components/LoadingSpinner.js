import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = ({ message = "Analyzing...", size = "default" }) => {
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
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Animated Code Analysis Icon */}
      <div className="relative mb-8">
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-2xl flex items-center justify-center shadow-2xl"
          animate={{
            scale: [1, 1.05, 1],
            rotateY: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            className="w-10 h-10 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              animate={{
                pathLength: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>

        {/* Circuit-like rings */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-emerald-400/30"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-2xl border border-blue-400/20"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />

        {/* Floating code symbols */}
        <motion.div
          className="absolute -top-4 -right-4 text-emerald-400 font-mono text-lg"
          animate={{
            y: [-2, 2, -2],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {"{}"}
        </motion.div>
        <motion.div
          className="absolute -bottom-4 -left-4 text-blue-400 font-mono text-lg"
          animate={{
            y: [2, -2, 2],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          {"</>"}
        </motion.div>
      </div>

      {/* Loading text with terminal effect */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-mono font-bold text-slate-100 mb-2">
          {message}
        </h3>
        <div className="flex items-center justify-center font-mono text-sm text-slate-400">
          <span className="mr-2">$</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            analyzing_source_code...
          </motion.span>
        </div>
      </motion.div>

      {/* Progress indicator grid */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-slate-700 rounded-sm"
            animate={{
              backgroundColor: ["#334155", "#10b981", "#334155"],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3,
            }}
          />
        ))}
      </div>

      {/* Technical status messages */}
      <div className="text-center max-w-md">
        <motion.div
          className="flex items-center justify-center space-x-2 text-slate-300 text-sm font-mono mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>Running static code analysis...</span>
        </motion.div>

        <motion.div
          className="space-y-2 text-xs text-slate-400 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="flex items-center space-x-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-1 h-1 bg-blue-400 rounded-full" />
            <span>Parsing syntax and structure</span>
          </motion.div>
          <motion.div
            className="flex items-center space-x-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <div className="w-1 h-1 bg-yellow-400 rounded-full" />
            <span>Identifying patterns and issues</span>
          </motion.div>
          <motion.div
            className="flex items-center space-x-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <div className="w-1 h-1 bg-emerald-400 rounded-full" />
            <span>Generating recommendations</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Technical progress bar */}
      <motion.div
        className="w-80 h-1 bg-slate-800 rounded-full overflow-hidden mt-6 border border-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 rounded-full"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;
