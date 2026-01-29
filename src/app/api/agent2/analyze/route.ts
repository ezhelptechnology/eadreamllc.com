import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Agent 2 Analysis Engine
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const proposalId = body.proposal_id;

        // Fetch proposal and related data
        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
            include: {
                request: true,
                tasks: true,
                changeLogs: true
            }
        });

        if (!proposal) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
        }

        // Run Agent 2 analysis
        const analysis = await runAgent2Analysis(proposal);

        return NextResponse.json({
            success: true,
            analysis
        });

    } catch (error: unknown) {
        console.error('Error running Agent 2 analysis:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to analyze proposal',
            details: message
        }, { status: 500 });
    }
}

interface ProposalWithRequest {
    id: string;
    estimatedCost: number;
    validationScore: number | null;
    request: {
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        eventDate: string | null;
        eventLocation: string | null;
        eventType: string | null;
        headcount: number;
        proteins: string;
        preparation: string | null;
        sides: string | null;
        bread: string | null;
        allergies: string | null;
    };
}

async function runAgent2Analysis(proposal: ProposalWithRequest) {
    const request = proposal.request;
    const headcount = request.headcount;
    const eventDate = request.eventDate ? new Date(request.eventDate) : new Date();
    const proteins = request.proteins || '';
    const allergies = request.allergies || '';
    const eventLocation = request.eventLocation || '';

    // ============================================
    // 1. QUALITY SCORING (0-100)
    // ============================================
    const qualityFactors = {
        validation_passed: (proposal.validationScore || 0) > 90 ? 20 : 10,
        menu_coherence: analyzeMenuCoherence(request) ? 15 : 10,
        pricing_accuracy: 20, // Assume validated
        client_completeness: (request.customerEmail && request.customerPhone) ? 15 : 10,
        seasonal_appropriateness: checkSeasonalAppropriate(eventDate, proteins) ? 10 : 5,
        special_requests_handled: allergies && allergies.toLowerCase() !== 'none' ? 10 : 5,
        profit_margin: calculateProfitMargin(proposal) > 35 ? 10 : 5
    };

    const quality_score = Object.values(qualityFactors).reduce((a, b) => a + b, 0);

    // ============================================
    // 2. RISK ASSESSMENT
    // ============================================
    let risk_level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    const risk_factors: string[] = [];

    if (headcount > 200) {
        risk_level = 'HIGH';
        risk_factors.push('Large event (200+ guests) - confirm kitchen capacity');
    } else if (headcount > 100) {
        risk_level = 'MEDIUM';
        risk_factors.push('Medium-large event - verify staff availability');
    }

    if (allergies && allergies.toLowerCase().includes('severe')) {
        risk_level = risk_level === 'HIGH' ? 'HIGH' : 'MEDIUM';
        risk_factors.push('Severe allergies - requires dedicated prep area');
    }

    const daysUntilEvent = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilEvent < 7) {
        risk_level = 'HIGH';
        risk_factors.push('URGENT: Less than 7 days until event');
    } else if (daysUntilEvent < 14) {
        risk_level = risk_level === 'HIGH' ? 'HIGH' : 'MEDIUM';
        risk_factors.push('Short lead time - expedite prep');
    }

    // ============================================
    // 3. UPSELL OPPORTUNITIES
    // ============================================
    const upsell_suggestions: Array<{
        type: string;
        description: string;
        potential_revenue: number;
        confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    }> = [];

    const hasPremiumProteins = proteins.toLowerCase().includes('steak') ||
        proteins.toLowerCase().includes('seafood');

    if (headcount >= 100 && !hasPremiumProteins) {
        upsell_suggestions.push({
            type: 'PREMIUM_UPGRADE',
            description: `Suggest premium package upgrade for ${headcount} guests (+$5/person)`,
            potential_revenue: headcount * 5,
            confidence: 'HIGH'
        });
    }

    if (eventLocation.toLowerCase().includes('corporate') ||
        eventLocation.toLowerCase().includes('office') ||
        eventLocation.toLowerCase().includes('convention')) {
        upsell_suggestions.push({
            type: 'BEVERAGE_SERVICE',
            description: 'Corporate events often include beverage service',
            potential_revenue: 500,
            confidence: 'MEDIUM'
        });
    }

    const eventMonth = eventDate.getMonth();
    if (eventMonth >= 2 && eventMonth <= 4) { // March-May
        upsell_suggestions.push({
            type: 'SEASONAL_ADD',
            description: 'Suggest spring seasonal salad as additional side',
            potential_revenue: Math.round(headcount * 2.5),
            confidence: 'MEDIUM'
        });
    }

    if (headcount >= 150) {
        upsell_suggestions.push({
            type: 'DESSERT_ADD',
            description: 'Large events benefit from dessert bar option',
            potential_revenue: Math.round(headcount * 4),
            confidence: 'MEDIUM'
        });
    }

    // ============================================
    // 4. HISTORICAL CONTEXT
    // ============================================
    const similarEvents = await prisma.proposal.findMany({
        where: {
            request: {
                headcount: {
                    gte: Math.floor(headcount * 0.8),
                    lte: Math.ceil(headcount * 1.2)
                }
            },
            status: { in: ['APPROVED', 'SENT'] }
        },
        take: 10
    });

    const avgCloseRate = similarEvents.length > 5 ? 0.78 :
        similarEvents.length > 2 ? 0.65 : 0.50;

    // ============================================
    // 5. PROFIT ANALYSIS
    // ============================================
    const profitMargin = calculateProfitMargin(proposal);
    const estimatedCost = proposal.estimatedCost * (1 - profitMargin / 100);
    const profit = proposal.estimatedCost - estimatedCost;

    // ============================================
    // 6. RECOMMENDATIONS
    // ============================================
    const recommendations: string[] = [];

    if (quality_score >= 85) {
        recommendations.push('✅ APPROVE - High quality proposal ready to send');
    } else if (quality_score >= 70) {
        recommendations.push('📝 REVIEW - Good proposal, minor improvements possible');
    } else {
        recommendations.push('⚠️ NEEDS WORK - Below quality threshold');
    }

    risk_factors.forEach(f => recommendations.push(`⚠️ RISK: ${f}`));
    upsell_suggestions.slice(0, 2).forEach(s =>
        recommendations.push(`💰 UPSELL: ${s.description} (+$${s.potential_revenue})`)
    );

    return {
        proposal_id: proposal.id,
        quality_score,
        quality_factors: qualityFactors,
        risk_level,
        risk_factors,
        upsell_suggestions,
        profit_analysis: {
            revenue: proposal.estimatedCost,
            estimated_cost: Math.round(estimatedCost),
            profit: Math.round(profit),
            margin_percent: profitMargin
        },
        close_probability: avgCloseRate,
        similar_events_count: similarEvents.length,
        days_until_event: daysUntilEvent,
        recommendations,
        analysis_timestamp: new Date().toISOString()
    };
}

