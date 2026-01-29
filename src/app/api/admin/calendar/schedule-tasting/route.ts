import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scheduleTasting } from '@/lib/google-calendar';
import { sendTastingConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            proposal_id,
            client_name,
            client_email,
            date_time,
            duration = 60,
            notes
        } = body;

        // Schedule tasting via Google Calendar
        const calendarEvent = await scheduleTasting({
            proposalId: proposal_id,
            clientName: client_name,
            clientEmail: client_email,
            dateTime: date_time,
            duration,
            notes
        });

        // Update proposal status
        await prisma.proposal.update({
            where: { id: proposal_id },
            data: { tastingScheduled: true }
        });

        // Store calendar event in database
        await prisma.calendarEvent.create({
            data: {
                googleEventId: calendarEvent.id,
                title: `Tasting: ${client_name}`,
                description: notes || 'Complimentary tasting session',
                startTime: new Date(date_time),
                endTime: new Date(new Date(date_time).getTime() + duration * 60 * 1000),
                eventType: 'TASTING',
                proposalId: proposal_id
            }
        });

        // Send confirmation email
        await sendTastingConfirmation(client_email, client_name, date_time);

        return NextResponse.json({
            success: true,
            message: 'Tasting scheduled successfully',
            calendar_event: calendarEvent
        });

    } catch (error: unknown) {
        console.error('Error scheduling tasting:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to schedule tasting',
            details: message
        }, { status: 500 });
    }
}
