'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useThemeStore } from '@/lib/theme-store';
import api from '@/lib/api';
import {
  FolderTree,
  Upload,
  Database,
  BarChart3,
  File,
  ChevronRight,
  ChevronDown,
  LogOut,
  HardDrive,
  Crown,
  Zap,
  Download,
  Trash2,
  Eye,
  Search,
  X,
  Star,
  CheckSquare,
  Square,
  Lock,
  Moon,
  Sun,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  usedGB: number;
  limitGB: number;
  percentUsed: number;
  categories: { [key: string]: number };
}

interface FolderStructure {
  [category: string]: {
    [subcategory: string]: Array<{
      name: string;
      path: string;
      size: number;
      created: string;
    }>;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const [stats, setStats] = useState<StorageStats | null>(null);
  const [structure, setStructure] = useState<FolderStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFile, setPreviewFile] = useState<{name: string; path: string; type: string} | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchStorageData();
    }
  }, [isAuthenticated, router]);

  // Initialize dark mode on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(`favorites_${user.id}`);
      if (stored) {
        try {
          setFavorites(new Set(JSON.parse(stored)));
        } catch (error) {
          console.error('Failed to load favorites:', error);
        }
      }
    }
  }, [user?.id]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (user?.id && favorites.size > 0) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(Array.from(favorites)));
    } else if (user?.id && favorites.size === 0) {
      localStorage.removeItem(`favorites_${user.id}`);
    }
  }, [favorites, user?.id]);

  const fetchStorageData = async () => {
    try {
      const response = await api.get('/upload/structure');
      if (response.data.success) {
        setStats(response.data.stats);
        setStructure(response.data.structure);
      }
    } catch (error: any) {
      console.error('Failed to fetch storage data:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async (category: string, subcategory: string, filename: string) => {
    try {
      const response = await api.get(
        `/upload/download/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}/${encodeURIComponent(filename)}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log(`✅ Downloaded: ${filename}`);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleDelete = async (category: string, subcategory: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    try {
      await api.delete(
        `/upload/delete/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}/${encodeURIComponent(filename)}`
      );

      console.log(`🗑️ Deleted: ${filename}`);
      alert('File deleted successfully!');
      fetchStorageData(); // Refresh
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
  };

  const handlePreview = (filename: string, category: string, subcategory: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoExts = ['mp4', 'mov', 'avi', 'mkv'];

    let type = 'unknown';
    if (imageExts.includes(ext || '')) type = 'image';
    if (videoExts.includes(ext || '')) type = 'video';

    setPreviewFile({
      name: filename,
      path: `/storage/users/${user?.id}/media/${category}/${subcategory}/${filename}`,
      type
    });
  };

  const toggleFavorite = (fileId: string) => {
    if (user?.subscriptionTier !== 'premium') {
      alert('⭐ Favorites is a Premium feature! Upgrade to access it.');
      return;
    }

    const newFavorites = new Set(favorites);
    if (newFavorites.has(fileId)) {
      newFavorites.delete(fileId);
    } else {
      newFavorites.add(fileId);
    }
    setFavorites(newFavorites);
  };

  const toggleFileSelection = (fileId: string) => {
    if (user?.subscriptionTier !== 'premium') {
      alert('📦 Bulk Operations is a Premium feature! Upgrade to access it.');
      return;
    }

    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleBulkDownload = async () => {
    if (selectedFiles.size === 0) {
      alert('Please select files first');
      return;
    }

    try {
      console.log('📦 Requesting ZIP download for files:', Array.from(selectedFiles));

      const response = await api.post(
        '/upload/bulk-download',
        { files: Array.from(selectedFiles) },
        { responseType: 'blob' }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `download-${Date.now()}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alert(`✅ Successfully downloaded ${selectedFiles.size} files as ZIP!`);
      setSelectedFiles(new Set()); // Clear selection
      setBulkMode(false);

    } catch (error: any) {
      console.error('Bulk download error:', error);
      alert(error.response?.data?.error || 'Bulk download failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-950 flex items-center justify-center">
        <div className="text-center">
          <div className="luxury-spinner mx-auto mb-6"></div>
          <p className="text-gold-200 text-lg font-display tracking-wider">Loading your storage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-950 transition-colors duration-300">
      {/* Premium Header */}
      <header className="bg-premium-900/80 backdrop-blur-xl shadow-luxury border-b border-gold-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-gold flex items-center justify-center">
                <span className="text-premium-950 font-display text-2xl">IS</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-display font-bold text-gold-500 tracking-wide uppercase">Intelligent Storage</h1>
                  {user?.subscriptionTier === 'premium' ? (
                    <span className="premium-badge flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      PREMIUM
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-premium-800 text-gold-200/70 text-xs font-bold uppercase tracking-wider border border-gold-500/20">
                      FREE
                    </span>
                  )}
                </div>
                <p className="text-xs text-gold-200/60 tracking-wide">Welcome, {user?.fullName}</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/ai-training">
                <button className="btn bg-premium-800 text-gold-500 border border-gold-500/30 hover:bg-premium-700 flex items-center gap-2">
                  <Sparkles size={18} />
                  <span className="uppercase tracking-wider text-xs">AI Training</span>
                </button>
              </Link>
              {user?.subscriptionTier === 'premium' && (
                <Link href="/analytics">
                  <button className="btn bg-premium-800 text-gold-500 border border-gold-500/30 hover:bg-premium-700 flex items-center gap-2">
                    <BarChart3 size={18} />
                    <span className="uppercase tracking-wider text-xs">Analytics</span>
                  </button>
                </Link>
              )}
              {user?.subscriptionTier !== 'premium' && (
                <Link href="/pricing">
                  <button className="btn-luxury flex items-center gap-2">
                    <Zap size={18} />
                    <span className="uppercase tracking-wider text-xs">Upgrade</span>
                  </button>
                </Link>
              )}
              <Link href="/upload">
                <button className="btn-luxury flex items-center gap-2">
                  <Upload size={18} />
                  <span className="uppercase tracking-wider text-xs">Upload</span>
                </button>
              </Link>
              <button
                onClick={() => {
                  if (user?.subscriptionTier !== 'premium') {
                    alert('🌙 Dark Mode is a Premium feature! Upgrade to access it.');
                    return;
                  }
                  toggleDarkMode();
                }}
                className="btn bg-premium-800 text-gold-500 border border-gold-500/30 hover:bg-premium-700 flex items-center gap-2 relative"
                title="Toggle Dark Mode (Premium)"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                {user?.subscriptionTier !== 'premium' && (
                  <Lock size={12} className="absolute -top-1 -right-1 text-gold-500" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="btn bg-premium-800 text-gold-500 border border-gold-500/30 hover:bg-premium-700 flex items-center gap-2"
              >
                <LogOut size={18} />
                <span className="uppercase tracking-wider text-xs">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Premium Storage Usage Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark mb-8 bg-gradient-to-br from-premium-900 to-premium-950 border-2 border-gold-500/30 luxury-pulse"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-display font-bold text-gold-500 mb-2 tracking-wide">Storage Usage</h2>
              <p className="text-gold-100/80 text-lg">
                {(stats?.usedGB || 0).toFixed(2)} GB / {stats?.limitGB || 100} GB used
              </p>
              <p className="text-xs text-gold-200/50 mt-1 tracking-wide uppercase">
                {user?.subscriptionTier === 'premium' ? '500 GB Premium Storage' : '100 GB Free Storage'}
              </p>
            </div>
            <HardDrive size={56} className="text-gold-500/50" />
          </div>

          <div className="w-full bg-premium-800 h-6 mb-3 border border-gold-500/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats?.percentUsed || 0}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-6 bg-gradient-gold"
              style={{
                opacity: (stats?.percentUsed || 0) > 90 ? 0.8 : 1
              }}
            />
          </div>

          <p className="text-sm text-gold-200/70 tracking-wide">
            {(100 - (stats?.percentUsed || 0)).toFixed(1)}% available • {((stats?.limitGB || 100) - (stats?.usedGB || 0)).toFixed(2)} GB remaining
          </p>
        </motion.div>

        {/* Premium Features Showcase (Free Users Only) */}
        {user?.subscriptionTier !== 'premium' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-dark mb-8 bg-gradient-to-br from-gold-500/10 via-premium-900 to-premium-950 border-4 border-gold-500/40 relative overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 gold-shimmer opacity-10"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-gold flex items-center justify-center">
                    <Crown className="w-8 h-8 text-premium-950" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold text-gold-500 mb-2 tracking-wide">
                      Unlock Premium Features
                    </h2>
                    <p className="text-gold-100/70 tracking-wide">
                      Upgrade to access exclusive pro features and 5x more storage
                    </p>
                  </div>
                </div>
                <div className="premium-badge flex items-center gap-2 text-base px-6 py-3">
                  <Sparkles className="w-5 h-5" />
                  ONLY ₹499/YEAR
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Feature 1 */}
                <div className="flex items-start gap-3 p-4 bg-premium-900/50 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
                  <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <HardDrive className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gold-500 mb-1 tracking-wide">500 GB Storage</h3>
                    <p className="text-sm text-gold-100/60">5x more space than free plan</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-3 p-4 bg-premium-900/50 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
                  <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gold-500 mb-1 tracking-wide">Advanced AI Search</h3>
                    <p className="text-sm text-gold-100/60">Find files by content and context</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-3 p-4 bg-premium-900/50 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
                  <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gold-500 mb-1 tracking-wide">Favorites & Bulk Ops</h3>
                    <p className="text-sm text-gold-100/60">Mark favorites and bulk download</p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-start gap-3 p-4 bg-premium-900/50 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
                  <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gold-500 mb-1 tracking-wide">Advanced Analytics</h3>
                    <p className="text-sm text-gold-100/60">Detailed insights and reports</p>
                  </div>
                </div>

                {/* Feature 5 */}
                <div className="flex items-start gap-3 p-4 bg-premium-900/50 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
                  <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <Moon className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gold-500 mb-1 tracking-wide">Dark Mode</h3>
                    <p className="text-sm text-gold-100/60">Premium dark theme support</p>
                  </div>
                </div>

                {/* Feature 6 */}
                <div className="flex items-start gap-3 p-4 bg-premium-900/50 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
                  <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gold-500 mb-1 tracking-wide">Priority Support</h3>
                    <p className="text-sm text-gold-100/60">24/7 premium customer support</p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-premium-900/70 border-t-2 border-gold-500/30">
                <div>
                  <p className="text-gold-100 font-display text-lg mb-1">
                    <span className="text-gold-500 font-bold">Limited Time Offer:</span> Get 1 year for just ₹499
                  </p>
                  <p className="text-gold-200/60 text-sm tracking-wide">
                    Join thousands of premium users • Cancel anytime
                  </p>
                </div>
                <Link href="/pricing">
                  <motion.button
                    className="btn-luxury px-10 py-4 text-base flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Crown className="w-5 h-5" />
                    <span className="uppercase tracking-wider">Upgrade to Premium</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Premium Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {/* Total Files */}
          <div className="card-dark border-2 border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gold-200/70 text-sm mb-2 uppercase tracking-wider font-display">Total Files</p>
                <p className="luxury-number text-5xl">{stats?.totalFiles || 0}</p>
              </div>
              <File size={48} className="text-gold-500/30" />
            </div>
          </div>

          {/* Categories */}
          <div className="card-dark border-2 border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gold-200/70 text-sm mb-2 uppercase tracking-wider font-display">Categories</p>
                <p className="luxury-number text-5xl">{Object.keys(stats?.categories || {}).length}</p>
              </div>
              <FolderTree size={48} className="text-gold-500/30" />
            </div>
          </div>

          {/* Avg File Size */}
          <div className="card-dark border-2 border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gold-200/70 text-sm mb-2 uppercase tracking-wider font-display">Avg Size</p>
                <p className="text-2xl font-display font-bold text-gold-500">
                  {stats?.totalFiles
                    ? formatBytes((stats.totalSize || 0) / stats.totalFiles)
                    : '0 Bytes'}
                </p>
              </div>
              <BarChart3 size={48} className="text-gold-500/30" />
            </div>
          </div>
        </motion.div>

        {/* Premium Category Breakdown */}
        {stats && stats.totalFiles > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-dark border-2 border-gold-500/20 mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3 text-gold-500">
              <BarChart3 size={28} />
              Category Breakdown
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div
                  key={category}
                  className="p-4 bg-premium-900 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-medium text-gold-200 tracking-wide">{category}</span>
                    <span className="premium-badge text-xs">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Premium Folder Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-dark border-2 border-gold-500/20"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3 text-gold-500">
              <FolderTree size={28} />
              Your Files
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              {user?.subscriptionTier === 'premium' && (
                <>
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`btn ${showFavoritesOnly ? 'btn-luxury' : 'bg-premium-800 text-gold-500 border border-gold-500/30'} flex items-center gap-2 text-xs`}
                    title="Show favorites only"
                  >
                    <Star size={16} className={showFavoritesOnly ? 'fill-gold-500' : ''} />
                    <span className="uppercase tracking-wider">Favorites {showFavoritesOnly && `(${favorites.size})`}</span>
                  </button>
                  <button
                    onClick={() => setBulkMode(!bulkMode)}
                    className={`btn ${bulkMode ? 'btn-luxury' : 'bg-premium-800 text-gold-500 border border-gold-500/30'} flex items-center gap-2 text-xs`}
                  >
                    <CheckSquare size={16} />
                    <span className="uppercase tracking-wider">Bulk {bulkMode && `(${selectedFiles.size})`}</span>
                  </button>
                  {bulkMode && selectedFiles.size > 0 && (
                    <button
                      onClick={handleBulkDownload}
                      className="btn btn-luxury flex items-center gap-2 text-xs"
                    >
                      <Download size={16} />
                      <span className="uppercase tracking-wider">Download ZIP</span>
                    </button>
                  )}
                </>
              )}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500/50" size={18} />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-premium-900 border-2 border-gold-500/30 text-gold-100 placeholder-gold-500/30 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300 font-sans text-sm"
                />
              </div>
            </div>
          </div>

          {structure && Object.keys(structure).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(structure).map(([category, subcategories]) => (
                <div key={category} className="border border-gold-500/20 overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-5 py-4 bg-premium-900 hover:bg-premium-800 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {expandedCategories.has(category) ? (
                        <ChevronDown className="text-gold-500" size={20} />
                      ) : (
                        <ChevronRight className="text-gold-500" size={20} />
                      )}
                      <Database size={20} className="text-gold-500/70" />
                      <span className="font-display font-bold text-lg text-gold-200 tracking-wide">{category}</span>
                      <span className="text-sm text-gold-500/50 tracking-wide">
                        ({Object.keys(subcategories).length} subcategories)
                      </span>
                    </div>
                  </button>

                  {/* Subcategories */}
                  {expandedCategories.has(category) && (
                    <div className="p-5 bg-premium-950 space-y-4">
                      {Object.entries(subcategories).map(([subcategory, files]) => (
                        <div key={subcategory} className="pl-6 border-l-2 border-gold-500/30">
                          <div className="font-display font-medium text-gold-200 mb-3 flex items-center gap-2">
                            <FolderTree size={16} className="text-gold-500/70" />
                            {subcategory}
                            <span className="ml-2 text-sm text-gold-500/50">
                              ({files.length} files)
                            </span>
                          </div>
                          <div className="space-y-2 pl-4">
                            {files
                              .filter(file => {
                                const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
                                const fileId = `${category}/${subcategory}/${file.name}`;
                                const isFavorite = favorites.has(fileId);

                                if (showFavoritesOnly) {
                                  return matchesSearch && isFavorite;
                                }
                                return matchesSearch;
                              })
                              .map((file, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="flex items-center justify-between py-3 px-4 hover:bg-premium-900 border border-transparent hover:border-gold-500/30 transition-all group"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {/* Bulk Selection Checkbox (Premium) */}
                                  {bulkMode && user?.subscriptionTier === 'premium' && (
                                    <button
                                      onClick={() => toggleFileSelection(`${category}/${subcategory}/${file.name}`)}
                                      className="p-1"
                                    >
                                      {selectedFiles.has(`${category}/${subcategory}/${file.name}`) ? (
                                        <CheckSquare size={18} className="text-gold-500" />
                                      ) : (
                                        <Square size={18} className="text-gold-500/30" />
                                      )}
                                    </button>
                                  )}

                                  <File size={20} className="text-gold-500/50" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-gold-100">{file.name}</p>
                                      {favorites.has(`${category}/${subcategory}/${file.name}`) && (
                                        <Star size={14} className="text-gold-500 fill-gold-500" />
                                      )}
                                    </div>
                                    <p className="text-xs text-gold-200/50">{formatBytes(file.size)}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {/* Favorite Star (Premium) */}
                                  <button
                                    onClick={() => toggleFavorite(`${category}/${subcategory}/${file.name}`)}
                                    className="p-2 hover:bg-gold-500/10 transition-colors relative border border-transparent hover:border-gold-500/30"
                                    title={user?.subscriptionTier === 'premium' ? "Add to Favorites" : "Premium Feature"}
                                  >
                                    {user?.subscriptionTier !== 'premium' && (
                                      <Lock size={10} className="absolute top-0 right-0 text-gold-500/50" />
                                    )}
                                    <Star
                                      size={16}
                                      className={favorites.has(`${category}/${subcategory}/${file.name}`) ? "text-gold-500 fill-gold-500" : "text-gold-500/30"}
                                    />
                                  </button>

                                  <button
                                    onClick={() => handlePreview(file.name, category, subcategory)}
                                    className="p-2 hover:bg-gold-500/10 transition-colors border border-transparent hover:border-gold-500/30"
                                    title="Preview"
                                  >
                                    <Eye size={16} className="text-gold-500" />
                                  </button>
                                  <button
                                    onClick={() => handleDownload(category, subcategory, file.name)}
                                    className="p-2 hover:bg-gold-500/10 transition-colors border border-transparent hover:border-gold-500/30"
                                    title="Download"
                                  >
                                    <Download size={16} className="text-gold-500" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(category, subcategory, file.name)}
                                    className="p-2 hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-500/30"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} className="text-red-400" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Database size={72} className="mx-auto mb-6 text-gold-500/30" />
              <p className="text-gold-200 text-lg mb-6 font-display tracking-wide">No files uploaded yet</p>
              <Link href="/upload" className="btn-luxury inline-flex items-center gap-2">
                <Upload size={18} />
                <span className="uppercase tracking-wider text-sm">Upload Your First Files</span>
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Premium Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setPreviewFile(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-premium-900 border-2 border-gold-500/30 p-8 max-w-5xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-display font-bold text-gold-500 tracking-wide">{previewFile.name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-2 hover:bg-gold-500/10 border border-gold-500/30 hover:border-gold-500 transition-colors"
              >
                <X size={24} className="text-gold-500" />
              </button>
            </div>

            <div className="flex items-center justify-center bg-premium-950 border border-gold-500/20 p-6 min-h-[500px]">
              {previewFile.type === 'image' ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${previewFile.path}`}
                  alt={previewFile.name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : previewFile.type === 'video' ? (
                <video
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${previewFile.path}`}
                  controls
                  className="max-w-full max-h-[70vh]"
                />
              ) : (
                <div className="text-center text-gold-200/70">
                  <File size={72} className="mx-auto mb-6 text-gold-500/30" />
                  <p className="font-display tracking-wide">Preview not available for this file type</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
