
import { GoogleGenAI, Type } from "@google/genai";
import type { AIGeneratedInvoice } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        seller: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                address: { type: Type.STRING },
                gstin: { type: Type.STRING },
                state: { type: Type.STRING },
            }
        },
        customer: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                address: { type: Type.STRING },
                gstin: { type: Type.STRING },
                state: { type: Type.STRING },
            }
        },
        invoiceNumber: { type: Type.STRING },
        invoiceDate: { type: Type.STRING, description: "Format as YYYY-MM-DD" },
        dueDate: { type: Type.STRING, description: "Format as YYYY-MM-DD" },
        lineItems: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    rate: { type: Type.NUMBER },
                    taxRate: { type: Type.NUMBER, description: "The tax rate as a percentage, e.g., 18 for 18%." },
                },
                required: ["description", "quantity", "rate", "taxRate"]
            }
        }
    },
};

export const generateInvoiceFromText = async (prompt: string): Promise<AIGeneratedInvoice> => {
  try {
    const fullPrompt = `
      Parse the following user request to generate a structured JSON invoice.
      - Extract seller and customer details including name, address, GSTIN, and state.
      - Identify the invoice number, invoice date, and due date.
      - List all line items with their description, quantity, rate, and tax rate.
      - If a tax rate isn't specified, assume a standard 18% GST.
      - Infer state from address or GSTIN if not explicitly mentioned. The first two digits of a GSTIN correspond to the state code.
      - Current date is ${new Date().toISOString().split('T')[0]}. If dates are relative (e.g., 'tomorrow', 'in 15 days'), calculate the absolute date.

      User request: "${prompt}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text;
    const parsedData = JSON.parse(jsonString);
    
    // Add unique IDs to line items
    if (parsedData.lineItems && Array.isArray(parsedData.lineItems)) {
        parsedData.lineItems = parsedData.lineItems.map((item: object, index: number) => ({
            ...item,
            id: `ai-${Date.now()}-${index}`
        }));
    }

    return parsedData as AIGeneratedInvoice;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate invoice data from AI. Please check the console for details.");
  }
};
