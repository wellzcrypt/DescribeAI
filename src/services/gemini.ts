import { GoogleGenAI } from "@google/genai";
import { Tone } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateDescription(productName: string, features: string, tone: Tone) {
  const prompt = `
    You are an expert copywriter. Generate a compelling, high-converting product description.
    
    Product Name: ${productName}
    Features: ${features}
    Tone of Voice: ${tone}
    
    Requirements:
    - Focus on benefits, not just features.
    - Use natural, engaging language.
    - Format with clear headings and bullet points if necessary.
    - The output should be in Markdown.
    - Do not include meta-talk, only the product description.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate description. Please try again.");
  }
}
