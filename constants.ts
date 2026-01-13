
import { FoodItem } from './types';

export const FOOD_LIST: FoodItem[] = [
  // Existing & Basic Options
  { name: '麻辣烫', emoji: '🍜', category: '中式热食', isVegetarian: false, tags: ['spicy'] },
  { name: '猪脚饭', emoji: '🍱', category: '中式套餐', isVegetarian: false, tags: ['pork'] },
  { name: '肯德基', emoji: '🍗', category: '西式快餐', isVegetarian: false, tags: ['dairy'] },
  { name: '轻食沙拉', emoji: '🥗', category: '健康餐', isVegetarian: true, tags: [] },
  { name: '黄焖鸡', emoji: '🥘', category: '中式炖菜', isVegetarian: false, tags: ['chicken'] },
  { name: '螺蛳粉', emoji: '🥢', category: '地方小吃', isVegetarian: false, tags: ['spicy', 'seafood'] },
  { name: '日本寿司', emoji: '🍣', category: '日韩料理', isVegetarian: false, tags: ['seafood'] },
  { name: '牛肉拉面', emoji: '🍜', category: '面食', isVegetarian: false, tags: ['beef'] },
  { name: '意式披萨', emoji: '🍕', category: '西餐', isVegetarian: false, tags: ['dairy'] },
  { name: '美式汉堡', emoji: '🍔', category: '西式快餐', isVegetarian: false, tags: ['beef', 'dairy'] },
  
  // Chinese Set Meal Combinations (荤+素+主食)
  { name: '红烧肉+炒时蔬+米饭', emoji: '🍱', category: '中式套餐', isVegetarian: false, tags: ['pork'] },
  { name: '西红柿炒蛋+小炒肉+米饭', emoji: '🍛', category: '中式套餐', isVegetarian: false, tags: ['pork'] },
  { name: '鱼香肉丝+手撕包菜+米饭', emoji: '🥡', category: '中式套餐', isVegetarian: false, tags: ['pork', 'spicy'] },
  { name: '台式卤肉饭+烫青菜+卤蛋', emoji: '🍲', category: '中式套餐', isVegetarian: false, tags: ['pork'] },
  { name: '宫保鸡丁+地三鲜+米饭', emoji: '🍚', category: '中式套餐', isVegetarian: false, tags: ['chicken', 'spicy'] },
  { name: '照烧鸡腿+清炒兰花+米饭', emoji: '🍱', category: '中式套餐', isVegetarian: false, tags: ['chicken'] },
  { name: '青椒肉丝+麻婆豆腐+米饭', emoji: '🍛', category: '中式套餐', isVegetarian: false, tags: ['pork', 'spicy'] },
  { name: '土豆炖牛腩+酸辣土豆丝+米饭', emoji: '🍲', category: '中式套餐', isVegetarian: false, tags: ['beef', 'spicy'] },
  { name: '孜然羊肉+凉拌木耳+面条', emoji: '🍜', category: '中式套餐', isVegetarian: false, tags: ['spicy'] },
  { name: '咸鱼鸡粒豆腐+干煸四季豆+米饭', emoji: '🍱', category: '中式套餐', isVegetarian: false, tags: ['chicken', 'seafood'] },

  // More variety
  { name: '四川火锅', emoji: '🍲', category: '火锅', isVegetarian: false, tags: ['spicy', 'beef', 'pork'] },
  { name: '陕西凉皮', emoji: '🥣', category: '特色小吃', isVegetarian: true, tags: ['spicy'] },
  { name: '潮汕牛杂', emoji: '🍢', category: '中式炖煮', isVegetarian: false, tags: ['beef'] },
  { name: '粤式虾饺+肠粉', emoji: '🥟', category: '粤式餐饮', isVegetarian: false, tags: ['seafood', 'pork'] },
  { name: '韩国石锅拌饭', emoji: '🥘', category: '日韩料理', isVegetarian: false, tags: ['beef', 'spicy'] },
  { name: '东北地三鲜+大米饭', emoji: '🍚', category: '东北菜', isVegetarian: true, tags: [] },
  { name: '过桥米线', emoji: '🍜', category: '云南特色', isVegetarian: false, tags: ['chicken', 'pork'] },
  { name: '北京烤鸭卷', emoji: '🦆', category: '特色小吃', isVegetarian: false, tags: ['duck'] },
  { name: '泰式菠萝炒饭', emoji: '🍍', category: '东南亚料理', isVegetarian: false, tags: ['seafood'] },
  { name: '越南河粉', emoji: '🍲', category: '东南亚料理', isVegetarian: false, tags: ['beef'] }
];

export const TAG_LABELS: Record<string, string> = {
  'spicy': '辣',
  'seafood': '海鲜',
  'beef': '牛肉',
  'pork': '猪肉',
  'chicken': '鸡肉',
  'dairy': '奶制品'
};

export const COLORS = {
  primary: '#FF8C00',
  secondary: '#FF7F50',
  accent: '#FFD700',
  background: '#FFF9F0',
  text: '#5D4037',
};
