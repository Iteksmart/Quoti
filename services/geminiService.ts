
import { GoogleGenAI, Type } from "@google/genai";
import type { QuoteData } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set. The app will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        quote: {
            type: Type.STRING,
            description: "The inspirational quote."
        },
        author: {
            type: Type.STRING,
            description: "The author of the quote. If unknown, state 'Unknown'."
        },
        elaboration: {
            type: Type.STRING,
            description: "An insightful elaboration on the quote's meaning and application."
        },
    },
    required: ["quote", "author", "elaboration"],
};

const getLengthInstruction = (length: string): string => {
    switch (length) {
        case 'Short':
            return 'The total response (quote + elaboration) should be concise, around 50 words.';
        case 'Medium':
            return 'The total response (quote + elaboration) should be detailed, around 100 words.';
        case 'Long':
            return 'The total response (quote + elaboration) should be very comprehensive, around 200 words.';
        default:
            return 'The total response (quote + elaboration) should be around 100 words.';
    }
};

const getPersonalityInstruction = (personality: string): string => {
    switch (personality) {
        case 'Energetic Coach':
            return "Your tone should be like an energetic coach: highly motivational, using exclamation points, and encouraging action.";
        case 'Stoic':
            return "Your tone should be like a stoic philosopher: calm, logical, and focused on virtue and self-control.";
        case 'Friendly':
            return "Your tone should be like a supportive friend: warm, empathetic, and easy to understand.";
        case 'Poetic':
            return "Your tone should be poetic and artistic: using figurative language, imagery, and a more expressive, evocative style.";
        default:
            return "Your tone should be neutral and insightful.";
    }
};

export const generateElaboratedQuote = async (theme: string, length: string, personality: string): Promise<QuoteData> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    
    const lengthInstruction = getLengthInstruction(length);
    const personalityInstruction = getPersonalityInstruction(personality);

    const systemInstruction = `You are Quoti, an AI inspirational guide. Your task is to provide a famous or impactful quote and an insightful elaboration.
1. The quote must relate to the theme: '${theme}'.
2. The elaboration should explain the quote's meaning and how to apply its wisdom in daily life.
3. Adopt the following personality for your elaboration: ${personalityInstruction}
4. ${lengthInstruction}
5. You must provide a valid JSON object matching the provided schema. Do not include markdown or any other text outside the JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Provide a quote and elaboration based on my instructions.",
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
                topP: 1,
            }
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("Received an empty response from the API.");
        }

        const parsedJson = JSON.parse(jsonText);
        
        if (parsedJson.quote && parsedJson.author && parsedJson.elaboration) {
             return parsedJson as QuoteData;
        } else {
            throw new Error("Invalid JSON structure received from API.");
        }

    } catch (error) {
        console.error("Error generating content with Gemini:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse the AI's response. Please try again.");
        }
        throw new Error("Failed to communicate with the AI model. Please check your connection or API key.");
    }
};
