import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: proposalId } = await params;
        const body = await request.json();

        // Validate admin permission
        if (!body.admin_id) {
            return NextResponse.json({
                error: 'Admin authorization required'
            }, { status: 403 });
        }

        // Track what changed
        const changes: Record<string, unknown> = {};
        const changeLog: Array<{ field: string; old_value: unknown; new_value: unknown }> = [];

        // Update each modified field
        if (body.headcount !== undefined) {
            changes.headcount = body.headcount;
            changeLog.push({
                field: 'headcount',
                old_value: body.old_headcount,
                new_value: body.headcount
            });
        }

        if (body.event_date !== undefined) {
            changes.eventDate = body.event_date;
            changeLog.push({
                field: 'event_date',
                old_value: body.old_event_date,
                new_value: body.event_date
            });
        }

        // Recalculate pricing if headcount changed
        let newEstimatedCost: number | undefined;
        if (body.headcount !== undefined) {
            const rate = body.rate_per_person || 25;
            const subtotal = rate * body.headcount;
            const tax = subtotal * 0.0725;
            newEstimatedCost = subtotal + tax;
        }

        // Update proposal
        const proposal = await prisma.proposal.update({
            where: { id: proposalId },
            data: {
                ...(newEstimatedCost && { estimatedCost: newEstimatedCost }),
                status: 'MODIFIED_PENDING_SEND',
                version: { increment: 1 }
            },
            include: { request: true }
        });

        // Update request if needed
        if (body.headcount !== undefined) {
            await prisma.cateringRequest.update({
                where: { id: proposal.requestId },
                data: { headcount: body.headcount }
            });
        }

        // Log changes
        if (changeLog.length > 0) {
            await prisma.changeLog.createMany({
                data: changeLog.map(change => ({
                    proposalId,
                    changedBy: body.admin_id,
                    fieldName: change.field,
                    oldValue: String(change.old_value),
                    newValue: String(change.new_value),
                    reason: body.modification_reason || 'Admin modification'
                }))
            });
        }

        // Log admin action
        await prisma.adminLog.create({
            data: {
                adminId: body.admin_id,
                action: 'MODIFY_PROPOSAL',
                entityType: 'PROPOSAL',
                entityId: proposalId,
                metadata: { changes: changeLog.map(c => ({ field: c.field, old_value: String(c.old_value), new_value: String(c.new_value) })) }
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Proposal modified successfully',
            proposal,
            changes: changeLog,
            next_action: 'Review updated proposal and send to client'
        });

    } catch (error: unknown) {
        console.error('Error modifying proposal:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to modify proposal',
            details: message
        }, { status: 500 });
    }
}
