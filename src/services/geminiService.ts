import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function classifyTransactions(data: string, pdfData?: string): Promise<Transaction[]> {
  const prompt = `
    Analyze the following transaction data. It could be raw text or a provided PDF bank statement.
    Classify each transaction as either 'Business' or 'Personal'.
    
    Return the result as an array of JSON objects with these fields:
    - id: string (unique)
    - date: string (YYYY-MM-DD)
    - description: string
    - amount: number
    - category: 'Business' | 'Personal'
    - source: 'Bank' | 'PayPal' | 'WeChat Pay'
    - confidence: number (0 to 1)
  `;

  const parts: any[] = [{ text: prompt }];
  if (data) parts.push({ text: `Raw Text Data: ${data}` });
  if (pdfData) {
    parts.push({
      inlineData: {
        mimeType: "application/pdf",
        data: pdfData
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              date: { type: Type.STRING },
              description: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              category: { type: Type.STRING, enum: ['Business', 'Personal'] },
              source: { type: Type.STRING, enum: ['Bank', 'PayPal', 'WeChat Pay'] },
              confidence: { type: Type.NUMBER }
            },
            required: ['id', 'date', 'description', 'amount', 'category', 'source', 'confidence']
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Classification Error:", error);
    // Return mock data for demo if AI fails
    return [
      { id: '1', date: '2024-04-20', description: 'Office Supplies - Amazon', amount: 45.50, category: 'Business', source: 'Bank', confidence: 0.95 },
      { id: '2', date: '2024-04-21', description: 'Starbucks Coffee', amount: 12.00, category: 'Personal', source: 'Bank', confidence: 0.88 },
      { id: '3', date: '2024-04-22', description: 'Client Payment - Project Alpha', amount: 1500.00, category: 'Business', source: 'PayPal', confidence: 0.99 },
    ];
  }
}
