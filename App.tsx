
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
      alert("筛选条件太严格啦，换个口味试试？");
      return;
    }

    setIsSpinning(true);
    setAiRating(null);
    setShowSettings(false);
    
    let counter = 0;
    const maxIterations = 12;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredList.length);
      setCurrentFood(filteredList[randomIndex]);
      counter++;

      if (counter >= maxIterations) {
        clearInterval(interval);
        const finalFood = filteredList[Math.floor(Math.random() * filteredList.length)];
        setCurrentFood(finalFood);
        setIsSpinning(false);
        setHistory(prev => [finalFood, ...prev.filter(f => f.name !== finalFood.name)].slice(0, 5));
        
        setIsLoadingReason(true);
        getFoodReason(finalFood.name)
          .then(res => setAiRating(res))
          .finally(() => setIsLoadingReason(false));
      }
    }, 120);
  }, [isSpinning, filteredList]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF9F0] p-4 sm:p-6 select-none">
      <header className="w-full max-w-md text-center py-8 z-10">
        <h1 className="text-4xl sm:text-5xl font-cute text-[#FF8C00] mb-2 drop-shadow-sm">今天中午吃什么</h1>
        <p className="text-[#8D6E63] text-sm opacity-70">解决世纪难题的 AI 实验室 🧪</p>
      </header>

      <main className="w-full max-w-md flex flex-col gap-6 z-10 pb-12">
        <div className={`w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-orange-50 p-6 flex flex-col items-center transition-all ${isSpinning ? 'scale-[0.98]' : 'scale-100'}`}>
          {!currentFood ? (
            <div className="py-16 flex flex-col items-center">
              <span className="text-8xl mb-6 animate-bounce-subtle">🍱</span>
              <p className="text-lg font-cute text-orange-200">点击按钮，开启好运</p>
            </div>
          ) : (
            <div className={`w-full flex flex-col items-center ${isSpinning ? 'opacity-40' : 'opacity-100'}`}>
              <div className="text-8xl mb-4 h-32 flex items-center drop-shadow-md animate-bounce-subtle">
                {currentFood.emoji}
              </div>
              <h2 className="text-2xl sm:text-3xl font-cute text-[#FF7F50] text-center mb-1">
                {currentFood.name}
              </h2>
              <span className="px-3 py-1 bg-orange-50 text-orange-400 rounded-full text-[10px] font-bold border border-orange-100 mb-6">
                {currentFood.category}
              </span>
              
              <div className="w-full min-h-[100px] flex items-center justify-center border-t border-orange-50 pt-4">
                {!isSpinning && aiRating && (
                  <div className="w-full bg-orange-50/40 rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-sm text-[#8D6E63] font-medium italic text-center leading-relaxed">
                      “ {aiRating.reason} ”
                    </p>
                    <div className="mt-2 text-[10px] font-bold text-orange-400 text-right uppercase">
                      Mood: {aiRating.mood}
                    </div>
                  </div>
                )}
                {isLoadingReason && !isSpinning && (
                  <div className="flex flex-col items-center gap-2 text-orange-300">
                    <div className="w-4 h-4 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                    <span className="text-xs font-cute">AI 正在疯狂安利中...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handlePick}
            disabled={isSpinning}
            className={`w-full py-5 rounded-[2rem] text-2xl font-cute shadow-lg transition-all active:scale-95 ${
              isSpinning ? 'bg-gray-100 text-gray-300' : 'bg-gradient-to-r from-[#FF8C00] to-[#FF7F50] text-white'
            }`}
          >
            {isSpinning ? '正在为您挑选...' : '帮 我 选'}
          </button>
          
          <button onClick={() => setShowSettings(!showSettings)} className="text-orange-400 font-cute text-sm">
            {showSettings ? '隐藏设置 ▲' : '口味设置 ▼'}
          </button>
        </div>

        {showSettings && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border-2 border-orange-50 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-orange-50">
              <span className="text-sm font-bold text-[#8D6E63]">只要素食 🥬</span>
              <input 
                type="checkbox" 
                checked={preferences.onlyVegetarian}
                onChange={e => setPreferences(p => ({ ...p, onlyVegetarian: e.target.checked }))}
                className="w-5 h-5 accent-orange-500"
              />
            </div>
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#8D6E63] block opacity-50">不吃这些:</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TAG_LABELS).map(([tag, label]) => (
                  <button
                    key={tag}
                    onClick={() => setPreferences(p => ({
                      ...p,
                      excludedTags: p.excludedTags.includes(tag) ? p.excludedTags.filter(t => t !== tag) : [...p.excludedTags, tag]
                    }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      preferences.excludedTags.includes(tag) ? 'bg-orange-500 text-white' : 'bg-white text-orange-400 border border-orange-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && !isSpinning && (
          <div className="mt-2 overflow-x-auto no-scrollbar flex gap-2">
            {history.map((item, idx) => (
              <div key={idx} className="flex-shrink-0 bg-white/50 px-3 py-2 rounded-xl border border-orange-50 flex items-center gap-2">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-xs text-[#8D6E63]">{item.name.split('+')[0]}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
