import Anthropic from '@anthropic-ai/sdk';
import { callGrok } from './grok';

// Claude client - primary and only AI provider
const getClaudeClient = (): Anthropic | null => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.log('ANTHROPIC_API_KEY not configured');
        return null;
    }
    return new Anthropic({ apiKey });
};

// Full customer information for personalized proposals
export interface CustomerInfo {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventDate: string;
    eventLocation: string;
    eventType: string;
    headcount: number;
    proteins: string[];
    preparation: string;
    sides: string;
    bread: string;
    allergies: string;
}

// Legacy interface for backward compatibility
interface MenuSelections {
    proteins: string[];
    preparation: string;
    sides: string;
    bread: string;
    allergies: string;
}

function generateProposalId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EA-${timestamp}-${random}`;
}

function formatDate(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr || 'TBD';
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return dateStr || 'TBD';
    }
}

function getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getExpirationDate(): string {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 30);
    return expDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculatePricing(info: CustomerInfo) {
    const premiumProteins = ['steak', 'seafood', 'fish', 'shrimp', 'lobster', 'crab', 'salmon', 'filet'];
    const hasPremium = info.proteins.some(p =>
        premiumProteins.some(premium => p.toLowerCase().includes(premium))
    );

    const rate = hasPremium ? 30 : 25;
    const packageType = hasPremium ? 'Premium Package' : 'Classic Package';
    const subtotal = rate * info.headcount;
    const tax = subtotal * 0.0725; // 7.25% estimated tax
    const total = subtotal + tax;
    const deposit = total * 0.5;
    const finalPayment = total - deposit;

    return {
        rate,
        packageType,
        subtotal,
        tax,
        total,
        deposit,
        finalPayment,
        hasPremium
    };
}

// Generate detailed protein descriptions using Claude
async function generateProteinDescriptions(proteins: string[], preparation: string): Promise<string> {
    const client = getClaudeClient();
    const prompt = `Write a luxurious, mouth-watering description for each protein prepared in "${preparation}" style. Keep each description to 2 sentences max. Format as bullet points.

Proteins: ${proteins.join(', ')}

Example format:
- **Beef:** [description]
- **Chicken:** [description]`;

    if (client) {
        try {
            const message = await client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 500,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            });

            const textBlock = message.content.find(block => block.type === 'text');
            if (textBlock?.text) return textBlock.text;
        } catch (error) {
            console.warn('Claude protein generation failed, falling back to Grok:', error);
        }
    }

    // Try Grok Fallback
    const grokResponse = await callGrok([
        { role: 'system', content: 'You are an expert culinary writer for Etheleen & Alma\'s Dream.' },
        { role: 'user', content: prompt }
    ]);

    if (grokResponse) return grokResponse;

    // Hardcoded fallback
    return proteins.map(p => `**${p}:** Expertly prepared ${preparation.toLowerCase()} style with our signature seasoning blend.`).join('\n');
}

// Generate side dish descriptions
async function generateSideDescriptions(sides: string): Promise<string> {
    const client = getClaudeClient();
    const sidesList = sides.split(',').map(s => s.trim()).filter(Boolean);
    const prompt = `Write elegant descriptions for these side dishes. Keep each to 1-2 sentences. Format as bullet points.

Sides: ${sides}

Example:
- **Green Beans:** [description]`;

    if (client && sidesList.length > 0) {
        try {
            const message = await client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 300,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            });

            const textBlock = message.content.find(block => block.type === 'text');
            if (textBlock?.text) return textBlock.text;
        } catch (error) {
            console.warn('Claude side generation failed, falling back to Grok:', error);
        }
    }

    // Try Grok Fallback
    if (sidesList.length > 0) {
        const grokResponse = await callGrok([
            { role: 'system', content: 'You are an expert culinary writer for Etheleen & Alma\'s Dream.' },
            { role: 'user', content: prompt }
        ]);

        if (grokResponse) return grokResponse;
    }

    // Hardcoded fallback
    return sidesList.map(s => `**${s}:** Chef's special preparation with premium ingredients.`).join('\n');
}

