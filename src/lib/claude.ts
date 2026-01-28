import Anthropic from '@anthropic-ai/sdk';

// Claude client - primary and only AI provider
const getClaudeClient = (): Anthropic | null => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.log('ANTHROPIC_API_KEY not configured');
        return null;
    }
    return new Anthropic({ apiKey });
};

interface MenuSelections {
    proteins: string[];
    preparation: string;
    sides: string;
    bread: string;
    allergies: string;
}

function getPrompt(selections: MenuSelections): string {
    return `You are an expert catering chef for "Etheleen & Alma's Dream," a premium catering service in the Greater Charlotte area.

Your task is to create a formal "Catering Proposal Template" based on a client's specific experience curation:
- Main Proteins: ${selections.proteins.join(', ')}
- Preparation Style: ${selections.preparation}
- Side Dishes: ${selections.sides}
- Bread Selection: ${selections.bread}
- Dietary Notes/Allergies: ${selections.allergies}

The proposal MUST follow this structured format:

1. HEADER:
   Etheleen & Alma's Dream, LLC
   Catering Proposal

2. CLIENT INFO (Use blanks):
   Submitted To: ____________________
   Event Date: ____________________
   Location: ____________________

3. SCOPE OF WORK:
   Etheleen & Alma's Dream, LLC proposes to provide bespoke "Pick-up-and-go" catered meals. 
   Includes: ${selections.proteins.length} types of custom sliders, 2 sides, and bread service.

4. MENU OVERVIEW:
   - Sliders: (Provide detailed, mouth-watering descriptions of ${selections.proteins.join(', ')} prepared in "${selections.preparation}" style)
   - Sides: ${selections.sides}
   - Bread: ${selections.bread}
   - Special Instructions: ${selections.allergies}

5. PAYMENT TERMS:
   - A non-refundable deposit of 50% is due upon contract signing.
   - The remaining balance is due upon completion of services.
   - Final headcount due 7 days prior to event.

6. SIGNATURE BLOCK (Use blanks):
   Authorized Signature (Client): ____________________ Date: ____________
   Authorized Signature (Etheleen & Alma's Dream, LLC): ____________________ Date: ____________

Make the tone luxurious, professional, and bespoke.`;
}

function getFallbackProposal(selections: MenuSelections): string {
    return `
═══════════════════════════════════════════════════════════════
                    ETHELEEN & ALMA'S DREAM, LLC
                        CATERING PROPOSAL
═══════════════════════════════════════════════════════════════

CLIENT INFORMATION
───────────────────────────────────────────────────────────────
Submitted To: ____________________
Event Date: ____________________
Location: ____________________
Guest Count: ____________________

SCOPE OF WORK
───────────────────────────────────────────────────────────────
Etheleen & Alma's Dream, LLC proposes to provide bespoke 
"Pick-up-and-go" catered meals for your special event.

MENU OVERVIEW
───────────────────────────────────────────────────────────────
PROTEINS:
${selections.proteins.map(p => `  • ${p}`).join('\n')}

PREPARATION STYLE: ${selections.preparation || 'Chef\'s Choice'}

SIDE DISHES: ${selections.sides || 'Chef\'s Selection'}

BREAD SERVICE: ${selections.bread || 'Artisan Rolls'}

DIETARY NOTES: ${selections.allergies || 'None specified'}

PRICING
───────────────────────────────────────────────────────────────
Classic Package: $25 per person
Premium Package: $30 per person (includes steak/seafood options)

PAYMENT TERMS
───────────────────────────────────────────────────────────────
• 50% non-refundable deposit due upon contract signing
• Remaining balance due upon completion of services
• Final headcount required 7 days prior to event

SIGNATURES
───────────────────────────────────────────────────────────────
Client Signature: ____________________ Date: ____________

Etheleen & Alma's Dream, LLC: ____________ Date: ____________

───────────────────────────────────────────────────────────────
Questions? Contact us at (602) 318-4925 or yourmeal@eadreamllc.com
═══════════════════════════════════════════════════════════════
    `.trim();
}

// Generate menu using Claude AI
async function tryClaudeGeneration(selections: MenuSelections): Promise<string | null> {
    const client = getClaudeClient();
    if (!client) return null;

    try {
        console.log('Generating proposal with Claude...');
        const message = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            messages: [{ role: 'user', content: getPrompt(selections) }],
        });

        const textBlock = message.content.find(block => block.type === 'text');
        if (textBlock) {
            console.log('Claude generation successful');
            return textBlock.text;
        }
        return null;
    } catch (error) {
        console.error('Claude generation failed:', error);
        return null;
    }
}

export async function generateMenuFromDishes(selections: MenuSelections): Promise<string> {
    // Try Claude (primary AI provider)
    const claudeResult = await tryClaudeGeneration(selections);
    if (claudeResult) return claudeResult;

    // Fall back to static template if Claude fails
    console.log('Claude unavailable, using static fallback template');
    return getFallbackProposal(selections);
}

export async function estimateCateringCost(menuContent: string, guestCount: number = 50): Promise<number> {
    // Simple logic - no need to call AI for cost estimation
    const hasSteakOrSeafood = menuContent.toLowerCase().includes('steak') ||
        menuContent.toLowerCase().includes('seafood') ||
        menuContent.toLowerCase().includes('bass') ||
        menuContent.toLowerCase().includes('filet');
    const rate = hasSteakOrSeafood ? 30 : 25;
    return rate * guestCount;
}
