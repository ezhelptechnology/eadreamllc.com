import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
        );

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.events'
            ],
            prompt: 'consent'
        });

        return NextResponse.redirect(authUrl);

    } catch (error) {
        console.error('Error generating auth URL:', error);
        return NextResponse.json({
            error: 'Failed to initialize Google auth'
        }, { status: 500 });
    }
}
