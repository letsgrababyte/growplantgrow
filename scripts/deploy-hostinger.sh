#!/bin/bash

# Hostinger Deployment Script for GrowPlantGrow
# Run this on your Hostinger VPS/Cloud server

echo "🚀 Starting GrowPlantGrow deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing Node.js 20.x...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo -e "${GREEN}✓ Node.js version: $(node --version)${NC}"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 not found. Installing PM2...${NC}"
    sudo npm install -g pm2
fi

echo -e "${GREEN}✓ PM2 installed${NC}"

# Navigate to app directory
APP_DIR="$HOME/growplantgrow"
if [ ! -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Creating app directory...${NC}"
    mkdir -p "$APP_DIR"
    cd "$APP_DIR"
    
    echo -e "${YELLOW}Please clone your repository:${NC}"
    echo "git clone https://github.com/letsgrababyte/growplantgrow.git ."
    exit 1
fi

cd "$APP_DIR"

# Pull latest changes
echo -e "${YELLOW}Pulling latest changes...${NC}"
git pull origin main || git pull origin master

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Check for .env.production
if [ ! -f ".env.production" ]; then
    echo -e "${RED}⚠ .env.production not found!${NC}"
    echo "Creating .env.production template..."
    cat > .env.production << EOF
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NODE_ENV=production
EOF
    echo -e "${YELLOW}Please edit .env.production with your actual values!${NC}"
    echo "Then run this script again."
    exit 1
fi

# Build the application
echo -e "${YELLOW}Building application...${NC}"
npm run build

# Restart PM2
echo -e "${YELLOW}Restarting application with PM2...${NC}"
pm2 restart growplantgrow || pm2 start npm --name "growplantgrow" -- start

# Save PM2 configuration
pm2 save

echo -e "${GREEN}✓ Deployment complete!${NC}"
echo -e "${GREEN}Your app should be running on http://localhost:3000${NC}"
echo ""
echo "Check status: pm2 list"
echo "View logs: pm2 logs growplantgrow"

