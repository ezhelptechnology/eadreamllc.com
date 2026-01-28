import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const logs = await prisma.errorLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 100,
        });

        return NextResponse.json({ logs });
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}

export async function DELETE() {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.errorLog.deleteMany();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error clearing logs:', error);
        return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
    }
}
