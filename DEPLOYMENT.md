# 🚀 FreshMarket Deployment Guide

This guide will walk you through deploying your Vendure e-commerce application.

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Vercel        │────────▶│   Railway       │────────▶│   Supabase      │
│  (Storefront)   │  API    │  (Vendure API)  │  DB     │  (PostgreSQL)   │
│  Next.js App    │         │  Node.js Server │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## Step 1: Deploy Server to Railway

### 1.1 Push Code to GitHub

Make sure your code is in a GitHub repository:

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit for deployment"

# Add your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/freshmarket.git
git push -u origin main
```

### 1.2 Create Railway Project

1. Go to https://railway.app and login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the `railway.toml` config

### 1.3 Set Environment Variables on Railway

Go to your Railway project → Variables tab, and add:

```env
# App Settings
APP_ENV=prod
PORT=3000

# Security (Generate new random strings!)
COOKIE_SECRET=your-random-secret-min-32-characters-long
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=your-secure-admin-password

# Database (Use your Supabase Connection Pooler settings)
DB_HOST=aws-1-eu-west-1.pooler.supabase.com
DB_PORT=6543
DB_USERNAME=postgres.kpmoildlrtvkpoennpsr
DB_PASSWORD=your-supabase-password
DB_DATABASE=postgres

# Optional: For migrations
DB_DIRECT_HOST=aws-1-eu-west-1.pooler.supabase.com
DB_DIRECT_PORT=5432
```

### 1.4 Deploy Server

1. Railway will auto-deploy when you push to GitHub
2. Wait for the deployment to complete
3. Railway will give you a URL like: `https://freshmarket-production.up.railway.app`
4. **Copy this URL** - you'll need it for the storefront

### 1.5 Run Migrations on Railway

To set up the database schema:

```bash
# Install Railway CLI (one time)
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npm run migrate
```

Or use Railway's dashboard:
1. Go to your project → "Shell" tab
2. Run: `npm run migrate`

---

## Step 2: Deploy Storefront to Vercel

### 2.1 Prepare Environment Variables

The storefront needs to know where your server is. Create a `.env.production` file:

```bash
# apps/storefront/.env.production
NEXT_PUBLIC_SITE_NAME=FreshMarket
NEXT_PUBLIC_SITE_URL=https://freshmarket.vercel.app
NEXT_PUBLIC_VENDURE_SHOP_API_URL=https://YOUR_RAILWAY_URL/shop-api
NEXT_PUBLIC_VENDURE_ADMIN_API_URL=https://YOUR_RAILWAY_URL/admin-api
```

Replace `YOUR_RAILWAY_URL` with the URL from Railway (e.g., `https://freshmarket-production.up.railway.app`)

### 2.2 Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com and login
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `apps/storefront`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
5. Add Environment Variables:
   - `NEXT_PUBLIC_SITE_NAME` = FreshMarket
   - `NEXT_PUBLIC_SITE_URL` = https://freshmarket.vercel.app
   - `NEXT_PUBLIC_VENDURE_SHOP_API_URL` = https://YOUR_RAILWAY_URL/shop-api
   - `NEXT_PUBLIC_VENDURE_ADMIN_API_URL` = https://YOUR_RAILWAY_URL/admin-api
6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd apps/storefront
vercel --prod
```

---

## Step 3: Post-Deployment Setup

### 3.1 Configure CORS on Vendure Server

After deployment, update your `vendure-config.ts` to allow requests from your Vercel domain:

```typescript
// apps/server/src/vendure-config.ts
export const config: VendureConfig = {
    // ... other config
    apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        cors: {
            origin: [
                'https://freshmarket.vercel.app',     // Your Vercel URL
                'https://www.freshmarket.vercel.app', // With www
                'http://localhost:3001',              // Local dev
            ],
            credentials: true,
        },
    },
    // ... rest of config
};
```

Then push and redeploy to Railway.

### 3.2 Add Products in Dashboard

1. Go to your Railway URL: `https://YOUR_RAILWAY_URL/dashboard`
2. Login with your superadmin credentials
3. Create Collections: Fruits, Vegetables, Meat, etc.
4. Add Products with images

---

## Environment Variables Summary

### Railway (Server) Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_ENV` | Environment | `prod` |
| `PORT` | Server port | `3000` |
| `COOKIE_SECRET` | Random secret | `change-me-32-char-min` |
| `SUPERADMIN_USERNAME` | Admin username | `superadmin` |
| `SUPERADMIN_PASSWORD` | Admin password | `secure-password` |
| `DB_HOST` | Database host | `aws-1-eu-west-1.pooler.supabase.com` |
| `DB_PORT` | Database port | `6543` |
| `DB_USERNAME` | Database user | `postgres.xxx` |
| `DB_PASSWORD` | Database password | `your-password` |
| `DB_DATABASE` | Database name | `postgres` |

### Vercel (Storefront) Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_NAME` | Site name | `FreshMarket` |
| `NEXT_PUBLIC_SITE_URL` | Storefront URL | `https://freshmarket.vercel.app` |
| `NEXT_PUBLIC_VENDURE_SHOP_API_URL` | Shop API | `https://railway.app/shop-api` |
| `NEXT_PUBLIC_VENDURE_ADMIN_API_URL` | Admin API | `https://railway.app/admin-api` |

---

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console, make sure the `cors.origin` in your Vendure config includes your Vercel URL.

### Database Connection Issues
- Verify Supabase credentials
- Check that your Supabase project is active
- Ensure you're using the Connection Pooler port (6543) for the app

### Build Failures
- Check that `postinstall` script runs `npm run build`
- Ensure TypeScript compiles without errors locally: `cd apps/server && npm run build`

### Images Not Loading
- Make sure `assetUrlPrefix` is set correctly in Vendure config
- For production: `assetUrlPrefix: 'https://YOUR_RAILWAY_URL/assets/'`

---

## Custom Domain Setup (Optional)

### Vercel Custom Domain
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `freshmarket.com`)
3. Follow DNS instructions

### Railway Custom Domain
1. Go to Railway Dashboard → Your Project → Settings → Domains
2. Click "Generate Domain" or add custom domain
3. Update your storefront env vars with the new URL

---

## Security Checklist

- [ ] Changed default superadmin password
- [ ] Generated strong COOKIE_SECRET (32+ characters)
- [ ] Set up HTTPS on both Railway and Vercel
- [ ] Restricted CORS origins to your domains only
- [ ] Enabled Row Level Security in Supabase (if not already)
- [ ] Set up database backups in Supabase

---

## Need Help?

- Vendure Docs: https://docs.vendure.io
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
