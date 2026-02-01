
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

export const generateDebtSnowballPlan = async (debts: any[]) => {
  const prompt = `Based on the following list of debts: ${JSON.stringify(debts)}, generate a "Debt Snowball" payoff plan. 
  The debt snowball method involves paying off the smallest debts first to build momentum.
  Provide a month-by-month plan for the first 6 months. Include which debt to focus on and a motivational tip for each month.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are a world-class financial advisor specializing in debt elimination. You help people find freedom through intentional budgeting and the snowball method. Return a clean JSON array of plan steps.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            month: { type: Type.STRING },
            action: { type: Type.STRING },
            focusDebt: { type: Type.STRING },
            estimatedRemainingTotal: { type: Type.NUMBER }
          },
          required: ["month", "action", "focusDebt", "estimatedRemainingTotal"]
        }
      }
    }
  });

  return JSON.parse(response.text.trim());
};
