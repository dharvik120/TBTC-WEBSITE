# Hostinger Deployment Guide for Shree TBTC Website

This document explains how to deploy your Next.js website to **Hostinger** securely, keeping your database and Cloudinary keys fully hidden from the public Git repository.

---

## 🔒 Security First: Keeping API Keys Hidden
All credentials (`DATABASE_URL`, Cloudinary API Keys, etc.) are stored inside the `.env` file. 
* This file is listed in `.gitignore` and is **never** pushed to GitHub.
* When hosting on Hostinger, you will create/upload this `.env` file directly to your server, where it remains 100% private.

---

## 🛠️ Step 1: Create your `.env` file on Hostinger
When you set up your Node.js application folder on Hostinger (usually under `/home/username/public_html` or similar), create a file named `.env` in the root of that project folder and paste the following content:

```env
DATABASE_URL="postgresql://postgres.mpiwhfhelhiyfgyfcsjo:kAcZgxzM1aNDtz9D@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://postgres.mpiwhfhelhiyfgyfcsjo:kAcZgxzM1aNDtz9D@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require"
JWT_SECRET="stbt_secret_key_12345_industrial_portal"
NODE_ENV="production"

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME="ye4tjvdy"
CLOUDINARY_API_KEY="565125531498358"
CLOUDINARY_API_SECRET="mvZpYJwJvGUEZ_Vv7ICLi93N_6c"
CLOUDINARY_URL="cloudinary://565125531498358:mvZpYJwJvGUEZ_Vv7ICLi93N_6c@ye4tjvdy"
```

---

## 🚀 Step 2: Deploying to Hostinger

### Option A: Using Hostinger VPS (Recommended & Most Flexible)
If you have a Hostinger Virtual Private Server (VPS) with Node.js installed:

1. **Clone the repository** to your VPS folder:
   ```bash
   git clone https://github.com/dharvik120/TBTC-WEBSITE.git
   cd TBTC-WEBSITE
   ```
2. **Create the `.env` file** (as shown in Step 1) inside this directory.
3. **Install dependencies and build the app**:
   ```bash
   npm install
   npm run build
   ```
4. **Start the application** using PM2 to keep it running forever in the background:
   ```bash
   npm install -g pm2
   pm2 start npm --name "tbtc-website" -- start
   pm2 save
   pm2 startup
   ```

---

### Option B: Using Hostinger hPanel Node.js Dashboard (Shared/Cloud Startup)
If you are using Hostinger Shared Node.js hosting:

1. **Upload the build files**:
   * Zip the codebase (excluding `node_modules` and `.next`).
   * Upload and extract it inside Hostinger File Manager in your app directory.
2. **Create the `.env` file** (as shown in Step 1) in the File Manager inside the root folder.
3. **Go to Hostinger Node.js Dashboard**:
   * Select Node.js version **18 or 20**.
   * Set **Document Root** to the folder where files are uploaded.
   * Set **App startup file** to `node_modules/next/dist/bin/next` and options to `start`.
4. **Install and Run**:
   * Click **NPM Install** in the Hostinger hPanel Node.js dashboard.
   * Click **Run Build** or execute `npm run build` using the Hostinger console.
   * Click **Start** to run the app.

---

## 🌐 Verification
Once deployed and connected to your domain, upload any image, PDF brochure, or Excel datasheet inside your admin panel. The files will upload directly to Cloudinary and display beautifully on the public website!
