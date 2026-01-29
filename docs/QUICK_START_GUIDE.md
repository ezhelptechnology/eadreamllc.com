# 🚀 AGENT 2 ADMIN SYSTEM - QUICK START GUIDE
## From Zero to Billion-Dollar Experience in 7 Days

---

## 📋 TABLE OF CONTENTS

1. System Architecture Overview
2. Prerequisites
3. Day 1: Database Setup
4. Day 2: Google Calendar Integration
5. Day 3: Admin Dashboard
6. Day 4: Agent 2 AI Integration
7. Day 5: Contract Generation
8. Day 6: Testing & QA
9. Day 7: Launch

---

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────┐
│  Agent 1        │  ← Client-facing chatbot
│  (Chatbot)      │     Collects data, validates
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validation     │  ← Zero-error quality gate
│  Bot            │     37+ checks before admin
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Agent 2        │  ← Admin AI Assistant
│  (Admin AI)     │     Analyzes, recommends, executes
└────────┬────────┘
         │
         ├──────────► Google Calendar (tastings, events)
         ├──────────► Contract Generator
         ├──────────► Email System (client comms)
         └──────────► Admin Dashboard (human oversight)
```

---

## ✅ PREREQUISITES

### Required Services

| Service | Purpose | Cost |
|---------|---------|------|
| **Google Cloud** | Calendar API | Free tier |
| **Anthropic API** | Agent 2 (Claude) | ~$50/mo |
| **PostgreSQL** | Database | Free tier |
| **SMTP** | Email | Free tier |

---

## 📅 DAY 1: DATABASE SETUP

### Run Database Migration

```bash
# Generate migration
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

All tables created:
- Proposal (with ProposalStatus enum)
- Contract (with ContractStatus enum)
- CalendarEvent (with EventType enum)
- Task (with TaskStatus, TaskPriority enums)
- ChangeLog
- AdminLog
- GoogleTokens

---

## 📅 DAY 2: GOOGLE CALENDAR INTEGRATION

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Create new project: "EA-Dream-Admin"
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials

### Step 2: Add Environment Variables

```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here  
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

### Step 3: Authorize

Visit `/api/auth/google` to complete OAuth flow.

---

## 📅 DAY 3: ADMIN DASHBOARD

Dashboard available at `/admin/dashboard`

Features:
- Metrics overview
- Agent 2 suggestions panel
- Proposals table with filtering
- Approval/Deny/Modify actions
- Calendar integration

---

## 📅 DAY 4: AGENT 2 AI INTEGRATION

API Endpoints:
- `GET /api/agent2/initialize` - Load suggestions & metrics
- `POST /api/agent2/analyze` - Analyze specific proposal

Agent 2 provides:
- Quality scores (0-100)
- Risk assessments
- Upsell opportunities
- Profit analysis
- Recommendations

---

## 📅 DAY 5: CONTRACT GENERATION

Contracts auto-generated with:
- Client information
- Event details
- Menu selections
- Pricing breakdown
- Terms and conditions
- Signature blocks

---

## 📅 DAY 6: TESTING

### Checklist

- [ ] Agent 1 → Agent 2 handoff works
- [ ] Validation catches errors
- [ ] Agent 2 analysis is accurate
- [ ] Approve workflow sends email
- [ ] Calendar events created correctly
- [ ] Contracts generate properly
- [ ] Admin auth protects routes

---

## 📅 DAY 7: LAUNCH

### Deploy

```bash
# Deploy to Vercel
vercel --prod

# Run migrations
npx prisma migrate deploy

# Authorize Google Calendar
# Visit /api/auth/google
```

---

## 📊 SUCCESS METRICS

| Metric | Target |
|--------|--------|
| Proposals processed/day | 20+ |
| Admin time per proposal | <5 min |
| Agent 2 recommendation acceptance | >80% |
| Close rate | >70% |

---

## 🎯 FINAL CHECKLIST

- [ ] Agent 1 → Agent 2 → Admin flow works
- [ ] Google Calendar integration working
- [ ] Contracts generate correctly
- [ ] Admin can approve/modify/deny
- [ ] Email notifications send
- [ ] Dashboard is responsive
- [ ] System is secure

**You're ready to handle 1000+ proposals/month with a single admin.**

---

*Quick Start Guide Version: 1.0*
*Last Updated: January 28, 2026*
