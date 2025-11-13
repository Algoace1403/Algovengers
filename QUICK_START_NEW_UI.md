# Quick Start Guide - New UI Components

## 🎯 How to Use the New Components in Your Project

### 1. **Import the Components**

All components are in the `/components` directory and ready to use:

```typescript
import UploadProgress from '@/components/UploadProgress';
import FileLightbox from '@/components/FileLightbox';
import FloatingActionButton from '@/components/FloatingActionButton';
import Tooltip from '@/components/Tooltip';
import AnimatedStatCard from '@/components/AnimatedStatCard';
import { ToastContainer } from '@/components/Toast';
import { CardSkeleton, DashboardSkeleton } from '@/components/LoadingSkeleton';
```

---

## 📦 Component Examples

### UploadProgress - Show Upload Status

```tsx
'use client';

import { useState } from 'react';
import UploadProgress from '@/components/UploadProgress';

export default function UploadPage() {
  const [uploads, setUploads] = useState([
    { fileName: 'photo.jpg', progress: 45, status: 'uploading' },
    { fileName: 'video.mp4', progress: 100, status: 'complete' },
  ]);

  return (
    <div>
      {uploads.map((upload, i) => (
        <UploadProgress
          key={i}
          fileName={upload.fileName}
          progress={upload.progress}
          status={upload.status}
        />
      ))}
    </div>
  );
}
```

---

### FileLightbox - Full Screen Preview

```tsx
'use client';

import { useState } from 'react';
import FileLightbox from '@/components/FileLightbox';

export default function Gallery() {
  const [currentFile, setCurrentFile] = useState(null);

  const file = {
    name: 'sunset.jpg',
    path: '/storage/users/123/media/Nature/Landscapes/sunset.jpg',
    type: 'image',
    category: 'Nature',
    subcategory: 'Landscapes',
  };

  return (
    <div>
      <button onClick={() => setCurrentFile(file)}>
        Open Preview
      </button>

      <FileLightbox
        file={currentFile}
        onClose={() => setCurrentFile(null)}
        onDownload={() => {
          // Download logic
          console.log('Downloading:', currentFile.name);
        }}
        onDelete={() => {
          // Delete logic
          console.log('Deleting:', currentFile.name);
          setCurrentFile(null);
        }}
        hasNext={true}
        hasPrevious={true}
        onNext={() => {
          // Load next file
        }}
        onPrevious={() => {
          // Load previous file
        }}
      />
    </div>
  );
}
```

---

### AnimatedStatCard - Dashboard Statistics

```tsx
import AnimatedStatCard from '@/components/AnimatedStatCard';
import { File, FolderTree, HardDrive } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <AnimatedStatCard
        title="Total Files"
        value={1234}
        subtitle="Across all categories"
        icon={File}
        gradient="from-orange-500 to-orange-600"
        delay={0}
      />

      <AnimatedStatCard
        title="Categories"
        value={24}
        subtitle="Organized folders"
        icon={FolderTree}
        gradient="from-purple-500 to-purple-600"
        delay={0.1}
      />

      <AnimatedStatCard
        title="Storage Used"
        value="45.8 GB"
        subtitle="55% of total"
        icon={HardDrive}
        gradient="from-blue-500 to-blue-600"
        delay={0.2}
      />
    </div>
  );
}
```

---

### Toast Notifications - User Feedback

```tsx
'use client';

import { useState } from 'react';
import { ToastContainer } from '@/components/Toast';

export default function MyApp() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleUpload = async () => {
    try {
      // Your upload logic
      await uploadFile();
      addToast('File uploaded successfully!', 'success');
    } catch (error) {
      addToast('Upload failed. Please try again.', 'error');
    }
  };

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <button onClick={handleUpload}>Upload File</button>

      {/* Demo buttons */}
      <button onClick={() => addToast('Success message!', 'success')}>
        Show Success
      </button>
      <button onClick={() => addToast('Error occurred!', 'error')}>
        Show Error
      </button>
      <button onClick={() => addToast('Processing...', 'info')}>
        Show Info
      </button>
      <button onClick={() => addToast('Warning: Low storage', 'warning')}>
        Show Warning
      </button>
    </div>
  );
}
```

---

### FloatingActionButton - Quick Actions

