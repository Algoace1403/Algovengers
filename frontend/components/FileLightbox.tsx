'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Trash2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useState } from 'react';
import Tooltip from './Tooltip';

interface FileLightboxProps {
  file: {
    name: string;
    path: string;
    type: 'image' | 'video' | 'unknown';
    category: string;
    subcategory: string;
  } | null;
  onClose: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export default function FileLightbox({
  file,
  onClose,
  onDownload,
  onDelete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: FileLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!file) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close Button */}
        <Tooltip text="Close (Esc)" position="bottom">
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all z-10"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </Tooltip>

        {/* Action Buttons */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {onDownload && (
            <Tooltip text="Download" position="bottom">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                className="p-3 bg-green-500/90 hover:bg-green-600 rounded-full text-white backdrop-blur-sm transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download size={20} />
              </motion.button>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip text="Delete" position="bottom">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-3 bg-red-500/90 hover:bg-red-600 rounded-full text-white backdrop-blur-sm transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 size={20} />
              </motion.button>
            </Tooltip>
          )}
        </div>

        {/* Zoom Controls (for images) */}
        {file.type === 'image' && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            <Tooltip text="Zoom Out" position="top">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ZoomOut size={20} />
              </motion.button>
            </Tooltip>
            <Tooltip text="Reset Zoom" position="top">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetZoom();
                }}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm transition-all font-mono text-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {Math.round(zoom * 100)}%
              </motion.button>
            </Tooltip>
            <Tooltip text="Zoom In" position="top">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ZoomIn size={20} />
              </motion.button>
            </Tooltip>
            <Tooltip text="Fullscreen" position="top">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Maximize size={20} />
              </motion.button>
            </Tooltip>
          </div>
        )}

        {/* Navigation Arrows */}
        {hasPrevious && onPrevious && (
          <Tooltip text="Previous (←)" position="right">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all z-10"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={32} />
            </motion.button>
          </Tooltip>
        )}
        {hasNext && onNext && (
          <Tooltip text="Next (→)" position="left">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all z-10"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={32} />
            </motion.button>
          </Tooltip>
        )}

        {/* File Info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-4 right-4 glass px-4 py-3 rounded-xl text-white max-w-sm z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-semibold truncate">{file.name}</p>
          <p className="text-xs text-white/70">
            {file.category} › {file.subcategory}
          </p>
        </motion.div>

        {/* File Content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {file.type === 'image' ? (
            <motion.img
              src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${file.path}`}
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-zoom-in"
              style={{ transform: `scale(${zoom})` }}
              transition={{ duration: 0.3 }}
              drag={zoom > 1}
              dragConstraints={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onClick={() => {
                if (zoom === 1) handleZoomIn();
              }}
            />
          ) : file.type === 'video' ? (
            <video
              src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${file.path}`}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
          ) : (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-xl mb-2">Preview not available</p>
              <p className="text-sm text-white/70">This file type cannot be previewed</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
