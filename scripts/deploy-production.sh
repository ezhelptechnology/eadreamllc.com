#!/bin/bash
# Production Deployment Script for EA Dream Admin System

set -e  # Exit on error

echo "🚀 EA DREAM ADMIN SYSTEM - Production Deployment"
echo "=================================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI found${NC}"
echo ""

# Check if .env.production.local exists
if [ ! -f .env.production.local ]; then
    echo -e "${RED}❌ .env.production.local not found${NC}"
    echo "Create it first and configure all required variables"
    exit 1
fi

echo -e "${GREEN}✅ Production environment file found${NC}"
echo ""

# Step 1: Build locally to verify
echo "📦 Step 1: Building project locally..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Local build successful${NC}"
else
    echo -e "${RED}❌ Local build failed. Fix errors before deploying.${NC}"
    exit 1
fi
echo ""

# Step 2: Run database migration (dry run)
echo "🗄️  Step 2: Checking database schema..."
npx prisma migrate status
echo ""

# Step 3: Deploy to Vercel
echo "🌐 Step 3: Deploying to Vercel..."
echo "This will deploy to production: https://eadreamllc.com"
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Deployment successful!${NC}"
        echo ""
        echo "🎯 Next Steps:"
        echo "1. Run production migrations: npx prisma migrate deploy"
        echo "2. Seed admin user: npx prisma db seed"
        echo "3. Authorize Google Calendar: https://eadreamllc.com/api/auth/google"
        echo "4. Test admin login: https://eadreamllc.com/admin/login"
        echo "5. Submit test proposal and verify full flow"
        echo ""
        echo -e "${YELLOW}⚠️  IMPORTANT: Change admin password from default 'admin123'${NC}"
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    fi
else
    echo "Deployment cancelled"
    exit 0
fi
