
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
    return FOOD_LIST.filter(item => {
      if (preferences.onlyVegetarian && !item.isVegetarian) return false;
      if (item.tags.some(tag => preferences.excludedTags.includes(tag))) return false;
      return true;
    });
  }, [preferences]);

  const handlePick = useCallback(() => {
    if (isSpinning) return;
    if (filteredList.length === 0) {
      alert("当前的筛选条件下没有可选的食物，请调整偏好设置。");
      return;
    }

    setIsSpinning(true);
    setAiRating(null);
    setShowSettings(false);
    
    let counter = 0;
    const maxIterations = 15;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredList.length);
      setCurrentFood(filteredList[randomIndex]);
      counter++;

      if (counter >= maxIterations) {
        clearInterval(interval);
        const finalFood = filteredList[Math.floor(Math.random() * filteredList.length)];
        setCurrentFood(finalFood);
        setIsSpinning(false);
        setHistory(prev => {
          // 避免重复显示
          const newHistory = [finalFood, ...prev.filter(f => f.name !== finalFood.name)];
          return newHistory.slice(0, 5);
        });
        
        setIsLoadingReason(true);
        getFoodReason(finalFood.name).then(res => {
          setAiRating(res);
          setIsLoadingReason(false);
        }).catch(() => {
          setIsLoadingReason(false);
        });
      }
    }, 100);
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
    <div className="min-h-screen flex flex-col items-center bg-[#FFF9F0] p-4 sm:p-6 overflow-y-auto">
      {/* 动态背景 */}
      <div className="fixed -top-10 -left-10 w-40 h-40 bg-orange-200 rounded-full blur-[60px] opacity-30 pointer-events-none"></div>
      <div className="fixed -bottom-10 -right-10 w-40 h-40 bg-yellow-200 rounded-full blur-[60px] opacity-30 pointer-events-none"></div>

      <header className="w-full max-w-md text-center py-8 z-10">
        <h1 className="text-4xl sm:text-5xl font-cute text-[#FF8C00] mb-2">今天中午吃什么</h1>
        <p className="text-[#8D6E63] text-sm font-medium tracking-wide">AI 主厨为你精准点餐 🥘</p>
      </header>

      <main className="w-full max-w-md flex flex-col gap-6 z-10 pb-10">
        {/* 展示核心卡片 */}
        <div className={`w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-orange-50 p-6 flex flex-col items-center transition-all duration-300 ${isSpinning ? 'scale-[0.97]' : 'scale-100'}`}>
          {!currentFood ? (
            <div className="py-16 flex flex-col items-center">
              <span className="text-8xl mb-6 animate-bounce-subtle">🍜</span>
              <p className="text-xl font-cute text-orange-200 tracking-widest">点击下方按钮开始</p>
            </div>
          ) : (
            <div className={`w-full flex flex-col items-center ${isSpinning ? 'opacity-50' : 'opacity-100'}`}>
              <div className="text-8xl sm:text-9xl mb-4 drop-shadow-md animate-bounce-subtle h-32 flex items-center">
                {currentFood.emoji}
              </div>
              <h2 className="text-2xl sm:text-3xl font-cute text-[#FF7F50] text-center mb-1">
                {currentFood.name}
              </h2>
              <div className="flex gap-2 mb-6">
                <span className="px-2 py-0.5 bg-orange-50 text-orange-400 rounded-lg text-[10px] font-bold border border-orange-100">
                  {currentFood.category}
                </span>
              </div>
              
              {/* AI 理由区域 - 嵌入式高度，防止遮挡 */}
              <div className="w-full min-h-[90px] flex items-center justify-center border-t border-orange-50 pt-4">
                {!isSpinning && aiRating && (
                  <div className="w-full bg-orange-50/40 rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-sm text-[#8D6E63] font-medium italic text-center leading-relaxed">
                      “ {aiRating.reason} ”
                    </p>
                    <div className="mt-2 text-[10px] font-bold text-orange-400 text-right">
                      {aiRating.mood}
                    </div>
                  </div>
                )}
                {isLoadingReason && !isSpinning && (
                  <div className="flex flex-col items-center gap-2 text-orange-300">
                    <div className="w-5 h-5 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                    <span className="text-xs font-cute">正在咨询 AI 主厨意见...</span>
                  </div>
                )}
                {isSpinning && (
                  <span className="text-orange-200 font-cute animate-pulse">命运之轮转动中...</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 交互按钮 */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handlePick}
            disabled={isSpinning}
            className={`
              w-full py-5 rounded-[2rem] text-2xl sm:text-3xl font-cute shadow-lg transition-all active:scale-95
              ${isSpinning 
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-[#FF8C00] to-[#FF7F50] text-white hover:shadow-2xl hover:shadow-orange-200/50'}
            `}
          >
            {isSpinning ? '正在挑选...' : '帮 我 选'}
          </button>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="text-orange-400 font-cute text-sm flex items-center justify-center gap-1 opacity-80 hover:opacity-100"
          >
            {showSettings ? '🔼 收起偏好' : '🔽 偏好设置'}
          </button>
        </div>

        {/* 偏好面板 */}
        {showSettings && (
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border-2 border-orange-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-orange-50">
              <span className="text-sm font-bold text-[#8D6E63]">只看素食 🥬</span>
              <div 
                onClick={() => setPreferences(p => ({ ...p, onlyVegetarian: !p.onlyVegetarian }))}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${preferences.onlyVegetarian ? 'bg-orange-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.onlyVegetarian ? 'left-7' : 'left-1'}`}></div>
              </div>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#8D6E63] block opacity-60">排除口味:</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TAG_LABELS).map(([tag, label]) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      preferences.excludedTags.includes(tag)
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-white text-orange-400 border border-orange-100 hover:bg-orange-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 历史记录 */}
        {history.length > 0 && !isSpinning && (
          <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="h-[1px] flex-1 bg-orange-100"></div>
              <span className="text-[10px] font-bold text-orange-200 tracking-widest uppercase">最近心动</span>
              <div className="h-[1px] flex-1 bg-orange-100"></div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
              {history.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="flex-shrink-0 bg-white/80 px-4 py-2 rounded-2xl border border-orange-50 flex items-center gap-2 snap-start shadow-sm">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-xs font-medium text-[#8D6E63] whitespace-nowrap">{item.name.split('+')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 text-center text-[#8D6E63] text-[10px] opacity-30 font-bold tracking-[0.2em]">
        LUNCH PICKER • DESIGNED FOR FOODIES
      </footer>
    </div>
  );
};

export default App;
