import nodemailer from 'nodemailer';

interface EmailParams {
    to: string;
    subject: string;
    template: string;
    data: Record<string, unknown>;
}

interface ProposalApprovedData {
    client_name: string;
    proposal_content: string;
    total: number;
    deposit: number;
    proposal_id: string;
}

// Email transporter
const getTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// Email templates
const templates: Record<string, (data: Record<string, unknown>) => { html: string; text: string }> = {
    proposal_approved: (data) => {
        const d = data as unknown as ProposalApprovedData;
        const firstName = d.client_name.split(' ')[0];

        return {
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background: #f5f3ef;">
    <div style="max-width: 680px; margin: 0 auto; background: #fff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #5D3A5C 0%, #7B4B7A 100%); padding: 50px 40px; text-align: center;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 32px; letter-spacing: 3px;">ETHELEEN & ALMA'S DREAM</h1>
            <p style="color: #fff; margin: 15px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 4px;">Bespoke Catering Excellence</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 50px 40px; text-align: center;">
            <h2 style="color: #5D3A5C; margin: 0 0 20px; font-size: 28px;">Your Proposal is Ready! 🎉</h2>
            <p style="color: #666; font-size: 18px; line-height: 1.8; margin: 0;">
                Dear ${firstName},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.8; margin: 20px 0;">
                We're thrilled to present your personalized catering proposal. Our team has carefully crafted a menu 
                designed specifically for your event, ensuring every detail reflects your vision.
            </p>
        </div>

        <!-- Pricing Highlight -->
        <div style="padding: 40px; background: linear-gradient(135deg, #D4AF37 0%, #c9a430 100%); text-align: center;">
            <p style="color: #5D3A5C; margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Your Investment</p>
            <p style="color: #5D3A5C; margin: 0; font-size: 48px; font-weight: bold;">$${d.total.toFixed(2)}</p>
            <p style="color: #5D3A5C; margin: 15px 0 0; font-size: 14px;">50% Deposit: $${d.deposit.toFixed(2)}</p>
        </div>

        <!-- CTA -->
        <div style="padding: 50px 40px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://eadreamllc.com'}/proposals/${d.proposal_id}" 
               style="display: inline-block; background: #5D3A5C; color: #D4AF37; padding: 18px 50px; text-decoration: none; font-size: 16px; font-weight: bold; letter-spacing: 2px; border-radius: 50px;">
                VIEW FULL PROPOSAL
            </a>
            <p style="color: #999; font-size: 14px; margin: 30px 0 0;">
                Proposal Reference: ${d.proposal_id}
            </p>
        </div>

        <!-- Next Steps -->
        <div style="padding: 40px; background: #faf8f5; border-top: 1px solid #eee;">
            <h3 style="color: #5D3A5C; margin: 0 0 20px; font-size: 18px;">Next Steps</h3>
            <ol style="color: #666; font-size: 15px; line-height: 2; margin: 0; padding-left: 20px;">
                <li>Review your personalized proposal</li>
                <li>Schedule your complimentary tasting (highly recommended!)</li>
                <li>Confirm your booking with the 50% deposit</li>
                <li>We'll handle the rest!</li>
            </ol>
        </div>

        <!-- Contact -->
        <div style="padding: 40px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0 0 15px; font-size: 16px;">Questions? We're here to help!</p>
            <p style="margin: 0;">
                <a href="mailto:yourmeal@eadreamllc.com" style="color: #5D3A5C; text-decoration: none; margin: 0 15px;">📧 yourmeal@eadreamllc.com</a>
                <a href="tel:6023184925" style="color: #5D3A5C; text-decoration: none; margin: 0 15px;">📱 (602) 318-4925</a>
            </p>
        </div>

        <!-- Footer -->
        <div style="padding: 30px 40px; background: #333; text-align: center;">
            <p style="color: #888; margin: 0; font-size: 12px;">
                Etheleen & Alma's Dream, LLC | Serving the Greater Charlotte Area<br>
                © ${new Date().getFullYear()} All Rights Reserved
            </p>
        </div>
    </div>
</body>
</html>
            `.trim(),
            text: `
Your Proposal is Ready!

Dear ${firstName},

We're thrilled to present your personalized catering proposal.

YOUR INVESTMENT: $${d.total.toFixed(2)}
50% Deposit Required: $${d.deposit.toFixed(2)}

View your full proposal: ${process.env.NEXT_PUBLIC_APP_URL || 'https://eadreamllc.com'}/proposals/${d.proposal_id}

NEXT STEPS:
1. Review your personalized proposal
2. Schedule your complimentary tasting
3. Confirm your booking with the 50% deposit
4. We'll handle the rest!

Questions? Contact us:
📧 yourmeal@eadreamllc.com
📱 (602) 318-4925

---
Etheleen & Alma's Dream, LLC
Proposal Reference: ${d.proposal_id}
            `.trim()
        };
    },

    follow_up: (data) => {
        const firstName = (data.client_name as string).split(' ')[0];
        return {
            html: `
<!DOCTYPE html>
<html>
<body style="font-family: Georgia, serif; background: #f5f3ef; padding: 40px;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: #5D3A5C; padding: 30px; text-align: center;">
            <h1 style="color: #D4AF37; margin: 0;">Just Checking In! 👋</h1>
        </div>
        <div style="padding: 40px;">
            <p style="font-size: 16px; color: #333; line-height: 1.8;">
                Hi ${firstName},
            </p>
            <p style="font-size: 16px; color: #666; line-height: 1.8;">
                We hope you've had a chance to review your catering proposal. We're excited about the possibility 
                of making your event unforgettable and wanted to see if you have any questions.
            </p>
            <p style="font-size: 16px; color: #666; line-height: 1.8;">
                Would you like to schedule a tasting? It's the perfect way to experience our food before your event!
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/proposals/${data.proposal_id}" 
                   style="display: inline-block; background: #D4AF37; color: #5D3A5C; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold;">
                    View Your Proposal
                </a>
            </div>
            <p style="font-size: 14px; color: #999; text-align: center;">
                Reply to this email or call us at (602) 318-4925
            </p>
        </div>
    </div>
</body>
</html>
            `.trim(),
            text: `Hi ${firstName}, just checking in on your catering proposal. Any questions?`
        };
    },

    tasting_scheduled: (data) => {
        const firstName = (data.client_name as string).split(' ')[0];
        return {
            html: `
<!DOCTYPE html>
<html>
<body style="font-family: Georgia, serif; background: #f5f3ef; padding: 40px;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #5D3A5C, #7B4B7A); padding: 40px; text-align: center;">
            <h1 style="color: #D4AF37; margin: 0;">Your Tasting is Confirmed! 🍽️</h1>
        </div>
        <div style="padding: 40px;">
            <p style="font-size: 16px; color: #333; line-height: 1.8;">
                Hello ${firstName},
            </p>
            <p style="font-size: 16px; color: #666; line-height: 1.8;">
                We're excited to host you for a tasting experience!
            </p>
            <div style="background: #faf8f5; padding: 25px; border-radius: 12px; margin: 25px 0;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #888;">📅 Date & Time</p>
                <p style="margin: 0; font-size: 20px; color: #5D3A5C; font-weight: bold;">${data.date_time}</p>
            </div>
            <p style="font-size: 14px; color: #666; line-height: 1.8;">
                During your tasting, you'll sample selections from your proposed menu. Feel free to bring 
                up to 2 guests to help you decide!
            </p>
        </div>
    </div>
</body>
</html>
            `.trim(),
            text: `Your tasting is confirmed for ${data.date_time}!`
        };
    }
};

export async function sendEmail(params: EmailParams): Promise<boolean> {
    const transporter = getTransporter();

    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('=== EMAIL (SMTP Not Configured) ===');
        console.log(`To: ${params.to}`);
        console.log(`Subject: ${params.subject}`);
        console.log(`Template: ${params.template}`);
        console.log(`Data:`, JSON.stringify(params.data, null, 2));
        console.log('===================================');
        return true;
    }

    try {
        const templateFn = templates[params.template];
        if (!templateFn) {
            throw new Error(`Template "${params.template}" not found`);
        }

        const { html, text } = templateFn(params.data);

        await transporter.sendMail({
            from: `"Etheleen & Alma's Dream" <${process.env.SMTP_USER}>`,
            to: params.to,
            subject: params.subject,
            html,
            text,
        });

        console.log(`✅ Email sent to ${params.to}: ${params.subject}`);
        return true;
    } catch (error) {
        console.error('❌ Email error:', error);
        return false;
    }
}

export async function sendFollowUpEmail(
    clientEmail: string,
    clientName: string,
    proposalId: string
): Promise<boolean> {
    return sendEmail({
        to: clientEmail,
        subject: `Quick check-in on your catering proposal - EA Dream`,
        template: 'follow_up',
        data: { client_name: clientName, proposal_id: proposalId }
    });
}

export async function sendTastingConfirmation(
    clientEmail: string,
    clientName: string,
    dateTime: string
): Promise<boolean> {
    return sendEmail({
        to: clientEmail,
        subject: `Your Tasting is Confirmed! 🍽️ - EA Dream`,
        template: 'tasting_scheduled',
        data: { client_name: clientName, date_time: dateTime }
    });
}
