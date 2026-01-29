#!/bin/bash
# Google OAuth Setup Wizard
# Interactive guide for configuring Google Calendar API

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

clear
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║    📅  GOOGLE OAUTH SETUP WIZARD                       ║${NC}"
echo -e "${BLUE}║    Google Calendar API Integration                     ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}This wizard will help you set up Google Calendar integration.${NC}"
echo ""

# Step 1: Create Project
echo -e "${BLUE}STEP 1: Create Google Cloud Project${NC}"
echo "──────────────────────────────────────────────"
echo ""
echo "1. Go to: https://console.cloud.google.com/"
echo "2. Click the project dropdown (top left)"
echo "3. Click 'NEW PROJECT'"
echo "4. Project name: EA-Dream-Production"
echo "5. Click 'CREATE'"
echo "6. Wait for the project to be created"
echo ""
read -p "Have you created the project? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Please create the project first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Project created${NC}"
echo ""

# Step 2: Enable APIs
echo -e "${BLUE}STEP 2: Enable Google Calendar API${NC}"
echo "──────────────────────────────────────────────"
echo ""
echo "1. In your project, go to: APIs & Services > Library"
echo "   Direct link: https://console.cloud.google.com/apis/library"
echo "2. Search for: Google Calendar API"
echo "3. Click on 'Google Calendar API'"
echo "4. Click 'ENABLE'"
echo "5. Wait for the API to be enabled"
echo ""
read -p "Have you enabled the Calendar API? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Please enable the API first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Calendar API enabled${NC}"
echo ""

# Step 3: Configure OAuth Consent Screen
echo -e "${BLUE}STEP 3: Configure OAuth Consent Screen${NC}"
echo "──────────────────────────────────────────────"
echo ""
echo "1. Go to: APIs & Services > OAuth consent screen"
echo "   Direct link: https://console.cloud.google.com/apis/credentials/consent"
echo "2. User Type: Select 'External' (unless you have Google Workspace)"
echo "3. Click 'CREATE'"
echo "4. App information:"
echo "   - App name: Etheleen & Alma's Dream Admin"
echo "   - User support email: yourmeal@eadreamllc.com"
echo "   - Developer contact: yourmeal@eadreamllc.com"
echo "5. Click 'SAVE AND CONTINUE'"
echo "6. Scopes: Click 'ADD OR REMOVE SCOPES'"
echo "   - Search for: calendar"
echo "   - Select: Google Calendar API (.../auth/calendar)"
echo "   - Click 'UPDATE'"
echo "7. Click 'SAVE AND CONTINUE'"
echo "8. Test users: Click 'ADD USERS'"
echo "   - Add: yourmeal@eadreamllc.com"
echo "   - Click 'ADD'"
echo "9. Click 'SAVE AND CONTINUE'"
echo "10. Review and click 'BACK TO DASHBOARD'"
echo ""
read -p "Have you configured the consent screen? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Please configure the consent screen first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ OAuth consent screen configured${NC}"
echo ""

# Step 4: Create OAuth Credentials
echo -e "${BLUE}STEP 4: Create OAuth 2.0 Credentials${NC}"
echo "──────────────────────────────────────────────"
echo ""
echo "1. Go to: APIs & Services > Credentials"
echo "   Direct link: https://console.cloud.google.com/apis/credentials"
echo "2. Click '+ CREATE CREDENTIALS'"
echo "3. Select: 'OAuth client ID'"
echo "4. Application type: 'Web application'"
echo "5. Name: EA Dream Admin (Production)"
echo "6. Authorized redirect URIs:"
echo "   - Click 'ADD URI'"
echo "   - For local testing: http://localhost:3000/api/auth/google/callback"
echo "   - Click 'ADD URI' again"
echo "   - For production: https://eadreamllc.com/api/auth/google/callback"
echo "7. Click 'CREATE'"
echo "8. A dialog will appear with your credentials"
echo ""
echo -e "${YELLOW}📋 IMPORTANT: Copy both the Client ID and Client Secret${NC}"
echo ""
read -p "Press Enter when you're ready to enter your credentials..."
echo ""

# Step 5: Input credentials
echo -e "${BLUE}STEP 5: Enter Your OAuth Credentials${NC}"
echo "──────────────────────────────────────────────"
echo ""
echo "Enter your OAuth 2.0 credentials from Google Cloud Console:"
echo ""
read -p "Client ID: " GOOGLE_CLIENT_ID
echo ""
read -s -p "Client Secret: " GOOGLE_CLIENT_SECRET
echo ""
echo ""

# Step 6: Update .env files
echo -e "${BLUE}STEP 6: Updating Environment Files${NC}"
echo "──────────────────────────────────────────────"
echo ""

# Update .env
if [ -f .env ]; then
    sed -i.bak "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=\"$GOOGLE_CLIENT_ID\"|" .env
    sed -i.bak "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=\"$GOOGLE_CLIENT_SECRET\"|" .env
    echo -e "${GREEN}✅ Updated .env${NC}"
fi

# Update .env.production.local
if [ -f .env.production.local ]; then
    sed -i.bak "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=\"$GOOGLE_CLIENT_ID\"|" .env.production.local
    sed -i.bak "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=\"$GOOGLE_CLIENT_SECRET\"|" .env.production.local
    echo -e "${GREEN}✅ Updated .env.production.local${NC}"
fi

echo ""

# Step 7: Test OAuth
echo -e "${BLUE}STEP 7: Test OAuth Configuration${NC}"
echo "──────────────────────────────────────────────"
echo ""
echo "Next, you need to authorize the application:"
echo ""
echo -e "${YELLOW}For LOCAL testing:${NC}"
echo "1. Make sure dev server is running: npm run dev"
echo "2. Visit: http://localhost:3000/api/auth/google"
echo "3. Sign in with: yourmeal@eadreamllc.com"
echo "4. Grant calendar permissions"
echo ""
echo -e "${YELLOW}For PRODUCTION:${NC}"
echo "After deploying to Vercel, visit:"
echo "https://eadreamllc.com/api/auth/google"
echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║    ✅  GOOGLE OAUTH CONFIGURED SUCCESSFULLY!           ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Restart your dev server: npm run dev"
echo "2. Visit: http://localhost:3000/api/auth/google"
echo "3. Authorize the application"
echo "4. Continue to Option C: Vercel Deployment"
echo ""
