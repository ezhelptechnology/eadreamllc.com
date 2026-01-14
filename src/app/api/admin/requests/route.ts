import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const requests = await prisma.cateringRequest.findMany({
            include: {
                generatedMenu: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ requests });
    } catch (error: any) {
        console.error('Error fetching requests:', error);
        return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
    }
}
