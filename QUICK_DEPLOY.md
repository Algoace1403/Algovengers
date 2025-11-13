# ⚡ QUICK DEPLOY - 3 Steps Only!

## 🚀 Deploy in 10 Minutes

### Step 1: Deploy Backend (5 min)

1. Go to **https://render.com**
2. Click **Sign Up** (use GitHub)
3. Click **New +** → **Web Service**
4. Click **"Build and deploy from a Git repository"**
5. Click **"Connect a repository"** (or skip if no GitHub)

**Configuration:**
```
Name: algovengers-backend
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

**Environment Variables** (click "Add Environment Variable"):
```
NODE_ENV = production
PORT = 5001
JWT_SECRET = hackathon-secret-key-2024-change-in-production
JWT_EXPIRES_IN = 7d
CORS_ORIGIN = *
```

6. Click **"Create Web Service"**
7. Wait 3-5 minutes for deployment
8. **Copy your backend URL:** `https://algovengers-backend-xxxx.onrender.com`

✅ Backend deployed!

---

### Step 2: Deploy Frontend (3 min)

1. Go to **https://vercel.com**
2. Click **Sign Up** (use GitHub)
3. Click **Add New...** → **Project**
4. Click **"Import"** (or skip if no GitHub)

**Configuration:**
```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
```

**Environment Variables:**
```
NEXT_PUBLIC_API_URL = https://your-backend-url.onrender.com/api
NEXT_PUBLIC_STORAGE_URL = https://your-backend-url.onrender.com/storage
```

**⚠️ IMPORTANT:** Replace `your-backend-url` with your actual Render backend URL from Step 1!

5. Click **"Deploy"**
6. Wait 2-3 minutes
7. **Copy your frontend URL:** `https://algovengers-xxxx.vercel.app`

✅ Frontend deployed!

---

### Step 3: Update CORS (1 min)

1. Go back to **Render.com** dashboard
2. Click your backend service
3. Click **Environment** tab
4. Find `CORS_ORIGIN` variable
5. Change from `*` to your Vercel URL: `https://algovengers-xxxx.vercel.app`
6. Click **"Save Changes"**
7. Backend will auto-redeploy (30 seconds)

✅ CORS configured!

---

## 🎉 You're Live!

**Your App:** https://algovengers-xxxx.vercel.app

### Test It:
1. ✅ Open the URL
2. ✅ See animated gradient background
3. ✅ Register a new account
4. ✅ Upload a file
5. ✅ Check dashboard

---

## 🔥 Alternative: CLI Deploy (Fastest!)

### Option A: Vercel CLI Only (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod

# Follow prompts - done in 2 minutes!
```

### Option B: Use Existing Hosting

If you already have hosting:

**Frontend build:**
```bash
cd frontend
npm run build
# Upload the .next folder + public folder
```

**Backend:**
```bash
cd backend
npm run build
# Upload dist folder + node_modules
```

---

## 📱 Share Your Demo

Once deployed, share with judges:

**Landing Page:**
https://your-app.vercel.app

**Key Features to Show:**
- 🌈 Animated gradient background
- ✨ AI-powered file categorization
- 📊 Interactive dashboard
- 🔮 Glassmorphism UI

---

## 🐛 Quick Troubleshooting

**Backend won't start?**
- Check environment variables are set
- Make sure `NODE_ENV=production`
- Check logs in Render dashboard

**Frontend can't connect?**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend
- Open browser console (F12) for errors

**Files not uploading?**
- Backend might be asleep (free tier sleeps after 15 min)
- First request wakes it up (~30 seconds)
- This is normal on free tier!

---

## 💡 Pro Tips

1. **Wake up backend before demo:** Visit backend URL 1 minute before presenting
2. **Test before demo:** Upload a file 5 minutes before
3. **Have backup:** Keep localhost running just in case
4. **Take screenshots:** In case network fails during demo

---

## ✅ Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] CORS updated with frontend URL
- [ ] Tested registration
- [ ] Tested file upload
- [ ] Tested dashboard
- [ ] URLs saved for demo

---

## 🎯 You're Ready!

Your Algovengers project is now **LIVE** and ready to impress judges! 🚀

**Good luck with your hackathon!** 🏆
