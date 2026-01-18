import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasSmtpHost: !!process.env.SMTP_HOST,
        nodeEnv: process.env.NODE_ENV,
    });
}
