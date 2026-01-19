import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiModel = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-1.5-flash which is standard. For v1beta issues, flash-latest or pro might work.
    return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

export async function generateMenuFromDishes(selections: {
    proteins: string[];
    preparation: string;
    sides: string;
    bread: string;
    allergies: string;
}): Promise<string> {
    try {
        const geminiModel = getGeminiModel();
        const prompt = `You are an expert catering chef for "Etheleen & Alma's Dream," a premium catering service in the Greater Charlotte area.

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

Make the tone luxurious, professional, and bespoke. Do NOT mention specific names like "Elevation Church".`;

        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini generateMenuFromDishes failed, using fallback:', error);
        // Fallback menu content
        return `
Etheleen & Alma's Dream, LLC
Catering Proposal (Standard Template)

MENU OVERVIEW:
- Proteins: ${selections.proteins.join(', ')}
- Style: ${selections.preparation}
- Sides: ${selections.sides}
- Bread: ${selections.bread}
- Dietary: ${selections.allergies}

PAYMENT TERMS:
- A non-refundable deposit of 50% is due upon contract signing.
- Final headcount due 7 days prior to event.
        `.trim();
    }
}

export async function estimateCateringCost(menuContent: string, guestCount: number = 50): Promise<number> {
    try {
        const geminiModel = getGeminiModel();
        const prompt = `You are a catering cost estimator for "Etheleen & Alma's Dream." 
Our pricing follows these rules:
- $25 per person if the main proteins are Beef, Chicken, or Pork.
- $30 per person if any main protein is Steak or Seafood.

Based on the following menu and a guest count of ${guestCount}, determine the appropriate rate and calculate the total.

Menu:
${menuContent}

Return ONLY the final numeric total (no currency symbol, just the number).`;

        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        const costText = response.text().trim().replace(/[^0-9.]/g, '');
        return parseFloat(costText) || 5000;
    } catch (error) {
        console.error('Gemini estimateCateringCost failed, using logic fallback:', error);
        // Simple logic fallback
        const hasSteakOrSeafood = menuContent.toLowerCase().includes('steak') || menuContent.toLowerCase().includes('seafood') || menuContent.toLowerCase().includes('bass');
        const rate = hasSteakOrSeafood ? 30 : 25;
        return rate * guestCount;
    }
}
