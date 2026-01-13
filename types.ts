
export interface FoodItem {
  name: string;
  emoji: string;
  category: string;
  isVegetarian: boolean;
  tags: string[]; // e.g., 'spicy', 'seafood', 'beef', 'pork', 'dairy'
}

export interface UserPreferences {
  onlyVegetarian: boolean;
  excludedTags: string[];
}

export interface AIRating {
  reason: string;
  mood: string;
}
