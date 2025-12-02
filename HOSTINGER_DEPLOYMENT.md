# Hostinger Deployment Guide for GrowPlantGrow.com

## Step 1: Determine Your Hostinger Plan Type

Hostinger offers different plans. Check your Hostinger dashboard to see which you have:

1. **Shared Hosting** - Cheaper, but limited for Next.js
2. **VPS Hosting** - Best for Next.js (full control)
3. **Cloud Hosting** - Good for Next.js (managed)

**Check your Hostinger panel:**
- Log in to https://hpanel.hostinger.com
- Look at your hosting plan type

---

## Option A: Hostinger VPS or Cloud Hosting (Recommended)

If you have VPS or Cloud hosting, you can run Next.js directly.

### Step 1: Access Your Server

1. **Get SSH Access**:
   - In Hostinger hPanel, go to **SSH Access**
   - Note your server IP address
   - Use the SSH credentials provided

2. **Connect via SSH**:
   ```bash
   ssh username@your-server-ip
   ```

### Step 2: Install Node.js

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### Step 4: Clone Your Repository

```bash
# Navigate to your home directory or create app directory
cd ~
mkdir growplantgrow
cd growplantgrow

# Clone your repository (you'll need to push to GitHub first)
git clone https://github.com/letsgrababyte/growplantgrow.git .

# OR if you need to set up the repo first, we can do that
```

### Step 5: Install Dependencies and Build

```bash
# Install dependencies
npm install

# Create production environment file
nano .env.production
```

Add these variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=production
```

Save and exit (Ctrl+X, then Y, then Enter)

```bash
# Build the application
npm run build
```

### Step 6: Start with PM2

```bash
# Start the application
pm2 start npm --name "growplantgrow" -- start

# Make it start on server reboot
pm2 save
pm2 startup
# Follow the instructions it gives you
```

### Step 7: Install and Configure Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/growplantgrow.com
```

Add this configuration:
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and exit, then:
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/growplantgrow.com /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 8: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d growplantgrow.com -d www.growplantgrow.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommend Yes)
```

### Step 9: Configure GoDaddy DNS

1. **Log in to GoDaddy**:
   - Go to https://dcc.godaddy.com
   - Select your domain: growplantgrow.com

2. **Update DNS Records**:
   - Find your Hostinger server IP (from hPanel)
   - Update A record:
     - **Type**: A
     - **Name**: @
     - **Value**: YOUR_HOSTINGER_SERVER_IP
     - **TTL**: 600 (or default)
   
   - Update CNAME for www:
     - **Type**: CNAME
     - **Name**: www
     - **Value**: growplantgrow.com
     - **TTL**: 600 (or default)

3. **Wait for DNS Propagation**:
   - Can take 1-48 hours (usually 1-2 hours)
   - Check with: `nslookup growplantgrow.com`

---

## Option B: Hostinger Shared Hosting

If you have shared hosting, you have two options:

### Option B1: Static Export (Limited Features)

This exports your site as static files, but you'll lose:
- Server-side features
- API routes
- Dynamic features

**Not recommended** for your site since you need Supabase auth and admin features.

### Option B2: Upgrade to VPS

**Recommended**: Upgrade to Hostinger VPS (usually $4-10/month) to get full Next.js support.

---

## Step 10: Set Up Auto-Deployment (Optional)

### Using GitHub Actions

I can create a GitHub Actions workflow that automatically deploys when you push to GitHub.

Would you like me to create:
1. GitHub Actions workflow for auto-deployment?
2. A deployment script you can run manually?

---

## Important: Environment Variables

Make sure these are set in production:

1. **In `.env.production` on server**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **In Supabase Dashboard**:
   - Make sure your Supabase project allows your production domain
   - Add `growplantgrow.com` to allowed domains if needed

---

## Step 11: Set Up Admin User in Production

After deployment, you'll need to:

1. **Sign up/Sign in** on your production site
2. **Add yourself as admin** in Supabase:
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

## Troubleshooting

### Can't access via SSH
- Check Hostinger hPanel → SSH Access
- Make sure SSH is enabled
- Use the credentials from hPanel

### Port 3000 not accessible
- Check firewall: `sudo ufw allow 3000`
- Make sure PM2 is running: `pm2 list`

### Nginx errors
- Check logs: `sudo tail -f /var/log/nginx/error.log`
- Test config: `sudo nginx -t`

### Domain not resolving
- Wait for DNS propagation (can take up to 48 hours)
- Check DNS: `nslookup growplantgrow.com`
- Verify GoDaddy DNS settings

---

## Next Steps

1. **Check your Hostinger plan type** in hPanel
2. **Let me know which plan you have**, and I'll provide specific instructions
3. **If you have VPS/Cloud**: Follow Option A above
4. **If you have Shared Hosting**: We should discuss upgrading or alternatives

---

## Quick Commands Reference

```bash
# Check if Node.js is running
pm2 list

# View logs
pm2 logs growplantgrow

# Restart app
pm2 restart growplantgrow

# Stop app
pm2 stop growplantgrow

# Check Nginx status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx
```

