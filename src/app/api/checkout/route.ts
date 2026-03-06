import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        // Stripe integration temporarily deactivated - return placeholder
        return NextResponse.json({
            demo: true,
            message: 'Stripe integration is currently in placeholder mode.',
            url: 'https://stripe.com',
        });

        /* 
        // Graceful fallback: if no Stripe key, return demo mode response
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your-stripe-secret-key-here') {
            return NextResponse.json({
                demo: true,
                message: 'Stripe is in demo mode. Connect your Stripe account to accept real payments.',
                url: 'https://stripe.com',
            });
        }

        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2026-02-25.clover',
        });
        const body = await req.json();
        */
        const {
            eventType = 'catering',     // 'catering' | 'private_dinner'
            guestCount = 1,
            packageTier = 'classic',    // 'classic' | 'premium' | 'private'
            customerEmail,
            customerName,
            eventDate,
            depositPercentage = 50,     // 25-50% deposit
        } = body;

        // Calculate pricing
        let totalAmount: number;
        let eventLabel: string;
        let priceDescription: string;

        if (packageTier === 'private') {
            // Private Dinner: $1,000 per group of 8
            const groups = Math.ceil(guestCount / 8);
            totalAmount = groups * 100000; // $1,000.00 in cents per group
            eventLabel = 'Private Dinner Experience';
            priceDescription = `${groups} group(s) of 8 (${guestCount} guests)`;
        } else {
            // Catering: per plate pricing
            let perPlateRate: number;
            switch (packageTier) {
                case 'premium':
                    perPlateRate = 3000; // $30.00 per plate
                    eventLabel = 'Premium Catering (Per Plate)';
                    break;
                case 'classic':
                default:
                    perPlateRate = 2500; // $25.00 per plate
                    eventLabel = 'Classic Catering (Per Plate)';
                    break;
            }
            totalAmount = perPlateRate * guestCount;
            priceDescription = `${guestCount} plates`;
        }

        const depositAmount = Math.round(totalAmount * (depositPercentage / 100));

        // Build the origin URL for redirects
        const origin = req.headers.get('origin') || 'https://eadreamllc.com';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: customerEmail || undefined,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${eventLabel} — Deposit`,
                            description: `${depositPercentage}% deposit for ${priceDescription}${eventDate ? ` on ${eventDate}` : ''}. Remaining balance due before event.`,
                            images: [`${origin}/food-salmon-main.jpg`],
                        },
                        unit_amount: depositAmount,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                eventType,
                packageTier,
                guestCount: String(guestCount),
                customerName: customerName || '',
                eventDate: eventDate || '',
                totalAmount: String(totalAmount),
                depositPercentage: String(depositPercentage),
            },
            success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/booking/cancelled`,
        });

        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (error: unknown) {
        console.error('Stripe checkout error:', error);
        const message = error instanceof Error ? error.message : 'Failed to create checkout session';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
