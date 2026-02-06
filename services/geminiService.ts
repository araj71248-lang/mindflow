
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// When using locally, you can replace process.env.API_KEY with your actual string key
// e.g., const ai = new GoogleGenAI({ apiKey: 'YOUR_KEY_HERE' });
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeJournal = async (content: string, type: 'text' | 'image'): Promise<AnalysisResult> => {
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are MindFlow, a highly empathetic and professional student counselor. 
    Your goal is to analyze a student's exam journal and provide immediate, soothing support.
    Identify their stress level, emotional state, and provide actionable, gentle advice.
    If you detect severe distress (suicidal ideation, self-harm, or complete breakdown), 
    flag the stress level as 'severe' and include a special supportive message while strongly suggesting they use the helpline.
  `;

  const prompt = type === 'text' 
    ? `Analyze this journal entry: ${content}`
    : `Read the text in this image and analyze the emotional state of the writer.`;

  const parts: any[] = [{ text: prompt }];
  if (type === 'image') {
    parts.unshift({
      inlineData: {
        mimeType: 'image/jpeg',
        data: content.split(',')[1] || content,
      }
    });
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: type === 'text' ? prompt : { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: { type: Type.STRING },
          summary: { type: Type.STRING },
          comfortingMessage: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          stressLevel: {
            type: Type.STRING,
            description: "One of: low, moderate, high, severe"
          }
        },
        required: ["sentiment", "summary", "comfortingMessage", "suggestions", "stressLevel"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON response", response.text);
    throw new Error("I had trouble understanding that. Could you try sharing your thoughts differently?");
  }
};

export const startChat = (systemInstruction: string) => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction }
  });
};
