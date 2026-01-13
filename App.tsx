
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
      alert("哎呀，选出的餐厅都被你排除掉啦！请修改偏好设置后再试。");
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
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center p-4 sm:p-8 bg-[#FFF9F0] transition-colors duration-500 overflow-y-auto">
      {/* Background elements */}
      <div className="fixed top-[-50px] left-[-50px] w-48 sm:w-64 h-48 sm:h-64 bg-orange-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="fixed bottom-[-50px] right-[-50px] w-48 sm:w-64 h-48 sm:h-64 bg-yellow-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      <header className="text-center mb-6 sm:mb-8 z-10 w-full pt-4 sm:pt-0">
        <h1 className="text-4xl sm:text-6xl font-cute text-[#FF8C00] mb-2 drop-shadow-sm leading-tight">
          今天中午吃什么？
        </h1>
        <p className="text-[#8D6E63] font-medium text-sm sm:text-base">拯救你的午餐困难症 🥡</p>
      </header>

      <main className="w-full max-w-md flex flex-col items-center gap-4 sm:gap-6 z-10">
        {/* Main Display Card */}
        <div className={`relative w-full min-h-[300px] sm:min-h-[380px] bg-white rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-6 sm:p-8 border-4 sm:border-8 border-orange-100 transition-all duration-500 ${isSpinning ? 'scale-95' : 'scale-100'}`}>
          {!currentFood ? (
            <div className="text-center animate-bounce-subtle">
              <span className="text-6xl sm:text-8xl mb-4 block">🤤</span>
              <p className="text-lg text-gray-400 font-medium font-cute">请 主 公 翻 牌</p>
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center transition-all duration-300 w-full ${isSpinning ? 'opacity-50' : 'opacity-100'}`}>
              <div className="text-7xl sm:text-9xl mb-4 drop-shadow-md animate-bounce-subtle">
                {currentFood.emoji}
              </div>
              <h2 className="text-2xl sm:text-4xl font-cute text-[#FF7F50] mb-3 text-center leading-snug">
                {currentFood.name}
              </h2>
              <span className="px-3 py-1 bg-orange-50 text-orange-400 rounded-full text-[10px] sm:text-xs font-bold border border-orange-100 mb-4">
                {currentFood.category}
              </span>
              
              {/* AI Tip - Now integrated INSIDE the card flow to avoid obscuring the button */}
              {!isSpinning && aiRating && (
                <div className="w-full bg-[#FFF9F0] border border-orange-200 p-3 sm:p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-xs sm:text-sm text-[#8D6E63] font-medium italic text-center leading-relaxed">
                    “ {aiRating.reason} ”
                  </p>
                  <div className="mt-2 text-[10px] font-bold text-orange-400 text-right">
                    ✨ 今日推荐：{aiRating.mood}
                  </div>
                </div>
              )}

              {isLoadingReason && !isSpinning && (
                <div className="w-full bg-orange-50 p-3 rounded-2xl text-center">
                  <span className="text-[10px] sm:text-xs text-orange-400 animate-pulse">🍱 AI 主厨正在写推荐理由...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full flex flex-col gap-3 pt-2">
          <button
            onClick={handlePick}
            disabled={isSpinning}
            className={`
              group relative w-full py-5 sm:py-6 rounded-[2rem] text-2xl sm:text-3xl font-cute shadow-xl transition-all duration-200
              ${isSpinning 
                ? 'bg-gray-300 cursor-not-allowed scale-95' 
                : 'bg-gradient-to-r from-[#FF8C00] to-[#FF7F50] text-white hover:shadow-2xl hover:scale-[1.02] active:scale-95'}
            `}
          >
            {isSpinning ? '正在翻牌...' : '帮 我 选'}
            {!isSpinning && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-white px-2 py-1 rounded-full text-[10px] animate-bounce shadow-md">
                饿了!
              </span>
            )}
          </button>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="text-orange-400 text-xs sm:text-sm font-bold flex items-center justify-center gap-1 hover:text-[#FF8C00] transition-colors py-2"
          >
            🍴 饮食偏好设置 {showSettings ? '收起' : '展开'}
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-lg border border-orange-50 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-4 border-b border-orange-50 pb-3">
              <label className="text-[#8D6E63] font-bold text-sm cursor-pointer flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-[#FF8C00] rounded"
                  checked={preferences.onlyVegetarian}
                  onChange={(e) => setPreferences(p => ({...p, onlyVegetarian: e.target.checked}))}
                />
                🥗 只看素食
              </label>
              <span className="text-[10px] font-bold text-orange-300 bg-orange-50 px-2 py-0.5 rounded-full">
                余量: {filteredList.length}
              </span>
            </div>
            
            <div className="space-y-3">
              <p className="text-[#8D6E63] text-[10px] font-bold uppercase tracking-wider">不喜欢/过敏:</p>
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

        {/* History Area */}
        {history.length > 0 && (
          <div className="w-full mt-4 sm:mt-6">
            <h3 className="text-[#8D6E63] text-[10px] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="flex-1 h-[1px] bg-orange-100"></span>
              最近的灵感
              <span className="flex-1 h-[1px] bg-orange-100"></span>
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar snap-x">
              {history.map((food, idx) => (
                <div 
                  key={`${food.name}-${idx}`}
                  className="flex-shrink-0 bg-white p-3 rounded-2xl shadow-sm border border-orange-50 flex flex-col items-center min-w-[75px] snap-start transition-transform hover:scale-105"
                >
                  <span className="text-2xl mb-1">{food.emoji}</span>
                  <span className="text-[10px] font-medium text-gray-500 text-center line-clamp-1">{food.name.split('+')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-8 py-6 text-center text-orange-200 text-[10px] font-medium w-full">
        祝你今天胃口好 | © 2024 午餐选择器
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
