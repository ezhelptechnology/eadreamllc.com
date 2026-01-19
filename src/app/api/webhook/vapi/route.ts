import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, call } = body;

        console.log('Vapi webhook received:', type, call?.id);

        switch (type) {
            case 'call-ended':
                // Update order with call results
                if (call?.metadata?.requestId) {
                    await prisma.cateringRequest.update({
                        where: { id: call.metadata.requestId },
                        data: {
                            status: 'CALLBACK_COMPLETED',
                        }
                    });

                    console.log('Call completed for request:', call.metadata.requestId);

                    // Log call summary for admin review
                    console.log('Call Summary:', {
                        duration: call.duration,
                        summary: call.summary,
                        transcript: call.transcript
                    });
                }
                break;

            case 'call-failed':
                // Mark for manual follow-up
                if (call?.metadata?.requestId) {
                    await prisma.cateringRequest.update({
                        where: { id: call.metadata.requestId },
                        data: {
                            status: 'CALLBACK_FAILED',
                        }
                    });

                    console.error('Call failed for request:', call.metadata.requestId, call.error);

                    // TODO: Send alert to owner via email
                }
                break;

            case 'transcript':
                // Real-time transcript updates (optional logging)
                console.log('Transcript update:', call?.transcript);
                break;

            default:
                console.log('Unhandled webhook type:', type);
        }

        return NextResponse.json({ received: true });

    } catch (error: unknown) {
        console.error('Webhook error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// Vapi sends GET requests for webhook verification
export async function GET() {
    return NextResponse.json({ status: 'ok', service: 'vapi-webhook' });
}
