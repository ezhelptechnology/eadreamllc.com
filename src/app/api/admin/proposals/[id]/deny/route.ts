import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: proposalId } = await params;
        const body = await request.json();

        // Update proposal status to DENIED
        const proposal = await prisma.proposal.update({
            where: { id: proposalId },
            data: {
                status: 'DENIED'
            },
            include: { request: true }
        });

        // Log admin action
        if (body.admin_id) {
            await prisma.adminLog.create({
                data: {
                    adminId: body.admin_id,
                    action: 'DENY_PROPOSAL',
                    entityType: 'PROPOSAL',
                    entityId: proposalId,
                    metadata: {
                        reason: body.reason || 'Denied by admin',
                        client: proposal.request.customerName
                    }
                }
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Proposal denied',
            proposal
        });

    } catch (error: unknown) {
        console.error('Error denying proposal:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to deny proposal',
            details: message
        }, { status: 500 });
    }
}
