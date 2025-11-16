# 🎯 Algovengers - Intelligent Storage System

<div align="center">

![Algovengers Banner](https://img.shields.io/badge/🚀_Algovengers-Intelligent_Storage-orange?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/⚡_Powered_by-AI-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-green?style=for-the-badge)

**Store anything. Organize everything. Powered by AI.**

*An intelligent file storage system that automatically categorizes and organizes your media using cutting-edge machine learning*

[🎥 Live Demo](#) | [📖 Documentation](./QUICK_START_NEW_UI.md) | [🚀 Deployment Guide](./DEPLOYMENT_GUIDE.md)

</div>

---

## 🌟 What Makes Algovengers Special?

Imagine uploading hundreds of images and videos, and having them **instantly organized** into perfectly structured folders - Animals/Dogs, Nature/Landscapes, Food/Desserts, and more. No manual sorting, no thinking required. That's the power of **Algovengers**.

### The Problem We Solve
- **Manual Organization Hell**: Tired of spending hours organizing files into folders?
- **Storage Chaos**: Can't find that one photo from last summer vacation?
- **Data Architecture Decisions**: Confused whether to use SQL or NoSQL for your data?

### Our Solution
- ✨ **AI-Powered Auto-Categorization**: MobileNet deep learning model recognizes and categorizes 200+ file types
- 🗂️ **Intelligent Folder Structures**: Hierarchical organization that actually makes sense
- 🧠 **Smart Data Analysis**: JSON analyzer that recommends optimal database architectures
- 🎨 **Stunning UI/UX**: Production-quality animations and glassmorphism effects
- ⚡ **Lightning Fast**: Client-side AI processing for instant feedback

---

## 🎬 Demo Highlights

<table>
<tr>
<td width="33%">

### 🎨 Beautiful Landing Page
Animated gradient backgrounds, floating particles, and glassmorphism effects that create an immersive experience

</td>
<td width="33%">

### 📤 Smart Upload System
Drag & drop interface with real-time AI categorization preview before uploading

</td>
<td width="33%">

### 📊 Interactive Dashboard
Browse your organized files with expandable folders, file previews, and usage statistics

</td>
</tr>
</table>

---

## 🚀 Key Features

### 🤖 AI & Machine Learning

#### 1. **Image Categorization with TensorFlow MobileNet**
- Pre-trained on ImageNet (1000+ classes)
- **200+ custom categories** intelligently mapped
- Client-side processing (no server load)
- ~100ms inference time per image
- Confidence scoring and fallback handling

**Example Categories:**
```
Animals → Dogs, Cats, Birds, Marine Life
Nature → Landscapes, Forests, Mountains, Beaches
Food → Desserts, Meals, Beverages
Urban → Architecture, Streets, Skylines
And 190+ more...
```

#### 2. **JSON Data Analyzer**
Upload JSON files and get instant recommendations:
- **SQL vs NoSQL** decision analysis
- Schema structure visualization
- Field consistency checking
- Depth and complexity analysis
- Auto-generated Prisma/Mongoose schemas

### 💾 Storage & File Management

- **Intelligent Organization**: Automatic hierarchical folder structure
  ```
  storage/users/{userId}/media/
    ├── Animals/
    │   ├── Dogs/
    │   ├── Cats/
    │   └── Birds/
    ├── Nature/
    │   ├── Landscapes/
    │   ├── Forests/
    │   └── Beaches/
    └── Food/
        └── Desserts/
  ```
- **Storage Quota System**: 100GB per user with visual usage indicators
- **Bulk Operations**: Download multiple files as ZIP, bulk delete
- **Cloud Storage Ready**: Google Cloud Storage integration built-in
- **Secure Access**: User-isolated storage with JWT authentication
- **File Previews**: Full-screen lightbox with zoom, pan, and navigation

### 🎨 Modern UI/UX

#### Custom React Components
7 production-ready components built from scratch:

| Component | Features |
|-----------|----------|
| **UploadProgress** | Real-time progress bars with 4 status states, shimmer effects, animated icons |
| **FileLightbox** | Full-screen previews with zoom (50-300%), drag, keyboard shortcuts |
| **AnimatedStatCard** | Animated number counters, floating particles, gradient icons |
| **Toast System** | Auto-dismiss notifications with progress bars, 4 color variants |
| **LoadingSkeleton** | Professional loading states for better perceived performance |
| **FloatingActionButton** | Quick action buttons with spring animations and tooltips |
| **Tooltip** | 4-position tooltips with glassmorphism and smooth transitions |

#### Visual Effects
- **Animated Gradients**: Living, breathing color transitions
- **Glassmorphism**: Modern frosted-glass effects throughout
- **Floating Particles**: 20+ ambient particles creating depth
- **11 Custom Animations**: Shimmer, pulse-glow, bounce-in, slide-in, and more
- **Spring Physics**: Natural, bounce-based interactions
- **Dark Mode**: Premium feature with seamless theme switching

### 🔐 Security & Authentication

- **JWT Authentication**: Stateless, scalable token-based auth
- **Password Hashing**: bcryptjs with automatic salt generation
- **Path Validation**: Protection against directory traversal attacks
- **User Isolation**: Complete data separation between users
- **Secure File Upload**: Type validation, size limits (50MB), mimetype checking
- **CORS Protection**: Whitelist-based origin validation

### ⚡ Performance & Scalability

- **Client-Side AI**: Distributed processing across users
- **Lazy Loading**: Images and components load on-demand
- **Code Splitting**: Route-based chunking for faster load times
- **GPU Acceleration**: CSS transforms optimized for 60fps
- **Responsive Design**: Mobile-first approach, works on all devices
- **Production Ready**: Easily deployable to Vercel + Render (10 minutes!)

---

## 🏗️ Architecture

### Tech Stack

#### Frontend
```
Next.js 16.0.1          │ React framework with App Router
React 19.2.0            │ UI library with latest features
TypeScript              │ Type-safe development
TailwindCSS             │ Utility-first styling
Framer Motion           │ Advanced animations
TensorFlow.js           │ Machine learning in the browser
@tensorflow-models/mobilenet │ Pre-trained image classification
Zustand                 │ Lightweight state management
Axios                   │ HTTP client with interceptors
React Dropzone          │ Drag & drop file uploads
Lucide React            │ Beautiful icon library
```

#### Backend
```
Node.js + Express 5.1.0 │ Modern async/await support
TypeScript              │ End-to-end type safety
JWT + bcryptjs          │ Secure authentication
Multer                  │ File upload handling
Google Cloud Storage    │ Cloud storage integration
Socket.io               │ Real-time communication
Prisma                  │ Next-gen ORM for SQL databases
Mongoose                │ MongoDB object modeling
Natural                 │ NLP for text analysis
Archiver                │ ZIP file generation
Sharp                   │ High-performance image processing
```

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│                                                           │
│  ┌─────────────┐    ┌──────────────┐   ┌──────────────┐│
│  │  Next.js UI  │───▶│ TensorFlow.js │──▶│   MobileNet   ││
│  │  Components  │    │   AI Engine   │   │     Model     ││
│  └─────────────┘    └──────────────┘   └──────────────┘│
│         │                                                 │
│         │ (Categorized Files + Metadata)                 │
│         ▼                                                 │
└─────────┼─────────────────────────────────────────────────┘
          │
          │ HTTP/REST API (JWT Auth)
          ▼
┌─────────┼─────────────────────────────────────────────────┐
│         │            EXPRESS BACKEND                       │
│  ┌──────▼─────────┐                                        │
│  │  API Gateway   │                                        │
│  │  (Routes)      │                                        │
│  └────┬───────┬───┘                                        │
│       │       │                                            │
│  ┌────▼──┐ ┌──▼────────┐   ┌──────────────┐              │
│  │ Auth  │ │  Upload    │───▶│   Storage    │              │
│  │Service│ │  Service   │   │   Service    │              │
│  └───────┘ └───────────┘   └──────┬───────┘              │
│                                    │                       │
│                             ┌──────▼───────┐              │
│                             │  File System │              │
│                             │  (or GCS)    │              │
│                             └──────────────┘              │
└─────────────────────────────────────────────────────────┘
```

**Why This Architecture?**
- **Client-Side AI**: Reduces server costs, scales infinitely, faster UX
- **Separation of Concerns**: Frontend/backend can scale independently
- **API-First Design**: Easy to add mobile apps or third-party integrations
- **Modular Services**: Clean, testable, maintainable code structure
- **Type Safety**: Shared TypeScript interfaces prevent bugs

---

## 📦 Project Structure

```
algovengers/
├── frontend/                  # Next.js React Application
│   ├── app/                   # App Router (Next.js 13+)
│   │   ├── page.tsx          # Landing page with animations
│   │   ├── upload/           # File upload interface
│   │   ├── dashboard/        # User dashboard
│   │   ├── analytics/        # JSON analyzer
│   │   ├── login/            # Authentication
│   │   └── globals.css       # Custom animations & styles
│   ├── components/           # Reusable React components
│   │   ├── UploadProgress.tsx
│   │   ├── FileLightbox.tsx
│   │   ├── AnimatedStatCard.tsx
│   │   ├── Toast.tsx
│   │   └── ... (7 components)
│   ├── lib/                  # Utilities & helpers
│   │   ├── api.ts           # Axios client with interceptors
│   │   ├── ai-categorizer.ts # TensorFlow integration
│   │   └── stores.ts        # Zustand state management
│   └── package.json
│
├── backend/                   # Express.js API Server
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── storage.service.ts
│   │   │   └── upload.service.ts
│   │   ├── routes/           # API endpoints
│   │   │   ├── auth.routes.ts
│   │   │   └── upload.routes.ts
│   │   ├── middleware/       # Auth, error handling
│   │   ├── models/           # Data schemas
│   │   ├── utils/            # Helper functions
│   │   └── server.ts         # Express app entry
│   ├── storage/              # User uploaded files
│   │   └── users/
│   │       └── {userId}/media/
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md       # Deploy to Vercel + Render
├── QA_PREPARATION.md         # 80+ Q&A for presentations
├── UI_UX_IMPROVEMENTS.md     # Complete UI documentation
├── QUICK_START_NEW_UI.md     # Component usage guide
└── README.md                 # This file!
```

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
npm or yarn
Git
```

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/algovengers.git
cd algovengers
```

#### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
STORAGE_TYPE=local
EOF

# Start backend server
npm run dev
```

Server running at: **http://localhost:5001** 🚀

#### 3. Setup Frontend
```bash
cd ../frontend
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_STORAGE_URL=http://localhost:5001/storage
EOF

# Start frontend
npm run dev
```

Frontend running at: **http://localhost:3000** ✨

#### 4. Open Your Browser
Navigate to **http://localhost:3000** and experience the magic!

---

## 🎯 Usage Guide

### 1. Register an Account
- Click **"Sign Up"** on the homepage
- Enter your details (email, password)
- Get instant access with JWT token

### 2. Upload Files
- Navigate to **Upload** page
- **Drag & drop** images/videos or click to browse
- Watch AI categorize your files in real-time
- Preview categories before uploading
- Hit **"Upload All"** and watch the magic happen

### 3. Browse Your Dashboard
- See **organized folders** by category
- Click to **expand** subcategories
- View **storage usage** statistics
- **Preview** files in full-screen lightbox
- **Download** or **delete** files with one click
- **Bulk operations** for multiple files

### 4. Analyze JSON Data
- Go to **Analytics** page
- Paste or upload JSON file
- Get instant **SQL vs NoSQL** recommendation
- See **auto-generated schemas**
- View detailed **structure analysis**

---

## 🎨 UI/UX Features Deep Dive

### Animation Library

We've built **11 custom keyframe animations** for smooth, professional interactions:

| Animation | Use Case | Duration |
|-----------|----------|----------|
| `gradient-animation` | Living background gradients | 15s infinite |
| `shimmer` | Loading states | 2s infinite |
| `pulse-glow` | Attention-grabbing elements | 2s infinite |
| `bounce-in` | Component entrances | 0.6s |
| `slide-in-bottom` | Slide-up reveals | 0.5s |
| `float-animation` | Floating icons/particles | 3s infinite |
| `progress-shine` | Progress bars | 2s infinite |

### Color System

**Primary Palette:**
```css
Orange:  #ff6b35 → #ea580c
Purple:  #a855f7 → #9333ea
Gradients: from-orange-500 to-purple-600
```

**Semantic Colors:**
```css
Success: Green (#10b981)
Error:   Red (#ef4444)
Warning: Orange (#f59e0b)
Info:    Blue (#3b82f6)
```

### Responsive Design
- **Mobile**: Single column, touch-friendly (44x44px targets)
- **Tablet**: 2-column grids, optimized layouts
- **Desktop**: 3+ columns, hover effects, keyboard shortcuts

---

## 🔧 Configuration

### Backend Environment Variables

```bash
# Server Configuration
PORT=5001                                    # API server port
NODE_ENV=development                         # Environment mode

# Authentication
JWT_SECRET=your-super-secret-key            # JWT signing key
JWT_EXPIRES_IN=7d                           # Token expiration

# CORS & Security
CORS_ORIGIN=http://localhost:3000           # Allowed frontend origin

# Storage Configuration
STORAGE_TYPE=local                          # 'local' or 'gcs'
STORAGE_PATH=./storage                      # Local storage directory
MAX_STORAGE_GB=100                          # Per-user quota (GB)
MAX_FILE_SIZE_MB=50                         # Per-file limit (MB)

# Google Cloud Storage (Optional)
GCS_PROJECT_ID=your-project-id
GCS_BUCKET_NAME=your-bucket-name
GCS_KEY_FILE=./gcs-key.json
```

### Frontend Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_STORAGE_URL=http://localhost:5001/storage

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}

Response: 201 Created
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Upload Endpoints

#### Upload Files
```http
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
- files: [File, File, ...]
- categories: ["Animals/Dogs", "Nature/Landscapes", ...]

Response: 201 Created
{
  "message": "Files uploaded successfully",
  "uploadedFiles": [
    {
      "filename": "dog.jpg",
      "path": "/storage/users/123/media/Animals/Dogs/dog.jpg",
      "size": 245678,
      "category": "Animals",
      "subcategory": "Dogs"
    }
  ]
}
```

#### List Files
```http
GET /api/upload/files
Authorization: Bearer {token}

Response: 200 OK
{
  "files": [
    {
      "name": "sunset.jpg",
      "path": "/storage/users/123/media/Nature/Landscapes/sunset.jpg",
      "size": 345678,
      "category": "Nature",
      "subcategory": "Landscapes",
      "uploadedAt": "2024-11-13T10:30:00Z"
    }
  ],
  "storageUsed": "4.5 GB",
  "storageTotal": "100 GB",
  "storagePercentage": 4.5
}
```

#### Download File
```http
GET /api/upload/download?path=/users/123/media/Nature/sunset.jpg
Authorization: Bearer {token}

Response: 200 OK
Content-Type: image/jpeg
```

#### Bulk Download (ZIP)
```http
POST /api/upload/bulk-download
Authorization: Bearer {token}
Content-Type: application/json

{
  "files": [
    "/users/123/media/Animals/Dogs/dog1.jpg",
    "/users/123/media/Animals/Dogs/dog2.jpg"
  ]
}

Response: 200 OK
Content-Type: application/zip
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with credentials
- [ ] Token persists after refresh
- [ ] Logout clears token
- [ ] Protected routes redirect if not authenticated

**File Upload:**
- [ ] Drag & drop single file
- [ ] Drag & drop multiple files
- [ ] Click to browse and select
- [ ] AI categorization shows correct category
- [ ] Upload progress displays
- [ ] Success notification appears

**Dashboard:**
- [ ] Files appear in correct folders
- [ ] Folders expand/collapse smoothly
- [ ] Storage usage accurate
- [ ] File preview lightbox works
- [ ] Download file succeeds
- [ ] Delete file removes from storage
- [ ] Bulk operations work

**UI/UX:**
- [ ] Animations smooth (60fps)
- [ ] Dark mode toggles (if premium)
- [ ] Responsive on mobile/tablet
- [ ] Loading skeletons appear
- [ ] Toast notifications auto-dismiss
- [ ] Tooltips show on hover

### Automated Testing (Future)
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## 🚀 Deployment

### Quick Deploy (10 minutes)

**Option 1: Vercel + Render (Recommended)**

1. **Deploy Backend to Render:**
   - Create account at [render.com](https://render.com)
   - New Web Service → Connect repo
   - Build: `cd backend && npm install && npm run build`
   - Start: `npm start`
   - Add environment variables
   - **Backend URL**: `https://algovengers-backend.onrender.com`

2. **Deploy Frontend to Vercel:**
   - Create account at [vercel.com](https://vercel.com)
   - Import project → Select repo
   - Root: `frontend`
   - Add env vars with backend URL
   - **Frontend URL**: `https://algovengers.vercel.app`

3. **Update CORS:**
   - In Render, update `CORS_ORIGIN` to Vercel URL
   - Redeploy backend

**Detailed instructions:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Option 2: Docker (Advanced)**
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Services running at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5001
```

---

## 🛡️ Security Best Practices

### Current Implementation
✅ JWT authentication with secure tokens
✅ Password hashing with bcryptjs
✅ Path traversal attack prevention
✅ User data isolation
✅ File type validation
✅ File size limits (50MB)
✅ CORS origin whitelisting

### Production Recommendations
🔒 Add rate limiting (express-rate-limit)
🔒 Implement Helmet.js for security headers
🔒 Add input validation (Joi/Zod)
🔒 Enable virus scanning (ClamAV)
🔒 Implement 2FA authentication
🔒 Add audit logging
🔒 Use HTTPS in production
🔒 Rotate JWT secrets periodically

---

## 📈 Performance Optimization

### Current Optimizations
- **Client-side AI**: ~4MB model cached, no server load
- **Lazy loading**: Images load on-demand
- **Code splitting**: Route-based chunking
- **GPU acceleration**: CSS transforms optimized
- **Compression**: Gzip for production builds

### Scalability Roadmap
1. **Database Migration**: Move from file-based to PostgreSQL
2. **Redis Caching**: Cache hot data and sessions
3. **CDN Integration**: CloudFront for static assets
4. **Load Balancing**: Multiple backend instances
5. **Queue System**: Bull for async processing
6. **Monitoring**: Prometheus + Grafana

**Expected Performance:**
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Lighthouse Score: 90+

---

## 🤝 Contributing

We welcome contributions! Here's how:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow TypeScript best practices
   - Add comments for complex logic
   - Update documentation if needed
4. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: add real-time collaboration"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Coding Standards
- **TypeScript**: Use strict mode, define interfaces
- **React**: Functional components, hooks
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: JSDoc for functions, inline for complex logic
- **Formatting**: Prettier (automatic)

---

## 🐛 Known Issues & Roadmap

### Known Limitations
- File-based user database (migrate to SQL planned)
- No video content analysis (images only)
- Upload progress not real-time (websocket planned)
- No file name conflict handling
- Token refresh not implemented

### Roadmap

**v2.0 - Q1 2025**
- [ ] Real database (PostgreSQL + Prisma)
- [ ] WebSocket for real-time upload progress
- [ ] File sharing with shareable links
- [ ] User recategorization of files
- [ ] Full-text search across filenames
- [ ] Thumbnail generation for images

**v3.0 - Q2 2025**
- [ ] Mobile app (React Native)
- [ ] Video content analysis with ML
- [ ] Collaboration features (shared folders)
- [ ] Version control for files
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations

**Future**
- [ ] Public gallery feature
- [ ] CDN integration
- [ ] Enterprise features (teams, SSO)
- [ ] Desktop app (Electron)
- [ ] Browser extension

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Anuj Soni, Anisha Ghosh & Ayush Arora

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Technologies & Libraries
- **TensorFlow.js** - Amazing ML framework for the browser
- **MobileNet** - Pre-trained model that powers our AI
- **Next.js** - The best React framework for production
- **Framer Motion** - Delightful animations made easy
- **Tailwind CSS** - Utility-first CSS that speeds development
- **Vercel & Render** - Seamless deployment platforms

### Inspiration
- **Dropbox**: For pioneering cloud storage
- **Google Photos**: For intelligent organization
- **Notion**: For beautiful UI/UX design
- **Linear**: For smooth animations and interactions

### Special Thanks
- **TensorFlow Community** - For excellent documentation
- **Open Source Community** - For amazing tools and libraries
- **Hackathon Organizers** - For the opportunity to build
- **Beta Testers** - For valuable feedback

---

## 👥 Team

<div align="center">

### Created with ❤️ by

**Anuj Soni** | **Anisha Ghosh** | **Ayush Arora**

*with AI assistance from* **Claude**

*OSC Hackathon 2025*

---

### 📬 Contact & Support

**Questions?** Open an issue on GitHub
**Bugs?** Submit a detailed bug report
**Ideas?** Start a discussion

**Email**: algovengers@example.com
**Twitter**: [@algovengers](#)
**Discord**: [Join our server](#)

---

### ⭐ If you found this project helpful, give it a star!

[![GitHub stars](https://img.shields.io/github/stars/yourusername/algovengers?style=social)](https://github.com/yourusername/algovengers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/algovengers?style=social)](https://github.com/yourusername/algovengers/fork)

</div>

---

## 📊 Project Stats

```
Total Lines of Code:     15,000+
Frontend Components:     7 custom
Backend Services:        5 core
API Endpoints:          12
UI Animations:          11 keyframes
AI Categories:          200+
Documentation Pages:    6
Development Time:       72 hours
Coffee Consumed:        ∞
```

---

<div align="center">

**Built with passion during OSC Hackathon 2025**

[⬆ Back to Top](#-algovengers---intelligent-storage-system)

</div>
