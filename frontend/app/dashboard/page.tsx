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
  Sun
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin-slow text-6xl mb-4">📊</div>
          <p className="text-gray-600 text-lg">Loading your storage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-orange-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-3xl">🗂️</div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold gradient-text">Intelligent Storage</h1>
                  {user?.subscriptionTier === 'premium' ? (
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      PREMIUM
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                      FREE
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">Welcome, {user?.fullName}</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {user?.subscriptionTier === 'premium' && (
                <Link href="/analytics">
                  <button className="btn bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center gap-2">
                    <BarChart3 size={18} />
                    Analytics
                  </button>
                </Link>
              )}
              {user?.subscriptionTier !== 'premium' && (
                <Link href="/pricing">
                  <button className="btn bg-gradient-to-r from-orange-500 to-purple-600 text-white flex items-center gap-2">
                    <Zap size={18} />
                    Upgrade to Premium
                  </button>
                </Link>
              )}
              <Link href="/upload">
                <button className="btn btn-primary flex items-center gap-2">
                  <Upload size={18} />
                  Upload Files
                </button>
              </Link>
              {/* Dark Mode Toggle (Premium Feature) */}
              <button
                onClick={() => {
                  if (user?.subscriptionTier !== 'premium') {
                    alert('🌙 Dark Mode is a Premium feature! Upgrade to access it.');
                    return;
                  }
                  toggleDarkMode();
                }}
                className="btn btn-secondary flex items-center gap-2 relative"
                title="Toggle Dark Mode (Premium)"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                {user?.subscriptionTier !== 'premium' && (
                  <Lock size={12} className="absolute -top-1 -right-1 text-orange-500" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-secondary flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Storage Usage Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8 bg-gradient-to-r from-orange-500 to-purple-600 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Storage Usage</h2>
              <p className="text-white/80">
                {(stats?.usedGB || 0).toFixed(2)} GB / {stats?.limitGB || 100} GB used
              </p>
              <p className="text-xs text-white/60 mt-1">
                {user?.subscriptionTier === 'premium' ? '500 GB Premium Storage' : '100 GB Free Storage'}
              </p>
            </div>
            <HardDrive size={48} className="opacity-80" />
          </div>

          <div className="w-full bg-white/20 rounded-full h-4 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats?.percentUsed || 0}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-4 rounded-full"
              style={{
                backgroundColor: (stats?.percentUsed || 0) > 90 ? '#ef4444' : (stats?.percentUsed || 0) > 70 ? '#f59e0b' : '#ffffff'
              }}
            />
          </div>

          <p className="text-sm text-white/80">
            {(100 - (stats?.percentUsed || 0)).toFixed(1)}% available ({((stats?.limitGB || 100) - (stats?.usedGB || 0)).toFixed(2)} GB free)
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {/* Total Files */}
          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Total Files</p>
                <p className="text-4xl font-bold">{stats?.totalFiles || 0}</p>
              </div>
              <File size={40} className="opacity-80" />
            </div>
          </div>

          {/* Categories */}
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Categories</p>
                <p className="text-4xl font-bold">{Object.keys(stats?.categories || {}).length}</p>
              </div>
              <FolderTree size={40} className="opacity-80" />
            </div>
          </div>

          {/* Avg File Size */}
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Avg File Size</p>
                <p className="text-4xl font-bold">
                  {stats?.totalFiles
                    ? formatBytes((stats.totalSize || 0) / stats.totalFiles)
                    : '0 Bytes'}
                </p>
              </div>
              <BarChart3 size={40} className="opacity-80" />
            </div>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        {stats && stats.totalFiles > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="text-orange-500" />
              Category Breakdown
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div
                  key={category}
                  className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-purple-50 border border-orange-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{category}</span>
                    <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-bold">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Folder Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FolderTree className="text-orange-500" />
              Your Files
            </h2>
            <div className="flex items-center gap-3">
              {user?.subscriptionTier === 'premium' && (
                <>
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`btn ${showFavoritesOnly ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
                    title="Show favorites only"
                  >
                    <Star size={18} className={showFavoritesOnly ? 'fill-white' : ''} />
                    Favorites {showFavoritesOnly && `(${favorites.size})`}
                  </button>
                  <button
                    onClick={() => setBulkMode(!bulkMode)}
                    className={`btn ${bulkMode ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
                  >
                    <CheckSquare size={18} />
                    Bulk {bulkMode && `(${selectedFiles.size})`}
                  </button>
                  {bulkMode && selectedFiles.size > 0 && (
                    <button
                      onClick={handleBulkDownload}
                      className="btn bg-green-600 text-white flex items-center gap-2"
                    >
                      <Download size={18} />
                      Download ZIP
                    </button>
                  )}
                </>
              )}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {structure && Object.keys(structure).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(structure).map(([category, subcategories]) => (
                <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-orange-50 to-purple-50 hover:from-orange-100 hover:to-purple-100 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      {expandedCategories.has(category) ? (
                        <ChevronDown className="text-orange-500" size={20} />
                      ) : (
                        <ChevronRight className="text-orange-500" size={20} />
                      )}
                      <span className="font-bold text-lg">📁 {category}</span>
                      <span className="text-sm text-gray-500">
                        ({Object.keys(subcategories).length} subcategories)
                      </span>
                    </div>
                  </button>

                  {/* Subcategories */}
                  {expandedCategories.has(category) && (
                    <div className="p-4 bg-white space-y-3">
                      {Object.entries(subcategories).map(([subcategory, files]) => (
                        <div key={subcategory} className="pl-6 border-l-2 border-orange-200">
                          <div className="font-medium text-gray-700 mb-2">
                            📂 {subcategory}
                            <span className="ml-2 text-sm text-gray-500">
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
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center justify-between py-2 px-3 hover:bg-orange-50 rounded-lg border border-transparent hover:border-orange-200 transition-all group"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {/* Bulk Selection Checkbox (Premium) */}
                                  {bulkMode && user?.subscriptionTier === 'premium' && (
                                    <button
                                      onClick={() => toggleFileSelection(`${category}/${subcategory}/${file.name}`)}
                                      className="p-1"
                                    >
                                      {selectedFiles.has(`${category}/${subcategory}/${file.name}`) ? (
                                        <CheckSquare size={20} className="text-orange-500" />
                                      ) : (
                                        <Square size={20} className="text-gray-400" />
                                      )}
                                    </button>
                                  )}

                                  <span className="text-2xl">📄</span>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                      {favorites.has(`${category}/${subcategory}/${file.name}`) && (
                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {/* Favorite Star (Premium) */}
                                  <button
                                    onClick={() => toggleFavorite(`${category}/${subcategory}/${file.name}`)}
                                    className="p-2 hover:bg-yellow-100 rounded-lg transition-colors relative"
                                    title={user?.subscriptionTier === 'premium' ? "Add to Favorites" : "Premium Feature"}
                                  >
                                    {user?.subscriptionTier !== 'premium' && (
                                      <Lock size={10} className="absolute top-0 right-0 text-gray-400" />
                                    )}
                                    <Star
                                      size={18}
                                      className={favorites.has(`${category}/${subcategory}/${file.name}`) ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}
                                    />
                                  </button>

                                  <button
                                    onClick={() => handlePreview(file.name, category, subcategory)}
                                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                    title="Preview"
                                  >
                                    <Eye size={18} className="text-blue-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDownload(category, subcategory, file.name)}
                                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                    title="Download"
                                  >
                                    <Download size={18} className="text-green-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(category, subcategory, file.name)}
                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} className="text-red-600" />
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
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg mb-4">No files uploaded yet</p>
              <Link href="/upload" className="btn btn-primary inline-flex items-center gap-2">
                <Upload size={18} />
                Upload Your First Files
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{previewFile.name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 min-h-[400px]">
              {previewFile.type === 'image' ? (
                <img
                  src={`http://localhost:5001${previewFile.path}`}
                  alt={previewFile.name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : previewFile.type === 'video' ? (
                <video
                  src={`http://localhost:5001${previewFile.path}`}
                  controls
                  className="max-w-full max-h-[70vh]"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <File size={64} className="mx-auto mb-4" />
                  <p>Preview not available for this file type</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
