'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export default function AnimatedStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  delay = 0,
}: AnimatedStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={`relative overflow-hidden card-glass cursor-pointer group`}
    >
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
      />

      {/* Floating particles effect on hover */}
      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '0%',
            }}
            animate={{
              y: [-0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <motion.p
              className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: delay + 0.2,
                type: 'spring',
                stiffness: 200,
                damping: 10,
              }}
            >
              {value}
            </motion.p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <motion.div
            className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <Icon size={32} className="text-white" />
          </motion.div>
        </div>

        {/* Progress indicator or sparkline could go here */}
        <motion.div
          className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delay + 0.4, duration: 0.8 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            transition={{
              delay: delay + 0.5,
              duration: 1,
              ease: 'easeOut',
            }}
            style={{ width: '75%' }}
          />
        </motion.div>
      </div>

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
}
