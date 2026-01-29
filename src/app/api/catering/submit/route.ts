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

        // Send notifications (errors here should not block the overall success)
        try {
            // Send SMS thank you with their submission summary
            if (customerPhone && customerPhone.toLowerCase() !== 'skip') {
                await sendThankYouSms({
                    customerName,
                    customerPhone,
                    eventDate: eventDate || 'TBD',
                    headcount: headcount || 50,
                    proteins,
                    proposalId: proposalRef
                }).catch(e => console.error('SMS Failed:', e));
            }

            // Send customer confirmation email
            await sendCustomerConfirmation({
                customerName,
                customerEmail,
                proposalRef,
                eventType: eventType || 'Special Event',
                eventDate: eventDate || 'TBD',
                headcount: headcount || 50,
                proteins,
                preparation: preparation || 'Chef\'s choice',
                sides: sides || 'Chef\'s selection',
                bread: bread || 'Artisan rolls',
                allergies: allergies || 'None',
                estimatedCost,
                pricePerPerson: rate,
            }).catch(e => console.error('Customer email failed:', e));

            // Send admin notification email
            await sendAdminNotification({
                requestId: cateringRequest.id,
                proposalRef,
                customerName,
                customerEmail,
                customerPhone: customerPhone || 'Not provided',
                eventType: eventType || 'Not specified',
                eventDate: eventDate || 'TBD',
                headcount: headcount || 50,
                proteins,
                preparation: preparation || 'Not specified',
                sides: sides || 'Not specified',
                bread: bread || 'Not specified',
                allergies: allergies || 'None',
                estimatedCost,
                pricePerPerson: rate,
            }).catch(e => console.error('Admin email failed:', e));
        } catch (error) {
            console.error('Notification error (non-blocking):', error);
        }

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
