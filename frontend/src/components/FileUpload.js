import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";

const FileUpload = ({ onFileSelect, selectedFile, multiple = false }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (multiple) {
        const maxFiles = 3;
        if (acceptedFiles.length > maxFiles) {
          // Show error for exceeding file limit
          import("react-hot-toast").then((toast) => {
            toast.default.error(
              `Maximum ${maxFiles} files allowed. Only the first ${maxFiles} files will be selected.`
            );
          });
          onFileSelect(acceptedFiles.slice(0, maxFiles));
        } else {
          onFileSelect(acceptedFiles);
        }
      } else {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: {
      "text/plain": [
        ".py",
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".java",
        ".cpp",
        ".c",
        ".h",
        ".hpp",
        ".cs",
        ".go",
        ".rs",
        ".php",
        ".rb",
        ".swift",
        ".kt",
        ".scala",
        ".r",
        ".m",
        ".pl",
        ".lua",
        ".sh",
        ".sql",
        ".html",
        ".css",
        ".dart",
        ".jl",
      ],
    },
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const iconMap = {
      py: "🐍",
      js: "📜",
      jsx: "⚛️",
      ts: "🟦",
      tsx: "🟦",
      java: "☕",
      cpp: "⚙️",
      c: "⚙️",
      cs: "🔷",
      go: "🔷",
      rs: "🦀",
      php: "🐘",
      rb: "💎",
      swift: "🍎",
      kt: "🎯",
      scala: "🎭",
      r: "📊",
      dart: "🎯",
      lua: "🌙",
      sh: "🐚",
      sql: "🗄️",
      html: "🌐",
      css: "🎨",
    };
    return iconMap[extension] || "📄";
  };

  const renderSelectedFiles = () => {
    if (multiple && Array.isArray(selectedFile) && selectedFile.length > 0) {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Selected Files ({selectedFile.length})
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFile.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-2xl">{getFileIcon(file.name)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (!multiple && selectedFile) {
      return (
        <div className="mt-6">
          <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-3xl">{getFileIcon(selectedFile.name)}</span>
            <div className="flex-1">
              <p className="text-lg font-medium text-green-900">
                {selectedFile.name}
              </p>
              <p className="text-sm text-green-700">
                {formatFileSize(selectedFile.size)} • Ready for review
              </p>
            </div>
            <div className="text-green-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      <motion.div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : selectedFile
            ? "border-green-300 bg-green-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 text-4xl flex items-center justify-center">
            {isDragActive ? "🎯" : selectedFile ? "✅" : "📁"}
          </div>

          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-blue-700">
                Drop the files here!
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-900">
                {multiple
                  ? "Drop files here or click to browse"
                  : "Drop a file here or click to browse"}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Supports: Python, JavaScript, Java, C++, Go, Rust, PHP, Ruby,
                Swift, Kotlin and more
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Max file size: 10MB{" "}
                {multiple ? "• Maximum 3 files allowed" : "• Single file only"}
              </p>
            </div>
          )}
        </div>

        {/* Upload Animation */}
        {isDragActive && (
          <motion.div
            className="absolute inset-0 border-2 border-blue-400 rounded-xl"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      {renderSelectedFiles()}
    </div>
  );
};

export default FileUpload;
