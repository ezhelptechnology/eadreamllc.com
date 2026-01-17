import { NextResponse } from 'next/server';

// This route is deprecated. Use /api/catering/submit instead.
// Keeping for backwards compatibility - just logs and returns success.
export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log('--- DEPRECATED send-email route called ---');
        console.log('Use /api/catering/submit instead');
        console.log('Body received:', JSON.stringify(body, null, 2));

        return NextResponse.json({
            success: true,
            message: 'Request logged. Please use the new /api/catering/submit endpoint.',
            deprecated: true
        });
    } catch (error: any) {
        console.error('Error in send-email API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
