
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Transaction, FinancialSummary, Coordinates, UserProfile } from "../types";

export const getFinancialAdvice = async (
  transactions: Transaction[],
  summary: FinancialSummary,
  profile: UserProfile,
  userInput: string,
  isPro: boolean = false
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = isPro ? "gemini-3-pro-preview" : "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are a ${isPro ? 'Senior Strategic Wealth Manager' : 'Helpful Financial Advisor'} AI. 
    User Context:
    - Base Monthly Salary: $${profile.baseSalary}
    - Current Net Worth: $${summary.netWorth}
    - Recent Expenses: ${JSON.stringify(transactions.filter(t => t.type === 'expense').slice(-10))}
    
    Guidelines:
    1. Provide specific, actionable advice based on transaction history and current market conditions.
    2. Format using Markdown for clarity.
    3. You have access to Google Search. Use it to find the latest interest rates, inflation data, market trends, or tax laws.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: userInput }] }],
      config: {
        systemInstruction,
        temperature: isPro ? 0.4 : 0.7,
        tools: [{ googleSearch: {} }],
        ...(isPro ? { thinkingConfig: { thinkingBudget: 4000 } } : {})
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri) || [];

    return {
      text: response.text || "I'm sorry, I couldn't process that request.",
      sources: sources
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const parseBankStatement = async (rawText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // Fixed: Added responseSchema and responseMimeType for cleaner and more reliable JSON output
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ 
        parts: [{ 
          text: `You are a financial data extractor. Convert the following raw bank statement, CSV, or document text into a structured JSON array of transactions. 
          Rules:
          1. Detect the Date, Description, and Amount.
          2. Amounts should be numbers (positive for expenses, negative for income/deposits).
          3. Categorize into: Housing, Food, Transportation, Entertainment, Shopping, Healthcare, Utilities, Income, Investment, Other.
          
          Raw Data: """${rawText}"""` 
        }] 
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ["date", "amount", "description", "category", "type"]
          }
        },
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    throw error;
  }
};

export const parseReceipt = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // Fixed: Added responseSchema and responseMimeType for reliable receipt extraction
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: "Analyze this receipt image. Extract: Amount (number), Description (store name), Date (YYYY-MM-DD), and Category." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            description: { type: Type.STRING },
            date: { type: Type.STRING },
            category: { type: Type.STRING },
            type: { type: Type.STRING }
          },
          required: ["amount", "description", "date", "category", "type"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw error;
  }
};

export const runWealthSimulation = async (scenario: string, profile: UserProfile, summary: FinancialSummary) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Perform a 10-year wealth trajectory simulation for: "${scenario}". Salary $${profile.baseSalary}, Net Worth $${summary.netWorth}. Use professional financial modeling logic.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Simulation failed.";
  } catch (error) {
    throw error;
  }
};

export const getNearbyShoppingAdvice = async (query: string, coords: Coordinates | null, budgets: any[], isPro: boolean) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: `Find nearby stores for: ${query}. Mention current localized deals.` }] }],
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: coords ? { retrievalConfig: { latLng: { latitude: coords.latitude, longitude: coords.longitude } } } : undefined
      },
    });
    
    // Extract both Map and Web chunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { 
      text: response.text || "No local data found.", 
      sources: chunks 
    };
  } catch (error) {
    throw error;
  }
};

export const getMarketAnalysis = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Provide a professional market analysis for: ${query}.` }] }],
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text || "No data available.", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web).filter(Boolean) || [] };
  } catch (error) {
    throw error;
  }
};

export const getMarketSuggestions = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // Fixed: Implemented responseSchema for type-safe JSON response
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ 
        parts: [{ 
          text: `Based on the market analysis for "${query}", suggest 4-5 related trending financial topics, emerging news keywords, or specific assets that investors are currently discussing.` 
        }] 
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Suggestions Error:", error);
    return [];
  }
};