function analyzeMenuCoherence(request: ProposalWithRequest['request']): boolean {
    const proteins = (request.proteins || '').toLowerCase();
    const preparation = (request.preparation || '').toLowerCase();
    const sides = (request.sides || '').toLowerCase();

    // BBQ-style proteins should have BBQ-appropriate sides
    if (preparation.includes('bbq') || preparation.includes('smoked')) {
        return sides.includes('coleslaw') || sides.includes('beans') ||
            sides.includes('mac') || sides.includes('corn');
    }

    // Grilled proteins go with fresh sides
    if (preparation.includes('grill')) {
        return true; // Most sides work with grilled
    }

    // Herb-crusted is upscale - should have matching sides
    if (preparation.includes('herb')) {
        return sides.includes('rice') || sides.includes('potato') ||
            sides.includes('brussels') || sides.includes('asparagus');
    }

    return true; // Default to coherent
}

function checkSeasonalAppropriate(eventDate: Date, proteins: string): boolean {
    const month = eventDate.getMonth();
    const proteinsLower = proteins.toLowerCase();

    // Summer months (June-August) - all proteins work
    if (month >= 5 && month <= 7) return true;

    // Winter months - heavier proteins preferred
    if (month >= 10 || month <= 1) {
        return proteinsLower.includes('beef') || proteinsLower.includes('pork') ||
            proteinsLower.includes('steak');
    }

    return true;
}

function calculateProfitMargin(proposal: ProposalWithRequest): number {
    const revenue = proposal.estimatedCost;
    const headcount = proposal.request.headcount;
    const proteins = (proposal.request.proteins || '').toLowerCase();

    // Rough cost estimation
    let costPerPerson = 12; // Base cost for standard proteins
    if (proteins.includes('steak') || proteins.includes('filet')) {
        costPerPerson = 18;
    } else if (proteins.includes('seafood') || proteins.includes('shrimp')) {
        costPerPerson = 16;
    }

    const totalCost = costPerPerson * headcount;
    const profit = revenue - totalCost;
    const margin = (profit / revenue) * 100;

    return Math.round(margin);
}
