#!/usr/bin/env node
/**
 * SMTP Connection Test Script
 * Tests email sending capability before production deployment
 */

const nodemailer = require('nodemailer');

async function testSMTP() {
    console.log('🧪 Testing SMTP Connection...\n');

    const config = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    };

    console.log('📧 SMTP Configuration:');
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   Secure: ${config.secure}`);
    console.log(`   User: ${config.auth.user}`);
    console.log(`   Pass: ${config.auth.pass ? '***' + config.auth.pass.slice(-4) : 'NOT SET'}\n`);

    if (!config.auth.user || !config.auth.pass) {
        console.error('❌ ERROR: SMTP_USER or SMTP_PASS not configured');
        console.error('   Set environment variables and try again.\n');
        process.exit(1);
    }

    const transporter = nodemailer.createTransport(config);

    // Test 1: Verify connection
    console.log('Test 1: Verifying SMTP connection...');
    try {
        await transporter.verify();
        console.log('✅ SMTP connection verified\n');
    } catch (error) {
        console.error('❌ SMTP verification failed:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Check if 2-Step Verification is enabled on your Google account');
        console.error('2. Generate App Password: https://myaccount.google.com/apppasswords');
        console.error('3. Use the 16-character app password (remove spaces)');
        console.error('4. Make sure SMTP_USER matches the Gmail account\n');
        process.exit(1);
    }

    // Test 2: Send test email
    console.log('Test 2: Sending test email...');
    try {
        const info = await transporter.sendMail({
            from: `"EA Dream Admin" <${config.auth.user}>`,
            to: config.auth.user,
            subject: '✅ SMTP Test - Agent 2 Admin System',
            text: `
This is a test email from the EA Dream Admin System.

If you're receiving this, your SMTP configuration is working correctly!

Configuration tested:
- Host: ${config.host}
- Port: ${config.port}
- Secure: ${config.secure}
- User: ${config.auth.user}

System is ready for production email sending.

---
Etheleen & Alma's Dream, LLC
Agent 2 Admin System
            `.trim(),
            html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #5D3A5C, #7B4B7A); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #D4AF37; margin: 0;">✅ SMTP Test Successful</h1>
    </div>
    <div style="padding: 30px; background: #fff; border: 1px solid #eee; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">
            This is a test email from the <strong>EA Dream Admin System</strong>.
        </p>
        <p style="color: #666;">
            If you're receiving this, your SMTP configuration is working correctly!
        </p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px; color: #5D3A5C;">Configuration Tested:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666;">
                <li>Host: ${config.host}</li>
                <li>Port: ${config.port}</li>
                <li>Secure: ${config.secure}</li>
                <li>User: ${config.auth.user}</li>
            </ul>
        </div>
        <p style="color: #28a745; font-weight: bold;">
            ✅ System is ready for production email sending.
        </p>
    </div>
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>Etheleen & Alma's Dream, LLC<br>Agent 2 Admin System</p>
    </div>
</body>
</html>
            `.trim()
        });

        console.log('✅ Test email sent successfully');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Recipient: ${config.auth.user}\n`);
        console.log('📬 Check your inbox for the test email.\n');
        console.log('🎉 SMTP is fully configured and ready for production!\n');

    } catch (error) {
        console.error('❌ Failed to send test email:', error.message);
        process.exit(1);
    }
}

// Run the test
testSMTP().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
});
