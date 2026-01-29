import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmailParams {
    to: string;
    subject: string;
    html: string;
    text: string;
    from?: string;
}

/**
 * Send email using Resend (preferred) or fallback to SMTP
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
    const fromEmail = params.from || process.env.ADMIN_EMAIL || 'yourmeal@eadreamllc.com';
    const fromName = 'Etheleen & Alma\'s Dream';
    const fromAddress = `"${fromName}" <${fromEmail}>`;

    // Try Resend first (if configured)
    if (resend && process.env.RESEND_API_KEY) {
        try {
            console.log(`📧 Sending email via Resend to ${params.to}...`);

            const { data, error } = await resend.emails.send({
                from: fromAddress,
                to: params.to,
                subject: params.subject,
                html: params.html,
                text: params.text,
            });

            if (error) {
                console.error('❌ Resend error:', error);
                throw error;
            }

            console.log(`✅ Email sent via Resend! ID: ${data?.id}`);
            return true;
        } catch (error) {
            console.error('❌ Resend failed, trying SMTP fallback...', error);
            // Fall through to SMTP
        }
    }

    // Fallback to SMTP (if configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
            console.log(`📧 Sending email via SMTP to ${params.to}...`);

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: fromAddress,
                to: params.to,
                subject: params.subject,
                html: params.html,
                text: params.text,
            });

            console.log(`✅ Email sent via SMTP!`);
            return true;
        } catch (error) {
            console.error('❌ SMTP error:', error);
            throw error;
        }
    }

    // No email service configured
    console.log('⚠️  No email service configured (Resend or SMTP)');
    console.log('=== EMAIL PREVIEW ===');
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${params.subject}`);
    console.log(`From: ${fromAddress}`);
    console.log('--- TEXT VERSION ---');
    console.log(params.text);
    console.log('====================');

    return false;
}

/**
 * Send catering request confirmation to customer
 */
