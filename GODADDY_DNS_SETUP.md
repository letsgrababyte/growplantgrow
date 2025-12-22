# GoDaddy DNS Setup for growplantgrow.com

## Quick Setup Guide

This guide will help you connect your GoDaddy domain (growplantgrow.com) to your GPG app.

## Option 1: Deploy to Vercel (Recommended - Easiest & Free)

### Step 1: Deploy to Vercel

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Sign up/Login to Vercel**:
   - Go to https://vercel.com
   - Sign up with GitHub
   - Click "Add New" → "Project"
   - Import your `growplantgrow` repository

3. **Configure Environment Variables**:
   - In Vercel project settings → Environment Variables
   - Add these:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
     - `SUPABASE_SERVICE_ROLE_KEY` = your service role key

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - You'll get a URL like: `growplantgrow.vercel.app`

### Step 2: Add Domain to Vercel

1. **In Vercel Dashboard**:
   - Go to your project → **Settings** → **Domains**
   - Click **"Add"**
   - Enter: `growplantgrow.com`
   - Click **"Add"**
   - Enter: `www.growplantgrow.com`
   - Click **"Add"**

2. **Vercel will show you DNS instructions**:
   - You'll see what DNS records to add
   - **Note the values** - you'll need them for GoDaddy

### Step 3: Configure GoDaddy DNS for Vercel

1. **Log in to GoDaddy**:
   - Go to https://dcc.godaddy.com
   - Sign in
   - Find **growplantgrow.com** and click on it

2. **Go to DNS Management**:
   - Scroll down to **"DNS"** section
   - Click **"Manage DNS"** or **"DNS"**

