# 🚀 PRODUCTION DEPLOYMENT GUIDE
## Etheleen & Alma's Dream - Agent 2 Admin System

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. **Gmail SMTP Setup** (5 minutes)

#### Generate App Password
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification (if not already enabled)
3. Go to https://myaccount.google.com/apppasswords
4. Select app: **Mail**
5. Select device: **Other (Custom name)**
6. Name it: **EA Dream Admin System**
7. Click **Generate**
8. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

#### Update .env.production.local
```bash
SMTP_USER="yourmeal@eadreamllc.com"
SMTP_PASS="YOUR_16_CHAR_APP_PASSWORD"  # Replace with actual app password
```

#### Test SMTP Connection
```bash
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'yourmeal@eadreamllc.com',
    pass: 'YOUR_APP_PASSWORD_HERE'
  }
});
transporter.verify((error, success) => {
  if (error) console.log('❌ SMTP Error:', error);
  else console.log('✅ SMTP Ready:', success);
});
"
```

---

### 2. **Google Cloud OAuth** (15 minutes)

#### Create OAuth Credentials
1. Go to https://console.cloud.google.com/
2. Create new project: **EA-Dream-Production**
3. Enable APIs:
   - Google Calendar API
   - Gmail API (optional)

#### Configure OAuth Consent Screen
1. Navigate to: **APIs & Services** → **OAuth consent screen**
2. User Type: **External**
3. App Information:
   - App name: **Etheleen & Alma's Dream Admin**
   - User support email: `yourmeal@eadreamllc.com`
   - Developer email: `yourmeal@eadreamllc.com`
4. Scopes: Add **Google Calendar API** scope
5. Test users: Add `yourmeal@eadreamllc.com`

#### Create OAuth 2.0 Client
1. Navigate to: **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: **EA Dream Admin (Production)**
5. Authorized redirect URIs:
   ```
   https://eadreamllc.com/api/auth/google/callback
   ```
6. Click **Create**
7. Copy **Client ID** and **Client Secret**

#### Update Environment Variables
```bash
GOOGLE_CLIENT_ID="your_production_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxxx"
```

---

### 3. **Generate Secure Secrets** (2 minutes)

```bash
# Generate random secret for NextAuth
openssl rand -base64 32

# Update .env.production.local
NEXTAUTH_SECRET="paste_the_generated_secret_here"
AUTH_SECRET="paste_the_generated_secret_here"
```

---

## 🚀 VERCEL DEPLOYMENT

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Link Project
```bash
vercel link
# Select scope: Your account
# Link to existing project? N
# Project name: eadreamsllc-com
# Directory: ./
```

### Step 4: Set Environment Variables
```bash
# Set all production variables
vercel env add NEXTAUTH_SECRET production
vercel env add AUTH_SECRET production
vercel env add DATABASE_URL production
vercel env add ANTHROPIC_API_KEY production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add SMTP_USER production
vercel env add SMTP_PASS production
vercel env add ADMIN_EMAIL production
```

### Step 5: Deploy
```bash
# Production deployment
vercel --prod

# Expected output:
# ✅ Deployed to production: https://eadreamllc.com
```

---

## 🗄️ DATABASE MIGRATION (Production)

### Run Migrations on Production Database
```bash
# This uses the DATABASE_URL from .env.production.local
NODE_ENV=production npx prisma migrate deploy

# Seed admin user
NODE_ENV=production npx prisma db seed
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### 1. Test Website
```bash
curl https://eadreamllc.com
# Should return: 200 OK
```

### 2. Authorize Google Calendar
1. Visit: `https://eadreamllc.com/api/auth/google`
2. Sign in with: `yourmeal@eadreamllc.com`
3. Grant calendar permissions
4. Verify redirect to: `https://eadreamllc.com/admin/dashboard?auth=success`

### 3. Test Admin Login
1. Visit: `https://eadreamllc.com/admin/login`
2. Login:
   - Email: `yourmeal@eadreamllc.com`
   - Password: `admin123`
3. **⚠️ IMMEDIATELY change password after first login**

### 4. Test Email System
1. Submit a test catering request via chatbot
2. Approve it in admin dashboard
3. Check `yourmeal@eadreamllc.com` inbox for confirmation email

### 5. Test Calendar Integration
1. In admin dashboard, click a pending proposal
2. Click "Schedule Tasting"
3. Check Google Calendar for new event

---

## 🔒 SECURITY HARDENING

### Immediate Actions
- [ ] Change admin password from default `admin123`
- [ ] Rotate `NEXTAUTH_SECRET` to generated value
- [ ] Enable Vercel deployment protection
- [ ] Set up custom domain SSL (Vercel auto-provisions)
- [ ] Add IP allowlist to Neon database (optional)

### Monitoring Setup
```bash
# Add Sentry for error tracking
npm install @sentry/nextjs

# Add LogRocket for session replay
npm install logrocket
```

---

## 📊 PRODUCTION METRICS

### Monitor These KPIs
- **Response Time:** Target < 200ms for API routes
- **Error Rate:** Target < 0.1%
- **Email Deliverability:** Target > 99%
- **Calendar Sync Success:** Target > 99.5%
- **Admin Response Time:** Target < 5 min per proposal

### Vercel Analytics
- Enable in Vercel dashboard
- Track page load times
- Monitor API endpoint performance

---

## 🆘 TROUBLESHOOTING

### SMTP Errors
```bash
# Test SMTP from production
vercel env pull .env.production.downloaded
node -e "require('./scripts/test-smtp.js')"
```

### Google Calendar Errors
- Check OAuth token expiration in database
- Re-authorize if needed: visit `/api/auth/google`
- Verify scopes in Google Cloud Console

### Database Connection Errors
- Check Neon database status: https://console.neon.tech/
- Verify connection string has correct SSL mode
- Test connection: `npx prisma db push --skip-generate`

---

## 🎯 PRODUCTION CHECKLIST

- [ ] Gmail app password generated
- [ ] Google OAuth configured
- [ ] Secrets rotated
- [ ] Vercel deployment successful
- [ ] Database migrations run
- [ ] Admin user seeded
- [ ] Google Calendar authorized
- [ ] Email sending verified
- [ ] Admin login tested
- [ ] End-to-end flow verified
- [ ] Admin password changed
- [ ] Monitoring enabled

---

## 📞 SUPPORT

**For production issues:**
- Email: yourmeal@eadreamllc.com
- Documentation: `/docs/AGENT_2_PLAYBOOK.md`
- Quick Start: `/docs/QUICK_START_GUIDE.md`

---

*Production Setup Guide Version: 1.0*
*Last Updated: January 28, 2026*
