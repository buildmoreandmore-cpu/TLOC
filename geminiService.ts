
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCreditReport = async (text: string) => {
  const prompt = `Analyze this credit report text and identify negative items that can be disputed. 
  Extract the creditor name, the type of negative item (e.g., late payment, collection, bankruptcy), the approximate balance, and current status.
  Also, extract or estimate the date it was first reported.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }, { text: text }] },
    config: {
      systemInstruction: "You are a senior credit repair specialist with 20 years of experience. You find errors and leverage consumer laws (FCRA) to identify disputable items. Always return a valid JSON array of objects.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "A unique short ID for the item" },
            creditor: { type: Type.STRING },
            type: { type: Type.STRING },
            balance: { type: Type.NUMBER },
            status: { type: Type.STRING },
            dateReported: { type: Type.STRING, description: "MM/DD/YYYY format" },
            reasonForDispute: { type: Type.STRING, description: "A legal reason why this might be inaccurate" }
          },
          required: ["id", "creditor", "type", "balance", "status", "dateReported", "reasonForDispute"]
        }
      }
    }
  });

  const jsonStr = response.text.trim();
  return JSON.parse(jsonStr);
};

export const generateDisputeLetter = async (clientName: string, negativeItems: any[], templateContent: string) => {
  const prompt = `Using the following template as a base:
  "${templateContent}"
  
  Generate a professional dispute letter for ${clientName} targeting these specific items:
  ${JSON.stringify(negativeItems)}
  
  Make it authoritative, legally sound, and formatted ready to print. Include placeholders like [TODAY'S DATE] and [CLIENT ADDRESS].`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are an expert consumer law attorney. You write letters that get results from credit bureaus."
    }
  });

  return response.text;
};
