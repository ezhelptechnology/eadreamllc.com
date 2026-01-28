import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generatePersonalizedProposal, CustomerInfo } from '@/lib/claude';
import { sendThankYouSms } from '@/lib/sms';
import nodemailer from 'nodemailer';
import { logError } from '@/lib/logger';

interface CateringRequest {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    eventDate: string | null;
    eventLocation: string | null;
    eventType: string | null;
    headcount: number;
    proteins: string;
    preparation: string | null;
    sides: string | null;
    bread: string | null;
    allergies: string | null;
    status: string;
}

interface Proposal {
    id: string;
    content: string;
    estimatedCost: number;
    version: number;
    status: string;
    requestId: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            eventDate,
            eventLocation,
            eventType,
            headcount,
            proteins,
            preparation,
            sides,
            bread,
            allergies
        } = body;

        // Validate required fields
        if (!customerName || !customerEmail || !proteins || proteins.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create the catering request
        console.log('Creating catering request in DB...');
        const cateringRequest = await prisma.cateringRequest.create({
            data: {
                customerName,
                customerEmail,
                customerPhone: customerPhone || null,
                eventDate: eventDate || null,
                eventLocation: eventLocation || null,
                eventType: eventType || null,
                headcount: headcount || 50,
                proteins: JSON.stringify(proteins),
                preparation: preparation || null,
                sides: sides || null,
                bread: bread || null,
                allergies: allergies || null,
                status: 'PENDING',
            },
        });
        console.log('Catering request created:', cateringRequest.id);

        // Build customer info for personalized proposal
        const customerInfo: CustomerInfo = {
            customerName,
            customerEmail,
            customerPhone: customerPhone || '',
            eventDate: eventDate || 'TBD',
            eventLocation: eventLocation || 'TBD',
            eventType: eventType || '',
            headcount: headcount || 50,
            proteins,
            preparation: preparation || 'Chef\'s Choice',
            sides: sides || 'Chef\'s Selection',
            bread: bread || 'Artisan Rolls',
            allergies: allergies || 'None'
        };

        // Generate personalized proposal with all their answers populated
        console.log('Generating personalized proposal with Claude...');
        const proposalContent = await generatePersonalizedProposal(customerInfo);
        console.log('Proposal content generated.');

        // Calculate estimated cost
        const hasSteak = proteins.some((p: string) => p.toLowerCase().includes('steak'));
        const hasSeafood = proteins.some((p: string) =>
            p.toLowerCase().includes('seafood') ||
            p.toLowerCase().includes('fish') ||
            p.toLowerCase().includes('shrimp')
        );
        const rate = (hasSteak || hasSeafood) ? 30 : 25;
        const estimatedCost = rate * (headcount || 50);

        // Create the proposal in DB (status: DRAFT - pending admin approval)
        console.log('Creating proposal in DB...');
        const proposal = await prisma.proposal.create({
            data: {
                content: proposalContent,
                estimatedCost,
                version: 1,
                status: 'DRAFT', // Pending admin review
                requestId: cateringRequest.id,
            },
        });

        // Generate proposal ID for customer reference
        const proposalRef = `EA-${cateringRequest.id.slice(-8).toUpperCase()}`;

        // Send SMS thank you with their submission summary
        if (customerPhone && customerPhone.toLowerCase() !== 'skip') {
            await sendThankYouSms({
                customerName,
                customerPhone,
                eventDate: eventDate || 'TBD',
                headcount: headcount || 50,
                proteins,
                proposalId: proposalRef
            });
        }

        // Send emails (customer gets generic proposal, admin gets full report)
        await sendEmails(cateringRequest, proposal, body, proposalRef);

        // Update request status
        await prisma.cateringRequest.update({
            where: { id: cateringRequest.id },
            data: { status: 'PROPOSAL_SENT' },
        });

        return NextResponse.json({
            success: true,
            requestId: cateringRequest.id,
            proposalId: proposal.id,
            proposalRef,
            message: 'Your custom proposal has been sent to your email!'
        });

    } catch (error: unknown) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        await logError(errorObj, { source: 'CATERING_SUBMIT', path: '/api/catering/submit' });

        console.error('Error creating catering request:', error);
        const errorMessage = errorObj.message;
        const errorStack = errorObj.stack;
        return NextResponse.json({
            error: 'Failed to create request',
            details: errorMessage,
            stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
        }, { status: 500 });
    }
}

