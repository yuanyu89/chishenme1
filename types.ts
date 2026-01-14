
export type CrowdType = 'normal' | 'fat-loss' | 'muscle-gain';

export interface FoodItem {
  name: string;
  emoji: string;
  category: string;
  isVegetarian: boolean;
  tags: string[];
  suitableFor: CrowdType[]; // 支持的人群类型
}

export interface UserPreferences {
  onlyVegetarian: boolean;
  excludedTags: string[];
}

export interface AIRating {
  reason: string;
  mood: string;
}
