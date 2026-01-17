import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all catering requests with their proposals
export async function GET() {
    try {
        const requests = await prisma.cateringRequest.findMany({
            include: {
                proposals: {
                    orderBy: { version: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error('Error fetching requests:', error);
        return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
    }
}
