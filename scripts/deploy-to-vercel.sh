#!/bin/bash
# Complete Vercel Deployment Wizard
# Handles environment variables, deployment, and verification

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                        ║${NC}"
echo -e "${MAGENTA}║    🚀  VERCEL DEPLOYMENT WIZARD                        ║${NC}"
echo -e "${MAGENTA}║    EA Dream Admin System - Full Deploy                ║${NC}"
echo -e "${MAGENTA}║                                                        ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${BLUE}Checking Prerequisites...${NC}"
echo "──────────────────────────────────────────────"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI found${NC}"
fi

# Check if .env.production.local exists
if [ ! -f .env.production.local ]; then
    echo -e "${RED}❌ .env.production.local not found${NC}"
    echo "Please run setup-gmail.sh and setup-google-oauth.sh first"
    exit 1
fi
echo -e "${GREEN}✅ Production environment file found${NC}"

# Check if build works
echo ""
echo -e "${BLUE}Testing Local Build...${NC}"
echo "──────────────────────────────────────────────"
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Local build successful${NC}"
else
    echo -e "${RED}❌ Local build failed${NC}"
    echo "Fix build errors before deploying"
    exit 1
fi

echo ""
echo -e "${BLUE}STEP 1: Login to Vercel${NC}"
echo "──────────────────────────────────────────────"
echo ""
vercel login

echo ""
echo -e "${BLUE}STEP 2: Link Project${NC}"
echo "──────────────────────────────────────────────"
echo ""
echo "Linking to Vercel project..."
vercel link

echo ""
echo -e "${BLUE}STEP 3: Set Environment Variables ${NC}"
echo "──────────────────────────────────────────────"
echo ""
echo "Loading variables from .env.production.local..."
echo ""

# Read env file and set variables
while IFS='=' read -r key value; do
    # Skip comments and empty lines
    [[ $key =~ ^#.*  ]] && continue
    [[ -z $key ]] && continue
    
    # Remove quotes from value
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//')
    
    # Skip placeholder values
    if [[ $value == *"your_"* ]] || [[ $value == *"_here"* ]]; then
        echo -e "${YELLOW}⚠️  Skipping placeholder: $key${NC}"
        continue
    fi
    
    echo -e "Setting ${GREEN}$key${NC}..."
    echo "$value" | vercel env add "$key" production --force > /dev/null 2>&1 || true
    
done < .env.production.local

echo ""
echo -e "${GREEN}✅ Environment variables set${NC}"

echo ""
echo -e "${BLUE}STEP 4: Deploy to Production${NC}"
echo "──────────────────────────────────────────────"
echo ""
echo -e "${YELLOW}This will deploy to: https://eadreamllc.com${NC}"
echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo "Deploying to production..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                        ║${NC}"
    echo -e "${GREEN}║    ✅  DEPLOYMENT SUCCESSFUL!                          ║${NC}"
    echo -e "${GREEN}║                                                        ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo -e "${BLUE}STEP 5: Post-Deployment Setup${NC}"
    echo "──────────────────────────────────────────────"
    echo ""
    echo -e "${YELLOW}🗄️  Database Migration:${NC}"
    echo "   npx prisma migrate deploy"
    echo ""
    echo -e "${YELLOW}👤 Seed Admin User:${NC}"
    echo "   npx prisma db seed"
    echo ""
    echo -e "${YELLOW}📅 Authorize Google Calendar:${NC}"
    echo "   Visit: https://eadreamllc.com/api/auth/google"
    echo "   Sign in with: yourmeal@eadreamllc.com"
    echo ""
    echo -e "${YELLOW}🔐 Admin Login:${NC}"
    echo "   Visit: https://eadreamllc.com/admin/login"
    echo "   Email: yourmeal@eadreamllc.com"
    echo "   Password: admin123"
    echo "   ${RED}⚠️  CHANGE PASSWORD IMMEDIATELY${NC}"
    echo ""
    echo -e "${YELLOW}🧪 Test Full Flow:${NC}"
    echo "   1. Submit test proposal via chatbot"
    echo "   2. Approve in admin dashboard"
    echo "   3. Verify email sent"
    echo "   4. Check Google Calendar"
    echo ""
    
    # Ask if should run migrations
    read -p "Run database migrations now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Running migrations..."
        npx prisma migrate deploy
        echo ""
        read -p "Seed admin user? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npx prisma db seed
        fi
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Production deployment complete!${NC}"
    echo -e "${BLUE}Dashboard: https://eadreamllc.com/admin/dashboard${NC}"
    echo ""
    
else
    echo ""
    echo -e "${RED}❌ Deployment failed${NC}"
    echo "Check the error messages above"
    exit 1
fi
