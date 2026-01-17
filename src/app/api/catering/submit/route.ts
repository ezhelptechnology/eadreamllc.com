import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateMenuFromDishes } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            eventDate,
            eventLocation,
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
        const cateringRequest = await prisma.cateringRequest.create({
            data: {
                customerName,
                customerEmail,
                customerPhone: customerPhone || null,
                eventDate: eventDate || null,
                eventLocation: eventLocation || null,
                headcount: headcount || 50,
                proteins: JSON.stringify(proteins),
                preparation: preparation || null,
                sides: sides || null,
                bread: bread || null,
                allergies: allergies || null,
                status: 'PENDING',
            },
        });

        // Generate the proposal using Gemini
        const proposalContent = await generateMenuFromDishes({
            proteins,
            preparation: preparation || '',
            sides: sides || '',
            bread: bread || '',
            allergies: allergies || '',
        });

        // Calculate estimated cost
        const hasSteak = proteins.some((p: string) => p.toLowerCase().includes('steak'));
        const hasSeafood = proteins.some((p: string) => p.toLowerCase().includes('seafood') || p.toLowerCase().includes('fish') || p.toLowerCase().includes('shrimp'));
        const rate = (hasSteak || hasSeafood) ? 30 : 25;
        const estimatedCost = rate * (headcount || 50);

        // Create the proposal
        const proposal = await prisma.proposal.create({
            data: {
                content: proposalContent,
                estimatedCost,
                version: 1,
                status: 'DRAFT',
                requestId: cateringRequest.id,
            },
        });

        // Send emails (to customer and admin)
        await sendEmails(cateringRequest, proposal, body);

        // Update status
        await prisma.cateringRequest.update({
            where: { id: cateringRequest.id },
            data: { status: 'PROPOSAL_SENT' },
        });

        await prisma.proposal.update({
            where: { id: proposal.id },
            data: { status: 'SENT', sentAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            requestId: cateringRequest.id,
            proposalId: proposal.id,
            message: 'Your custom proposal has been sent to your email!'
        });

    } catch (error) {
        console.error('Error creating catering request:', error);
        return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
    }
}

async function sendEmails(request: any, proposal: any, selections: any) {
    const adminEmail = 'yourmeal@eadreamllc.com';

    // Format the admin report
    const adminReport = `
=== NEW CATERING REQUEST REPORT ===
Request ID: ${request.id}
Submitted: ${new Date().toLocaleString()}

--- CUSTOMER INFORMATION ---
1. Name: ${request.customerName}
2. Email: ${request.customerEmail}
3. Phone: ${request.customerPhone || 'Not provided'}
4. Event Date: ${request.eventDate || 'TBD'}
5. Event Location: ${request.eventLocation || 'TBD'}
6. Headcount: ${request.headcount}

--- ORDER DETAILS ---
7. Proteins: ${selections.proteins.join(', ')}
8. Preparation Style: ${selections.preparation || 'Not specified'}
9. Sides: ${selections.sides || 'Not specified'}
10. Bread: ${selections.bread || 'Not specified'}
11. Allergies/Dietary: ${selections.allergies || 'None'}

--- PRICING ---
12. Estimated Cost: $${proposal.estimatedCost.toFixed(2)}
13. Rate: $${(proposal.estimatedCost / request.headcount).toFixed(2)} per person

--- PROPOSAL CONTENT ---
${proposal.content}

================================
Manage this request: https://eadreamsllc.com/admin
    `.trim();

    // Format customer email
    const customerEmailContent = `
Dear ${request.customerName},

Thank you for choosing Etheleen & Alma's Dream for your upcoming event!

We're thrilled to create a personalized culinary experience for you. Attached below is your custom catering proposal based on your selections.

${proposal.content}

--- NEXT STEPS ---
• Review your proposal above
• Reply to this email with any changes or questions
• Once approved, we'll schedule your personalized tasting experience

We look forward to making your event unforgettable!

Warm regards,
The Etheleen & Alma's Dream Team
📧 yourmeal@eadreamllc.com
    `.trim();

    // Check if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: parseInt(smtpPort) === 465,
            auth: { user: smtpUser, pass: smtpPass },
        });

        // Send to admin
        await transporter.sendMail({
            from: `"Etheleen & Alma's Dream" <${smtpUser}>`,
            to: adminEmail,
            subject: `📋 New Catering Request: ${request.customerName}`,
            text: adminReport,
        });

        // Send to customer
        await transporter.sendMail({
            from: `"Etheleen & Alma's Dream" <${smtpUser}>`,
            to: request.customerEmail,
            subject: `Your Custom Catering Proposal from Etheleen & Alma's Dream`,
            text: customerEmailContent,
        });

        console.log('Emails sent successfully');
    } else {
        console.log('SMTP not configured. Email contents:');
        console.log('--- ADMIN REPORT ---');
        console.log(adminReport);
        console.log('--- CUSTOMER EMAIL ---');
        console.log(customerEmailContent);
    }
}
