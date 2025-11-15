# 📋 Complete File-by-File Summary - Algovengers Project

This document provides a comprehensive summary of **EVERY SINGLE FILE** in the Algovengers project, explaining what each file does.

---

## 📁 Root Directory Files

### `README.md`
**What it does:** Main project documentation and overview
- Project description and features
- Installation instructions
- Usage guide
- API documentation
- Deployment guide links
- Project statistics and team info

### `FILE_SUMMARIES.md`
**What it does:** Detailed technical summary of each file (created for interview prep)
- File-by-file technical explanations
- Architecture decisions
- Implementation details

### `INTERVIEW_QUESTIONS.md`
**What it does:** Comprehensive Q&A preparation document
- 60+ potential interview questions
- Detailed answers for each question
- Technical deep-dives
- Behavioral questions

### `COMPLETE_FILE_SUMMARY.md`
**What it does:** This file - complete list of all files and their purposes

### `QA_PREPARATION.md`
**What it does:** Q&A session preparation guide
- Technical questions and answers
- Architecture explanations
- Trade-offs and challenges

### `NEW_FEATURES_SUMMARY.md`
**What it does:** Summary of new UI/UX features added
- Component descriptions
- Animation library
- CSS utilities
- Integration guide

### `UI_UX_IMPROVEMENTS.md`
**What it does:** Complete UI/UX documentation
- Component features
- Animation details
- Color system
- Design principles

### `QUICK_START_NEW_UI.md`
**What it does:** Quick reference guide for new UI components
- Import instructions
- Usage examples
- Best practices

### `QUICK_DEPLOY.md`
**What it does:** Quick deployment instructions
- Vercel + Render deployment
- Environment setup
- Configuration steps

### `DEPLOYMENT_GUIDE.md`
**What it does:** Detailed deployment documentation
- Step-by-step deployment
- Platform-specific instructions
- Troubleshooting

### `START_PROJECT.sh`
**What it does:** Shell script to start the project
- Starts both backend and frontend
- Development server initialization

---

## 🔧 Backend Files

### **Core Server Files**

#### `backend/src/server.ts`
**What it does:** Main Express.js server entry point
- Initializes Express application
- Configures security middleware (Helmet, CORS, rate limiting)
- Sets up body parsers (JSON, URL-encoded)
- Mounts all route handlers
- Serves static files from `/storage` directory
- Connects to database and starts server
- Health check endpoint (`/api/health`)

#### `backend/package.json`
**What it does:** Backend dependencies and scripts
- Lists all npm packages
- Defines scripts: `dev`, `build`, `start`
- Dependencies: Express, Mongoose, JWT, Multer, Razorpay, etc.

#### `backend/package-lock.json`
**What it does:** Locked dependency versions
- Ensures consistent installs across environments
- Exact versions of all dependencies

#### `backend/tsconfig.json`
**What it does:** TypeScript configuration for backend
- Compiler options
- Module resolution
- Output settings

---

### **Configuration Files**

#### `backend/src/config/database.ts`
**What it does:** MongoDB connection management
- Connects to MongoDB using Mongoose
- Graceful fallback if connection fails
- Exports `isConnected()` helper function
- Handles connection errors and disconnections
- Clean shutdown on SIGINT

#### `backend/check-storage.sh`
**What it does:** Shell script to check storage usage
- Utility script for monitoring storage

#### `backend/CLOUD_STORAGE_SETUP.md`
**What it does:** Google Cloud Storage setup guide
- Instructions for GCS configuration
- Environment variables needed
- Setup steps

---

### **Controllers**

#### `backend/src/controllers/auth.controller.ts`
**What it does:** Authentication logic
- **register()** - Creates new user account
  - Validates input (email, password, name)
  - Hashes password with bcryptjs
  - Creates user in MongoDB or file storage
  - Generates JWT token
  - Returns user data and token

- **login()** - Authenticates existing user
  - Verifies email and password
  - Compares hashed password
  - Generates JWT token
  - Returns user data and token

- **getMe()** - Gets current user profile (protected)
  - Extracts userId from JWT
  - Returns user information

- **getAllUsers()** - Debug endpoint to list all users
  - Returns all users (without passwords)
  - Should be removed in production

- **getUserById()** - Helper to get user by ID
  - Used by other controllers
  - Works with MongoDB or file storage

- **updateUser()** - Helper to update user
  - Updates user data
  - Used for subscription updates