async function sendEmails(
    request: CateringRequest,
    proposal: Proposal,
    selections: { proteins: string[]; preparation?: string; sides?: string; bread?: string; allergies?: string },
    proposalRef: string
) {
    const adminEmail = 'yourmeal@eadreamllc.com';
    const firstName = request.customerName.split(' ')[0];

    // ============================================
    // ADMIN REPORT - Full details for review
    // ============================================
    const adminReport = `
🚨 NEW CATERING REQUEST - ACTION REQUIRED 🚨
============================================

📋 REQUEST DETAILS
------------------
Request ID: ${request.id}
Proposal Ref: ${proposalRef}
Submitted: ${new Date().toLocaleString()}
Status: PENDING ADMIN REVIEW

👤 CUSTOMER INFORMATION
-----------------------
1. Name: ${request.customerName}
2. Email: ${request.customerEmail}
3. Phone: ${request.customerPhone || 'Not provided'}
4. Event Type: ${request.eventType || 'Not specified'}
5. Event Date: ${request.eventDate || 'TBD'}
6. Event Location: ${request.eventLocation || 'TBD'}
7. Guest Count: ${request.headcount}

🍽️ MENU SELECTIONS
-------------------
7. Proteins: ${selections.proteins.join(', ')}
8. Preparation Style: ${selections.preparation || 'Not specified'}
9. Sides: ${selections.sides || 'Not specified'}
10. Bread: ${selections.bread || 'Not specified'}
11. Allergies/Dietary: ${selections.allergies || 'None'}

💰 PRICING (AUTO-CALCULATED)
-----------------------------
12. Rate: $${(proposal.estimatedCost / request.headcount).toFixed(2)} per person
13. Subtotal: $${proposal.estimatedCost.toFixed(2)}
14. Estimated Tax (7.25%): $${(proposal.estimatedCost * 0.0725).toFixed(2)}
15. TOTAL: $${(proposal.estimatedCost * 1.0725).toFixed(2)}
16. Deposit (50%): $${(proposal.estimatedCost * 1.0725 * 0.5).toFixed(2)}

📄 GENERATED PROPOSAL
---------------------
${proposal.content}

============================================
⚡ ACTION: Review and approve this proposal
🔗 Admin Dashboard: https://eadreamsllc.com/admin
============================================
    `.trim();

    // ============================================
    // CUSTOMER EMAIL - Confirmation with their answers
    // ============================================
    const customerEmailHtml = `
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
                    <td style="padding: 12px 0; color: #333; font-weight: bold;">${proposalRef}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Your Name</td>
                    <td style="padding: 12px 0; color: #333;">${request.customerName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Event Type</td>
                    <td style="padding: 12px 0; color: #333;">${request.eventType || 'Special Event'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Event Date</td>
                    <td style="padding: 12px 0; color: #333;">${request.eventDate || 'To be confirmed'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Guest Count</td>
                    <td style="padding: 12px 0; color: #333;">${request.headcount} attendees</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Protein Selections</td>
                    <td style="padding: 12px 0; color: #333;">${selections.proteins.join(', ')}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Preparation Style</td>
                    <td style="padding: 12px 0; color: #333;">${selections.preparation || 'Chef\'s choice'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Side Dishes</td>
                    <td style="padding: 12px 0; color: #333;">${selections.sides || 'Chef\'s selection'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; color: #888;">Bread Selection</td>
                    <td style="padding: 12px 0; color: #333;">${selections.bread || 'Artisan rolls'}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; color: #888;">Dietary Notes</td>
                    <td style="padding: 12px 0; color: #333;">${selections.allergies || 'None specified'}</td>
                </tr>
            </table>
        </div>

        <!-- Estimated Pricing -->
        <div style="padding: 30px; background: #5D3A5C; color: white;">
            <h3 style="margin: 0 0 15px; color: #D4AF37;">💰 Estimated Investment</h3>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="margin: 0; font-size: 14px; opacity: 0.8;">Based on your selections</p>
                    <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.8;">${request.headcount} guests × $${(proposal.estimatedCost / request.headcount).toFixed(0)}/person</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; font-size: 32px; font-weight: bold; color: #D4AF37;">$${proposal.estimatedCost.toLocaleString()}</p>
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
                <li><strong>Tasting Session</strong> - Schedule a complimentary tasting experience</li>
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

    // Plain text version for customer
    const customerEmailText = `
Thank You, ${firstName}! 🎉

We've received your catering request and are thrilled to help create an unforgettable experience for your event.

📋 YOUR SUBMISSION SUMMARY
--------------------------
Reference Number: ${proposalRef}
Your Name: ${request.customerName}
Event Type: ${request.eventType || 'Special Event'}
Event Date: ${request.eventDate || 'To be confirmed'}
Guest Count: ${request.headcount} attendees
Protein Selections: ${selections.proteins.join(', ')}
Preparation Style: ${selections.preparation || 'Chef\'s choice'}
Side Dishes: ${selections.sides || 'Chef\'s selection'}
Bread Selection: ${selections.bread || 'Artisan rolls'}
Dietary Notes: ${selections.allergies || 'None specified'}

💰 ESTIMATED INVESTMENT
-----------------------
${request.headcount} guests × $${(proposal.estimatedCost / request.headcount).toFixed(0)}/person = $${proposal.estimatedCost.toLocaleString()}
*Final pricing confirmed after review

🚀 WHAT HAPPENS NEXT?
---------------------
1. We Review - Our team reviews your request within 24 hours
2. Personalized Proposal - We'll send your detailed, customized proposal
3. Tasting Session - Schedule a complimentary tasting experience
4. Confirm & Secure - Sign agreement and secure your date

Questions? Contact us:
📧 yourmeal@eadreamllc.com
📱 (602) 318-4925

--
Etheleen & Alma's Dream, LLC
Serving the Greater Charlotte Area
    `.trim();

    // Check if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: parseInt(smtpPort) === 465,
            auth: { user: smtpUser, pass: smtpPass },
        });

        // Send to admin
        await transporter.sendMail({
            from: `"EA Dream Catering" <${smtpUser}>`,
            to: adminEmail,
            subject: `🚨 [ACTION REQUIRED] New Request: ${request.customerName} - ${proposalRef}`,
            text: adminReport,
        });

        // Send to customer (HTML email)
        await transporter.sendMail({
            from: `"Etheleen & Alma's Dream" <${smtpUser}>`,
            to: request.customerEmail,
            subject: `✨ Thank You ${firstName}! Your Catering Request [${proposalRef}]`,
            text: customerEmailText,
            html: customerEmailHtml,
        });

        console.log('Emails sent successfully');
    } else {
        console.log('SMTP not configured. Email contents:');
        console.log('--- ADMIN REPORT ---');
        console.log(adminReport);
        console.log('--- CUSTOMER EMAIL ---');
        console.log(customerEmailText);
    }
}
