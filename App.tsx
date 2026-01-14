
import React, { useState, useCallback, useMemo } from 'react';
import { FOOD_LIST, TAG_LABELS } from './constants.ts';
import { FoodItem, AIRating, UserPreferences } from './types.ts';
import { getFoodReason } from './services/geminiService.ts';

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

  const toggleTag = (tag: string) => {
    setPreferences(prev => ({
      ...prev,
      excludedTags: prev.excludedTags.includes(tag)
        ? prev.excludedTags.filter(t => t !== tag)
        : [...prev.excludedTags, tag]
    }));
  };

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
              <span className="text-8xl mb-6">🍱</span>
              <p className="text-lg font-cute text-orange-200">点击按钮，开启好运</p>
            </div>
          ) : (
            <div className={`w-full flex flex-col items-center ${isSpinning ? 'opacity-40' : 'opacity-100'}`}>
              <div className="text-8xl mb-4 h-32 flex items-center drop-shadow-md">
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
                  <div className="w-full bg-orange-50/40 rounded-2xl p-4 transition-all">
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
              isSpinning ? 'bg-orange-200 cursor-not-allowed' : 'bg-[#FF8C00] text-white hover:bg-[#FF7F50]'
            }`}
          >
            {isSpinning ? '正在纠结中...' : '帮我选一个！'}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-orange-400 text-sm font-cute opacity-60 hover:opacity-100 transition-opacity"
          >
            {showSettings ? '收起筛选 ↑' : '不喜欢这些？去设置条件 ↓'}
          </button>
        </div>

        {showSettings && (
          <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-orange-100 animate-in fade-in zoom-in-95">
            <h3 className="text-[#8D6E63] font-bold text-sm mb-4">偏好设置</h3>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.onlyVegetarian}
                  onChange={(e) => setPreferences(prev => ({ ...prev, onlyVegetarian: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm text-[#8D6E63]">只看素食 🌱</span>
              </label>
              
              <div>
                <p className="text-xs text-gray-400 mb-2">排除过敏或不喜的内容:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(TAG_LABELS).map(([tag, label]) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs border transition-all ${
                        preferences.excludedTags.includes(tag)
                          ? 'bg-red-50 border-red-100 text-red-400'
                          : 'bg-gray-50 border-transparent text-gray-400'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2 ml-2">最近抽到:</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {history.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="flex-shrink-0 bg-white/50 border border-orange-50 px-3 py-2 rounded-xl flex items-center gap-2 opacity-60">
                  <span>{item.emoji}</span>
                  <span className="text-xs text-[#8D6E63]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// 修复错误：添加 default export
export default App;