#### `backend/src/controllers/payment.controller.ts`
**What it does:** Payment processing for premium subscriptions
- **createOrder()** - Creates Razorpay payment order
  - Amount: ₹499 (49900 paise)
  - Currency: INR
  - Returns order ID and key

- **verifyPayment()** - Verifies payment signature
  - Validates Razorpay signature using HMAC SHA-256
  - Upgrades user to premium tier
  - Sets subscription dates (1 year)
  - Stores payment ID

- **getSubscriptionStatus()** - Returns current subscription info
  - Returns tier, dates, payment ID

- **webhook()** - Handles Razorpay webhook events
  - Verifies webhook signature
  - Handles payment.captured and payment.failed events

---

### **Services (Business Logic)**

#### `backend/src/services/storage.service.ts`
**What it does:** Core file storage and organization service
- **Storage Limits:**
  - Free: 100GB
  - Premium: 500GB

- **organizeFile()** - Organizes single file
  - Creates category/subcategory folders
  - Generates unique filename (timestamp-based)
  - Checks storage quota
  - Moves file from temp to organized location

- **organizeFiles()** - Organizes multiple files
  - Processes array of files
  - Uses AI categories for organization

- **getFolderStructure()** - Returns folder tree
  - Recursively reads directory structure
  - Returns organized JSON structure

- **getStorageStats()** - Calculates storage statistics
  - Total files count
  - Total size in bytes/GB
  - Percentage used
  - Category breakdown

- **checkStorageLimit()** - Validates storage quota
  - Calculates current usage
  - Checks if new upload would exceed limit
  - Returns allowed/denied status

- **deleteFile()** - Deletes file from storage
  - Removes file from filesystem
  - Returns success/failure

- **getFilesByCategory()** - Gets files in specific category
  - Filters files by category/subcategory

#### `backend/src/services/ai-training.service.ts`
**What it does:** AI model training and accuracy tracking
- **recordPrediction()** - Logs AI categorization
  - Tracks every prediction made
  - Updates model accuracy statistics
  - Stores in training-data.json

- **recordCorrection()** - Records user corrections
  - Stores when user recategorizes file
  - Updates accuracy calculations
  - Helps improve model over time

- **getTrainingStats()** - Returns training statistics
  - Overall accuracy percentage
  - Total predictions count
  - Total corrections count
  - Category-wise accuracy
  - Recent corrections list

- **getCategorySuggestions()** - Suggests categories based on training data
  - Analyzes past corrections
  - Returns top 5 suggestions for filename

- **exportTrainingData()** - Exports all training data
  - For analysis and model improvement

- **clearTrainingData()** - Clears training data (admin)

#### `backend/src/services/analytics.service.ts`
**What it does:** User activity tracking and analytics
- **trackEvent()** - Records user activity
  - Event types: upload, download, delete, view
  - Stores category, subcategory, file size
  - Works with MongoDB or file storage

- **getUserAnalytics()** - Generates analytics report
  - Last 30 days (configurable)
  - Total events count
  - Upload/download/view/delete counts
  - Total size uploaded
  - Category breakdown
  - Activity by day
  - Activity heatmap (7 days × 24 hours)
  - Recent activity feed

- **processAnalytics()** - Processes raw events into statistics
  - Calculates totals and percentages
  - Generates heatmap data
  - Creates category breakdown

#### `backend/src/services/json-analyzer.service.ts`
**What it does:** Analyzes JSON data and recommends database type
- **analyzeJSON()** - Main analysis function
  - Analyzes structure (depth, arrays, consistency)
  - Determines SQL vs NoSQL recommendation
  - Returns confidence score and reasoning

- **analyzeStructure()** - Analyzes JSON structure
  - Calculates maximum depth
  - Detects arrays and nested objects
  - Checks consistency across array elements
  - Counts fields
  - Detects relationships (foreign keys)

- **determineDatabase()** - Scoring algorithm
  - Assigns points to SQL/NoSQL based on factors
  - Returns recommendation with confidence

- **generateSQLSchema()** - Generates SQL schema suggestion
  - Creates CREATE TABLE statement
  - Infers field types

- **generateMongoSchema()** - Generates MongoDB schema suggestion
  - Creates Mongoose schema
  - Infers field types

