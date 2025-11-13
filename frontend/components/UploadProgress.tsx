'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Upload, Sparkles } from 'lucide-react';

interface UploadProgressProps {
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

export default function UploadProgress({ fileName, progress, status }: UploadProgressProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return 'from-blue-500 to-purple-600';
      case 'processing':
        return 'from-orange-500 to-pink-600';
      case 'complete':
        return 'from-green-500 to-emerald-600';
      case 'error':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Upload className="w-5 h-5" />
          </motion.div>
        );
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        );
      case 'complete':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <CheckCircle className="w-5 h-5" />
          </motion.div>
        );
      default:
        return <Upload className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'AI Processing...';
      case 'complete':
        return 'Complete!';
      case 'error':
        return 'Error';
      default:
        return 'Pending';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="card mb-4 overflow-hidden"
    >
      <div className="flex items-center gap-4 mb-3">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${getStatusColor()} text-white`}>
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
            {fileName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{getStatusText()}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            {progress}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getStatusColor()} rounded-full progress-shine`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Animated shine effect */}
        {status === 'uploading' || status === 'processing' ? (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        ) : null}
      </div>

      {/* Sub-progress indicators for different stages */}
      {(status === 'processing' || status === 'complete') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 space-y-2"
        >
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span className="text-gray-600 dark:text-gray-400">Upload complete</span>
          </div>
          {(status === 'processing' || status === 'complete') && (
            <div className="flex items-center gap-2 text-xs">
              {status === 'complete' ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-3 h-3"
                >
                  <Sparkles className="w-3 h-3 text-orange-500" />
                </motion.div>
              )}
              <span className="text-gray-600 dark:text-gray-400">
                {status === 'complete' ? 'AI categorization complete' : 'AI categorizing...'}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
