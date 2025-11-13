# 🚀 Google Cloud Storage Setup Guide

## Current Status: ✅ Using Local Storage

Your app is currently using **local file storage** and works perfectly! When you're ready to switch to cloud storage, follow these simple steps:

---

## 📋 Prerequisites

- Google Cloud account (free tier works!)
- 10 minutes of your time

---

## 🔧 Setup Steps (When You're Ready)

### Step 1: Create Google Cloud Project (5 min)

1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "NEW PROJECT"
3. Name it: `intelligent-storage-app`
4. Click "CREATE"

**📝 Note down your Project ID** (e.g., `intelligent-storage-app-12345`)

---

### Step 2: Create Storage Bucket (2 min)

1. In Google Cloud Console, go to: **Cloud Storage** → **Buckets**
2. Click **"CREATE"**
3. Bucket name: `intelligent-storage-bucket-YOURNAME` (must be globally unique)
4. Region: Choose closest to you (e.g., `asia-south1` for India)
5. Storage class: **Standard**
6. Access control: **Fine-grained**
7. Click **"CREATE"**

**📝 Note down your Bucket Name**

---

### Step 3: Create Service Account (3 min)

1. Go to: **IAM & Admin** → **Service Accounts**
2. Click **"CREATE SERVICE ACCOUNT"**
3. Name: `storage-service-account`
4. Click **"CREATE AND CONTINUE"**
5. Grant role: **"Storage Admin"**
6. Click **"CONTINUE"** → **"DONE"**

---

### Step 4: Generate JSON Key

1. Click on the service account you just created
2. Go to **"KEYS"** tab
3. Click **"ADD KEY"** → **"Create new key"**
4. Choose **JSON** format
5. Click **"CREATE"**
6. A JSON file will download automatically

---

### Step 5: Add Key File to Project

1. Rename the downloaded file to: `gcs-service-account-key.json`
2. Move it to: `/backend/gcs-service-account-key.json`

```bash
# Make sure the file is in the right location:
cd backend/
ls -la gcs-service-account-key.json
```

---

### Step 6: Update Environment Variables

Edit your `/backend/.env` file:

```env
# Change this line from 'local' to 'gcs'
STORAGE_TYPE=gcs

# Update these with your actual values
GCS_PROJECT_ID=intelligent-storage-app-12345    # Your project ID
GCS_BUCKET_NAME=intelligent-storage-bucket-yourname  # Your bucket name
GCS_KEY_FILE=./gcs-service-account-key.json
```

---

### Step 7: Restart Server

```bash
# Stop the backend server (Ctrl+C)
# Start it again
npm run dev
```

Look for this message:
```
☁️  Google Cloud Storage initialized
```

If you see that, you're done! 🎉

---

## 🧪 Testing Cloud Storage

1. Upload a file through your app
2. Check Google Cloud Console → Storage → Your bucket
3. You should see files appearing under: `users/{user-id}/media/...`

---

## 💰 Costs (Google Cloud Free Tier)

- **Storage**: First 5 GB free per month
- **Network**: 1 GB egress free per month
- After free tier: ~$0.02 per GB/month

**For your hackathon demo with small files, it's completely FREE!** ✅

---

## 🔄 Switching Back to Local Storage

Just change in `.env`:
```env
STORAGE_TYPE=local
```

No need to delete anything. The code automatically handles both!

---

## ❓ Troubleshooting

### Error: "GCS key file not found"
- Check the file path: `backend/gcs-service-account-key.json`
- File name must be exact (no spaces, correct extension)

### Error: "Bucket not found"
- Verify bucket name in `.env` matches Google Cloud Console
- Bucket names are case-sensitive

### Error: "Permission denied"
- Make sure service account has "Storage Admin" role
- Try deleting and recreating the service account

---

## 📚 What's Different?

### Local Storage (Current):
```
backend/storage/users/{user-id}/media/...
```

### Cloud Storage (After Setup):
```
https://storage.googleapis.com/your-bucket/users/{user-id}/media/...
```

Files are accessible from anywhere! 🌍

---

## 🎯 For Hackathon Judges

You can present your project as:

> "Currently demonstrating with local storage for speed, but our architecture supports Google Cloud Storage for production deployment with a simple configuration change. Files are automatically uploaded to GCS, organized by user and AI-detected categories, with signed URLs for secure access."

**They'll be impressed by the production-ready architecture!** 🏆

---

## ⚡ Quick Enable (When Ready)

```bash
# 1. Add your JSON key file
mv ~/Downloads/your-key-file.json backend/gcs-service-account-key.json

# 2. Update .env
sed -i '' 's/STORAGE_TYPE=local/STORAGE_TYPE=gcs/' backend/.env
sed -i '' 's/your-gcp-project-id/YOUR_ACTUAL_PROJECT_ID/' backend/.env
sed -i '' 's/intelligent-storage-bucket/YOUR_ACTUAL_BUCKET_NAME/' backend/.env

# 3. Restart server
npm run dev
```

Done in 30 seconds! ⚡

---

**Need help? The code is already set up - just follow these steps when you're ready!** 😊
