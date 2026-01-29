import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateContract } from '@/lib/contract-generation';
import { sendEmail } from '@/lib/email';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: proposalId } = await params;
        const body = await request.json();

        // 1. Update proposal status
        const proposal = await prisma.proposal.update({
            where: { id: proposalId },
            data: {
                status: 'APPROVED',
                approvedAt: new Date(),
                approvedBy: body.admin_id || 'admin'
            },
            include: { request: true }
        });

        // 2. Send proposal to client
        await sendEmail({
            to: proposal.request.customerEmail,
            subject: `Your Catering Proposal from Etheleen & Alma's Dream`,
            template: 'proposal_approved',
            data: {
                client_name: proposal.request.customerName,
                proposal_content: proposal.content,
                total: proposal.estimatedCost,
                deposit: proposal.estimatedCost / 2,
                proposal_id: proposalId
            }
        });

        // 3. Generate contract (draft)
        const contract = await generateContract({ proposalId });

        // 4. Create follow-up tasks
        await prisma.task.createMany({
            data: [
                {
                    title: `Follow up on proposal ${proposalId.substring(0, 8)}...`,
                    description: `Check if client has questions about proposal`,
                    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    status: 'PENDING',
                    priority: 'MEDIUM',
                    proposalId
                },
                {
                    title: `Schedule tasting for ${proposal.request.customerName}`,
                    description: `Coordinate tasting appointment`,
                    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    status: 'PENDING',
                    priority: 'HIGH',
                    proposalId
                }
            ]
        });

        // 5. Log admin action
        if (body.admin_id) {
            await prisma.adminLog.create({
                data: {
                    adminId: body.admin_id,
                    action: 'APPROVE_PROPOSAL',
                    entityType: 'PROPOSAL',
                    entityId: proposalId,
                    metadata: { proposal_id: proposalId, client: proposal.request.customerName }
                }
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Proposal approved and sent to client',
            proposal,
            contract,
            next_steps: [
                'Client will receive proposal via email',
                'Contract ready for signature when client approves',
                'Follow-up scheduled for 24 hours',
                'Tasting appointment to be coordinated'
            ]
        });

    } catch (error: unknown) {
        console.error('Error approving proposal:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to approve proposal',
            details: message
        }, { status: 500 });
    }
}
