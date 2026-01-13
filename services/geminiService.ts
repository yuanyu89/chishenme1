
import { GoogleGenAI, Type } from "@google/genai";
import { AIRating } from "../types";

// Always create the GoogleGenAI instance inside the function call for API Key safety and to follow guidelines
export async function getFoodReason(foodName: string): Promise<AIRating> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `为什么今天中午适合吃${foodName}？请给出一个简短、可爱且极具诱惑力的理由。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reason: {
              type: Type.STRING,
              description: "推荐理由，控制在30字以内",
            },
            mood: {
              type: Type.STRING,
              description: "一种心情描述，如'元气满满'、'幸福感爆棚'",
            }
          },
          required: ["reason", "mood"]
        },
        systemInstruction: "你是一个可爱又专业的美食评论家，说话风格俏皮，喜欢用表情符号。你的目标是让用户对抽到的食物产生强烈的食欲。"
      }
    });

    // .text is a property, not a method. Use it with trim() for JSON parsing.
    const jsonStr = response.text?.trim() || '{"reason": "美食就在眼前，快去享用吧！", "mood": "开心"}';
    const result = JSON.parse(jsonStr);
    return result;
  } catch (error) {
    console.error("AI Reason generation failed:", error);
    return {
      reason: "因为它看起来就很好吃！你是美食的小雷达~",
      mood: "期待满满"
    };
  }
}
