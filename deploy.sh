#!/bin/bash
# MASTER DEPLOYMENT SCRIPT
# One command to rule them all

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ███████╗ █████╗     ██████╗ ██████╗ ███████╗ █████╗ ███╗   ███╗
║   ██╔════╝██╔══██╗    ██╔══██╗██╔══██╗██╔════╝██╔══██╗████╗ ████║
║   █████╗  ███████║    ██║  ██║██████╔╝█████╗  ███████║██╔████╔██║
║   ██╔══╝  ██╔══██║    ██║  ██║██╔══██╗██╔══╝  ██╔══██║██║╚██╔╝██║
║   ███████╗██║  ██║    ██████╔╝██║  ██║███████╗██║  ██║██║ ╚═╝ ██║
║   ╚══════╝╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
║                                                               ║
║              AGENT 2 ADMIN SYSTEM - MASTER INSTALLER          ║
║                   Production Deployment Suite                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF

echo ""
echo -e "${CYAN}Welcome to the EA Dream Admin System deployment wizard!${NC}"
echo -e "${CYAN}This script will guide you through the complete setup process.${NC}"
echo ""

# Main Menu
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}                    DEPLOYMENT MENU                      ${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}A.${NC} Gmail SMTP Setup                    (10 minutes)"
echo -e "${GREEN}B.${NC} Google OAuth & Calendar Setup       (15 minutes)"
echo -e "${GREEN}C.${NC} Deploy to Vercel                    (15 minutes)"
echo -e "${GREEN}D.${NC} View ROI Analysis                   (read only)"
echo ""
echo -e "${YELLOW}E.${NC} Complete Setup (A → B → C)          (40 minutes)"
echo -e "${YELLOW}F.${NC} Quick Test (local only)             (5 minutes)"
echo ""
echo -e "${BLUE}Q.${NC} Quit"
echo ""
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
echo ""

read -p "Select option (A/B/C/D/E/F/Q): " -n 1 -r OPTION
echo ""
echo ""

case ${OPTION^^} in
    A)
        echo -e "${GREEN}📧 Starting Gmail SMTP Setup...${NC}"
        echo ""
        ./scripts/setup-gmail.sh
        ;;
    B)
        echo -e "${GREEN}📅 Starting Google OAuth Setup...${NC}"
        echo ""
        ./scripts/setup-google-oauth.sh
        ;;
    C)
        echo -e "${GREEN}🚀 Starting Vercel Deployment...${NC}"
        echo ""
        ./scripts/deploy-to-vercel.sh
        ;;
    D)
        echo -e "${GREEN}💰 Opening ROI Analysis...${NC}"
        echo ""
        if command -v bat &> /dev/null; then
            bat docs/ROI_ANALYSIS.md
        elif command -v less &> /dev/null; then
            less docs/ROI_ANALYSIS.md
        else
            cat docs/ROI_ANALYSIS.md
        fi
        ;;
    E)
        echo -e "${YELLOW}🎯 Starting Complete Setup (A → B → C)...${NC}"
        echo ""
        echo -e "${BLUE}Stage 1/3: Gmail SMTP${NC}"
        ./scripts/setup-gmail.sh
        echo ""
        echo -e "${BLUE}Stage 2/3: Google OAuth${NC}"
        ./scripts/setup-google-oauth.sh
        echo ""
        echo -e "${BLUE}Stage 3/3: Vercel Deployment${NC}"
        ./scripts/deploy-to-vercel.sh
        echo ""
        echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                                                               ║${NC}"
        echo -e "${GREEN}║          🎉  COMPLETE SETUP FINISHED!  🎉                     ║${NC}"
        echo -e "${GREEN}║                                                               ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
        ;;
    F)
        echo -e "${BLUE}🧪 Running Quick Local Test...${NC}"
        echo ""
        echo "1. Checking build..."
        npm run build > /dev/null 2>&1 && echo -e "${GREEN}   ✅ Build successful${NC}" || echo -e "${RED}   ❌ Build failed${NC}"
        
        echo "2. Checking database connection..."
        npx prisma db push --skip-generate > /dev/null 2>&1 && echo -e "${GREEN}   ✅ Database connected${NC}" || echo -e "${RED}   ❌ Database connection failed${NC}"
        
        echo "3. Checking admin user..."
        npx prisma db seed > /dev/null 2>&1 && echo -e "${GREEN}   ✅ Admin user seeded${NC}" || echo -e "${YELLOW}   ⚠️  Already seeded${NC}"
        
        echo ""
        echo -e "${YELLOW}Starting dev server...${NC}"
        echo "Visit: http://localhost:3000/admin/login"
        echo "Email: yourmeal@eadreamllc.com"
        echo "Password: admin123"
        echo ""
        npm run dev
        ;;
    Q)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}           Thank you for using EA Dream Deploy!            ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
