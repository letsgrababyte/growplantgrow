#!/bin/bash

# CloudCone VPS Deployment Script for GrowPlantGrow
# Run this on your CloudCone VPS server

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 GrowPlantGrow CloudCone Deployment Script${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# App directory
APP_DIR="/var/www/growplantgrow"

# Step 1: Check Node.js
echo -e "${YELLOW}📦 Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Installing Node.js 20.x...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo -e "${GREEN}✓ Node.js $(node --version) already installed${NC}"
fi

# Step 2: Check PM2
echo -e "${YELLOW}📦 Checking PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2...${NC}"
    npm install -g pm2
else
    echo -e "${GREEN}✓ PM2 already installed${NC}"
fi

# Step 3: Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}App directory not found: $APP_DIR${NC}"
    echo -e "${YELLOW}Please clone your repository first:${NC}"
    echo "  mkdir -p $APP_DIR"
    echo "  cd $APP_DIR"
    echo "  git clone https://github.com/letsgrababyte/growplantgrow.git ."
    exit 1
fi

cd "$APP_DIR"

# Step 4: Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes from Git...${NC}"
git pull origin main || git pull origin master || echo -e "${YELLOW}⚠ Could not pull (maybe not a git repo?)${NC}"

# Step 5: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Step 6: Check environment file
if [ ! -f ".env.production" ]; then
    echo -e "${RED}⚠ .env.production not found!${NC}"
    echo -e "${YELLOW}Creating template...${NC}"
    cat > .env.production << EOF
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NODE_ENV=production
EOF
    echo -e "${RED}Please edit .env.production with your actual values!${NC}"
    echo -e "${YELLOW}Then run this script again.${NC}"
    exit 1
fi

# Step 7: Build application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

# Step 8: Restart with PM2
echo -e "${YELLOW}🔄 Restarting application...${NC}"
if pm2 list | grep -q "growplantgrow"; then
    pm2 restart growplantgrow
else
    pm2 start npm --name "growplantgrow" -- start
fi

# Step 9: Save PM2 configuration
pm2 save

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  pm2 list              - View app status"
echo "  pm2 logs growplantgrow - View logs"
echo "  pm2 restart growplantgrow - Restart app"
echo ""
echo -e "${GREEN}Your app should be running on http://localhost:3000${NC}"

