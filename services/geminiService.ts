import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateLuxuryWish = async (): Promise<string> => {
  if (!apiKey) {
    return "May your holidays be filled with golden moments and emerald dreams.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Write a short, ultra-luxurious, elegant Christmas wish (max 20 words). The tone should be opulent, sophisticated, and warm. Avoid emojis.",
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.9,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Wishing you a season of splendor and magnificence.";
  }
};
