import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { dishes } = await req.json();

        if (!dishes || !Array.isArray(dishes) || dishes.length < 3) {
            return NextResponse.json({ error: 'At least 3 dishes are required' }, { status: 400 });
        }

        // Save to database
        const cateringRequest = await prisma.cateringRequest.create({
            data: {
                favoriteDishes: JSON.stringify(dishes),
                status: 'PENDING',
            },
        });

        const adminEmail = process.env.ADMIN_EMAIL || 'yourmeal@eadreamllc.com';
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = parseInt(process.env.SMTP_PORT || '587');
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        const emailContent = `
      <h1>New Catering Lead: Favorite Dishes Selected</h1>
      <p>A potential client has interacted with the AI guide and selected their top 3 favorite dishes:</p>
      <ul>
        ${dishes.map((dish: string) => `<li>${dish}</li>`).join('')}
      </ul>
      <p><strong>Request ID:</strong> ${cateringRequest.id}</p>
      <p>Please log in to the admin portal to generate a full menu and estimated catering costs for this client.</p>
    `;

        if (smtpHost && smtpUser && smtpPass) {
            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });

            await transporter.sendMail({
                from: `"E&A Dream Bot" <${smtpUser}>`,
                to: adminEmail,
                subject: "New Menu Consultation Request",
                html: emailContent,
            });

            return NextResponse.json({
                success: true,
                message: 'Email sent successfully via SMTP',
                requestId: cateringRequest.id
            });
        } else {
            console.warn('SMTP credentials not configured. Email logged to console:');
            console.log('--- EMAIL LOG ---');
            console.log(`To: ${adminEmail}`);
            console.log(`Subject: New Menu Consultation Request`);
            console.log(emailContent);
            console.log('-----------------');

            return NextResponse.json({
                success: true,
                message: 'Request received (Logged to console as SMTP is not configured)',
                mock: true,
                requestId: cateringRequest.id
            });
        }
    } catch (error: any) {
        console.error('Error in send-email API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
