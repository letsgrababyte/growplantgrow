# CloudCone VPS Deployment Guide for GrowPlantGrow.com

## Overview

This guide will help you deploy your Next.js site to CloudCone VPS and connect it to your GoDaddy domain (growplantgrow.com).

## Prerequisites

- CloudCone VPS with root/SSH access
- GoDaddy domain: growplantgrow.com
- Your code pushed to GitHub (or ready to deploy)

---

## Step 1: Access Your CloudCone VPS

### Option A: SSH from Windows

1. **Get your VPS details from CloudCone**:
   - Log in to https://app.cloudcone.com
   - Go to **VPS** → Select your server
   - Note: **IP Address**, **Root Password** (or SSH key)

2. **Connect via PowerShell or Git Bash**:
   ```bash
   ssh root@your-cloudcone-ip
   ```
   - Enter your root password when prompted

### Option B: Use CloudCone Console

- In CloudCone dashboard, click **Console** to access web-based terminal

---

## Step 2: Initial Server Setup

### Update System

```bash
# Update package list
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential
```

### Install Node.js 20.x (LTS)

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

You should see:
- Node.js v20.x.x
- npm 10.x.x

### Install PM2 (Process Manager)

```bash
npm install -g pm2
```

PM2 will keep your Next.js app running even if the server restarts.

---

## Step 3: Deploy Your Application

### Clone Your Repository

```bash
# Navigate to home directory
cd ~

# Create app directory
mkdir -p /var/www/growplantgrow
cd /var/www/growplantgrow

# Clone your repository
# Replace with your actual GitHub repo URL
git clone https://github.com/letsgrababyte/growplantgrow.git .

# If you need to set up the repo first, let me know!
```

### Install Dependencies

```bash
# Install all npm packages
npm install
```

### Set Up Environment Variables

```bash
# Create production environment file
nano .env.production
```

**Add these variables** (replace with your actual values):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NODE_ENV=production
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### Build the Application

```bash
# Build Next.js for production
npm run build
```

This may take a few minutes. Wait for it to complete.

---

## Step 4: Start Application with PM2

```bash
# Start the application
pm2 start npm --name "growplantgrow" -- start

# Make it start on server reboot
pm2 save
pm2 startup

# The last command will show you a command to run
# Copy and run that command (it will be something like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

**Verify it's running:**
```bash
pm2 list
pm2 logs growplantgrow
```

You should see your app running. Press `Ctrl + C` to exit logs.

Your app is now running on `http://localhost:3000` (only accessible on the server).

---

## Step 5: Install and Configure Nginx

Nginx will act as a reverse proxy, forwarding requests to your Next.js app.

### Install Nginx

```bash
apt install nginx -y

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx
```

### Configure Nginx for Your Domain

```bash
# Create Nginx configuration file
nano /etc/nginx/sites-available/growplantgrow.com
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name growplantgrow.com www.growplantgrow.com;

    # Increase body size for file uploads
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**Save and exit** (Ctrl+X, Y, Enter)

### Enable the Site

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/growplantgrow.com /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t
```

You should see: `nginx: configuration file /etc/nginx/nginx.conf test is successful`

### Restart Nginx

```bash
systemctl restart nginx
```

---

## Step 6: Configure Firewall

```bash
# Install UFW (if not already installed)
apt install ufw -y

# Allow SSH (important - don't lock yourself out!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## Step 7: Set Up SSL with Let's Encrypt (HTTPS)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d growplantgrow.com -d www.growplantgrow.com
```

**Follow the prompts:**
1. Enter your email address
2. Agree to terms of service (type `A` and press Enter)
3. Choose whether to redirect HTTP to HTTPS (recommend option 2: Redirect)

Certbot will automatically:
- Get SSL certificate
- Configure Nginx for HTTPS
- Set up auto-renewal

**Test auto-renewal:**
```bash
certbot renew --dry-run
```

---

## Step 8: Configure GoDaddy DNS

Now connect your GoDaddy domain to your CloudCone VPS.

### Get Your CloudCone Server IP

1. In CloudCone dashboard, note your **VPS IP Address**

### Update GoDaddy DNS

