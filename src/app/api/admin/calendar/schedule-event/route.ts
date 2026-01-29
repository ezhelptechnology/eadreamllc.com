import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scheduleEventDay } from '@/lib/google-calendar';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            proposal_id,
            event_date,
            event_time,
            event_end_time,
            location
        } = body;

        // Schedule main event + prep + shopping
        const events = await scheduleEventDay({
            proposalId: proposal_id,
            eventDate: event_date,
            eventTime: event_time,
            eventEndTime: event_end_time,
            location
        });

        // Store all calendar events in database
        const eventDate = new Date(event_date);
        const eventStart = new Date(`${event_date}T${event_time}`);
        const eventEnd = new Date(`${event_date}T${event_end_time}`);
        const prepStart = new Date(eventStart.getTime() - 3 * 60 * 60 * 1000);
        const shoppingDate = new Date(eventDate);
        shoppingDate.setDate(shoppingDate.getDate() - 1);

        await prisma.calendarEvent.createMany({
            data: [
                {
                    googleEventId: events.shopping.id,
                    title: 'Shopping for Event',
                    startTime: new Date(shoppingDate.setHours(9, 0, 0, 0)),
                    endTime: new Date(shoppingDate.setHours(12, 0, 0, 0)),
                    eventType: 'SHOPPING',
                    proposalId: proposal_id
                },
                {
                    googleEventId: events.prep.id,
                    title: 'Event Prep',
                    startTime: prepStart,
                    endTime: eventStart,
                    eventType: 'PREP',
                    proposalId: proposal_id
                },
                {
                    googleEventId: events.event.id,
                    title: 'Catering Event',
                    startTime: eventStart,
                    endTime: eventEnd,
                    location,
                    eventType: 'EVENT_DAY',
                    proposalId: proposal_id
                }
            ]
        });

        return NextResponse.json({
            success: true,
            message: 'Event scheduled on calendar',
            events
        });

    } catch (error: unknown) {
        console.error('Error scheduling event:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to schedule event',
            details: message
        }, { status: 500 });
    }
}
