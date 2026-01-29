import { google } from 'googleapis';

// Google Calendar client setup
const getCalendarClient = () => {
    const clientEmail = process.env.GOOGLE_CALENDAR_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_CALENDAR_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!clientEmail || !privateKey || !calendarId) {
        console.log('Google Calendar not configured');
        return null;
    }

    const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/calendar']
    });

    return {
        calendar: google.calendar({ version: 'v3', auth }),
        calendarId
    };
};

interface TastingParams {
    proposalId: string;
    clientName: string;
    clientEmail: string;
    dateTime: string;
    duration?: number;
    notes?: string;
}

interface EventDayParams {
    proposalId: string;
    eventDate: string;
    eventTime: string;
    eventEndTime: string;
    location: string;
}

interface AvailabilityParams {
    startDate: string;
    endDate: string;
    minCapacity?: number;
}

export async function scheduleTasting(params: TastingParams) {
    const setup = getCalendarClient();

    if (!setup) {
        // Return mock event for development
        console.log('=== MOCK CALENDAR EVENT (Tasting) ===');
        console.log(`Client: ${params.clientName}`);
        console.log(`Email: ${params.clientEmail}`);
        console.log(`Date/Time: ${params.dateTime}`);
        console.log(`Duration: ${params.duration || 60} minutes`);
        console.log('=====================================');

        return {
            id: `mock-tasting-${Date.now()}`,
            summary: `Tasting: ${params.clientName}`,
            start: params.dateTime,
            duration: params.duration || 60,
            status: 'MOCK'
        };
    }

    const { calendar, calendarId } = setup;
    const startTime = new Date(params.dateTime);
    const endTime = new Date(startTime.getTime() + (params.duration || 60) * 60 * 1000);

    const event = {
        summary: `🍽️ Tasting: ${params.clientName}`,
        description: `
Proposal ID: ${params.proposalId}
Client: ${params.clientName}
Email: ${params.clientEmail}

Notes: ${params.notes || 'No special notes'}

---
Auto-scheduled by EA Dream Admin System
        `.trim(),
        start: {
            dateTime: startTime.toISOString(),
            timeZone: 'America/New_York',
        },
        end: {
            dateTime: endTime.toISOString(),
            timeZone: 'America/New_York',
        },
        attendees: [
            { email: params.clientEmail }
        ],
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 60 },
            ],
        },
    };

    const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
        sendUpdates: 'all',
    });

    return {
        id: response.data.id,
        summary: response.data.summary,
        htmlLink: response.data.htmlLink,
        start: response.data.start?.dateTime,
        end: response.data.end?.dateTime,
        status: 'CREATED'
    };
}