// Generate bread description
function generateBreadDescription(bread: string): string {
    const descriptions: Record<string, string> = {
        'rolls': 'Our signature soft dinner rolls, baked fresh daily with a golden crust and pillowy interior. Served warm with whipped honey butter.',
        'biscuits': 'Southern-style buttermilk biscuits, flaky and tender, made from scratch using our family\'s secret recipe. Served warm with honey butter.',
        'toast': 'Artisan bread, perfectly toasted and brushed with herb-infused butter. Adds a satisfying crunch to complement your sliders.',
    };

    const key = bread.toLowerCase();
    for (const [type, desc] of Object.entries(descriptions)) {
        if (key.includes(type)) return desc;
    }
    return `Artisan ${bread}, freshly prepared to complement your meal perfectly.`;
}

// Main function to generate fully personalized proposal
export async function generatePersonalizedProposal(info: CustomerInfo): Promise<string> {
    const proposalId = generateProposalId();
    const currentDate = getCurrentDate();
    const expirationDate = getExpirationDate();
    const formattedEventDate = formatDate(info.eventDate);
    const pricing = calculatePricing(info);

    // Generate detailed descriptions
    const proteinDescriptions = await generateProteinDescriptions(info.proteins, info.preparation);
    const sideDescriptions = await generateSideDescriptions(info.sides);
    const breadDescription = generateBreadDescription(info.bread);

    const proposal = `
# ETHELEEN & ALMA'S DREAM, LLC
## BESPOKE CATERING PROPOSAL

---

### CLIENT INFORMATION

**Prepared For:** ${info.customerName}  
**Contact Email:** ${info.customerEmail}  
**Contact Phone:** ${info.customerPhone || 'Not provided'}  
**Event Type:** ${info.eventType || 'Special Event'}  
**Event Date:** ${formattedEventDate}  
**Event Location:** ${info.eventLocation || 'To be confirmed'}  
**Guest Count:** ${info.headcount} attendees  
**Proposal Date:** ${currentDate}  
**Proposal ID:** ${proposalId}

---

## EXECUTIVE SUMMARY

Etheleen & Alma's Dream, LLC is honored to present this bespoke catering proposal for your upcoming event. Our third-generation family recipes combined with modern culinary excellence create unforgettable dining experiences that transform events into cherished memories.

Dear ${info.customerName.split(' ')[0]}, this proposal outlines a fully customized menu designed specifically for your preferences, dietary requirements, and event specifications.

---

## SCOPE OF SERVICES

### What's Included:

✓ **Custom Menu Development** - Tailored to your exact specifications  
✓ **Premium Ingredients** - Locally sourced when possible, always fresh  
✓ **Professional Preparation** - Pick-up-and-go service with chef-quality execution  
✓ **Flexible Service Options** - Designed around your event needs  
✓ **Pre-Event Tasting** - Complimentary tasting session for approved proposals  
✓ **Event Consultation** - Expert guidance from planning through execution  
✓ **Dietary Accommodation** - Full support for allergies and special requirements

---

## CUSTOM MENU DESIGN

### SIGNATURE SLIDERS
**Protein Selections:** ${info.proteins.join(', ')}

${proteinDescriptions}

**Preparation Style:** ${info.preparation}  
All proteins are prepared using ${info.preparation.toLowerCase()} technique to ensure optimal flavor, texture, and presentation.

### PREMIUM SIDE SELECTIONS
**Your Chosen Sides:** ${info.sides}

${sideDescriptions}

### ARTISAN BREAD SERVICE
**Bread Selection:** ${info.bread}

${breadDescription}

### DIETARY ACCOMMODATIONS
**Special Requirements:** ${info.allergies || 'None specified'}

${info.allergies && info.allergies.toLowerCase() !== 'none'
            ? 'We take dietary restrictions seriously. Our kitchen follows strict protocols to prevent cross-contamination and ensure all guests can enjoy their meals safely.'
            : 'No specific dietary restrictions noted. Please contact us if any guests have allergies or special requirements.'}

---

## INVESTMENT BREAKDOWN

| Item | Unit Cost | Quantity | Subtotal |
|------|-----------|----------|----------|
| ${pricing.packageType} (per person) | $${pricing.rate}.00 | ${info.headcount} | $${pricing.subtotal.toFixed(2)} |
${pricing.hasPremium ? '| Premium Protein Upgrade | Included | - | $0.00 |\n' : ''}| **Subtotal** | | | **$${pricing.subtotal.toFixed(2)}** |
| Tax (estimated 7.25%) | | | $${pricing.tax.toFixed(2)} |
| **TOTAL INVESTMENT** | | | **$${pricing.total.toFixed(2)}** |

### Package Options:
- **Classic Package:** $25 per person (Beef, Chicken, Pork)
- **Premium Package:** $30 per person (Includes steak/seafood options)

**Your Selected Package:** ${pricing.packageType} - $${pricing.rate}.00 per person

---

## TERMS & CONDITIONS

### Payment Schedule:
1. **Deposit (50%):** $${pricing.deposit.toFixed(2)} - Due upon contract signing to secure your date
2. **Final Payment (50%):** $${pricing.finalPayment.toFixed(2)} - Due 7 days prior to event date

### Payment Methods Accepted:
- Bank Transfer / ACH
- Credit Card (Visa, Mastercard, AmEx)
- Check (made payable to "Etheleen & Alma's Dream, LLC")

### Important Dates:
- **Final Headcount Confirmation:** Due 7 days before event
- **Menu Modifications:** Accepted up to 10 days before event
- **Final Payment:** Due 7 days before event

### Cancellation Policy:
- 30+ days notice: 50% deposit refund
- 15-29 days notice: 25% deposit refund  
- Less than 14 days: No refund (deposit is non-refundable)

### Service Details:
- **Pickup Time:** To be coordinated
- **Pickup Location:** Charlotte, NC area (details provided upon confirmation)
- **Service Style:** Pick-up-and-go (delivery options available upon request)

---

## NEXT STEPS

### 1. **Review & Approve**
Carefully review this proposal. If you have questions or need modifications, contact us immediately at:
- **Email:** yourmeal@eadreamllc.com
- **Phone:** (602) 318-4925

### 2. **Schedule Your Tasting**
Upon proposal approval, we'll schedule a complimentary tasting session where you can:
- Sample your selected proteins and preparation styles
- Finalize portion sizes and presentations
- Make any last-minute menu adjustments
- Meet our team and discuss event day logistics

### 3. **Contract Signature**
Sign the agreement and submit your 50% deposit ($${pricing.deposit.toFixed(2)}) to secure your event date.

### 4. **Event Coordination**
We'll work closely with you to ensure every detail is perfect, from final headcount to pickup logistics.

---

## AUTHORIZATION & AGREEMENT

By signing below, you acknowledge that you have read, understood, and agree to the terms outlined in this proposal.

**Client Signature:** _________________________________ **Date:** _____________

**Print Name:** ${info.customerName}


**Etheleen & Alma's Dream, LLC Representative:** _________________________________ **Date:** _____________

**Print Name:** _________________________________

---

## CONTACT INFORMATION

**Etheleen & Alma's Dream, LLC**  
Serving the Greater Charlotte Area and Beyond

📧 **Email:** yourmeal@eadreamllc.com  
📱 **Phone:** (602) 318-4925  
🌐 **Website:** www.eadreamllc.com

**Business Hours:**  
Monday - Friday: 9:00 AM - 6:00 PM  
Saturday: 10:00 AM - 4:00 PM  
Sunday: By Appointment

---

## WHY CHOOSE ETHELEEN & ALMA'S DREAM?

🌟 **Third-Generation Family Recipes** - Authentic flavors passed down through generations  
🌟 **Customization Excellence** - Every menu is unique to your vision  
🌟 **Quality Ingredients** - We never compromise on freshness or quality  
🌟 **Professional Service** - White-glove attention to every detail  
🌟 **Community Roots** - A Charlotte family business serving our neighbors  

---

*This proposal is valid for 30 days from the date of issue. Pricing subject to change based on market conditions and availability. All services are contingent upon availability and final contract agreement.*

**Proposal Version:** 1.0  
**Generated:** ${new Date().toISOString()}  
**Expires:** ${expirationDate}
`.trim();

    return proposal;
}

// Legacy function for backward compatibility
export async function generateMenuFromDishes(selections: MenuSelections): Promise<string> {
    // Convert to full customer info with defaults
    const info: CustomerInfo = {
        customerName: '____________________',
        customerEmail: '____________________',
        customerPhone: '',
        eventDate: 'TBD',
        eventLocation: 'TBD',
        eventType: '',
        headcount: 50,
        ...selections
    };

    return generatePersonalizedProposal(info);
}

export async function estimateCateringCost(menuContent: string, guestCount: number = 50): Promise<number> {
    const hasSteakOrSeafood = menuContent.toLowerCase().includes('steak') ||
        menuContent.toLowerCase().includes('seafood') ||
        menuContent.toLowerCase().includes('bass') ||
        menuContent.toLowerCase().includes('filet');
    const rate = hasSteakOrSeafood ? 30 : 25;
    return rate * guestCount;
}
