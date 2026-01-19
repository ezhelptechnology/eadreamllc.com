import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { requestId, customerPhone, customerName, eventDetails } = body;

        // Validate required fields
        if (!requestId || !customerPhone || !customerName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const vapiApiKey = process.env.VAPI_API_KEY;
        const vapiPhoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;

        if (!vapiApiKey || !vapiPhoneNumberId) {
            console.error('VAPI credentials not configured');
            return NextResponse.json({
                error: 'Voice calling not configured',
                fallback: 'Please call (602) 318-4925 to schedule your tasting'
            }, { status: 503 });
        }

        // Create the outbound call via Vapi
        const response = await fetch('https://api.vapi.ai/call', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${vapiApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumberId: vapiPhoneNumberId,
                customer: {
                    number: customerPhone,
                    name: customerName
                },
                assistant: {
                    name: "Alma",
                    firstMessage: `Hi ${customerName}, this is Alma from Etheleen and Alma's Dream Catering. I'm calling about your recent catering inquiry${eventDetails?.eventType ? ` for your ${eventDetails.eventType}` : ''}. Do you have a moment to discuss your event?`,
                    model: {
                        provider: "anthropic",
                        model: "claude-sonnet-4-20250514",
                        systemPrompt: `You are Alma, a warm and professional representative from Etheleen & Alma's Dream Catering in Charlotte, NC.

You're calling to:
1. Confirm event details (date, guest count, menu selections)
2. Schedule a tasting if they want one
3. Answer any questions about the menu or service
4. Book their event on the calendar

Customer Info:
- Name: ${customerName}
- Request ID: ${requestId}
${eventDetails ? `- Event Type: ${eventDetails.eventType || 'Not specified'}
- Estimated Guests: ${eventDetails.guestCount || 'Not specified'}
- Preferred Date: ${eventDetails.eventDate || 'Not specified'}` : ''}

Be conversational, warm, and helpful. If they're not available, offer to call back at a better time or have them call (602) 318-4925.

Available tasting times: Saturdays 10am-2pm
Menu options: We offer Classic ($25/person) and Premium ($30/person) packages with proteins like Chicken, Beef, Pork, Steak, and Seafood options.

End the call by confirming next steps and thanking them for choosing Etheleen & Alma's Dream.`
                    },
                    voice: {
                        provider: "11labs",
                        voiceId: "rachel" // Warm, professional female voice
                    }
                },
                metadata: {
                    requestId,
                    source: 'chatbot_callback'
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Vapi call failed:', errorData);
            return NextResponse.json({
                error: 'Failed to initiate call',
                details: errorData
            }, { status: 500 });
        }

        const callData = await response.json();

        // Update the catering request with call info
        await prisma.cateringRequest.update({
            where: { id: requestId },
            data: {
                status: 'CALLBACK_SCHEDULED',
            }
        });

        return NextResponse.json({
            success: true,
            callId: callData.id,
            message: 'Callback scheduled successfully. Alma will call you shortly!'
        });

    } catch (error: unknown) {
        console.error('Error scheduling callback:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to schedule callback',
            details: errorMessage
        }, { status: 500 });
    }
}