export async function scheduleEventDay(params: EventDayParams) {
    const setup = getCalendarClient();

    const eventDate = new Date(params.eventDate);
    const eventStart = new Date(`${params.eventDate}T${params.eventTime}`);
    const eventEnd = new Date(`${params.eventDate}T${params.eventEndTime}`);

    // Prep time: 3 hours before event
    const prepStart = new Date(eventStart.getTime() - 3 * 60 * 60 * 1000);
    const prepEnd = eventStart;

    // Shopping: Day before, 9 AM - 12 PM
    const shoppingDate = new Date(eventDate);
    shoppingDate.setDate(shoppingDate.getDate() - 1);
    const shoppingStart = new Date(shoppingDate);
    shoppingStart.setHours(9, 0, 0, 0);
    const shoppingEnd = new Date(shoppingDate);
    shoppingEnd.setHours(12, 0, 0, 0);

    if (!setup) {
        // Return mock events for development
        console.log('=== MOCK CALENDAR EVENTS (Event Day) ===');
        console.log(`Shopping: ${shoppingStart.toISOString()}`);
        console.log(`Prep: ${prepStart.toISOString()}`);
        console.log(`Event: ${eventStart.toISOString()} - ${eventEnd.toISOString()}`);
        console.log(`Location: ${params.location}`);
        console.log('=========================================');

        return {
            shopping: {
                id: `mock-shopping-${Date.now()}`,
                summary: '🛒 Shopping for Event',
                start: shoppingStart.toISOString(),
                status: 'MOCK'
            },
            prep: {
                id: `mock-prep-${Date.now()}`,
                summary: '👨‍🍳 Event Prep',
                start: prepStart.toISOString(),
                status: 'MOCK'
            },
            event: {
                id: `mock-event-${Date.now()}`,
                summary: '🎉 Catering Event',
                start: eventStart.toISOString(),
                end: eventEnd.toISOString(),
                location: params.location,
                status: 'MOCK'
            }
        };
    }

    const { calendar, calendarId } = setup;

    // Create all three events
    const events = {
        shopping: await calendar.events.insert({
            calendarId,
            requestBody: {
                summary: '🛒 Shopping for Event',
                description: `Proposal ID: ${params.proposalId}\nPurchase ingredients for catering event`,
                start: { dateTime: shoppingStart.toISOString(), timeZone: 'America/New_York' },
                end: { dateTime: shoppingEnd.toISOString(), timeZone: 'America/New_York' },
            }
        }),
        prep: await calendar.events.insert({
            calendarId,
            requestBody: {
                summary: '👨‍🍳 Event Prep',
                description: `Proposal ID: ${params.proposalId}\nPrepare food for catering event`,
                start: { dateTime: prepStart.toISOString(), timeZone: 'America/New_York' },
                end: { dateTime: prepEnd.toISOString(), timeZone: 'America/New_York' },
            }
        }),
        event: await calendar.events.insert({
            calendarId,
            requestBody: {
                summary: '🎉 Catering Event',
                description: `Proposal ID: ${params.proposalId}\nMain catering event`,
                location: params.location,
                start: { dateTime: eventStart.toISOString(), timeZone: 'America/New_York' },
                end: { dateTime: eventEnd.toISOString(), timeZone: 'America/New_York' },
            }
        })
    };

    return {
        shopping: {
            id: events.shopping.data.id,
            summary: events.shopping.data.summary,
            start: events.shopping.data.start?.dateTime,
            status: 'CREATED'
        },
        prep: {
            id: events.prep.data.id,
            summary: events.prep.data.summary,
            start: events.prep.data.start?.dateTime,
            status: 'CREATED'
        },
        event: {
            id: events.event.data.id,
            summary: events.event.data.summary,
            start: events.event.data.start?.dateTime,
            end: events.event.data.end?.dateTime,
            location: params.location,
            status: 'CREATED'
        }
    };
}

export async function checkAvailability(params: AvailabilityParams) {
    const setup = getCalendarClient();

    if (!setup) {
        // Return mock availability for development
        const startDate = new Date(params.startDate);
        const endDate = new Date(params.endDate);
        const slots = [];

        // Generate available slots
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            // Skip weekdays if looking for weekend availability
            const dayOfWeek = d.getDay();

            slots.push({
                date: d.toISOString().split('T')[0],
                available: true,
                slots: [
                    { time: '11:00', available: Math.random() > 0.3 },
                    { time: '14:00', available: Math.random() > 0.3 },
                    { time: '17:00', available: Math.random() > 0.3 },
                ]
            });
        }

        return {
            slots,
            status: 'MOCK'
        };
    }

    const { calendar, calendarId } = setup;

    const response = await calendar.freebusy.query({
        requestBody: {
            timeMin: new Date(params.startDate).toISOString(),
            timeMax: new Date(params.endDate).toISOString(),
            items: [{ id: calendarId }]
        }
    });

    const busySlots = response.data.calendars?.[calendarId]?.busy || [];

    // Generate available slots based on busy times
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    const slots = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const daySlots = [
            { time: '11:00', available: true },
            { time: '14:00', available: true },
            { time: '17:00', available: true },
        ];

        // Check each slot against busy times
        for (const busy of busySlots) {
            const busyStart = new Date(busy.start || '');
            const busyEnd = new Date(busy.end || '');

            for (const slot of daySlots) {
                const slotTime = new Date(`${dateStr}T${slot.time}:00`);
                if (slotTime >= busyStart && slotTime < busyEnd) {
                    slot.available = false;
                }
            }
        }

        slots.push({
            date: dateStr,
            available: daySlots.some(s => s.available),
            slots: daySlots
        });
    }

    return {
        slots,
        status: 'LIVE'
    };
}
