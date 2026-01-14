
import { FoodItem } from './types.ts';

export const FOOD_LIST: FoodItem[] = [
  // 精选单品
  { name: '麻辣烫', emoji: '🍜', category: '中式热食', isVegetarian: false, tags: ['spicy'], suitableFor: ['normal'] },
  { name: '黄焖鸡米饭', emoji: '🥘', category: '中式套餐', isVegetarian: false, tags: ['chicken'], suitableFor: ['normal', 'muscle-gain'] },
  { name: '螺蛳粉', emoji: '🥢', category: '地方小吃', isVegetarian: false, tags: ['spicy', 'seafood'], suitableFor: ['normal'] },
  { name: '轻食沙拉', emoji: '🥗', category: '健康餐', isVegetarian: true, tags: [], suitableFor: ['fat-loss'] },
  { name: '肯德基', emoji: '🍗', category: '西式快餐', isVegetarian: false, tags: ['dairy'], suitableFor: ['normal'] },

  // 中式套餐
  { name: '红烧肉+手撕包菜+大米饭', emoji: '🍱', category: '中式套餐', isVegetarian: false, tags: ['pork'], suitableFor: ['normal'] },
  { name: '西红柿炒蛋+小炒肉+大米饭', emoji: '🍛', category: '中式套餐', isVegetarian: false, tags: ['pork'], suitableFor: ['normal', 'muscle-gain'] },
  { name: '宫保鸡丁+地三鲜+大米饭', emoji: '🍚', category: '中式套餐', isVegetarian: false, tags: ['chicken', 'spicy'], suitableFor: ['normal', 'muscle-gain'] },
  { name: '鱼香肉丝+蒜蓉西兰花+大米饭', emoji: '🥡', category: '中式套餐', isVegetarian: false, tags: ['pork', 'spicy'], suitableFor: ['normal'] },
  { name: '台式卤肉饭+烫青菜+卤蛋', emoji: '🍲', category: '中式套餐', isVegetarian: false, tags: ['pork'], suitableFor: ['normal'] },
  { name: '青椒肉丝+麻婆豆腐+大米饭', emoji: '🍛', category: '中式套餐', isVegetarian: false, tags: ['pork', 'spicy'], suitableFor: ['normal', 'muscle-gain'] },
  { name: '土豆炖牛腩+酸辣土豆丝+大米饭', emoji: '🥘', category: '中式套餐', isVegetarian: false, tags: ['beef', 'spicy'], suitableFor: ['normal', 'muscle-gain'] },
  { name: '照烧鸡腿+清炒小白菜+大米饭', emoji: '🍱', category: '中式套餐', isVegetarian: false, tags: ['chicken'], suitableFor: ['normal', 'muscle-gain'] },
  { name: '水煮鱼片+凉拌黄瓜+大米饭', emoji: '🐟', category: '中式套餐', isVegetarian: false, tags: ['seafood', 'spicy'], suitableFor: ['fat-loss', 'normal'] },
  { name: '梅菜扣肉+虎皮青椒+大米饭', emoji: '🍚', category: '中式套餐', isVegetarian: false, tags: ['pork'], suitableFor: ['normal'] },
  { name: '孜然羊肉+葱爆土豆片+拌面', emoji: '🍜', category: '中式套餐', isVegetarian: false, tags: ['spicy'], suitableFor: ['normal', 'muscle-gain'] },
  { name: '干锅肥肠+清炒油麦菜+大米饭', emoji: '🥘', category: '中式套餐', isVegetarian: false, tags: ['pork', 'spicy'], suitableFor: ['normal'] },
  { name: '糖醋排骨+香菇青菜+大米饭', emoji: '🍱', category: '中式套餐', isVegetarian: false, tags: ['pork'], suitableFor: ['normal'] },
  { name: '滑蛋虾仁+白灼芥兰+大米饭', emoji: '🍛', category: '中式套餐', isVegetarian: false, tags: ['seafood'], suitableFor: ['fat-loss', 'muscle-gain'] },
  { name: '尖椒肥肠+干煸四季豆+大米饭', emoji: '🍚', category: '中式套餐', isVegetarian: false, tags: ['pork', 'spicy'], suitableFor: ['normal'] },

  // 其他风味
  { name: '白灼基围虾+蒸粉丝+凉拌木耳', emoji: '🍤', category: '健康餐', isVegetarian: false, tags: ['seafood'], suitableFor: ['fat-loss', 'muscle-gain'] },
  { name: '煎烤三文鱼+黑米饭+芦笋', emoji: '🍣', category: '健康餐', isVegetarian: false, tags: ['seafood'], suitableFor: ['fat-loss', 'muscle-gain'] },
  { name: '四川火锅', emoji: '🍲', category: '火锅', isVegetarian: false, tags: ['spicy', 'beef', 'pork'], suitableFor: ['normal'] },
  { name: '陕西凉皮+肉夹馍', emoji: '🥙', category: '特色小吃', isVegetarian: false, tags: ['pork', 'spicy'], suitableFor: ['normal'] },
  { name: '韩国石锅拌饭', emoji: '🥘', category: '日韩料理', isVegetarian: false, tags: ['beef', 'spicy'], suitableFor: ['normal', 'muscle-gain'] }
];

export const TAG_LABELS: Record<string, string> = {
  'spicy': '辣',
  'seafood': '海鲜',
  'beef': '牛肉',
  'pork': '猪肉',
  'chicken': '鸡肉',
  'dairy': '奶制品'
};
