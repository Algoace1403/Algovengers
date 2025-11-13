'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Tooltip from './Tooltip';

interface FloatingActionButtonProps {
  icon: ReactNode;
  onClick: () => void;
  tooltip: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export default function FloatingActionButton({
  icon,
  onClick,
  tooltip,
  variant = 'primary',
  position = 'bottom-right',
}: FloatingActionButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-purple-600',
    secondary: 'bg-gradient-to-r from-blue-500 to-blue-600',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    danger: 'bg-gradient-to-r from-red-500 to-red-600',
  };

  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
    'top-left': 'top-8 left-8',
  };

  return (
    <Tooltip text={tooltip} position={position.includes('bottom') ? 'top' : 'bottom'}>
      <motion.button
        onClick={onClick}
        className={`fixed ${positionClasses[position]} ${variantClasses[variant]} text-white p-4 rounded-full shadow-2xl z-50 hover-glow`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          {icon}
        </motion.div>
      </motion.button>
    </Tooltip>
  );
}
