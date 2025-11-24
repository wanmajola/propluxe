import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    // Assumption: process.env.API_KEY is available as per instructions
    const apiKey = process.env.API_KEY || ''; 
    if (!apiKey) {
      console.warn("API Key not found in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

interface GenerateDescriptionParams {
  title: string;
  bedrooms: number;
  bathrooms: number;
  location: string;
  amenities: string[];
  price: number;
}

export const generateListingDescription = async (params: GenerateDescriptionParams): Promise<string> => {
  try {
    const client = getClient();
    const model = 'gemini-2.5-flash';

    const prompt = `
      You are a professional real estate copywriter. Write a compelling, attractive, and professional listing description for a rental property with the following details:
      
      Title: ${params.title}
      Location: ${params.location}
      Bedrooms: ${params.bedrooms}
      Bathrooms: ${params.bathrooms}
      Price: $${params.price}
      Amenities: ${params.amenities.join(', ')}

      The description should be approximately 80-120 words. Focus on the lifestyle and key selling points. Do not include markdown formatting like bolding or bullet points, just clean paragraphs.
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate description at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate description. Please check your API key or try again.");
  }
};
