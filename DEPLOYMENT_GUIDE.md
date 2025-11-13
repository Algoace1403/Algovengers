# 🚀 Deployment Guide - Algovengers

## Quick Deployment Options

### ⚡ **FASTEST (Recommended for Demo):**
- **Frontend:** Vercel (Free, 2 minutes)
- **Backend:** Render.com (Free, 5 minutes)

### 🎯 **Total Time:** ~10 minutes to deploy everything!

---

## 📦 **Part 1: Deploy Backend (Render.com)**

### Step 1: Prepare Backend for Deployment

Create a `render.yaml` file:

**File:** `backend/render.yaml`

```yaml
services:
  - type: web
    name: algovengers-backend
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5001
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 7d
      - key: CORS_ORIGIN
        sync: false
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (free)
3. Click **"New +"** → **"Web Service"**

### Step 3: Connect Repository

Option A - **If you have GitHub repo:**
1. Select your repository
2. Choose `backend` directory
3. Click "Connect"

Option B - **If NO GitHub repo (Quick Deploy):**
1. We'll use Render's manual deployment
2. Skip to Step 4

### Step 4: Configure Render

**Settings:**
- **Name:** algovengers-backend
- **Environment:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Instance Type:** Free

**Environment Variables:**
```
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### Step 5: Deploy

Click **"Create Web Service"**

Wait 3-5 minutes for deployment...

**Your backend URL:** `https://algovengers-backend.onrender.com`

✅ **Save this URL!** You'll need it for frontend.

---

## 🎨 **Part 2: Deploy Frontend (Vercel)**

### Step 1: Prepare Frontend

Update environment variables:

**File:** `frontend/.env.production`

```bash
NEXT_PUBLIC_API_URL=https://algovengers-backend.onrender.com/api
NEXT_PUBLIC_STORAGE_URL=https://algovengers-backend.onrender.com/storage
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub (free)
3. Click **"Add New..."** → **"Project"**

### Step 3: Import Project

**If you have GitHub repo:**
1. Select your repository
2. Choose `frontend` directory
3. Click "Import"

**If NO GitHub repo:**
1. Install Vercel CLI
2. Use manual deployment (see Alternative Method below)

### Step 4: Configure Vercel

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `frontend`

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://algovengers-backend.onrender.com/api
NEXT_PUBLIC_STORAGE_URL=https://algovengers-backend.onrender.com/storage
```

### Step 5: Deploy

Click **"Deploy"**

Wait 2-3 minutes...

**Your frontend URL:** `https://algovengers.vercel.app`

✅ **Done!** Your app is live!

---

## 🔄 **Update Backend CORS**

After frontend deploys, update backend:

1. Go to Render.com dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://algovengers.vercel.app
   ```
5. Click **"Save Changes"**
6. Backend will redeploy automatically

---

## 🎯 **Alternative: Deploy Without GitHub**

### Using Vercel CLI (Frontend):

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd "/Users/aks/Desktop/OSC hackathon2/frontend"
vercel --prod

# Follow prompts:
# - Login with email
# - Set project name
# - Configure as Next.js
# - Add environment variables when prompted
```

### Using Render CLI (Backend):

```bash
# Install Render CLI
brew install render  # macOS

# Deploy backend
cd "/Users/aks/Desktop/OSC hackathon2/backend"
render deploy

# Follow prompts
```

---

## 📋 **Quick Deployment Checklist**

### Backend (Render):
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Configure Node environment
- [ ] Set environment variables
- [ ] Deploy and get URL
- [ ] Test: `curl https://your-backend.onrender.com`

### Frontend (Vercel):
- [ ] Create Vercel account
- [ ] Import project
- [ ] Set environment variables (backend URL)
- [ ] Deploy and get URL
- [ ] Test: Open in browser

### Final Steps:
- [ ] Update backend CORS_ORIGIN with frontend URL
- [ ] Test login/register
- [ ] Test file upload
- [ ] Test dashboard

---

## 🌐 **Alternative Platforms**

### If Render/Vercel Don't Work:

**Backend Options:**
1. **Railway.app** - Similar to Render, free tier
2. **Heroku** - Classic, but paid now
3. **DigitalOcean App Platform** - $5/month
4. **AWS Elastic Beanstalk** - Free tier (complex)

**Frontend Options:**
1. **Netlify** - Similar to Vercel, free tier
2. **Cloudflare Pages** - Free, fast
3. **GitHub Pages** - Free, static only
4. **Firebase Hosting** - Free tier

---

## 🐛 **Common Deployment Issues**

### Issue 1: Backend Build Fails

**Error:** `Cannot find module typescript`

**Fix:** Add to `backend/package.json`:
```json
"devDependencies": {
  "typescript": "^5.9.3",
  "ts-node": "^10.9.2"
}
```

### Issue 2: Frontend Can't Connect to Backend

**Error:** `Network Error` or `CORS`

**Fix:**
1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Check `CORS_ORIGIN` in Render environment variables
3. Make sure both URLs match exactly

### Issue 3: Environment Variables Not Working

**Fix:**
1. Redeploy after adding variables
2. Use `NEXT_PUBLIC_` prefix for frontend variables
3. Check variable names (case-sensitive)

---

## ✅ **Verify Deployment**

### Backend Health Check:
```bash
curl https://your-backend.onrender.com/api/health
```

### Frontend Test:
1. Open `https://your-frontend.vercel.app`
2. See animated gradient background ✨
3. Try registering a new account
4. Upload a file
5. Check dashboard

---

## 💰 **Cost Breakdown**

### Free Tier (Perfect for Demo):
- **Vercel Frontend:** Free (100GB bandwidth/month)
- **Render Backend:** Free (750 hours/month)
- **Total Cost:** $0/month 🎉

### Limitations:
- Backend sleeps after 15 min inactivity (wakes up in ~30s)
- 100GB bandwidth limit
- No custom domain (can add for ~$10/year)

### Paid Tier (If Scaling):
- **Vercel Pro:** $20/month
- **Render Starter:** $7/month
- **Total:** $27/month

---

## 🚀 **Final Deployment URLs**

After deployment, you'll have:

**Frontend:** https://algovengers.vercel.app
**Backend:** https://algovengers-backend.onrender.com

**Share these URLs with judges!** 🎉

---

## 🎯 **For Your Hackathon Demo**

### Demo Flow:
1. **Show live URL** to judges
2. **Register account** on the spot
3. **Upload files** with AI categorization
4. **Show dashboard** with organized files
5. **Highlight animations** and smooth UX

### Backup Plan:
- Have **localhost version** running as backup
- Take **screenshots** in case of network issues
- Record **demo video** beforehand

---

## 📞 **Need Help?**

### Deployment Support:
- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Vercel Discord:** https://vercel.com/discord
- **Render Community:** https://community.render.com

---

## 🎉 **You're Ready to Deploy!**

Choose your method:
1. **Quick Deploy** - Vercel + Render (10 minutes)
2. **CLI Deploy** - Use terminal commands (5 minutes)
3. **Manual Deploy** - GitHub → Platform (15 minutes)

**Start with Backend first, then Frontend!**

Good luck! 🚀
