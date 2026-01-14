
import { GoogleGenAI, Type } from "@google/genai";
import { AIRating, CrowdType } from "../types.ts";

/**
 * 获取推荐理由
 * 使用 Google GenAI SDK 获取美食推荐文案
 */
export async function getFoodReason(foodName: string, crowdType: CrowdType): Promise<AIRating> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const crowdLabelMap: Record<CrowdType, string> = {
    'fat-loss': '正在减脂期，需要控制热量但想吃得开心',
    'muscle-gain': '正在增肌期，需要补充高质量蛋白质和能量',
    'normal': '正常饮食，追求味道好和心情愉悦'
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: `用户目前的饮食目标是：${crowdLabelMap[crowdType]}。
      为什么今天中午适合吃“${foodName}”？请给出一个简短、可爱且极具诱惑力的理由。
      如果是减脂期，请侧重低负担；如果是增肌期，请侧重营养补给。`,
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
              description: "一种心情描述",
            }
          },
          required: ["reason", "mood"]
        },
        systemInstruction: "你是一个可爱又专业的美食点评助手。说话俏皮，喜欢用 Emoji。"
      }
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) throw new Error("AI response empty");
    
    const result = JSON.parse(jsonStr);
    return {
      reason: result.reason || "这就是为你准备的最佳选择，快去享用吧！✨",
      mood: result.mood || "期待满满"
    };
  } catch (error) {
    console.warn("AI 接口降级:", error);
    const fallbacks = [
      "这就是为你量身定做的午餐！吃饱了才有力气努力呀~ ✨",
      "闻到香味了吗？这就是今天最懂你的那碗人间烟火！🥘",
      "生活已经很苦了，中午一定要吃点好的犒劳一下！🍓"
    ];
    return {
      reason: fallbacks[Math.floor(Math.random() * fallbacks.length)],
      mood: "随缘美味"
    };
  }
}
