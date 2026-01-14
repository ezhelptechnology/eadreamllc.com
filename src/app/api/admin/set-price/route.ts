import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { menuId, finalPrice } = await req.json();

        if (!menuId || finalPrice === undefined) {
            return NextResponse.json({ error: 'Menu ID and final price are required' }, { status: 400 });
        }

        // Update menu with final price
        const updatedMenu = await prisma.menu.update({
            where: { id: menuId },
            data: { finalPrice: parseFloat(finalPrice) }
        });

        // Update request status
        await prisma.cateringRequest.update({
            where: { id: updatedMenu.requestId },
            data: { status: 'REVIEWED' }
        });

        return NextResponse.json({
            success: true,
            message: 'Final price set successfully',
            menu: updatedMenu
        });

    } catch (error: any) {
        console.error('Error setting final price:', error);
        return NextResponse.json({ error: 'Failed to set final price' }, { status: 500 });
    }
}
