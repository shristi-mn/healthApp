import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
    console.warn('Gemini API key not found. AI features will be disabled.');
}

export const genAI = new GoogleGenerativeAI(apiKey);

// Use Gemini 1.5 Flash for fast, cost-effective responses
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
