import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        hasClaudeKey: !!process.env.ANTHROPIC_API_KEY,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        dbUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) : 'none',
        hasSmtpHost: !!process.env.SMTP_HOST,
        nodeEnv: process.env.NODE_ENV,
    });
}