3. **Update DNS Records**:

   **For Root Domain (growplantgrow.com):**
   
   **Option A: Use A Record (if Vercel provides IP)**
   - Find or create A record with Name: `@`
   - Set Value to: `76.76.21.21` (Vercel's IP - check Vercel dashboard for current IP)
   - TTL: `600`
   - Save
   
   **Option B: Use CNAME (Easier - Recommended)**
   - Delete any existing A record for `@` (if it exists)
   - Create new CNAME record:
     - Type: `CNAME`
     - Name: `@`
     - Value: `cname.vercel-dns.com`
     - TTL: `600`
     - Save
   
   **For www Subdomain:**
   - Find or create CNAME record with Name: `www`
   - Set Value to: `cname.vercel-dns.com`
   - TTL: `600`
   - Save

4. **Your DNS should look like this**:
   ```
   Type    Name    Value                    TTL
   CNAME   @       cname.vercel-dns.com     600
   CNAME   www     cname.vercel-dns.com     600
   ```

5. **Wait for DNS Propagation**:
   - Usually takes 1-24 hours (often much faster)
   - Vercel will automatically provision SSL certificate
   - Check status in Vercel dashboard

6. **Verify**:
   - Visit https://growplantgrow.com
   - Visit https://www.growplantgrow.com
   - Both should work!

---

## Option 2: Deploy to CloudCone (ep-core Server)

If you want to use your existing CloudCone server at `74.48.140.120`:

### Step 1: Deploy App to ep-core

1. **SSH to your server**:
   ```bash
   ssh root@74.48.140.120
   ```

2. **Set up the app**:
   ```bash
   # Create directory
   mkdir -p /var/www/growplantgrow
   cd /var/www/growplantgrow
   
   # Clone your repo
   git clone https://github.com/letsgrababyte/growplantgrow.git .
   
   # Install dependencies
   npm install
   
   # Create .env.production
   nano .env.production
   ```

3. **Add environment variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NODE_ENV=production
   PORT=3001
   ```

4. **Build and start**:
   ```bash
   npm run build
   PORT=3001 pm2 start npm --name "growplantgrow" -- start
   pm2 save
   ```

### Step 2: Configure Nginx

1. **Create Nginx config**:
   ```bash
   nano /etc/nginx/sites-available/growplantgrow.com
   ```

2. **Add this configuration**:
   ```nginx
   server {
       listen 80;
       server_name growplantgrow.com www.growplantgrow.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable and test**:
   ```bash
   ln -s /etc/nginx/sites-available/growplantgrow.com /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

4. **Set up SSL**:
   ```bash
   certbot --nginx -d growplantgrow.com -d www.growplantgrow.com
   ```

### Step 3: Configure GoDaddy DNS for CloudCone

1. **Log in to GoDaddy**:
   - Go to https://dcc.godaddy.com
   - Sign in
   - Find **growplantgrow.com** and click on it

2. **Go to DNS Management**:
   - Scroll down to **"DNS"** section
   - Click **"Manage DNS"** or **"DNS"**

3. **Update DNS Records**:

   **A Record for Root Domain:**
   - Find or create A record with Name: `@`
   - Set Value to: `74.48.140.120` (your CloudCone server IP)
   - TTL: `600`
   - Save

   **CNAME for www:**
   - Find or create CNAME record with Name: `www`
   - Set Value to: `growplantgrow.com`
   - TTL: `600`
   - Save

4. **Your DNS should look like this**:
   ```
   Type    Name    Value                TTL
   A       @       74.48.140.120        600
   CNAME   www     growplantgrow.com    600
   ```

5. **Wait for DNS Propagation**:
   - Usually takes 1-24 hours
   - Check with: `nslookup growplantgrow.com`
   - Should return: `74.48.140.120`

6. **Verify**:
   - Visit http://growplantgrow.com (will redirect to HTTPS after SSL)
   - Visit http://www.growplantgrow.com

---

## Visual Guide: GoDaddy DNS Interface

### Finding DNS Management

1. **After logging in to GoDaddy**:
   - You'll see "My Products" or "Domains"
   - Click on **growplantgrow.com** (the domain name itself, not checkbox)

2. **On the domain page**:
   - Scroll down to find **"DNS"** section
   - Look for button: **"Manage DNS"**, **"DNS"**, or **"DNS Management"**
   - Click it

3. **You'll see a table of DNS records**:
   ```
   Type | Name | Value | TTL | Actions
   -----|------|-------|-----|--------
   A    | @    | ...   | 600 | ✏️ 🗑️
   CNAME| www  | ...   | 600 | ✏️ 🗑️
   ```

### Editing Records

**To Edit Existing Record:**
1. Find the record you want to change
2. Click the **pencil icon** ✏️
3. Update the **Value** field
4. Click **"Save"** or **"Update"**

**To Add New Record:**
1. Click **"Add"** button (usually at top)
2. Select **Type** (A or CNAME)
3. Enter **Name** (`@` for root, `www` for www)
4. Enter **Value** (IP for A record, domain for CNAME)
5. Set **TTL** to `600`
6. Click **"Save"**

---

## Testing DNS Configuration

### Check DNS Propagation

1. **Online Tools**:
   - https://www.whatsmydns.net/#A/growplantgrow.com
   - https://dnschecker.org/#A/growplantgrow.com
   - Look for green checkmarks ✅ = DNS propagated

2. **Command Line**:
   ```bash
   # Check A record
   nslookup growplantgrow.com
   
   # Should return your server IP (74.48.140.120 for CloudCone)
   # or Vercel's IP if using Vercel
   ```

3. **Check www subdomain**:
   ```bash
   nslookup www.growplantgrow.com
   ```

### Verify Website is Working

1. **Visit in browser**:
   - http://growplantgrow.com
   - http://www.growplantgrow.com

2. **Check SSL** (after DNS propagates):
   - https://growplantgrow.com
   - Should show green lock 🔒

---

## Troubleshooting

### DNS Not Working After 24 Hours

1. **Double-check DNS records**:
   - Make sure values are correct
   - No typos in IP addresses or domain names
   - TTL is set (600 is good)

2. **Clear DNS cache**:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac/Linux
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

3. **Try different network**:
   - Use mobile data
   - Try different WiFi network
   - Use VPN

### Website Shows "Not Secure" or SSL Error

1. **If using Vercel**:
   - Wait for SSL to provision (automatic, usually within minutes)
   - Check Vercel dashboard for SSL status

2. **If using CloudCone**:
   - Make sure you ran `certbot --nginx`
   - Check SSL certificate: `certbot certificates`
   - Renew if needed: `certbot renew`

### Can't Find DNS Management in GoDaddy

1. **Try different locations**:
   - Look for tabs: "DNS", "Nameservers", "Records"
   - Try clicking directly on domain name
   - Check if domain is locked (may need to unlock first)

2. **Contact GoDaddy Support**:
   - They can guide you to DNS management
   - Or help you configure DNS records

---

## Quick Reference

### For Vercel:
```
Type    Name    Value                    TTL
CNAME   @       cname.vercel-dns.com     600
CNAME   www     cname.vercel-dns.com     600
```

### For CloudCone:
```
Type    Name    Value                TTL
A       @       74.48.140.120        600
CNAME   www     growplantgrow.com    600
```

---

## Next Steps After DNS is Configured

1. ✅ **Wait for DNS propagation** (1-24 hours)
2. ✅ **Verify site is accessible** at growplantgrow.com
3. ✅ **Check SSL certificate** is working
4. ✅ **Test all features** (login, products, etc.)
5. ✅ **Update Supabase** to allow growplantgrow.com domain
6. ✅ **Set up admin user** in production

---

## Need Help?

If you're stuck:
1. Check Vercel/CloudCone logs for errors
2. Verify environment variables are set correctly
3. Check browser console for errors
4. Verify Supabase allows your domain

**Which option do you want to use?**
- **Vercel** (easiest, free, recommended)
- **CloudCone** (use existing server)

Let me know and I can provide more specific instructions!

