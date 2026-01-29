import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const proposals = await prisma.proposal.findMany({
            include: {
                request: true,
                tasks: {
                    where: { status: 'PENDING' },
                    orderBy: { dueDate: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transform for frontend
        const transformed = proposals.map(p => ({
            id: `EA-${p.id.substring(0, 12).toUpperCase()}`,
            rawId: p.id,
            client: p.request.customerName,
            clientEmail: p.request.customerEmail,
            clientPhone: p.request.customerPhone,
            eventDate: p.request.eventDate,
            eventType: p.request.eventType,
            eventLocation: p.request.eventLocation,
            guests: p.request.headcount,
            total: p.estimatedCost,
            status: p.status,
            version: p.version,
            createdAt: p.createdAt,
            sentAt: p.sentAt,
            approvedAt: p.approvedAt,
            tastingScheduled: p.tastingScheduled,
            followUpSent: p.followUpSent,
            pendingTasks: p.tasks.length,
            // Menu details
            proteins: p.request.proteins,
            preparation: p.request.preparation,
            sides: p.request.sides,
            bread: p.request.bread,
            allergies: p.request.allergies
        }));

        return NextResponse.json({
            success: true,
            proposals: transformed,
            count: proposals.length
        });

    } catch (error: unknown) {
        console.error('Error fetching proposals:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to fetch proposals',
            details: message
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { search, filter, sortBy, sortOrder, page = 1, limit = 20 } = body;

        // Build where clause
        const where: Record<string, unknown> = {};

        if (filter && filter !== 'ALL') {
            where.status = filter;
        }

        if (search) {
            where.OR = [
                { request: { customerName: { contains: search, mode: 'insensitive' } } },
                { request: { customerEmail: { contains: search, mode: 'insensitive' } } },
                { id: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Execute query
        const [proposals, total] = await Promise.all([
            prisma.proposal.findMany({
                where,
                include: { request: true },
                orderBy: { [sortBy || 'createdAt']: sortOrder || 'desc' },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.proposal.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            proposals,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error: unknown) {
        console.error('Error searching proposals:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to search proposals',
            details: message
        }, { status: 500 });
    }
}
