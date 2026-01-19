import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY not found');
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // There isn't a direct listModels in the genAI class usually, 
        // it's often done via a different endpoint, but let's try a simple generation with a known model.
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });
        const result = await model.generateContent('Hi');
        console.log('Success with gemini-1.5-flash (v1):', result.response.text());
    } catch (error) {
        console.error('Error with gemini-1.5-flash:', error.message);
    }
}

listModels();
