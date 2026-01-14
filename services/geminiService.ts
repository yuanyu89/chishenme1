
import { GoogleGenAI, Type } from "@google/genai";
import { AIRating } from "../types";

/**
 * 获取推荐理由
 * 使用 Google GenAI SDK 获取美食推荐文案
 */
export async function getFoodReason(foodName: string): Promise<AIRating> {
  // 遵循指南：在调用时初始化 GoogleGenAI 实例
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      // 遵循指南：直接传递字符串作为内容
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

    // 遵循指南：直接访问 .text 属性，它是 getter
    const jsonStr = response.text?.trim();
    if (!jsonStr) throw new Error("AI response empty");
    
    const result = JSON.parse(jsonStr);
    return {
      reason: result.reason || "这就是为你准备的最佳选择，快去享用吧！✨",
      mood: result.mood || "期待满满"
    };
  } catch (error) {
    console.warn("AI 接口调用异常，已启用本地推荐库:", error);
    // 降级方案
    const fallbacks = [
      "这就是为你量身定做的午餐！吃饱了才有力气努力呀~ ✨",
      "闻到香味了吗？这就是今天最懂你的那碗人间烟火！🥘",
      "生活已经很苦了，中午一定要吃点好的犒劳一下！🍓",
      "相信直觉，这份美食绝对能唤醒你下午的全部元气！🚀"
    ];
    return {
      reason: fallbacks[Math.floor(Math.random() * fallbacks.length)],
      mood: "随缘美味"
    };
  }
}
