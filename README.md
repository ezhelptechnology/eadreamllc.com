# 🚀 EA Dream Admin System - Quick Start

## ONE-COMMAND DEPLOYMENT

```bash
./deploy.sh
```

That's it! The wizard will guide you through:
- ✅ Gmail SMTP setup
- ✅ Google OAuth configuration
- ✅ Vercel deployment
- ✅ Database migrations
- ✅ Admin user creation

---

## MENU OPTIONS

**A.** Gmail SMTP Setup (10 min)  
**B.** Google OAuth Setup (15 min)  
**C.** Deploy to Vercel (15 min)  
**D.** View ROI Analysis  
**E.** Complete Setup (A → B → C)  
**F.** Quick Local Test  

---

## INSTANT LOCAL TEST

```bash
./deploy.sh
# Select: F (Quick Test)
```

Launches dev server with:
- Admin login ready
- Database connected
- Test proposals loaded

---

## PRODUCTION DEPLOYMENT

```bash
./deploy.sh
# Select: E (Complete Setup)
```

Follow the interactive wizard. You'll need:
1. Gmail account password (for app password)
2. Google Cloud Console access (for OAuth)
3. Vercel account (free tier works)

**Time:** 40 minutes  
**Cost:** $0 setup, $600/year operating  
**ROI:** 187,633% first year

See `docs/ROI_ANALYSIS.md` for details.

---

## INDIVIDUAL SCRIPTS

```bash
# Gmail only
./scripts/setup-gmail.sh

# Google OAuth only
./scripts/setup-google-oauth.sh

# Vercel deployment only
./scripts/deploy-to-vercel.sh

# Test SMTP
node scripts/test-smtp.js

# Generate secrets
node scripts/generate-secrets.js
```

---

## DOCUMENTATION

| Document | Purpose |
|----------|---------|
| `PRODUCTION_SETUP.md` | Complete deployment guide |
| `PRODUCTION_CHECKLIST.md` | Pre-launch checklist |
| `docs/AGENT_2_PLAYBOOK.md` | System behavior guide |
| `docs/QUICK_START_GUIDE.md` | 7-day roadmap |
| `docs/ROI_ANALYSIS.md` | Financial analysis |

---

## SUPPORT

**Admin Email:** yourmeal@eadreamllc.com  
**Admin Password:** admin123 (CHANGE IMMEDIATELY)  
**Dashboard:** https://eadreamllc.com/admin

---

**Version:** 1.0.0  
**Last Updated:** January 28, 2026