#### `backend/src/services/cloud-storage.service.ts`
**What it does:** Abstraction layer for local or Google Cloud Storage
- **uploadFile()** - Uploads file to storage
  - If GCS: Uploads to Google Cloud Storage
  - If local: Uses local filesystem
  - Returns public URL

- **downloadFile()** - Downloads file from storage
  - Returns file buffer

- **deleteFile()** - Deletes file from storage

- **getFileSize()** - Gets file size from cloud

- **calculateUserStorage()** - Calculates user's total storage in cloud

- **getSignedUrl()** - Generates temporary access URL
  - Expires after specified time (default 60 minutes)

- **isCloudStorage()** - Checks if using cloud storage

---

### **Routes (API Endpoints)**

#### `backend/src/routes/auth.routes.ts`
**What it does:** Authentication API endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/users` - Get all users (debug, remove in production)

#### `backend/src/routes/upload.routes.ts`
**What it does:** File upload and management endpoints
- `POST /api/upload` - Upload files with AI categorization (protected)
  - Accepts multiple files
  - Receives AI categories from frontend
  - Checks storage quota
  - Organizes files into folders
  - Tracks analytics events

- `POST /api/upload/json` - Analyze JSON data (public)
  - Accepts JSON string
  - Analyzes structure
  - Returns SQL/NoSQL recommendation

- `GET /api/upload/structure` - Get folder structure (protected)
  - Returns organized folder tree
  - Includes storage statistics

- `GET /api/upload/download/:category/:subcategory/:filename` - Download file (protected)
  - Validates path (prevents traversal attacks)
  - Streams file to client
  - Tracks download event

- `DELETE /api/upload/delete/:category/:subcategory/:filename` - Delete file (protected)
  - Removes file from storage
  - Updates storage stats
  - Tracks delete event

- `POST /api/upload/bulk-download` - Download multiple files as ZIP (protected, premium)
  - Creates ZIP archive on-the-fly
  - Streams to client
  - Maximum compression

#### `backend/src/routes/payment.routes.ts`
**What it does:** Payment processing endpoints
- `POST /api/payment/create-order` - Create Razorpay order (protected)
- `POST /api/payment/verify` - Verify payment and upgrade (protected)
- `GET /api/payment/subscription` - Get subscription status (protected)
- `POST /api/payment/webhook` - Razorpay webhook handler (unprotected, signature verified)

#### `backend/src/routes/analytics.routes.ts`
**What it does:** Analytics endpoints
- `GET /api/analytics` - Get user analytics (protected)
  - Returns 30-day activity summary
  - Includes charts data, heatmap, breakdowns

- `POST /api/analytics/track` - Track custom event (protected)
  - Records custom analytics event

#### `backend/src/routes/ai-training.routes.ts`
**What it does:** AI training endpoints
- `POST /api/ai-training/record-prediction` - Record AI prediction (protected)
- `POST /api/ai-training/correct-category` - Submit user correction (protected)
- `GET /api/ai-training/stats` - Get training statistics (protected)
- `GET /api/ai-training/suggestions/:filename` - Get category suggestions (protected)
- `GET /api/ai-training/export` - Export training data (protected)

---

### **Middleware**

#### `backend/src/middleware/auth.middleware.ts`
**What it does:** JWT authentication middleware
- **authMiddleware** - Protects routes
  - Extracts token from `Authorization: Bearer <token>` header
  - Verifies JWT signature and expiry
  - Adds `userId` and `userEmail` to request object
  - Returns 401 if token invalid/expired

- **optionalAuth** - Optional authentication
  - Doesn't fail if no token
  - Adds user info if token present

---

### **Models (Database Schemas)**

#### `backend/src/models/user.model.ts`
**What it does:** Mongoose schema for User model
- **Fields:**
  - `id` (String, unique) - UUID
  - `email` (String, unique, lowercase)
  - `password` (String) - Hashed
  - `name` (String)
  - `subscription` (Object) - Tier, dates, payment ID
  - `storageUsed` (Number) - Bytes
  - `favorites` (Array) - File paths
  - `createdAt`, `updatedAt` (auto)

- **Indexes:** email, id

#### `backend/src/models/analytics.model.ts`
**What it does:** Mongoose schema for Analytics events
- **Fields:**
  - `userId` (String, indexed)
  - `eventType` (Enum: upload, download, delete, view)
  - `category` (String)
  - `subcategory` (String)
  - `fileSize` (Number)
  - `timestamp` (Date, indexed)
  - `metadata` (Mixed) - Additional data

- **Indexes:** userId+timestamp, userId+eventType

---

### **Storage Files**

#### `backend/storage/users.json`
**What it does:** File-based user database (fallback)
- Stores user data when MongoDB unavailable
- JSON array of user objects
- Used for hackathon demo

#### `backend/storage/ai-training/training-data.json`
**What it does:** Stores AI training data
- User corrections
- Prediction history
- Used for model improvement

#### `backend/storage/ai-training/model-accuracy.json`
**What it does:** Stores model accuracy statistics
- Total predictions count
- Correct predictions count
- Overall accuracy percentage
- Category-wise statistics

#### `backend/storage/temp/`
**What it does:** Temporary upload directory
- Files uploaded here first
- Moved to organized location after processing
- Should be cleaned periodically

#### `backend/storage/users/{userId}/media/`
**What it does:** User file storage
- Organized by category/subcategory
- Each user has isolated directory
- Structure: `Category/Subcategory/filename`

---

## 🎨 Frontend Files

### **Core Application Files**

#### `frontend/app/layout.tsx`
**What it does:** Root layout component
- Wraps all pages
- Sets up HTML structure
- Includes global CSS
- Configures metadata
- Provides theme context

#### `frontend/app/page.tsx`
**What it does:** Landing page
- Hero section with animated gradients
- Feature showcase
- Call-to-action buttons
- Stats display
- Navigation to login/register

#### `frontend/app/favicon.ico`
**What it does:** Website favicon
- Browser tab icon

---

### **Page Components**

#### `frontend/app/login/page.tsx`
**What it does:** User login page
- Email/password form
- Uses `useAuthStore` for authentication
- Redirects to dashboard on success
- Error message display
- Link to register page

#### `frontend/app/register/page.tsx`
**What it does:** User registration page
- Name, email, password form
- Password validation
- Auto-login after registration
- Redirects to dashboard
- Link to login page

#### `frontend/app/upload/page.tsx`
**What it does:** File upload interface
- **React Dropzone** for drag-and-drop
- **AI Processing:** Categorizes files before upload
- **Category Preview:** Shows AI-suggested categories
- **Dual Mode:** File upload or JSON paste
- **Progress Tracking:** Shows AI processing status
- **Metadata Input:** Optional category hints, description, tags
- **File List:** Shows selected files with categories

#### `frontend/app/dashboard/page.tsx`
**What it does:** Main user dashboard
- **Storage Stats:** Usage, limits, percentage
- **Folder Structure:** Expandable tree view
- **File List:** Files with preview, download, delete
- **Premium Features:** Favorites, bulk operations (premium only)
- **Search:** Filter files by name
- **Dark Mode:** Premium feature toggle
- **File Preview Modal:** Full-screen preview
- **Bulk Download:** ZIP download (premium)

#### `frontend/app/analytics/page.tsx`
**What it does:** Analytics dashboard (Premium feature)
- **Premium Gate:** Shows upgrade prompt for free users
- **Stats Overview:** Total uploads, storage, categories
- **Charts:** Storage growth, category distribution
- **Activity Heatmap:** 30-day upload activity
- **Recent Activity:** Timeline of actions
- **Demo Data:** Shows sample analytics

#### `frontend/app/ai-training/page.tsx`
**What it does:** AI training dashboard
- **Overall Accuracy:** Model accuracy percentage
- **Total Predictions:** Count of all predictions
- **User Corrections:** Count of corrections
- **Learning Rate:** Correction percentage
- **Category Performance:** Accuracy by category
- **Recent Corrections:** List of recent corrections
- **Help Card:** Encourages users to correct files

#### `frontend/app/pricing/page.tsx`
**What it does:** Pricing page
- **Free Plan:** Features and limits
- **Premium Plan:** Features and pricing (₹499/year)
- **Feature Comparison:** Side-by-side comparison
- **Razorpay Integration:** Payment processing
- **Payment Modal:** Payment confirmation
- **Upgrade Button:** Initiates payment flow

---

### **Reusable Components**

#### `frontend/components/FileLightbox.tsx`
**What it does:** Full-screen file preview component
- Opens modal overlay
- Displays image/video
- Zoom controls (50%-300%)
- Pan when zoomed
- Keyboard shortcuts (Esc, arrow keys)
- Download/delete actions
- Navigation (previous/next)

#### `frontend/components/UploadProgress.tsx`
**What it does:** Upload progress indicator
- Animated progress bar
- Percentage display
- Status states: uploading, processing, complete, error
- Shimmer animation effects
- Color-coded by status

#### `frontend/components/AnimatedStatCard.tsx`
**What it does:** Animated statistics card
- Number counter animation (0 to target)
- Floating particles on hover
- Gradient icon with wobble effect
- Progress indicators
- Shimmer effects

#### `frontend/components/Toast.tsx`
**What it does:** Notification toast system
- Auto-dismissing notifications
- Progress bar showing time remaining
- 4 types: success, error, info, warning
- Stacked notifications
- Icon animations
- ToastContainer component

#### `frontend/components/LoadingSkeleton.tsx`
**What it does:** Loading placeholder components
- Shimmer animation effect
- Multiple variants:
  - CardSkeleton
  - DashboardSkeleton
  - FileSkeleton
  - TableSkeleton
  - StatCardSkeleton
- Matches actual content layout

#### `frontend/components/FloatingActionButton.tsx`
**What it does:** Floating action button
- Fixed position button
- Spring animations
- Tooltip on hover
- Multiple positions (corners)
- Wiggle effect

#### `frontend/components/Tooltip.tsx`
**What it does:** Hover tooltip component
- 4 positions: top, bottom, left, right
- Auto-positioned arrow
- Smooth fade-in animation
- Dark theme support

#### `frontend/components/ThemeToggle.tsx`
**What it does:** Dark mode toggle button
- Toggles between light/dark themes
- Persists preference in localStorage
- Premium feature (locked for free users)
- Icon changes (sun/moon)

---

### **Libraries & Utilities**

#### `frontend/lib/ai-categorizer.ts`
**What it does:** Client-side AI image categorization
- **loadModel()** - Loads MobileNet v2 model
  - ~4MB model, cached in browser
  - Retry logic for failed loads

- **categorizeImage()** - Categorizes single image
  - Runs MobileNet inference
  - Maps ImageNet classes to 200+ categories
  - Returns category, subcategory, confidence

- **categorizeImages()** - Categorizes multiple images
  - Processes array of files
  - Uses AI for images, file type for others

- **categorizeByFileType()** - Fallback categorization
  - Uses file extension
  - Categorizes videos, documents, code, etc.

- **Category Mapping:** 1674+ keyword mappings
- **Smart Categorization:** Pattern-based matching
- **Fallback System:** Always categorizes, never fails

#### `frontend/lib/api.ts`
**What it does:** Axios HTTP client with authentication
- **Request Interceptor:** Adds JWT token to headers
- **Response Interceptor:** Handles 401 errors, redirects to login
- **Base URL:** Configurable via environment variable
- **Error Handling:** Centralized error management

#### `frontend/lib/auth-store.ts`
**What it does:** Zustand store for authentication state
- **State:** user, token, isAuthenticated, isLoading, error
- **Actions:**
  - `login()` - Authenticates user
  - `register()` - Creates new user
  - `logout()` - Clears auth state
  - `clearError()` - Clears error message
- **Persistence:** Saves to localStorage via Zustand persist
- **API Integration:** Calls backend auth endpoints

#### `frontend/lib/theme-store.ts`
**What it does:** Zustand store for theme (dark mode)
- **State:** isDarkMode (boolean)
- **Actions:** toggleDarkMode()
- **Persistence:** Saves to localStorage

#### `frontend/lib/theme-provider.tsx`
**What it does:** React context provider for theme
- Provides theme context to app
- Syncs with theme store
- Applies dark class to document element

---

### **Configuration Files**

#### `frontend/package.json`
**What it does:** Frontend dependencies and scripts
- Dependencies: Next.js, React, TensorFlow.js, Framer Motion, Zustand, etc.
- Scripts: `dev`, `build`, `start`, `lint`

#### `frontend/package-lock.json`
**What it does:** Locked dependency versions

#### `frontend/tsconfig.json`
**What it does:** TypeScript configuration for frontend
- Compiler options
- Path aliases (@/ for imports)
- Module resolution

#### `frontend/next.config.ts`
**What it does:** Next.js configuration
- Webpack configuration
- Environment variables
- Build settings

#### `frontend/tailwind.config.ts`
**What it does:** Tailwind CSS configuration
- Custom theme colors (premium palette)
- Custom font families
- Animation utilities
- Extends default Tailwind config

#### `frontend/postcss.config.mjs`
**What it does:** PostCSS configuration
- Tailwind CSS plugin
- Autoprefixer plugin

#### `frontend/eslint.config.mjs`
**What it does:** ESLint configuration
- Code linting rules
- Next.js ESLint config

#### `frontend/next-env.d.ts`
**What it does:** Next.js TypeScript definitions
- Auto-generated by Next.js
- Type definitions for Next.js

---

### **Styling Files**

#### `frontend/app/globals.css`
**What it does:** Global CSS with custom styles
- **Custom Animations:** 11 keyframe animations
  - gradient-animation
  - float-particle
  - shimmer
  - pulse-glow
  - bounce-in
  - slide-in-bottom
  - fade-in-scale
  - progress-shine
  - page-enter
  - ripple
  - float-up-down

- **Utility Classes:**
  - `.animated-gradient-bg` - Animated background
  - `.glass` / `.glass-dark` - Glassmorphism
  - `.gradient-text` - Animated gradient text
  - `.card-glass` - Glass cards
  - `.shimmer` - Loading shimmer
  - `.pulse-glow` - Pulsing glow
  - `.hover-glow` - Hover glow effect
  - `.skeleton` - Skeleton loading
  - `.bounce-in` - Bounce entrance
  - `.slide-in-bottom` - Slide entrance
  - `.fade-in-scale` - Fade entrance
  - `.float-animation` - Floating
  - `.progress-shine` - Progress shimmer

- **Premium Theme Variables:**
  - Gold colors (#d4af37)
  - Dark backgrounds
  - Luxury styling

- **Responsive Design:** Mobile-first approach

---

### **Public Assets**

#### `frontend/public/file.svg`
**What it does:** File icon SVG

#### `frontend/public/globe.svg`
**What it does:** Globe icon SVG

#### `frontend/public/next.svg`
**What it does:** Next.js logo SVG

#### `frontend/public/vercel.svg`
**What it does:** Vercel logo SVG

#### `frontend/public/window.svg`
**What it does:** Window icon SVG

---

### **Documentation Files**

#### `frontend/README.md`
**What it does:** Frontend-specific README
- Frontend setup instructions
- Component documentation
- Development guide

---

## 📊 Summary Statistics

- **Total Files:** 100+
- **Backend Files:** 30+
- **Frontend Files:** 50+
- **Configuration Files:** 10+
- **Documentation Files:** 10+

### **File Types:**
- **TypeScript Files:** 40+
- **React Components:** 15+
- **Service Files:** 6
- **Route Files:** 5
- **Controller Files:** 2
- **Model Files:** 2
- **Configuration Files:** 8
- **Documentation Files:** 10+

---

## 🎯 Key File Relationships

### **Authentication Flow:**
1. User registers → `auth.controller.ts` → Creates user → Returns JWT
2. Frontend stores token → `auth-store.ts` → localStorage
3. API requests → `api.ts` → Adds token to headers
4. Protected routes → `auth.middleware.ts` → Verifies token

### **File Upload Flow:**
1. User selects files → `upload/page.tsx`
2. AI categorizes → `ai-categorizer.ts` → MobileNet model
3. Files uploaded → `upload.routes.ts` → Multer
4. Files organized → `storage.service.ts` → Creates folders
5. Analytics tracked → `analytics.service.ts` → Records event

### **Payment Flow:**
1. User clicks upgrade → `pricing/page.tsx`
2. Creates order → `payment.controller.ts` → Razorpay
3. User pays → Razorpay gateway
4. Verifies payment → `payment.controller.ts` → Signature check
5. Upgrades user → `auth.controller.ts` → Updates subscription

---

## 🔍 File Purpose Summary

### **Backend Purpose:**
- **server.ts** - Application entry point
- **controllers/** - Request/response handling
- **services/** - Business logic
- **routes/** - API endpoint definitions
- **middleware/** - Authentication, validation
- **models/** - Database schemas
- **config/** - Configuration (database, etc.)

### **Frontend Purpose:**
- **app/** - Next.js pages (routes)
- **components/** - Reusable React components
- **lib/** - Utilities, stores, API client
- **public/** - Static assets
- **Configuration files** - Build, TypeScript, Tailwind setup

---

This comprehensive summary covers every file in the Algovengers project, explaining what each file does and how it contributes to the overall system.



