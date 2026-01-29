import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Agent 2 Initialization - Load suggestions and alerts
export async function GET() {
    try {
        // =============================================
        // 1. Get Pending Proposals for Review
        // =============================================
        const pendingProposals = await prisma.proposal.findMany({
            where: {
                status: { in: ['DRAFT', 'PENDING_REVIEW', 'MODIFIED_PENDING_SEND'] }
            },
            include: { request: true },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // =============================================
        // 2. Generate Suggestions
        // =============================================
        const suggestions: Array<{
            type: string;
            priority: 'HIGH' | 'MEDIUM' | 'LOW';
            proposal_id?: string;
            client_name?: string;
            description: string;
            potential_revenue?: number;
            count?: number;
            proposals?: Array<{ id: string; client: string; sent_at: Date | null }>;
        }> = [];

        // Check each pending proposal for opportunities
        for (const proposal of pendingProposals) {
            const headcount = proposal.request.headcount;
            const proteins = proposal.request.proteins.toLowerCase();
            const hasPremium = proteins.includes('steak') || proteins.includes('seafood');

            // Upsell opportunities
            if (headcount >= 100 && !hasPremium) {
                suggestions.push({
                    type: 'UPSELL_OPPORTUNITY',
                    priority: 'HIGH',
                    proposal_id: proposal.id,
                    client_name: proposal.request.customerName,
                    description: `${proposal.request.customerName} (${headcount} guests) - similar clients upgrade 78% of the time`,
                    potential_revenue: headcount * 5
                });
            }

            // Large event alerts
            if (headcount > 150) {
                suggestions.push({
                    type: 'CAPACITY_CHECK',
                    priority: 'MEDIUM',
                    proposal_id: proposal.id,
                    client_name: proposal.request.customerName,
                    description: `Large event (${headcount} guests) - verify kitchen capacity for ${proposal.request.eventDate || 'TBD'}`
                });
            }
        }

        // =============================================
        // 3. Check for Follow-ups Needed (>48 hours)
        // =============================================
        const followUpNeeded = await prisma.proposal.findMany({
            where: {
                status: 'SENT',
                sentAt: {
                    lt: new Date(Date.now() - 48 * 60 * 60 * 1000)
                },
                followUpSent: false
            },
            include: { request: true },
            orderBy: { sentAt: 'asc' }
        });

        if (followUpNeeded.length > 0) {
            suggestions.push({
                type: 'FOLLOW_UP_REQUIRED',
                priority: 'HIGH',
                count: followUpNeeded.length,
                description: `${followUpNeeded.length} proposals pending > 48 hours need follow-up`,
                proposals: followUpNeeded.map(p => ({
                    id: p.id,
                    client: p.request.customerName,
                    sent_at: p.sentAt
                }))
            });
        }

        // =============================================
        // 4. Check Calendar Capacity (Next 30 days)
        // =============================================
        const upcomingEvents = await prisma.calendarEvent.findMany({
            where: {
                eventType: 'EVENT_DAY',
                startTime: {
                    gte: new Date(),
                    lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            },
            include: { proposal: { include: { request: true } } }
        });

        // Group by date and check capacity
        const capacityByDate: Record<string, number> = {};
        for (const event of upcomingEvents) {
            const dateKey = event.startTime.toISOString().split('T')[0];
            const headcount = event.proposal.request.headcount;
            capacityByDate[dateKey] = (capacityByDate[dateKey] || 0) + headcount;
        }

        const MAX_CAPACITY = 200;
        for (const [date, totalGuests] of Object.entries(capacityByDate)) {
            if (totalGuests > MAX_CAPACITY * 0.85) {
                suggestions.push({
                    type: 'CAPACITY_ALERT',
                    priority: totalGuests >= MAX_CAPACITY ? 'HIGH' : 'MEDIUM',
                    description: `${date} approaching capacity (${totalGuests}/${MAX_CAPACITY} guests). Consider blocking new bookings.`
                });
            }
        }

        // =============================================
        // 5. Check for Unsigned Contracts
        // =============================================
        const unsignedContracts = await prisma.contract.findMany({
            where: {
                status: 'SENT',
                createdAt: {
                    lt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // > 5 days
                }
            },
            include: { proposal: { include: { request: true } } }
        });

        if (unsignedContracts.length > 0) {
            suggestions.push({
                type: 'CONTRACT_PENDING',
                priority: 'HIGH',
                count: unsignedContracts.length,
                description: `${unsignedContracts.length} contracts awaiting signature > 5 days`,
                proposals: unsignedContracts.map(c => ({
                    id: c.proposalId,
                    client: c.proposal.request.customerName,
                    sent_at: c.createdAt
                }))
            });
        }

        // =============================================
        // 6. Get Metrics Summary
        // =============================================
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalProposals,
            approvedProposals,
            totalRevenue
        ] = await Promise.all([
            prisma.proposal.count({
                where: { createdAt: { gte: thirtyDaysAgo } }
            }),
            prisma.proposal.count({
                where: {
                    createdAt: { gte: thirtyDaysAgo },
                    status: { in: ['APPROVED', 'SENT'] }
                }
            }),
            prisma.proposal.aggregate({
                where: {
                    createdAt: { gte: thirtyDaysAgo },
                    status: { in: ['APPROVED', 'SENT'] }
                },
                _sum: { estimatedCost: true }
            })
        ]);

        const closeRate = totalProposals > 0
            ? Math.round((approvedProposals / totalProposals) * 100)
            : 0;

        return NextResponse.json({
            success: true,
            suggestions: suggestions.sort((a, b) => {
                const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }),
            metrics: {
                pending_count: pendingProposals.length,
                follow_ups_needed: followUpNeeded.length,
                proposals_this_month: totalProposals,
                approved_this_month: approvedProposals,
                close_rate: closeRate,
                revenue_this_month: totalRevenue._sum.estimatedCost || 0
            },
            timestamp: new Date().toISOString(),
            agent2_status: 'ACTIVE'
        });

    } catch (error: unknown) {
        console.error('Error initializing Agent 2:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to initialize Agent 2',
            details: message
        }, { status: 500 });
    }
}
