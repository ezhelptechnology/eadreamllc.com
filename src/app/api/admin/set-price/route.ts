import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { proposalId, finalPrice } = await req.json();

        if (!proposalId || finalPrice === undefined) {
            return NextResponse.json({ error: 'Proposal ID and final price are required' }, { status: 400 });
        }

        // Update proposal with final price
        const updatedProposal = await prisma.proposal.update({
            where: { id: proposalId },
            data: { estimatedCost: parseFloat(finalPrice), status: 'APPROVED' }
        });

        // Update request status
        await prisma.cateringRequest.update({
            where: { id: updatedProposal.requestId },
            data: { status: 'APPROVED' }
        });

        return NextResponse.json({
            success: true,
            message: 'Final price set successfully',
            proposal: updatedProposal
        });

    } catch (error: any) {
        console.error('Error setting final price:', error);
        return NextResponse.json({ error: 'Failed to set final price' }, { status: 500 });
    }
}
