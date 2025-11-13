'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-500',
      textColor: 'text-green-800 dark:text-green-200',
    },
    error: {
      icon: AlertCircle,
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-500',
      textColor: 'text-red-800 dark:text-red-200',
    },
    info: {
      icon: Info,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800 dark:text-blue-200',
    },
    warning: {
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-800 dark:text-orange-200',
    },
  };

  const { icon: Icon, gradient, bgColor, borderColor, textColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`${bgColor} ${textColor} px-6 py-4 rounded-xl shadow-2xl border-l-4 ${borderColor} max-w-md flex items-center gap-4 backdrop-blur-sm`}
    >
      <motion.div
        className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <Icon size={24} className="text-white" />
      </motion.div>

      <p className="flex-1 font-medium">{message}</p>

      <motion.button
        onClick={onClose}
        className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={20} />
      </motion.button>

      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-xl overflow-hidden"
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${gradient}`}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

// Toast container component
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
