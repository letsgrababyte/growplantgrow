# Deployment Guide: GrowPlantGrow.com to Hostinger

## Overview

This guide will help you deploy your Next.js site to Hostinger and connect it to your GoDaddy domain (growplantgrow.com).

## Important Considerations

### Hostinger Hosting Options

**Option 1: Hostinger VPS (Recommended for Next.js)**
- Best for Next.js applications
- Full control over server
- Can run Node.js directly
- More expensive (~$4-10/month)

**Option 2: Hostinger Shared Hosting**
- Cheaper but limited
- May need to use static export or different approach
- Less ideal for Next.js

**Option 3: Vercel (Easiest - Recommended)**
- Free tier available
- Built specifically for Next.js
- Automatic deployments
- Free SSL
- Can still use your GoDaddy domain

## Recommended Approach: Vercel (Easiest)

Since you want to use your GoDaddy domain, I recommend deploying to **Vercel** (free) and connecting your domain. This is the easiest and most reliable option for Next.js.

### Step 1: Deploy to Vercel

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Sign up for Vercel**:
   - Go to https://vercel.com
   - Sign up with GitHub
   - Import your repository

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to your project settings
   - Add these environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (for admin features)

4. **Deploy**:
   - Vercel will automatically deploy
   - You'll get a URL like: `your-project.vercel.app`

### Step 2: Connect GoDaddy Domain to Vercel

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Domains
   - Add `growplantgrow.com` and `www.growplantgrow.com`

2. **In GoDaddy DNS Settings**:
   - Log in to GoDaddy
   - Go to DNS Management for growplantgrow.com
   - Update DNS records:
   
   **For root domain (growplantgrow.com):**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21` (Vercel's IP - check Vercel docs for current IP)
   
   **OR use CNAME (easier):**
   - Type: `CNAME`
   - Name: `@`
   - Value: `cname.vercel-dns.com`
   
   **For www subdomain:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

3. **Wait for DNS Propagation**:
   - Can take 24-48 hours (usually much faster)
   - Vercel will automatically provision SSL certificate

---

## Alternative: Deploy to Hostinger VPS

If you specifically want to use Hostinger, you'll need a VPS plan.

### Step 1: Set Up Hostinger VPS

1. **Purchase VPS Plan** (if not already)
   - Minimum: 1GB RAM, 1 CPU core
   - Recommended: 2GB+ RAM

2. **Access Your VPS**:
   - Use SSH to connect
   - Install Node.js (v18 or v20):
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```

3. **Install PM2** (Process Manager):
   ```bash
   sudo npm install -g pm2
   ```

### Step 2: Deploy Your Next.js App

1. **Clone Your Repository**:
   ```bash
   git clone https://github.com/letsgrababyte/growplantgrow.git
   cd growplantgrow
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the App**:
   ```bash
   npm run build
   ```

4. **Set Environment Variables**:
   Create `.env.production`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

5. **Start with PM2**:
   ```bash
   pm2 start npm --name "growplantgrow" -- start
   pm2 save
   pm2 startup
   ```

### Step 3: Set Up Nginx Reverse Proxy

1. **Install Nginx**:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx**:
   Create `/etc/nginx/sites-available/growplantgrow.com`:
   ```nginx
   server {
       listen 80;
       server_name growplantgrow.com www.growplantgrow.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable Site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/growplantgrow.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Set Up SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d growplantgrow.com -d www.growplantgrow.com
   ```

### Step 4: Configure GoDaddy DNS

1. **In GoDaddy DNS Settings**:
   - Log in to GoDaddy
   - Go to DNS Management
   - Update A record:
     - Type: `A`
     - Name: `@`
     - Value: `YOUR_HOSTINGER_VPS_IP` (get this from Hostinger panel)
   - Update CNAME for www:
     - Type: `CNAME`
     - Name: `www`
     - Value: `growplantgrow.com`

---

## Quick Setup Script for Hostinger VPS

I can create a deployment script for you. Would you like me to create:
1. A deployment script
2. A GitHub Actions workflow for auto-deployment
3. Environment variable templates

---

## Recommended: Use Vercel (Free & Easy)

**Why Vercel is better for Next.js:**
- ✅ Free tier (perfect for your site)
- ✅ Automatic deployments from GitHub
- ✅ Built-in SSL certificates
- ✅ Global CDN
- ✅ Zero configuration
- ✅ Easy domain connection
- ✅ Automatic preview deployments

**Steps:**
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Connect GoDaddy domain
5. Done!

---

## Next Steps

**Which option do you prefer?**

1. **Vercel** (Recommended - Free, Easy, Best for Next.js)
2. **Hostinger VPS** (More control, requires server management)
3. **Hostinger Shared Hosting** (Cheaper but limited - may need static export)

Let me know which option you'd like, and I'll provide detailed step-by-step instructions!

---

## Important Notes

- **Environment Variables**: Make sure all Supabase keys are set in production
- **Database**: Your Supabase database will work the same in production
- **Admin Access**: You'll need to set up your admin user in production Supabase
- **SSL**: Always use HTTPS in production (Vercel does this automatically)

