import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key exists, though typically we assume it does based on instructions.
const isAiAvailable = () => !!apiKey;

export const generateSubtasks = async (taskTitle: string): Promise<string[]> => {
  if (!isAiAvailable()) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down the following task into 3 to 5 smaller, actionable subtasks. Keep them concise. Task: "${taskTitle}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error (Subtasks):", error);
    return ["Identify the first step", "Gather necessary resources", "Execute the core action"];
  }
};

export const getMotivationalQuote = async (pendingCount: number): Promise<string> => {
  if (!isAiAvailable()) return "Keep pushing forward! You've got this.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I have ${pendingCount} tasks left to do today. Give me a very short, punchy, and unique motivational tip or quote to get me moving. Maximum 20 words.`,
    });
    return response.text?.trim() || "Action is the foundational key to all success.";
  } catch (error) {
    console.error("Gemini API Error (Motivation):", error);
    return "Focus on being productive instead of busy.";
  }
};
