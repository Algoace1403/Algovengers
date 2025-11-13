'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { Upload, File, Image, Video, Database, X, Sparkles, Zap, LogOut } from 'lucide-react';
import Link from 'next/link';
import { categorizeImages, loadModel } from '@/lib/ai-categorizer';
import { useAuthStore } from '@/lib/auth-store';

interface FileWithCategory extends File {
  category?: string;
  subcategory?: string;
  confidence?: number;
  aiProcessed?: boolean;
}

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  const [files, setFiles] = useState<FileWithCategory[]>([]);
  const [jsonText, setJsonText] = useState('');
  const [metadata, setMetadata] = useState({
    category: '',
    description: '',
    tags: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'files' | 'json'>('files');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Check authentication and load AI model
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }

    loadModel().then(() => {
      setModelLoaded(true);
      console.log('✅ AI model ready!');
    });
  }, [isAuthenticated, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setAiProcessing(true);

    // Add files first (without categories)
    const newFiles = acceptedFiles.map(f => Object.assign(f, { aiProcessed: false }));
    setFiles(prev => [...prev, ...newFiles]);

    // Categorize with AI
    try {
      const categorized = await categorizeImages(acceptedFiles);

      // Update files with AI categories
      setFiles(prev => prev.map(file => {
        const aiResult = categorized.find(c => c.file.name === file.name);
        if (aiResult) {
          return Object.assign(file, {
            category: aiResult.category,
            subcategory: aiResult.subcategory,
            confidence: aiResult.confidence,
            aiProcessed: true
          });
        }
        return file;
      }));
    } catch (error) {
      console.error('AI categorization error:', error);
    } finally {
      setAiProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: uploadMode === 'files'
      ? {
          'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
          'video/*': ['.mp4', '.mov', '.avi', '.mkv']
        }
      : undefined,
  });

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleUpload = async () => {
    setUploading(true);

    try {
      const formData = new FormData();

      if (uploadMode === 'files') {
        files.forEach(file => {
          formData.append('files', file);
        });

        // Send AI categories
        const categories = files.map(f => ({
          filename: f.name,
          category: f.category || 'Uncategorized',
          subcategory: f.subcategory || 'Other',
          confidence: f.confidence || 0
        }));
        formData.append('aiCategories', JSON.stringify(categories));
      } else {
        formData.append('json', jsonText);
      }

      formData.append('metadata', JSON.stringify(metadata));

      // Get token from localStorage
      const authStorage = localStorage.getItem('auth-storage');
      let token = '';
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        token = state?.token || '';
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const storageInfo = result.storage ?
          `\n\nStorage: ${result.storage.usedGB} GB / ${result.storage.limitGB} GB (${result.storage.percentUsed}% used)` : '';
        alert(`Upload successful! 🎉\n${result.message}${storageInfo}`);
        setFiles([]);
        setJsonText('');
        setMetadata({ category: '', description: '', tags: '' });
        router.push('/dashboard');
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold gradient-text">
            🎯 Intelligent Storage
          </Link>
          <div className="flex gap-4 items-center">
            {modelLoaded && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Zap className="w-4 h-4" />
                <span>AI Ready</span>
              </div>
            )}
            {user && (
              <span className="text-sm text-gray-600">
                {user.fullName}
              </span>
            )}
            <Link href="/dashboard">
              <button className="btn btn-secondary">Dashboard</button>
            </Link>
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

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-2 text-center">
            Upload <span className="gradient-text">Anything</span>
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Drop your files or paste JSON data - our AI will organize everything
          </p>

          {/* Mode Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setUploadMode('files')}
              className={`btn ${uploadMode === 'files' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Image className="w-5 h-5 inline mr-2" />
              Media Files
            </button>
            <button
              onClick={() => setUploadMode('json')}
              className={`btn ${uploadMode === 'json' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Database className="w-5 h-5 inline mr-2" />
              JSON Data
            </button>
          </div>

          {/* Upload Zone */}
          {uploadMode === 'files' ? (
            <div
              {...getRootProps()}
              className={`card border-2 border-dashed cursor-pointer transition-all ${
                isDragActive
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 hover:border-orange-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center py-12">
                <motion.div
                  animate={{ y: isDragActive ? -10 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">
                  {isDragActive ? 'Drop files here!' : 'Drag & Drop Files'}
                </h3>
                <p className="text-gray-600 mb-2">or click to browse</p>
                <p className="text-sm text-gray-500">
                  Images, Videos supported • AI categorization enabled ✨
                </p>
              </div>
            </div>
          ) : (
            <div className="card">
              <label className="block text-sm font-medium mb-2">
                Paste your JSON data:
              </label>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full h-64 p-4 border rounded-lg font-mono text-sm"
                placeholder={`{\n  "name": "John Doe",\n  "age": 25,\n  "email": "john@example.com"\n}`}
              />
            </div>
          )}

          {/* AI Processing Indicator */}
          {aiProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mt-6 bg-gradient-to-r from-orange-50 to-purple-50 border-orange-200"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-6 h-6 text-orange-500" />
                </motion.div>
                <div>
                  <p className="font-bold">AI Processing...</p>
                  <p className="text-sm text-gray-600">Analyzing and categorizing your images</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Selected Files with AI Categories */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mt-6"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <File className="w-5 h-5" />
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {file.type.startsWith('image/') ? (
                        <Image className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Video className="w-5 h-5 text-purple-500" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      {file.aiProcessed && file.category && (
                        <div className="text-right">
                          <p className="text-xs font-semibold text-orange-600">
                            📁 {file.category}/{file.subcategory}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.confidence}% confidence
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 ml-3"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Metadata */}
          <div className="card mt-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Optional Metadata
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Hint (optional - AI will suggest)
                </label>
                <input
                  type="text"
                  value={metadata.category}
                  onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="e.g., Nature, Animals, Technology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={metadata.description}
                  onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={metadata.tags}
                  onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <motion.button
            onClick={handleUpload}
            disabled={uploading || aiProcessing || (uploadMode === 'files' && files.length === 0) || (uploadMode === 'json' && !jsonText)}
            className="btn btn-primary w-full mt-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {uploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block mr-2"
                >
                  ⏳
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 inline mr-2" />
                Upload & Process
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
