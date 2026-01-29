import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

interface ContractParams {
    proposalId: string;
}

interface ContractData {
    clientName: string;
    clientEmail: string;
    eventDate: string;
    eventLocation: string;
    eventType: string;
    headcount: number;
    total: number;
    deposit: number;
    proteins: string;
    sides: string;
    bread: string;
    allergies: string;
}

const getClaudeClient = (): Anthropic | null => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return null;
    return new Anthropic({ apiKey });
};

export async function generateContract(params: ContractParams) {
    // Fetch proposal data
    const proposal = await prisma.proposal.findUnique({
        where: { id: params.proposalId },
        include: { request: true }
    });

    if (!proposal) {
        throw new Error('Proposal not found');
    }

    const request = proposal.request;
    const contractData: ContractData = {
        clientName: request.customerName,
        clientEmail: request.customerEmail,
        eventDate: request.eventDate || 'TBD',
        eventLocation: request.eventLocation || 'TBD',
        eventType: request.eventType || 'Special Event',
        headcount: request.headcount,
        total: proposal.estimatedCost,
        deposit: proposal.estimatedCost / 2,
        proteins: request.proteins,
        sides: request.sides || 'Chef\'s Selection',
        bread: request.bread || 'Artisan Rolls',
        allergies: request.allergies || 'None specified'
    };

    // Generate contract content
    const content = await generateContractContent(contractData);

    // Generate unique contract number
    const contractNumber = `EA-CONTRACT-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    // Create contract in database
    const contract = await prisma.contract.create({
        data: {
            contractNumber,
            content,
            status: 'DRAFT',
            proposalId: params.proposalId
        }
    });

    return contract;
}

async function generateContractContent(data: ContractData): Promise<string> {
    const claude = getClaudeClient();
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Static contract template (Claude can enhance this if available)
    const contractTemplate = `
# CATERING SERVICE AGREEMENT

## ETHELEEN & ALMA'S DREAM, LLC

---

**Contract Date:** ${currentDate}
**Contract ID:** EA-CONTRACT-${Date.now().toString(36).toUpperCase()}

---

## PARTIES

**Service Provider (Caterer):**
Etheleen & Alma's Dream, LLC
Email: yourmeal@eadreamllc.com
Phone: (602) 318-4925

**Client:**
${data.clientName}
Email: ${data.clientEmail}

---

## EVENT DETAILS

| Detail | Information |
|--------|-------------|
| Event Type | ${data.eventType} |
| Event Date | ${data.eventDate} |
| Event Location | ${data.eventLocation} |
| Expected Guests | ${data.headcount} |

---

## MENU SELECTIONS

**Protein Options:** ${data.proteins}
**Side Dishes:** ${data.sides}
**Bread Selection:** ${data.bread}
**Dietary Accommodations:** ${data.allergies}

---

## FINANCIAL TERMS

| Item | Amount |
|------|--------|
| **Total Contract Value** | $${data.total.toFixed(2)} |
| **Deposit (50%, due upon signing)** | $${data.deposit.toFixed(2)} |
| **Final Payment (due 7 days before event)** | $${data.deposit.toFixed(2)} |

### Payment Methods Accepted:
- Bank Transfer / ACH
- Credit Card (Visa, Mastercard, AmEx)
- Check (payable to "Etheleen & Alma's Dream, LLC")

---

## TERMS AND CONDITIONS

### 1. Deposit and Payment
- A non-refundable deposit of 50% is required to secure the event date
- Final payment is due no later than 7 days before the event
- Late payments may result in cancellation of services

### 2. Guest Count
- Final guest count must be confirmed 7 days before the event
- Increases of up to 10% may be accommodated with 48 hours notice
- Pricing is based on confirmed guest count, not actual attendance

### 3. Cancellation Policy
- 30+ days notice: 50% deposit refund
- 15-29 days notice: 25% deposit refund
- Less than 14 days notice: No refund

### 4. Menu Changes
- Menu modifications accepted up to 10 days before event
- Substitutions of equal value available
- Premium upgrades may incur additional charges

### 5. Food Allergies and Dietary Restrictions
- Client must provide complete allergy information at least 7 days before event
- Caterer will make reasonable accommodations for stated restrictions
- Caterer cannot guarantee a completely allergen-free environment

### 6. Service Details
- Pick-up time to be coordinated with client
- Client responsible for serving equipment unless otherwise arranged
- Leftover food becomes property of the client

### 7. Liability
- Caterer maintains appropriate food handling licenses and insurance
- Client assumes responsibility for food safety after pickup
- Maximum liability limited to contract value

---

## SIGNATURES

By signing below, both parties agree to the terms and conditions of this contract.

**Caterer Representative:**
_________________________________
Etheleen & Alma's Dream, LLC
Date: _______________


**Client:**
_________________________________
${data.clientName}
Date: _______________

---

*This contract was generated by EA Dream Admin System*
*Proposal Reference: ${data.eventType}*
    `.trim();

    // Try to enhance with Claude if available
    if (claude) {
        try {
            const message = await claude.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 500,
                messages: [{
                    role: 'user',
                    content: `Review and enhance this catering contract. Keep the same structure but make the language more professional and legally sound. Only output the enhanced contract, no explanations:\n\n${contractTemplate.substring(0, 3000)}`
                }]
            });

            const textBlock = message.content.find(block => block.type === 'text');
            if (textBlock?.text) {
                return textBlock.text;
            }
        } catch (error) {
            console.log('Using static contract template');
        }
    }

    return contractTemplate;
}

export async function updateContractStatus(
    contractId: string,
    status: 'DRAFT' | 'SENT' | 'SIGNED' | 'CANCELLED',
    signedBy?: string
) {
    return await prisma.contract.update({
        where: { id: contractId },
        data: {
            status,
            signedBy,
            signedAt: status === 'SIGNED' ? new Date() : undefined
        }
    });
}
