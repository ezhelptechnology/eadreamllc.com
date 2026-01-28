import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateMenuFromDishes } from '@/lib/gemini';

export async function POST(req: Request) {
    try {
        const { requestId, guestCount = 50 } = await req.json();

        if (!requestId) {
            return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
        }

        // Get the catering request
        const cateringRequest = await prisma.cateringRequest.findUnique({
            where: { id: requestId },
            include: { proposals: { orderBy: { version: 'desc' }, take: 1 } }
        });

        if (!cateringRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Parse proteins
        const proteins = JSON.parse(cateringRequest.proteins);

        // Generate menu using Gemini AI with the new selections format
        const menuContent = await generateMenuFromDishes({
            proteins,
            preparation: cateringRequest.preparation || '',
            sides: cateringRequest.sides || '',
            bread: cateringRequest.bread || '',
            allergies: cateringRequest.allergies || '',
        });

        // Estimate cost based on proteins
        const hasSteak = proteins.some((p: string) => p.toLowerCase().includes('steak'));
        const hasSeafood = proteins.some((p: string) => p.toLowerCase().includes('seafood') || p.toLowerCase().includes('fish'));
        const rate = (hasSteak || hasSeafood) ? 30 : 25;
        const estimatedCost = rate * guestCount;

        // Get latest version number
        const latestVersion = cateringRequest.proposals[0]?.version || 0;

        // Create new proposal
        await prisma.proposal.create({
            data: {
                content: menuContent,
                estimatedCost: estimatedCost,
                version: latestVersion + 1,
                status: 'DRAFT',
                requestId: requestId,
            }
        });

        // Update request status
        await prisma.cateringRequest.update({
            where: { id: requestId },
            data: { status: 'PROPOSAL_SENT' }
        });

        return NextResponse.json({
            success: true,
            menu: menuContent,
            estimatedCost: estimatedCost,
            disclaimer: 'Please be advised this is an estimated cost. Final pricing will be determined by our team based on specific event requirements, guest count, and service details.'
        });

    } catch (error: unknown) {
        console.error('Error generating menu:', error);
        return NextResponse.json({ error: 'Failed to generate menu' }, { status: 500 });
    }
}
