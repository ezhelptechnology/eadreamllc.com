import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generatePersonalizedProposal, CustomerInfo } from '@/lib/claude';
import { sendThankYouSms } from '@/lib/sms';
import { sendCustomerConfirmation, sendAdminNotification } from '@/lib/email-service';
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
            allergies,
            isPrivateRequest
        } = body;

        // Validate required fields
        if (!customerName || !customerEmail || !proteins || proteins.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const effectiveEventType = isPrivateRequest ? 'Private Dinner' : (eventType || 'Catering');

        // 1. CREATE LEAD (CRITICAL STEP)
        const cateringRequest = await prisma.cateringRequest.create({
            data: {
                customerName,
                customerEmail,
                customerPhone: customerPhone || null,
                eventDate: eventDate || null,
                eventLocation: eventLocation || null,
                eventType: effectiveEventType,
                headcount: headcount || (isPrivateRequest ? 8 : 50),
                proteins: JSON.stringify(proteins),
                preparation: preparation || null,
                sides: sides || null,
                bread: bread || null,
                allergies: allergies || null,
                status: 'PENDING',
            },
        });
        console.log('Lead captured in DB:', cateringRequest.id);

        // 2. GENERATE PROPOSAL (TRY AI, BUT FALLBACK IF FAILED)
        let proposalContent: string;
        try {
            console.log('Generating AI proposal...');
            proposalContent = await generatePersonalizedProposal(customerInfo);
        } catch (aiError) {
            console.error('AI proposal generation failed:', aiError);
            // Bulletproof fallback so the customer NEVER sees an error
            proposalContent = `
# ETHELEEN & ALMA'S DREAM, LLC
## INITIAL SERVICE INQUIRY

Thank you for your interest, ${customerName}! We have received your request for a ${effectiveEventType} on ${eventDate || 'TBD'}.

Our team is currently reviewing your custom menu selections:
- **Proteins:** ${Array.isArray(proteins) ? proteins.join(', ') : proteins}
- **Preparation:** ${preparation || 'Chef\'s Choice'}
- **Sides:** ${sides || 'Chef\'s Selection'}
- **Bread:** ${bread || 'Artisan Rolls'}

A Culinary Specialist will review your requirements and follow up with a finalized, detailed proposal and pricing shortly.
            `.trim();
        }

        // 3. CALCULATE PRICING
        let estimatedCost: number;
        let rate: number;
        if (isPrivateRequest) {
            const groups = Math.ceil((headcount || 8) / 8);
            estimatedCost = groups * 1000;
            rate = estimatedCost / (headcount || 8);
        } else {
            const hasSteak = Array.isArray(proteins) && proteins.some((p: string) => p.toLowerCase().includes('steak'));
            const hasSeafood = Array.isArray(proteins) && proteins.some((p: string) =>
                p.toLowerCase().includes('seafood') || p.toLowerCase().includes('fish') || p.toLowerCase().includes('shrimp')
            );
            rate = (hasSteak || hasSeafood) ? 30 : 25;
            estimatedCost = rate * (headcount || 50);
        }

        // 4. CREATE PROPOSAL RECORD
        const proposal = await prisma.proposal.create({
            data: {
                content: proposalContent,
                estimatedCost,
                version: 1,
                status: 'DRAFT',
                requestId: cateringRequest.id,
            },
        });

        const proposalRef = `EA-${cateringRequest.id.slice(-8).toUpperCase()}`;

        // 5. ASYNC NOTIFICATIONS (NON-BLOCKING)
        // Fire and forget so the user doesn't wait
        (async () => {
            try {
                if (customerPhone && customerPhone.toLowerCase() !== 'skip') {
                    await sendThankYouSms({
                        customerName,
                        customerPhone,
                        eventDate: eventDate || 'TBD',
                        headcount: headcount || (isPrivateRequest ? 8 : 50),
                        proteins,
                        proposalId: proposalRef
                    });
                }

                await sendCustomerConfirmation({
                    customerName,
                    customerEmail,
                    proposalRef,
                    eventType: effectiveEventType,
                    eventDate: eventDate || 'TBD',
                    headcount: headcount || (isPrivateRequest ? 8 : 50),
                    proteins,
                    preparation: preparation || 'Chef\'s choice',
                    sides: sides || 'Chef\'s selection',
                    bread: bread || 'Artisan rolls',
                    allergies: allergies || 'None',
                    estimatedCost,
                    pricePerPerson: rate,
                });

                await sendAdminNotification({
                    requestId: cateringRequest.id,
                    proposalRef,
                    customerName,
                    customerEmail,
                    customerPhone: customerPhone || 'Not provided',
                    eventType: effectiveEventType,
                    eventDate: eventDate || 'TBD',
                    headcount: headcount || (isPrivateRequest ? 8 : 50),
                    proteins,
                    preparation: preparation || 'Not specified',
                    sides: sides || 'Not specified',
                    bread: bread || 'Not specified',
                    allergies: allergies || 'None',
                    estimatedCost,
                    pricePerPerson: rate,
                });

                await prisma.cateringRequest.update({
                    where: { id: cateringRequest.id },
                    data: { status: 'PROPOSAL_SENT' },
                });
            } catch (notifyError) {
                console.error('Background notification failed:', notifyError);
            }
        })();

        // 6. IMMEDIATE SUCCESS RESPONSE
        return NextResponse.json({
            success: true,
            requestId: cateringRequest.id,
            proposalId: proposal.id,
            proposalRef,
            message: 'Your experience is being crafted! Check your email for your preliminary proposal.'
        });

    } catch (error: unknown) {
        // Only hits if INITIAL body parsing or DB connection fails entirely
        const errorObj = error instanceof Error ? error : new Error(String(error));
        await logError(errorObj, { source: 'CATERING_SUBMIT', path: '/api/catering/submit' });
        console.error('Terminal error in catering submission:', error);

        return NextResponse.json({
            error: 'Database connection issue. We are alerted and will reach out if you provided info.',
            details: errorObj.message
        }, { status: 500 });
    }
}
