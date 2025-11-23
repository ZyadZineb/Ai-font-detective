
import { GoogleGenAI } from "@google/genai";
import { IdentificationResult, SearchSource } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY is not set");
    return new GoogleGenAI({ apiKey });
};

export const identifyFont = async (
    textPrompt: string,
    imageBase64?: string,
    mimeType?: string
): Promise<IdentificationResult> => {
    const ai = getClient();
    
    const parts: any[] = [];

    // Add image if present
    if (imageBase64 && mimeType) {
        parts.push({
            inlineData: {
                data: imageBase64,
                mimeType: mimeType
            }
        });
    }

    // Add text prompt
    const promptText = textPrompt || "Identify the font in this image.";
    parts.push({ text: promptText });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: [{ googleSearch: {} }], // Enable Search Grounding to find links
                temperature: 0.3, // Low temperature for factual accuracy
            }
        });

        if (!response.text) {
            throw new Error("No analysis received from Gemini.");
        }

        // Extract Search Sources from Grounding Metadata
        const sources: SearchSource[] = [];
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

        if (chunks) {
            chunks.forEach((chunk: any) => {
                if (chunk.web?.uri && chunk.web?.title) {
                    sources.push({
                        title: chunk.web.title,
                        uri: chunk.web.uri
                    });
                }
            });
        }

        // Simple heuristic to extract a potential "Identified Name" for display headers
        // Usually the model puts it at the start or in bold as requested
        const firstLine = response.text.split('\n')[0];
        const identifiedName = firstLine.replace(/\*\*/g, '').replace(/The font is/i, '').trim();

        return {
            analysisText: response.text,
            sources: sources,
            identifiedName: identifiedName.length < 50 ? identifiedName : "Unknown Font"
        };

    } catch (error) {
        console.error("Font Identification Error:", error);
        throw error;
    }
};
