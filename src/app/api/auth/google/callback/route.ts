import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('OAuth error:', error);
            return NextResponse.redirect(
                new URL('/admin/dashboard?auth=error&reason=' + error, request.url)
            );
        }

        if (!code) {
            return NextResponse.redirect(
                new URL('/admin/dashboard?auth=error&reason=no_code', request.url)
            );
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
        );

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        if (!tokens.access_token || !tokens.refresh_token) {
            return NextResponse.redirect(
                new URL('/admin/dashboard?auth=error&reason=no_tokens', request.url)
            );
        }

        // Deactivate any existing active tokens
        await prisma.googleTokens.updateMany({
            where: { service: 'calendar', active: true },
            data: { active: false }
        });

        // Save new tokens to database
        await prisma.googleTokens.create({
            data: {
                service: 'calendar',
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                active: true
            }
        });

        console.log('✅ Google Calendar tokens saved successfully');

        return NextResponse.redirect(
            new URL('/admin/dashboard?auth=success', request.url)
        );

    } catch (error) {
        console.error('Error in Google OAuth callback:', error);
        return NextResponse.redirect(
            new URL('/admin/dashboard?auth=error&reason=token_exchange_failed', request.url)
        );
    }
}
