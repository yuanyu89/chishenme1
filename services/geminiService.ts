import { GoogleGenAI, Type } from "@google/genai";
import { AIRating } from "../types";

/**
 * 获取推荐理由
 * 使用 gemini-flash-lite-latest 提供更稳定的响应。
 * 针对 Rpc failed (code 500) 错误，Lite 模型通常能绕过复杂的推理超时问题。
 */
export async function getFoodReason(foodName: string): Promise<AIRating> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: [{ parts: [{ text: `为什么今天中午适合吃${foodName}？请给出一个简短、可爱且极具诱惑力的理由。` }] }],
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

    // .text 是属性而非方法
    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("Empty response from AI");
    }
    
    const result = JSON.parse(jsonStr);
    return {
      reason: result.reason || "因为它看起来就很好吃！你是美食的小雷达~ 🤤",
      mood: result.mood || "期待满满"
    };
  } catch (error) {
    console.error("AI Reason generation failed:", error);
    // 降级处理，保证用户体验
    return {
      reason: "因为它看起来就很好吃！你是美食的小雷达~ 🤤",
      mood: "期待满满"
    };
  }
}