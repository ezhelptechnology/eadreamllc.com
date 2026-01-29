#!/bin/bash
# Gmail SMTP Setup Wizard
# Interactive guide for configuring Gmail app password

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

clear
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║    📧  GMAIL SMTP SETUP WIZARD                         ║${NC}"
echo -e "${BLUE}║    EA Dream Admin System                               ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}This wizard will help you set up Gmail SMTP for sending emails.${NC}"
echo ""

# Step 1: Check 2FA
echo -e "${BLUE}STEP 1: Enable 2-Step Verification${NC}"
echo "──────────────────────────────────────"
echo ""
echo "1. Go to: https://myaccount.google.com/security"
echo "2. Under 'Signing in to Google', click '2-Step Verification'"
echo "3. Follow the prompts to enable 2FA if not already enabled"
echo ""
read -p "Have you enabled 2-Step Verification? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ 2-Step Verification is required. Please enable it first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 2-Step Verification confirmed${NC}"
echo ""

# Step 2: Generate App Password
echo -e "${BLUE}STEP 2: Generate App Password${NC}"
echo "──────────────────────────────────────"
echo ""
echo "1. Go to: https://myaccount.google.com/apppasswords"
echo "2. You may need to sign in again"
echo "3. Under 'Select app', choose: Mail"
echo "4. Under 'Select device', choose: Other (Custom name)"
echo "5. Type: EA Dream Admin System"
echo "6. Click 'Generate'"
echo "7. You'll see a 16-character password like: abcd efgh ijkl mnop"
echo ""
echo -e "${YELLOW}📋 Copy the app password (you won't see it again!)${NC}"
echo ""
read -p "Press Enter when you have the app password..."
echo ""

# Step 3: Input credentials
echo -e "${BLUE}STEP 3: Enter Your Credentials${NC}"
echo "──────────────────────────────────────"
echo ""
read -p "Gmail address (e.g., yourmeal@eadreamllc.com): " SMTP_USER
echo ""
echo "Enter your 16-character app password (spaces will be removed automatically)"
read -s -p "App password: " SMTP_PASS
echo ""
echo ""

# Remove spaces from app password
SMTP_PASS=$(echo "$SMTP_PASS" | tr -d ' ')

# Step 4: Update .env files
echo -e "${BLUE}STEP 4: Updating Environment Files${NC}"
echo "──────────────────────────────────────"
echo ""

# Update .env
if [ -f .env ]; then
    sed -i.bak "s/^SMTP_USER=.*/SMTP_USER=\"$SMTP_USER\"/" .env
    sed -i.bak "s/^SMTP_PASS=.*/SMTP_PASS=\"$SMTP_PASS\"/" .env
    echo -e "${GREEN}✅ Updated .env${NC}"
fi

# Update .env.production.local
if [ -f .env.production.local ]; then
    sed -i.bak "s/^SMTP_USER=.*/SMTP_USER=\"$SMTP_USER\"/" .env.production.local
    sed -i.bak "s/^SMTP_PASS=.*/SMTP_PASS=\"$SMTP_PASS\"/" .env.production.local
    echo -e "${GREEN}✅ Updated .env.production.local${NC}"
fi

echo ""

# Step 5: Test connection
echo -e "${BLUE}STEP 5: Testing SMTP Connection${NC}"
echo "──────────────────────────────────────"
echo ""
echo "Running connection test..."
echo ""

# Export for test script
export SMTP_USER="$SMTP_USER"
export SMTP_PASS="$SMTP_PASS"
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT=587

node scripts/test-smtp.js

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                        ║${NC}"
    echo -e "${GREEN}║    ✅  GMAIL SMTP CONFIGURED SUCCESSFULLY!             ║${NC}"
    echo -e "${GREEN}║                                                        ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Check your email: $SMTP_USER"
    echo "2. You should have received a test email"
    echo "3. Continue to Option B: Google OAuth Setup"
    echo ""
else
    echo ""
    echo -e "${RED}❌ SMTP test failed. Please check your credentials.${NC}"
    exit 1
fi
