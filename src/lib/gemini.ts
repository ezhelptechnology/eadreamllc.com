import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiModel = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

export async function generateMenuFromDishes(dishes: string[]): Promise<string> {
    const geminiModel = getGeminiModel();
    const prompt = `You are an expert catering chef for "Etheleen & Alma's Dream," a premium catering service specializing in high-quality, convenient "Pick-up-and-go" meals.

We have a Standard Catering Package priced at $9.00 per person. 
Your task is to create a bespoke menu proposal based on the following client preferences: ${dishes.join(', ')}.

The Standard Package MUST follow this structure:
1. Two (2) types of Slider options (Craft these based on the client's favorites: ${dishes.join(', ')}).
2. Two (2) side items: Creamy Mac & Cheese and a Fresh House Salad.
3. Service Type: Drop-off only (Pick-up-and-go).

Format the menu elegantly with detailed descriptions for the sliders. 
Include a "Pricing Summary" section clearly stating:
- Cost per person: $9.00
- 50% non-refundable deposit required upon contract signing.
- Final headcount due 7 days prior to service.

Make the proposal feel luxurious, professional, and bespoke, even within this standard framework. Do NOT mention specific churches or client names.`;

    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    return response.text();
}

export async function estimateCateringCost(menuContent: string, guestCount: number = 50): Promise<number> {
    const geminiModel = getGeminiModel();
    const prompt = `You are a catering cost estimator for "Etheleen & Alma's Dream." 
Our standard "Pick-up-and-go" package is priced strictly at $9.00 per person.

Based on a guest count of ${guestCount}, calculate the total cost ($9.00 * ${guestCount}).

Return ONLY the final numeric total (no currency symbol, just the number).`;

    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const costText = response.text().trim().replace(/[^0-9.]/g, '');
    return parseFloat(costText) || 5000; // Default fallback
}
