# 🚀 Quick Start Guide - Algovengers

## Start Your Application in 2 Minutes

### Step 1: Start Backend (Terminal 1)
```bash
cd "/Users/aks/Desktop/OSC hackathon2/backend"
npm install  # Only needed first time
npm run dev
```
**Expected Output:** `Server running on http://localhost:5001`

---

### Step 2: Start Frontend (Terminal 2)
```bash
cd "/Users/aks/Desktop/OSC hackathon2/frontend"
npm install  # Only needed first time
npm run dev
```
**Expected Output:** `Ready on http://localhost:3000`

---

### Step 3: Open Your Browser
Navigate to: **http://localhost:3000**

---

## ✨ What You'll See

### Landing Page (http://localhost:3000)
- Animated gradient background with floating particles
- Glassmorphism hero section
- Feature showcase with animated cards
- Sign up / Login buttons

### Upload Page (http://localhost:3000/upload)
- Drag & drop file upload interface
- Real-time AI categorization preview
- Upload progress with animations
- Category suggestions before upload

### Dashboard (http://localhost:3000/dashboard)
- Organized file browser by category
- Expandable folder structure
- Storage usage statistics
- File preview lightbox
- Download & delete actions

### Analytics (http://localhost:3000/analytics)
- JSON data analyzer
- SQL vs NoSQL recommendations
- Auto-generated schemas
- Structure visualization

---

## 🎯 Quick Demo Flow

1. **Register:** Create an account (email + password)
2. **Upload:** Drag images to upload page
3. **Watch:** AI categorizes them automatically
4. **Browse:** View organized files in dashboard
5. **Preview:** Click any file for full-screen view
6. **Analyze:** Test JSON analyzer with sample data

---

## 🎨 UI/UX Highlights to Check

- ✨ Animated gradient backgrounds
- 🪟 Glassmorphism cards
- 📊 Animated statistics counters
- 🎭 Toast notifications
- 💫 Floating particles
- 🖼️ Full-screen lightbox with zoom
- 📈 Progress bars with shimmer
- ⚡ Smooth page transitions
- 🌙 Dark mode effects
- 📱 Responsive mobile design

---

## 🔧 Troubleshooting

### Port Already in Use?
**Backend (5001):**
```bash
lsof -ti:5001 | xargs kill -9
```

**Frontend (3000):**
```bash
lsof -ti:3000 | xargs kill -9
```

### Dependencies Not Installed?
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Environment Variables Missing?
They're already configured! Check:
- `backend/.env`
- `frontend/.env.local`

---

## 📸 Screenshot Your Best Features

**Must-Capture Screens:**
1. Landing page with animations
2. Upload page with file preview
3. Dashboard with organized folders
4. File lightbox in action
5. Analytics page with recommendations
6. Toast notifications
7. Mobile responsive view

---

**Ready to impress? Start the servers and visit http://localhost:3000 🚀**
