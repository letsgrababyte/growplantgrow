# Quick Start: Deploy to Hostinger

## First: Check Your Hostinger Plan Type

1. **Log in to Hostinger**: https://hpanel.hostinger.com
2. **Check your plan type**:
   - Look for "VPS Hosting", "Cloud Hosting", or "Shared Hosting"
   - **VPS/Cloud** = ✅ Can run Next.js directly
   - **Shared Hosting** = ⚠️ Limited - may need upgrade

## Step-by-Step Deployment

### Step 1: Prepare Your Code

First, let's make sure your code is ready:

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for Hostinger deployment"
git push origin main
```

### Step 2: Access Your Hostinger Server

**If you have VPS/Cloud:**
1. Go to hPanel → **SSH Access**
2. Note your:
   - Server IP address
   - SSH username
   - SSH password (or set up SSH key)

**If you have Shared Hosting:**
- You'll need to upgrade to VPS for Next.js
- Or contact me for alternative solutions

### Step 3: Connect to Your Server

**On Windows (using PowerShell or Git Bash):**
```bash
ssh username@your-server-ip
```

**Or use Hostinger's Web Terminal:**
- In hPanel, go to **SSH Access** → **Web Terminal**

### Step 4: Run the Deployment

Once connected to your server, run:

```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Create app directory
mkdir -p ~/growplantgrow
cd ~/growplantgrow

# Clone your repository
git clone https://github.com/letsgrababyte/growplantgrow.git .

# Install dependencies
npm install

# Create environment file
nano .env.production
```

**Add your environment variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=production
```

Save (Ctrl+X, Y, Enter)

```bash
# Build the app
npm run build

# Start with PM2
pm2 start npm --name "growplantgrow" -- start
pm2 save
pm2 startup
# Follow the instructions it shows
```

### Step 5: Set Up Nginx (Web Server)

```bash
# Install Nginx
sudo apt update
sudo apt install nginx -y

# Create config file
sudo nano /etc/nginx/sites-available/growplantgrow.com
```

**Paste this configuration:**
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

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Set Up SSL (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d growplantgrow.com -d www.growplantgrow.com
```

Follow the prompts (enter email, agree to terms, choose redirect HTTP to HTTPS).

### Step 7: Configure GoDaddy DNS

1. **Log in to GoDaddy**: https://dcc.godaddy.com
2. **Select domain**: growplantgrow.com
3. **Go to DNS Management**
4. **Find your Hostinger server IP** (in hPanel → Server Details)
5. **Update DNS records**:

   **A Record:**
   - Type: `A`
   - Name: `@`
   - Value: `YOUR_HOSTINGER_SERVER_IP`
   - TTL: `600`

   **CNAME Record (for www):**
   - Type: `CNAME`
   - Name: `www`
   - Value: `growplantgrow.com`
   - TTL: `600`

6. **Save changes**
7. **Wait 1-24 hours** for DNS to propagate

## That's It! 🎉

Your site should be live at:
- http://growplantgrow.com (will redirect to HTTPS)
- https://growplantgrow.com

## Need Help?

**Common Issues:**
- Can't access SSH → Check hPanel → SSH Access
- Port 3000 not working → Check firewall: `sudo ufw allow 3000`
- Domain not loading → Wait for DNS (can take up to 48 hours)

**Check if app is running:**
```bash
pm2 list
pm2 logs growplantgrow
```

**Restart app:**
```bash
pm2 restart growplantgrow
```

---

## What's Your Hostinger Plan Type?

Please check your Hostinger hPanel and let me know:
1. **VPS Hosting** → Follow steps above ✅
2. **Cloud Hosting** → Follow steps above ✅
3. **Shared Hosting** → We need to discuss options ⚠️

Once you confirm, I can provide more specific instructions!

