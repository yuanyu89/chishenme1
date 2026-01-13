
import { FoodItem } from './types';

export const FOOD_LIST: FoodItem[] = [
  // 精选单品
  { name: '麻辣烫', emoji: '🍜', category: '中式热食', isVegetarian: false, tags: ['spicy'] },
  { name: '黄焖鸡米饭', emoji: '🥘', category: '中式套餐', isVegetarian: false, tags: ['chicken'] },
  { name: '螺蛳粉', emoji: '🥢', category: '地方小吃', isVegetarian: false, tags: ['spicy', 'seafood'] },
  { name: '轻食沙拉', emoji: '🥗', category: '健康餐', isVegetarian: true, tags: [] },
  { name: '肯德基', emoji: '🍗', category: '西式快餐', isVegetarian: false, tags: ['dairy'] },

  // 中式套餐 (荤 + 素 + 主食) - 极大增强
  { name: '红烧肉+手撕包菜+大米饭', emoji: '🍱', category: '中式套餐', isVegetarian: false, tags: ['pork'] },
  { name: '西红柿炒蛋+小炒肉+大米饭', emoji: '🍛', category: '中式套餐', isVegetarian: false, tags: ['pork'] },
  { name: '宫保鸡丁+地三鲜+大米饭', emoji: '🍚', category: '中式套餐', isVegetarian: false, tags: ['chicken', 'spicy'] },
  { name: '鱼香肉丝+蒜蓉西兰花+大米饭', emoji: '🥡', category: '中式套餐', isVegetarian: false, tags: ['pork', 'spicy'] },
  { name: '台式卤肉饭+烫青菜+卤蛋', emoji: '🍲', category: '中式套餐', isVegetarian: false, tags: ['pork'] },
  { name: '青椒肉丝+麻婆豆腐+大米饭', emoji: '🍛', category: '中式套餐', isVegetarian: false, tags: ['pork', 'spicy'] },
  { name: '土豆炖牛腩+酸辣土豆丝+大米饭', emoji: '🥘', category: '中式套餐', isVegetarian: false, tags: ['beef', 'spicy'] },
  { name: '照烧鸡腿+清炒小白菜+大米饭', emoji: '🍱', category: '中式套餐', isVegetarian: false, tags: ['chicken'] },
  { name: '水煮鱼片+凉拌黄瓜+大米饭', emoji: '🐟', category: '中式套餐', isVegetarian: false, tags: ['seafood', 'spicy'] },
  { name: '梅菜扣肉+虎皮青椒+大米饭', emoji: '🍚', category: '中式套餐', isVegetarian: false, tags: ['pork'] },
  { name: '孜然羊肉+葱爆土豆片+拌面', emoji: '🍜', category: '中式套餐', isVegetarian: false, tags: ['spicy'] },
  { name: '干锅肥肠+清炒油麦菜+大米饭', emoji: '🥘', category: '中式套餐', isVegetarian: false, tags: ['pork', 'spicy'] },
  { name: '糖醋排骨+香菇青菜+大米饭', emoji: '🍱', category: '中式套餐', isVegetarian: false, tags: ['pork'] },
  { name: '滑蛋虾仁+白灼芥兰+大米饭', emoji: '🍛', category: '中式套餐', isVegetarian: false, tags: ['seafood'] },
  { name: '尖椒肥肠+干煸四季豆+大米饭', emoji: '🍚', category: '中式套餐', isVegetarian: false, tags: ['pork', 'spicy'] },

  // 其他风味
  { name: '四川火锅', emoji: '🍲', category: '火锅', isVegetarian: false, tags: ['spicy', 'beef', 'pork'] },
  { name: '陕西凉皮+肉夹馍', emoji: '🥙', category: '特色小吃', isVegetarian: false, tags: ['pork', 'spicy'] },
  { name: '广式虾饺皇+肠粉', emoji: '🥟', category: '粤式点心', isVegetarian: false, tags: ['seafood', 'pork'] },
  { name: '日本拉面+叉烧', emoji: '🍜', category: '日韩料理', isVegetarian: false, tags: ['pork'] },
  { name: '韩国石锅拌饭', emoji: '🥘', category: '日韩料理', isVegetarian: false, tags: ['beef', 'spicy'] },
  { name: '泰式冬阴功汤+米饭', emoji: '🥣', category: '东南亚菜', isVegetarian: false, tags: ['seafood', 'spicy'] }
];

export const TAG_LABELS: Record<string, string> = {
  'spicy': '辣',
  'seafood': '海鲜',
  'beef': '牛肉',
  'pork': '猪肉',
  'chicken': '鸡肉',
  'dairy': '奶制品'
};
