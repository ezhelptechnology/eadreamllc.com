# Email Setup Guide

## Current Status
❌ **Email is NOT working** - Gmail App Password needs to be configured

## Quick Fix (5 minutes)

### Step 1: Generate Gmail App Password
1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Under "How you sign in to Google", click **2-Step Verification**
   - If not enabled, you'll need to enable it first
4. Scroll down and click **App passwords**
5. In the "App name" field, type: `EA Dreams Catering Website`
6. Click **Create**
7. Google will show you a 16-character password (like: `abcd efgh ijkl mnop`)
8. **Copy this password** (you won't see it again!)

### Step 2: Update Environment Variables

#### For Local Development (.env):
```bash
SMTP_USER="yourmeal@eadreamllc.com"
SMTP_PASS="abcd efgh ijkl mnop"  # Replace with your actual app password (remove spaces)
```

#### For Production (.env.production.local):
```bash
SMTP_USER="yourmeal@eadreamllc.com"
SMTP_PASS="abcd efgh ijkl mnop"  # Replace with your actual app password (remove spaces)
```

### Step 3: Restart Your Development Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 4: Test Email
1. Go to http://localhost:3000
2. Click "Build My Menu" button
3. Fill out the form completely
4. Submit the request
5. Check `yourmeal@eadreamllc.com` inbox for the email

## Troubleshooting

### "Less secure app access" error
- Gmail no longer supports "Less secure apps"
- You MUST use an App Password (see Step 1)

### Still not receiving emails?
1. Check spam folder
2. Verify the email address is correct: `yourmeal@eadreamllc.com`
3. Make sure 2-Step Verification is enabled on the Google account
4. Try generating a new App Password

### Email works locally but not in production?
1. Update the `.env.production.local` file with the same App Password
2. Redeploy to Vercel
3. Add the environment variables in Vercel dashboard:
   - Go to: https://vercel.com/your-project/settings/environment-variables
   - Add: `SMTP_USER` = `yourmeal@eadreamllc.com`
   - Add: `SMTP_PASS` = `your-app-password`
   - Redeploy

## Current Email Flow

When a customer submits a catering request:

1. **Customer receives**: Confirmation email with their submission details
2. **Admin receives**: Detailed report with all customer info and menu selections

Both emails are sent automatically via the `/api/catering/submit` endpoint.

## Need Help?

If emails still aren't working after following these steps, check:
- Server logs for SMTP errors
- Gmail account security settings
- That you're using the correct Google account (yourmeal@eadreamllc.com)
