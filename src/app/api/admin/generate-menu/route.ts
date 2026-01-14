import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateMenuFromDishes, estimateCateringCost } from '@/lib/gemini';

export async function POST(req: Request) {
    try {
        const { requestId, guestCount = 50 } = await req.json();

        if (!requestId) {
            return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
        }

        // Get the catering request
        const cateringRequest = await prisma.cateringRequest.findUnique({
            where: { id: requestId },
            include: { generatedMenu: true }
        });

        if (!cateringRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Parse favorite dishes
        const dishes = JSON.parse(cateringRequest.favoriteDishes);

        // Generate menu using Gemini AI
        const menuContent = await generateMenuFromDishes(dishes);

        // Estimate cost
        const estimatedCost = await estimateCateringCost(menuContent, guestCount);

        // Save or update menu
        if (cateringRequest.generatedMenu) {
            await prisma.menu.update({
                where: { id: cateringRequest.generatedMenu.id },
                data: {
                    content: menuContent,
                    estimatedCost: estimatedCost,
                }
            });
        } else {
            await prisma.menu.create({
                data: {
                    content: menuContent,
                    estimatedCost: estimatedCost,
                    requestId: requestId,
                }
            });
        }

        // Update request status
        await prisma.cateringRequest.update({
            where: { id: requestId },
            data: { status: 'GENERATED' }
        });

        return NextResponse.json({
            success: true,
            menu: menuContent,
            estimatedCost: estimatedCost,
            disclaimer: 'Please be advised this is an estimated cost. Final pricing will be determined by our team based on specific event requirements, guest count, and service details.'
        });

    } catch (error: any) {
        console.error('Error generating menu:', error);
        return NextResponse.json({ error: 'Failed to generate menu' }, { status: 500 });
    }
}
