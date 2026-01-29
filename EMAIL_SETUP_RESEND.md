# Email Setup with Resend (No Client Password Needed!)

## Why Resend?
- ✅ **No Gmail password needed** - Perfect for client emails
- ✅ **Free tier**: 3,000 emails/month
- ✅ **Professional delivery** - Better than Gmail for transactional emails
- ✅ **5-minute setup**
- ✅ **Can send from yourmeal@eadreamllc.com** (after domain verification)

## Setup Steps

### Step 1: Create Resend Account (2 minutes)
1. Go to https://resend.com/signup
2. Sign up with YOUR email (not your client's)
3. Verify your email

### Step 2: Get API Key (1 minute)
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name it: `EA Dreams Catering`
4. Select permissions: "Sending access"
5. Click "Create"
6. **Copy the API key** (starts with `re_...`)

### Step 3: Update Environment Variables (1 minute)

#### For Local Development (.env):
```bash
# Comment out or remove old SMTP settings
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT=587
# SMTP_USER="yourmeal@eadreamllc.com"
# SMTP_PASS="your-gmail-app-password-here"

# Add Resend
RESEND_API_KEY="re_your_api_key_here"
ADMIN_EMAIL="yourmeal@eadreamllc.com"
```

#### For Production (.env.production.local):
```bash
RESEND_API_KEY="re_your_api_key_here"
ADMIN_EMAIL="yourmeal@eadreamllc.com"
```

### Step 4: Verify Domain (Optional but Recommended)
This allows emails to come FROM `yourmeal@eadreamllc.com` instead of a Resend address.

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter: `eadreamllc.com`
4. Follow the DNS setup instructions (add TXT, MX, and CNAME records)
5. Ask your client or their hosting provider to add these DNS records
6. Wait for verification (usually 5-30 minutes)

**Without domain verification:**
- Emails will come from: `onboarding@resend.dev`
- Reply-to will be: `yourmeal@eadreamllc.com`
- Still works fine, just less professional

**With domain verification:**
- Emails will come from: `yourmeal@eadreamllc.com`
- Looks completely professional ✨

### Step 5: Test (1 minute)
```bash
npm run dev
# Submit a test catering request
# Check email delivery in Resend dashboard
```

## Alternative: Use Your Own Email

If you don't want to use Resend, you can use YOUR OWN Gmail account to send emails on behalf of your client:

### Option 2: Use Your Gmail (Quick Fix)

1. Use YOUR Gmail account credentials
2. Emails will appear to come from your client

#### Update .env:
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"  # YOUR Gmail
SMTP_PASS="your-app-password"      # YOUR Gmail App Password
ADMIN_EMAIL="yourmeal@eadreamllc.com"  # Client's email (for receiving)
```

The code will:
- Send FROM: `"Etheleen & Alma's Dream" <your-email@gmail.com>`
- Reply-to: Can be configured to client's email
- Admin notifications go to: `yourmeal@eadreamllc.com`

**Pros:**
- ✅ Works immediately
- ✅ No client password needed

**Cons:**
- ❌ Emails come from your Gmail (less professional)
- ❌ Gmail has daily sending limits (500/day)

## Alternative: SendGrid

Another option similar to Resend:

1. Sign up at https://sendgrid.com (Free: 100 emails/day)
2. Get API key
3. Similar setup process

## Recommended Approach

**For Production:** Use Resend with domain verification
**For Testing:** Use your own Gmail temporarily

Would you like me to implement the Resend integration now?