export async function sendCustomerConfirmation(data: {
    customerName: string;
    customerEmail: string;
    proposalRef: string;
    eventType: string;
    eventDate: string;
    headcount: number;
    proteins: string[];
    preparation: string;
    sides: string;
    bread: string;
    allergies: string;
    estimatedCost: number;
    pricePerPerson: number;
}): Promise<boolean> {
    const firstName = data.customerName.split(' ')[0];

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Catering Proposal</title>
</head>
<body style="font-family: 'Georgia', serif; background-color: #f8f5f0; margin: 0; padding: 20px;">
    <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #5D3A5C 0%, #7B4B7A 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 28px; letter-spacing: 2px;">ETHELEEN & ALMA'S DREAM</h1>
            <p style="color: #fff; margin: 10px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">Bespoke Catering Excellence</p>
        </div>

        <!-- Thank You Message -->
        <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #eee;">
            <h2 style="color: #5D3A5C; margin: 0 0 15px;">Thank You, ${firstName}! 🎉</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0;">
                We've received your catering request and are thrilled to help create an unforgettable experience for your event.
            </p>
        </div>

        <!-- Order Summary -->
        <div style="padding: 30px; background: #faf8f5;">
            <h3 style="color: #5D3A5C; margin: 0 0 20px; padding-bottom: 10px; border-bottom: 2px solid #D4AF37;">
                📋 Your Submission Summary
            </h3>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888; width: 40%;">Reference Number</td>
                    <td style="padding: 12px 0; color: #333; font-weight: bold;">${data.proposalRef}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Your Name</td>
                    <td style="padding: 12px 0; color: #333;">${data.customerName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Event Type</td>
                    <td style="padding: 12px 0; color: #333;">${data.eventType || 'Special Event'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Event Date</td>
                    <td style="padding: 12px 0; color: #333;">${data.eventDate || 'To be confirmed'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Guest Count</td>
                    <td style="padding: 12px 0; color: #333;">${data.headcount} attendees</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Protein Selections</td>
                    <td style="padding: 12px 0; color: #333;">${data.proteins.join(', ')}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Preparation Style</td>
                    <td style="padding: 12px 0; color: #333;">${data.preparation || 'Chef\'s choice'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Side Dishes</td>
                    <td style="padding: 12px 0; color: #333;">${data.sides || 'Chef\'s selection'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Bread Selection</td>
                    <td style="padding: 12px 0; color: #333;">${data.bread || 'Artisan rolls'}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; color: #888;">Dietary Notes</td>
                    <td style="padding: 12px 0; color: #333;">${data.allergies || 'None specified'}</td>
                </tr>
            </table>
        </div>

        <!-- Estimated Pricing -->
        <div style="padding: 30px; background: #5D3A5C; color: white;">
            <h3 style="margin: 0 0 15px; color: #D4AF37;">💰 Estimated Investment</h3>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="margin: 0; font-size: 14px; opacity: 0.8;">Based on your selections</p>
                    <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.8;">${data.headcount} guests × $${data.pricePerPerson}/person</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; font-size: 32px; font-weight: bold; color: #D4AF37;">$${data.estimatedCost.toLocaleString()}</p>
                    <p style="margin: 0; font-size: 12px; opacity: 0.7;">*Final pricing confirmed after review</p>
                </div>
            </div>
        </div>

        <!-- Next Steps -->
        <div style="padding: 30px;">
            <h3 style="color: #5D3A5C; margin: 0 0 20px;">🚀 What Happens Next?</h3>
            <ol style="color: #666; line-height: 1.8; padding-left: 20px; margin: 0;">
                <li><strong>We Review</strong> - Our team reviews your request within 24 hours</li>
                <li><strong>Personalized Proposal</strong> - We'll send your detailed, customized proposal</li>
                <li><strong>Consultation</strong> - We'll reach out to discuss your event details</li>
                <li><strong>Confirm & Secure</strong> - Sign agreement and secure your date</li>
            </ol>
        </div>

        <!-- Contact -->
        <div style="padding: 30px; background: #faf8f5; text-align: center;">
            <p style="color: #666; margin: 0 0 15px;">Questions? We're here to help!</p>
            <p style="margin: 0;">
                <a href="mailto:yourmeal@eadreamllc.com" style="color: #5D3A5C; text-decoration: none; margin: 0 15px;">📧 yourmeal@eadreamllc.com</a>
                <a href="tel:6023184925" style="color: #5D3A5C; text-decoration: none; margin: 0 15px;">📱 (602) 318-4925</a>
            </p>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 30px; background: #333; text-align: center;">
            <p style="color: #888; margin: 0; font-size: 12px;">
                Etheleen & Alma's Dream, LLC | Serving the Greater Charlotte Area<br>
                © ${new Date().getFullYear()} All Rights Reserved
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();

    const text = `
Thank You, ${firstName}! 🎉

We've received your catering request and are thrilled to help create an unforgettable experience for your event.

📋 YOUR SUBMISSION SUMMARY
--------------------------
Reference Number: ${data.proposalRef}
Your Name: ${data.customerName}
Event Type: ${data.eventType || 'Special Event'}
Event Date: ${data.eventDate || 'To be confirmed'}
Guest Count: ${data.headcount} attendees
Protein Selections: ${data.proteins.join(', ')}
Preparation Style: ${data.preparation || 'Chef\'s choice'}
Side Dishes: ${data.sides || 'Chef\'s selection'}
Bread Selection: ${data.bread || 'Artisan rolls'}
Dietary Notes: ${data.allergies || 'None specified'}

💰 ESTIMATED INVESTMENT
-----------------------
${data.headcount} guests × $${data.pricePerPerson}/person = $${data.estimatedCost.toLocaleString()}
*Final pricing confirmed after review

🚀 WHAT HAPPENS NEXT?
---------------------
1. We Review - Our team reviews your request within 24 hours
2. Personalized Proposal - We'll send your detailed, customized proposal
3. Consultation - We'll reach out to discuss your event details
4. Confirm & Secure - Sign agreement and secure your date

Questions? Contact us:
📧 yourmeal@eadreamllc.com
📱 (602) 318-4925

--
Etheleen & Alma's Dream, LLC
Serving the Greater Charlotte Area
    `.trim();

    return sendEmail({
        to: data.customerEmail,
        subject: `✨ Thank You ${firstName}! Your Catering Request [${data.proposalRef}]`,
        html,
        text,
    });
}

/**
 * Send admin notification about new catering request
 */
export async function sendAdminNotification(data: {
    requestId: string;
    proposalRef: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventType: string;
    eventDate: string;
    headcount: number;
    proteins: string[];
    preparation: string;
    sides: string;
    bread: string;
    allergies: string;
    estimatedCost: number;
    pricePerPerson: number;
}): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || 'yourmeal@eadreamllc.com';

    const text = `
🚨 NEW CATERING REQUEST - ACTION REQUIRED 🚨
============================================

📋 REQUEST DETAILS
------------------
Request ID: ${data.requestId}
Proposal Ref: ${data.proposalRef}
Submitted: ${new Date().toLocaleString()}
Status: PENDING ADMIN REVIEW

👤 CUSTOMER INFORMATION
-----------------------
1. Name: ${data.customerName}
2. Email: ${data.customerEmail}
3. Phone: ${data.customerPhone || 'Not provided'}
4. Event Type: ${data.eventType || 'Not specified'}
5. Event Date: ${data.eventDate || 'TBD'}
6. Guest Count: ${data.headcount}

🍽️ MENU SELECTIONS
-------------------
7. Proteins: ${data.proteins.join(', ')}
8. Preparation Style: ${data.preparation || 'Not specified'}
9. Sides: ${data.sides || 'Not specified'}
10. Bread: ${data.bread || 'Not specified'}
11. Allergies/Dietary: ${data.allergies || 'None'}

💰 PRICING (AUTO-CALCULATED)
-----------------------------
12. Rate: $${data.pricePerPerson} per person
13. Subtotal: $${data.estimatedCost.toFixed(2)}
14. Estimated Tax (7.25%): $${(data.estimatedCost * 0.0725).toFixed(2)}
15. TOTAL: $${(data.estimatedCost * 1.0725).toFixed(2)}
16. Deposit (50%): $${(data.estimatedCost * 1.0725 * 0.5).toFixed(2)}

============================================
⚡ ACTION: Review and approve this proposal
🔗 Admin Dashboard: https://eadreamsllc.com/admin
============================================
    `.trim();

    return sendEmail({
        to: adminEmail,
        subject: `🚨 [ACTION REQUIRED] New Request: ${data.customerName} - ${data.proposalRef}`,
        html: `<pre style="font-family: monospace; font-size: 14px; line-height: 1.6;">${text}</pre>`,
        text,
    });
}