```tsx
import FloatingActionButton from '@/components/FloatingActionButton';
import { Upload, Plus, Download, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const router = useRouter();

  return (
    <div>
      {/* Main content */}

      {/* Floating action buttons */}
      <FloatingActionButton
        icon={<Upload size={24} />}
        onClick={() => router.push('/upload')}
        tooltip="Quick Upload"
        variant="primary"
        position="bottom-right"
      />

      <FloatingActionButton
        icon={<Settings size={24} />}
        onClick={() => router.push('/settings')}
        tooltip="Settings"
        variant="secondary"
        position="bottom-left"
      />
    </div>
  );
}
```

---

### Tooltip - Helpful Hints

```tsx
import Tooltip from '@/components/Tooltip';
import { HelpCircle, Info } from 'lucide-react';

export default function Form() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label>File Size Limit</label>
        <Tooltip text="Maximum 50MB per file" position="top">
          <HelpCircle size={16} className="text-gray-400 cursor-help" />
        </Tooltip>
      </div>

      <div className="flex items-center gap-2">
        <label>AI Processing</label>
        <Tooltip text="Uses TensorFlow MobileNet" position="right">
          <Info size={16} className="text-blue-500 cursor-help" />
        </Tooltip>
      </div>
    </div>
  );
}
```

---

### Loading Skeletons - Better Loading States

```tsx
'use client';

import { useState, useEffect } from 'react';
import { DashboardSkeleton, CardSkeleton, FileSkeleton } from '@/components/LoadingSkeleton';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      {/* Your actual content */}
      {data && <DashboardContent data={data} />}
    </div>
  );
}

// For individual cards
function CardList() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div>
      {/* Your cards */}
    </div>
  );
}
```

---

## 🎨 Using New CSS Classes

### Animated Backgrounds

```tsx
// Animated gradient background
<div className="min-h-screen animated-gradient-bg">
  {/* Your content */}
</div>

// Glassmorphism effect
<div className="glass p-6 rounded-xl">
  <h2>Glass Card</h2>
  <p>Beautiful frosted glass effect</p>
</div>

// Dark mode glass
<div className="glass-dark p-6 rounded-xl">
  <h2>Dark Glass Card</h2>
</div>
```

### Animated Text

```tsx
// Animated gradient text
<h1 className="text-4xl font-bold gradient-text">
  Intelligent Storage
</h1>

// Static gradient text
<h2 className="text-2xl gradient-text-orange">
  Welcome Back
</h2>
```

### Cards with Effects

```tsx
// Standard card with hover effects
<div className="card">
  <h3>Card Title</h3>
  <p>Card content with automatic hover lift</p>
</div>

// Glass card
<div className="card-glass">
  <h3>Glass Card</h3>
  <p>Glassmorphism effect</p>
</div>
```

### Buttons

```tsx
// Primary button with gradient animation
<button className="btn btn-primary">
  Upload Files
</button>

// Secondary button
<button className="btn btn-secondary">
  Cancel
</button>
```

### Loading States

```tsx
// Shimmer loading effect
<div className="w-full h-20 shimmer rounded-lg" />

// Pulse glow effect
<div className="pulse-glow bg-orange-500 px-4 py-2 rounded-lg">
  <span>New Feature!</span>
</div>

// Skeleton loading
<div className="skeleton h-40 w-full" />
```

### Animations

```tsx
// Bounce in animation
<div className="bounce-in">
  <h1>Welcome!</h1>
</div>

// Slide in from bottom
<div className="slide-in-bottom">
  <p>Sliding content</p>
</div>

// Fade in with scale
<div className="fade-in-scale">
  <img src="..." alt="..." />
</div>

// Floating animation
<div className="float-animation">
  <span>⬆️</span>
</div>

// Hover glow
<button className="hover-glow">
  Hover me
</button>
```

---

## 🎯 Real-World Integration Example

Here's how to integrate everything into your upload page:

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle } from 'lucide-react';
import UploadProgress from '@/components/UploadProgress';
import { ToastContainer } from '@/components/Toast';
import FloatingActionButton from '@/components/FloatingActionButton';
import Tooltip from '@/components/Tooltip';