1. **Log in to GoDaddy**: https://dcc.godaddy.com
2. **Select your domain**: growplantgrow.com
3. **Go to DNS Management**
4. **Update DNS records**:

   **A Record (Root Domain):**
   - **Type**: `A`
   - **Name**: `@`
   - **Value**: `YOUR_CLOUDCONE_IP_ADDRESS`
   - **TTL**: `600` (or 1 hour)

   **CNAME Record (www subdomain):**
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Value**: `growplantgrow.com`
   - **TTL**: `600`

5. **Save changes**

### Wait for DNS Propagation

- Can take **1-48 hours** (usually 1-2 hours)
- Check propagation: https://www.whatsmydns.net/#A/growplantgrow.com

---

## Step 9: Verify Everything Works

### Check Your Application

```bash
# Check PM2 status
pm2 list

# View logs
pm2 logs growplantgrow

# Check Nginx status
systemctl status nginx
```

### Test Your Site

Once DNS propagates, visit:
- https://growplantgrow.com
- https://www.growplantgrow.com

Both should work and redirect to HTTPS automatically.

---

## Step 10: Set Up Auto-Deployment (Optional)

### Option A: Manual Deployment Script

I've created a deployment script. To use it:

```bash
# Make it executable
chmod +x /var/www/growplantgrow/scripts/deploy-hostinger.sh

# Run it
/var/www/growplantgrow/scripts/deploy-hostinger.sh
```

### Option B: GitHub Actions (Automatic)

I can create a GitHub Actions workflow that automatically deploys when you push to GitHub.

Would you like me to create this?

---

## Step 11: Set Up Admin User in Production

After your site is live:

1. **Sign up/Sign in** on https://growplantgrow.com
2. **Add yourself as admin** in Supabase SQL Editor:

```sql
INSERT INTO admin_users (user_id, role, permissions)
SELECT 
  id,
  'super_admin',
  '{"all": true}'::jsonb
FROM auth.users
WHERE email = 'your-email@example.com';
```

---

## Useful Commands

### Application Management

```bash
# View app status
pm2 list

# View logs
pm2 logs growplantgrow

# Restart app
pm2 restart growplantgrow

# Stop app
pm2 stop growplantgrow

# Delete app from PM2
pm2 delete growplantgrow
```

### Nginx Management

```bash
# Test configuration
nginx -t

# Reload Nginx (after config changes)
systemctl reload nginx

# Restart Nginx
systemctl restart nginx

# View error logs
tail -f /var/log/nginx/error.log
```

### SSL Certificate

```bash
# Renew certificate manually
certbot renew

# Check certificate status
certbot certificates
```

### Update Your Application

```bash
cd /var/www/growplantgrow

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild
npm run build

# Restart with PM2
pm2 restart growplantgrow
```

---

## Troubleshooting

### App Not Running

```bash
# Check PM2
pm2 list
pm2 logs growplantgrow

# Check if port 3000 is in use
netstat -tulpn | grep 3000
```

### Nginx Errors

```bash
# Check Nginx status
systemctl status nginx

# View error logs
tail -f /var/log/nginx/error.log

# Test configuration
nginx -t
```

### Domain Not Loading

1. **Check DNS propagation**: https://www.whatsmydns.net
2. **Verify DNS records in GoDaddy**
3. **Check CloudCone firewall** allows ports 80 and 443
4. **Wait longer** (DNS can take up to 48 hours)

### SSL Certificate Issues

```bash
# Check certificate
certbot certificates

# Renew manually
certbot renew --force-renewal

# Check Nginx SSL config
cat /etc/nginx/sites-available/growplantgrow.com
```

### Can't Access via SSH

- Check CloudCone dashboard for correct IP
- Verify SSH is enabled in CloudCone
- Check firewall allows port 22

---

## Security Recommendations

1. **Change default SSH port** (optional but recommended)
2. **Set up SSH key authentication** (more secure than password)
3. **Keep system updated**: `apt update && apt upgrade`
4. **Set up fail2ban** (protect against brute force)
5. **Regular backups** of your application and database

---

## Next Steps

1. ✅ Follow steps 1-8 above
2. ✅ Wait for DNS propagation
3. ✅ Test your site
4. ✅ Set up admin user
5. ✅ Enjoy your live site! 🎉

---

## Need Help?

If you run into any issues:
1. Check the troubleshooting section above
2. Check PM2 logs: `pm2 logs growplantgrow`
3. Check Nginx logs: `tail -f /var/log/nginx/error.log`
4. Let me know what error you're seeing!

