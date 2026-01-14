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
    const prompt = `You are an expert catering chef for "Etheleen & Alma's Dream," a premium catering service.

A client has selected their top 3 favorite dishes: ${dishes.join(', ')}.

Based on these preferences, create a complete bespoke catering menu for an event. Include:
- Appetizers (3-4 options)
- Main Courses (2-3 options, incorporating the client's favorites)
- Side Dishes (3-4 options)
- Desserts (2-3 options)

Format the menu elegantly with descriptions. Make it feel luxurious and high-end.`;

    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    return response.text();
}

export async function estimateCateringCost(menuContent: string, guestCount: number = 50): Promise<number> {
    const geminiModel = getGeminiModel();
    const prompt = `You are a catering cost estimator. Based on the following menu and assuming ${guestCount} guests, provide ONLY a numeric estimate in USD (no currency symbol, just the number).

Menu:
${menuContent}

Provide a realistic catering cost estimate considering:
- Premium ingredients
- Professional service
- Setup and cleanup
- Rentals (plates, silverware, linens)

Return ONLY the number, nothing else.`;

    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const costText = response.text().trim().replace(/[^0-9.]/g, '');
    return parseFloat(costText) || 5000; // Default fallback
}
