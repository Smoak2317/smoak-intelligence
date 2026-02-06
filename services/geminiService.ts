
import { GoogleGenAI, Type } from "@google/genai";
import { SearchParams, Buyer, DiamondType, GeminiResponse, BuyerType, MarketTier } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const findBuyers = async (params: SearchParams, excludeNames: string[] = []): Promise<GeminiResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const modelId = "gemini-3-flash-preview"; 

  const buyerTypeMap: Record<string, string> = {
    [BuyerType.ALL]: "B2B buyers, wholesalers, retailers, trading houses, or jewelry manufacturers",
    [BuyerType.WHOLESALER]: "diamond wholesalers, loose stone traders, and B2B diamond exchanges",
    [BuyerType.RETAILER]: "jewelry retailers, luxury jewelry boutiques, and jewelry store chains",
    [BuyerType.MANUFACTURER]: "jewelry manufacturers, diamond setting factories, and casting houses",
    [BuyerType.PRIVATE]: "private diamond collectors, high-net-worth individuals, family offices, and diamond investment firms"
  };

  const tierMap: Record<string, string> = {
    [MarketTier.ANY]: "",
    [MarketTier.LUXURY]: "Focus specifically on high-end, luxury, and premium market entities.",
    [MarketTier.COMMERCIAL]: "Focus on commercial, mass-market, and high-volume entities.",
    [MarketTier.BOUTIQUE]: "Focus on independent, artisanal, and boutique entities."
  };

  const targetAudience = buyerTypeMap[params.buyerType] || buyerTypeMap[BuyerType.ALL];
  const tierInstruction = tierMap[params.marketTier] || "";

  let exclusionText = "";
  if (excludeNames.length > 0) {
    const recentNames = excludeNames.slice(-20).join(", ");
    exclusionText = `Do NOT include these businesses as they have already been listed: ${recentNames}. Find DIFFERENT ones.`;
  }

  const prompt = `
    Find reputable ${targetAudience} who buy ${params.diamondType} diamonds in ${params.location || "the world"}.
    ${tierInstruction}
    
    Specific focus/keywords: ${params.keywords}.
    ${exclusionText}
    
    Use Google Search to find real, existing entities. 
    Extract public contact information (phone numbers, WhatsApp if explicitly stated, or emails) and websites.
    
    Provide a list of at least 5-8 NEW and DISTINCT entities.
    Also provide a brief 1-sentence market insight about the current demand for ${params.diamondType} diamonds in this region.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marketInsight: {
              type: Type.STRING,
              description: "A brief insight about the market demand found during search."
            },
            buyers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  location: { type: Type.STRING },
                  type: { type: Type.STRING, description: "Business type e.g., Wholesaler, Retailer, Private Investor" },
                  contactInfo: { type: Type.STRING, description: "Phone number or email address found" },
                  website: { type: Type.STRING },
                  description: { type: Type.STRING, description: "Brief description of what they buy" },
                  specialty: { type: Type.STRING, description: "Specific diamond qualities they look for (e.g. VVS, Melee)" }
                },
                required: ["name", "location", "contactInfo", "description"]
              }
            }
          },
          required: ["buyers", "marketInsight"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    const data = JSON.parse(text) as GeminiResponse;
    
    // Add client-side IDs to ensure stable keys
    const buyersWithIds = data.buyers.map(b => ({
      ...b,
      id: crypto.randomUUID()
    }));

    return { ...data, buyers: buyersWithIds };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch buyer data. Please try again later.");
  }
};