export default function EnhancedUploadPage() {
  const router = useRouter();
  const [uploads, setUploads] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const handleUpload = async (files) => {
    // Add files to upload list
    const newUploads = files.map(file => ({
      fileName: file.name,
      progress: 0,
      status: 'uploading',
    }));
    setUploads(prev => [...prev, ...newUploads]);

    // Simulate upload progress
    for (let file of newUploads) {
      await simulateUpload(file);
    }

    addToast('All files uploaded successfully!', 'success');
  };

  const simulateUpload = async (file) => {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploads(prev => prev.map(u =>
        u.fileName === file.fileName
          ? { ...u, progress: i, status: i < 100 ? 'uploading' : 'complete' }
          : u
      ));
    }
  };

  return (
    <div className="min-h-screen animated-gradient-bg">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={(id) => setToasts(t => t.filter(x => x.id !== id))} />

      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold gradient-text">Upload Files</h1>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Upload Zone */}
        <div className="card-glass mb-8">
          <Tooltip text="Drag files here or click to browse" position="bottom">
            <div className="border-2 border-dashed border-orange-300 rounded-xl p-12 text-center hover:border-orange-500 transition-colors cursor-pointer">
              <Upload className="w-16 h-16 mx-auto mb-4 text-orange-500 float-animation" />
              <p className="text-lg font-semibold">Drop files here</p>
              <p className="text-sm text-gray-500">Supports images and videos</p>
            </div>
          </Tooltip>
        </div>

        {/* Upload Progress List */}
        {uploads.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Uploading Files</h2>
            {uploads.map((upload, i) => (
              <UploadProgress
                key={i}
                fileName={upload.fileName}
                progress={upload.progress}
                status={upload.status}
              />
            ))}
          </div>
        )}

        {/* Success Message */}
        {uploads.every(u => u.status === 'complete') && uploads.length > 0 && (
          <div className="card bg-green-50 border-green-500 border-l-4 bounce-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-bold text-green-800">Upload Complete!</p>
                <p className="text-sm text-green-600">All {uploads.length} files have been uploaded successfully</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<Upload size={24} />}
        onClick={() => {
          // Trigger file picker
          document.getElementById('file-input')?.click();
        }}
        tooltip="Quick Upload"
        variant="primary"
        position="bottom-right"
      />
    </div>
  );
}
```

---

## 🎬 Animation Tips

### 1. **Stagger Animations for Lists**

```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {item.content}
  </motion.div>
))}
```

### 2. **Hover Effects**

```tsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  className="btn btn-primary"
>
  Click Me
</motion.button>
```

### 3. **Exit Animations**

```tsx
import { AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

---

## 🚀 Quick Wins

### 1. Add Floating Particles to Any Page

```tsx
export default function Page() {
  return (
    <div className="min-h-screen animated-gradient-bg relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            style={{ left: `${Math.random() * 100}%`, bottom: -20 }}
            animate={{
              y: [-20, -1000],
              opacity: [0.3, 0.7, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Your content */}
    </div>
  );
}
```

### 2. Make Any Card Cooler

```tsx
// Before
<div className="card">
  <h3>Title</h3>
  <p>Content</p>
</div>

// After
<motion.div
  className="card-glass hover-glow"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ y: -8, scale: 1.02 }}
>
  <h3 className="gradient-text">Title</h3>
  <p>Content</p>
</motion.div>
```

### 3. Better Loading States

```tsx
// Before
{loading && <p>Loading...</p>}

// After
{loading && <DashboardSkeleton />}
```

---

## 📱 Responsive Considerations

### Mobile Optimizations

```tsx
// Reduce animation complexity on mobile
const isMobile = window.innerWidth < 768;

<motion.div
  animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
>
  Content
</motion.div>
```

### Touch-Friendly Buttons

```tsx
<button className="btn btn-primary px-8 py-4 text-lg">
  {/* Minimum 44x44px tap target */}
  Large Touch Button
</button>
```

---

## 🎯 Best Practices

### 1. **Don't Overdo It**
- Use animations purposefully
- 2-3 animated elements per section max
- Subtle > flashy

### 2. **Performance First**
- Use CSS animations when possible
- GPU-accelerated properties (transform, opacity)
- Lazy load heavy components

### 3. **Accessibility**
- Respect prefers-reduced-motion
- Provide non-animated fallbacks
- Keep animations under 500ms

### 4. **Consistency**
- Use same animation duration (300ms, 500ms)
- Consistent easing functions
- Unified color palette

---

## 🎉 You're Ready!

All components are set up and ready to use. Just import and integrate them into your pages!

**Pro Tip:** Start with the landing page and dashboard for maximum impact during your demo.

**Happy coding! 🚀**
