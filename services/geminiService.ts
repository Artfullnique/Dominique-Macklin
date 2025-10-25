
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedContent } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    captions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'An array of 5 creative and engaging social media captions.'
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'An array of 15 relevant hashtags, without the # symbol.'
    }
  },
  required: ['captions', 'hashtags']
};

export const generateCaptionsAndHashtags = async (base64Image: string, mimeType: string, keywords: string, tone: string): Promise<GeneratedContent> => {
    try {
        const model = 'gemini-2.5-flash';
        
        const prompt = `You are an expert social media manager. Based on the provided image and context, generate 5 creative, engaging captions in a ${tone} tone, and 15 relevant hashtags. The user-provided context is: "${keywords || 'None provided'}". Format the output as a single, valid JSON object that strictly adheres to the provided schema.`;

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.7,
                topP: 0.9,
            }
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        // Basic validation
        if (!parsedJson.captions || !parsedJson.hashtags) {
            throw new Error("Invalid JSON structure received from API.");
        }
        
        return parsedJson as GeneratedContent;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Could not generate content. The model may have returned an unexpected response.");
    }
};