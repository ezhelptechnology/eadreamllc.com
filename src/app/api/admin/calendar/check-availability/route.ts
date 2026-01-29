import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/google-calendar';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            start_date,
            end_date,
            min_capacity
        } = body;

        const availability = await checkAvailability({
            startDate: start_date,
            endDate: end_date,
            minCapacity: min_capacity
        });

        return NextResponse.json({
            success: true,
            availability
        });

    } catch (error: unknown) {
        console.error('Error checking availability:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to check availability',
            details: message
        }, { status: 500 });
    }
}
