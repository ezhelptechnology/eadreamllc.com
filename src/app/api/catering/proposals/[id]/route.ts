import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// GET a single proposal
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const proposal = await prisma.proposal.findUnique({
            where: { id },
            include: { request: true },
        });

        if (!proposal) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
        }

        return NextResponse.json({ proposal });
    } catch (error) {
        console.error('Error fetching proposal:', error);
        return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 });
    }
}

// PUT to update a proposal
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { content, estimatedCost } = body;

        const existingProposal = await prisma.proposal.findUnique({
            where: { id },
        });

        if (!existingProposal) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
        }

        // Create a new version instead of overwriting
        const newProposal = await prisma.proposal.create({
            data: {
                content: content || existingProposal.content,
                estimatedCost: estimatedCost ?? existingProposal.estimatedCost,
                version: existingProposal.version + 1,
                status: 'DRAFT',
                requestId: existingProposal.requestId,
            },
        });

        return NextResponse.json({
            success: true,
            proposal: newProposal,
            message: `Proposal updated to version ${newProposal.version}`
        });
    } catch (error) {
        console.error('Error updating proposal:', error);
        return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
    }
}

// POST to resend a proposal to the customer
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const proposal = await prisma.proposal.findUnique({
            where: { id },
            include: { request: true },
        });

        if (!proposal) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
        }

        const cateringRequest = proposal.request;

        // Send email to customer
        const customerEmailContent = `
Dear ${cateringRequest.customerName},

We've updated your catering proposal based on our discussion. Please review the revised details below:

=== UPDATED PROPOSAL (Version ${proposal.version}) ===

${proposal.content}

--- PRICING ---
Estimated Total: $${proposal.estimatedCost.toFixed(2)}

--- NEXT STEPS ---
• Reply to this email to approve or request changes
• Once approved, we'll schedule your personalized tasting experience

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
            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: parseInt(smtpPort),
                secure: parseInt(smtpPort) === 465,
                auth: { user: smtpUser, pass: smtpPass },
            });

            await transporter.sendMail({
                from: `"Etheleen & Alma's Dream" <${smtpUser}>`,
                to: cateringRequest.customerEmail,
                subject: `Updated Catering Proposal (v${proposal.version}) from Etheleen & Alma's Dream`,
                text: customerEmailContent,
            });

            console.log('Updated proposal email sent to:', cateringRequest.customerEmail);
        } else {
            console.log('SMTP not configured. Would send email:');
            console.log(customerEmailContent);
        }

        // Update proposal status
        await prisma.proposal.update({
            where: { id },
            data: { status: 'SENT', sentAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            message: `Proposal v${proposal.version} sent to ${cateringRequest.customerEmail}`
        });
    } catch (error) {
        console.error('Error resending proposal:', error);
        return NextResponse.json({ error: 'Failed to resend proposal' }, { status: 500 });
    }
}
