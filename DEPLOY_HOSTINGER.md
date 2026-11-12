# Hostinger Deployment Guide for Shree TBTC Website

This document explains how to deploy your Next.js website to **Hostinger Premium Hosting / VPS** securely, keeping your database credentials and API keys fully protected.

---

## 🔒 Security First: Keeping API Keys Hidden
All credentials (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, SMTP credentials) are stored inside your private `.env` file on the server.
* `.env` is listed in `.gitignore` and must **NEVER** be committed to public Git repositories.
* When deploying on Hostinger, create this `.env` file directly inside your application folder on Hostinger.

---

## 🛠️ Step 1: Create your `.env` file on Hostinger
When you set up your Node.js application folder on Hostinger (usually under `/home/username/public_html` or similar), create a file named `.env` in the root of that project folder and fill in your values (see `.env.example`):

```env
DATABASE_URL="postgresql://username:password@your-database-host:6543/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://username:password@your-database-host:5432/postgres?sslmode=require"
JWT_SECRET="your_long_random_secret_key"
NODE_ENV="production"

# Optional: SMTP Configuration for instant inquiries & quote delivery to sales@stbtcgi.com
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT=465
SMTP_USER="sales@stbtcgi.com"
SMTP_PASS="your_email_password"
SMTP_FROM="Shree TBTC Global Industries <sales@stbtcgi.com>"
SALES_NOTIFICATION_EMAIL="sales@stbtcgi.com"
```

---

## 🚀 Step 2: Deploying to Hostinger

### Option A: Using Hostinger Node.js Dashboard (hPanel)
1. In Hostinger hPanel, go to **Websites** -> **Node.js**:
   * Set Node.js version to **v20** or **v22**.
   * Set **Application Root** to your project folder.
   * Set **Application Startup File** to `server.js` (or `node_modules/next/dist/bin/next` with argument `start`).
2. Upload your website files (excluding `node_modules` and `.next`).
3. Upload your `.env` file with your credentials.
4. Click **NPM Install** in hPanel.
5. In terminal or hPanel console, run:
   ```bash
   npx prisma generate
   npm run build
   ```
6. Click **Restart Application** in hPanel.

### Option B: Using Hostinger VPS with PM2 (Fastest & Maximum Performance)
1. SSH into your VPS:
   ```bash
   cd /var/www/tbtc-website
   ```
2. Upload or clone the code, and create your `.env` file.
3. Install dependencies and build:
   ```bash
   npm install
   npx prisma generate
   npm run build
   ```
4. Start with PM2:
   ```bash
   pm2 start npm --name "tbtc-website" -- start
   pm2 save
   pm2 startup
   ```

---

## ⚡ Performance & Self-Hosted Storage
* **Self-Hosted Storage**: All images, brochures, and catalogues uploaded via the Admin panel are saved directly to `public/uploads/` on your server and mirrored in the database.
* **Super Fast**: Assets are served directly with immutable HTTP caching headers.
* **Supabase 24x7 Keep-Alive**: The built-in `/api/health` route automatically keeps the Supabase PostgreSQL connection active so your free database never pauses!
