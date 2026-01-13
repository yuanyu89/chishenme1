
import React, { useState, useCallback, useMemo } from 'react';
import { FOOD_LIST, TAG_LABELS } from './constants';
import { FoodItem, AIRating, UserPreferences } from './types';
import { getFoodReason } from './services/geminiService';

const App: React.FC = () => {
  const [currentFood, setCurrentFood] = useState<FoodItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [aiRating, setAiRating] = useState<AIRating | null>(null);
  const [isLoadingReason, setIsLoadingReason] = useState(false);
  const [history, setHistory] = useState<FoodItem[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    onlyVegetarian: false,
    excludedTags: []
  });

  const filteredList = useMemo(() => {
    const list = FOOD_LIST.filter(item => {
      if (preferences.onlyVegetarian && !item.isVegetarian) return false;
      if (item.tags.some(tag => preferences.excludedTags.includes(tag))) return false;
      return true;
    });
    return list;
  }, [preferences]);

  const handlePick = useCallback(() => {
    if (isSpinning) return;
    if (filteredList.length === 0) {
      alert("筛选条件太苛刻啦，没有找到符合要求的食物。");
      return;
    }

    setIsSpinning(true);
    setAiRating(null);
    setShowSettings(false);
    
    let counter = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredList.length);
      setCurrentFood(filteredList[randomIndex]);
      counter++;

      if (counter >= maxIterations) {
        clearInterval(interval);
        const finalFood = filteredList[Math.floor(Math.random() * filteredList.length)];
        setCurrentFood(finalFood);
        setIsSpinning(false);
        setHistory(prev => [finalFood, ...prev.slice(0, 4)]);
        
        setIsLoadingReason(true);
        getFoodReason(finalFood.name).then(res => {
          setAiRating(res);
          setIsLoadingReason(false);
        });
      }
    }, 80);
  }, [isSpinning, filteredList]);

  const toggleTag = (tag: string) => {
    setPreferences(prev => ({
      ...prev,
      excludedTags: prev.excludedTags.includes(tag)
        ? prev.excludedTags.filter(t => t !== tag)
        : [...prev.excludedTags, tag]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF9F0] p-4 sm:p-6 overflow-x-hidden">
      {/* 装饰背景层 */}
      <div className="fixed -top-20 -left-20 w-64 h-64 bg-orange-200 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
      <div className="fixed -bottom-20 -right-20 w-64 h-64 bg-yellow-200 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

      {/* 头部 */}
      <header className="w-full max-w-md text-center py-6 sm:py-10 z-10">
        <h1 className="text-4xl sm:text-5xl font-cute text-[#FF8C00] mb-2 drop-shadow-sm tracking-tight">
          今天中午吃什么
        </h1>
        <p className="text-[#8D6E63] text-sm opacity-80">为你挑选最心动的一餐 ✨</p>
      </header>

      {/* 主体区域 */}
      <main className="w-full max-w-md flex flex-col gap-6 z-10">
        
        {/* 展示卡片 */}
        <div className={`relative w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-orange-50 p-6 sm:p-10 flex flex-col items-center transition-all duration-500 overflow-hidden ${isSpinning ? 'scale-[0.98]' : 'scale-100'}`}>
          {!currentFood ? (
            <div className="py-12 flex flex-col items-center animate-bounce-subtle">
              <span className="text-7xl sm:text-8xl mb-6">🍽️</span>
              <p className="text-lg font-cute text-orange-300">翻 牌 开 始</p>
            </div>
          ) : (
            <div className={`w-full flex flex-col items-center transition-opacity duration-300 ${isSpinning ? 'opacity-40' : 'opacity-100'}`}>
              <div className="text-7xl sm:text-9xl mb-4 drop-shadow-md animate-bounce-subtle">
                {currentFood.emoji}
              </div>
              <h2 className="text-2xl sm:text-3xl font-cute text-[#FF7F50] text-center mb-2 leading-tight">
                {currentFood.name}
              </h2>
              <span className="px-3 py-1 bg-orange-50 text-orange-400 rounded-full text-[10px] sm:text-xs font-bold border border-orange-100 mb-6">
                {currentFood.category}
              </span>
              
              {/* AI 推荐语容器：改为嵌入式而不是绝对定位，彻底解决遮挡问题 */}
              <div className="w-full min-h-[80px] flex items-center justify-center">
                {!isSpinning && aiRating && (
                  <div className="w-full bg-orange-50/50 rounded-2xl p-4 border border-orange-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <p className="text-sm sm:text-base text-[#8D6E63] font-medium italic text-center leading-relaxed">
                      “ {aiRating.reason} ”
                    </p>
                    <div className="mt-2 text-[10px] font-bold text-orange-400 text-right">
                      ✨ 心情关键词：{aiRating.mood}
                    </div>
                  </div>
                )}
                {isLoadingReason && !isSpinning && (
                  <div className="flex items-center gap-2 text-orange-300 text-sm animate-pulse">
                    <span>🍲 AI 大厨正在码字...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 交互按钮区域 */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handlePick}
            disabled={isSpinning}
            className={`
              w-full py-5 sm:py-6 rounded-3xl text-2xl sm:text-3xl font-cute shadow-lg transition-all active:scale-95
              ${isSpinning 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-br from-[#FF8C00] to-[#FF7F50] text-white hover:shadow-orange-200/50 hover:shadow-2xl'}
            `}
          >
            {isSpinning ? '挑选美食中...' : '帮 我 选'}
          </button>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="text-orange-400/80 text-sm font-bold flex items-center justify-center gap-1 hover:text-[#FF8C00]"
          >
            ⚙️ 设置偏好 {showSettings ? '▲' : '▼'}
          </button>
        </div>

        {/* 设置面板 */}
        {showSettings && (
          <div className="w-full bg-white rounded-3xl p-6 shadow-lg border border-orange-50 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-4 border-b border-orange-50 pb-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-[#FF8C00] rounded-md transition-all"
                  checked={preferences.onlyVegetarian}
                  onChange={(e) => setPreferences(p => ({...p, onlyVegetarian: e.target.checked}))}
                />
                <span className="text-sm font-bold group-hover:text-orange-500 transition-colors">只看素食 🥗</span>
              </label>
              <span className="text-[10px] font-bold text-orange-300 bg-orange-50 px-2 py-0.5 rounded-full">
                可选: {filteredList.length}
              </span>
            </div>
            
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8D6E63]">排除不喜欢：</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TAG_LABELS).map(([tag, label]) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                      preferences.excludedTags.includes(tag)
                        ? 'bg-red-50 text-red-500 border-red-100'
                        : 'bg-white text-orange-400 border-orange-100 hover:border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    {preferences.excludedTags.includes(tag) ? '✕ ' : '+ '}{label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 历史记录 */}
        {history.length > 0 && (
          <div className="mt-4">
            <h3 className="text-[#8D6E63] text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="flex-1 h-[1px] bg-orange-100"></span>
              刚才翻牌
              <span className="flex-1 h-[1px] bg-orange-100"></span>
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar snap-x">
              {history.map((food, idx) => (
                <div 
                  key={`${food.name}-${idx}`}
                  className="flex-shrink-0 bg-white p-3 rounded-2xl shadow-sm border border-orange-50 flex flex-col items-center min-w-[80px] snap-start transition-transform hover:scale-105"
                >
                  <span className="text-2xl mb-1">{food.emoji}</span>
                  <span className="text-[10px] font-medium text-gray-500 text-center line-clamp-1">{food.name.split('+')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 text-orange-200 text-[10px] font-bold tracking-widest uppercase">
        Bon Appétit | © 2024 午餐小助手
      </footer>
    </div>
  );
};

export default App;
