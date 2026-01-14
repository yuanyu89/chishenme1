
import React, { useState, useCallback, useMemo } from 'react';
import { FOOD_LIST, TAG_LABELS } from './constants.ts';
import { FoodItem, AIRating, UserPreferences, CrowdType } from './types.ts';
import { getFoodReason } from './services/geminiService.ts';

const App: React.FC = () => {
  const [crowdType, setCrowdType] = useState<CrowdType>('normal');
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
      // 人群特征过滤
      if (!item.suitableFor.includes(crowdType)) return false;
      // 素食过滤
      if (preferences.onlyVegetarian && !item.isVegetarian) return false;
      // 标签过滤
      if (item.tags.some(tag => preferences.excludedTags.includes(tag))) return false;
      return true;
    });
  }, [preferences, crowdType]);

  const handlePick = useCallback(() => {
    if (isSpinning) return;
    if (filteredList.length === 0) {
      alert("当前筛选条件下没有合适的菜品，尝试切换人群类型或清空标签吧！");
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
        setHistory(prev => [finalFood, ...prev.filter(f => f.name !== finalFood.name)].slice(0, 5));
        
        setIsLoadingReason(true);
        getFoodReason(finalFood.name, crowdType)
          .then(res => setAiRating(res))
          .finally(() => setIsLoadingReason(false));
      }
    }, 100);
  }, [isSpinning, filteredList, crowdType]);

  const toggleTag = (tag: string) => {
    setPreferences(prev => ({
      ...prev,
      excludedTags: prev.excludedTags.includes(tag)
        ? prev.excludedTags.filter(t => t !== tag)
        : [...prev.excludedTags, tag]
    }));
  };

  const crowdOptions: { type: CrowdType; label: string; icon: string }[] = [
    { type: 'fat-loss', label: '减脂', icon: '🥗' },
    { type: 'normal', label: '正常', icon: '🍱' },
    { type: 'muscle-gain', label: '增肌', icon: '💪' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF9F0] p-4 sm:p-6 select-none">
      <header className="w-full max-w-md text-center py-6 z-10">
        <h1 className="text-4xl sm:text-5xl font-cute text-[#FF8C00] mb-2 drop-shadow-sm">今天中午吃什么</h1>
        
        {/* 人群选择器 */}
        <div className="mt-6 inline-flex p-1 bg-white/60 backdrop-blur rounded-2xl border border-orange-100 shadow-inner">
          {crowdOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => {
                if (!isSpinning) {
                  setCrowdType(opt.type);
                  setCurrentFood(null);
                  setAiRating(null);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-cute transition-all ${
                crowdType === opt.type
                  ? 'bg-orange-500 text-white shadow-md scale-105'
                  : 'text-orange-300 hover:text-orange-400'
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="w-full max-w-md flex flex-col gap-6 z-10 pb-12">
        <div className={`w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-orange-50 p-6 flex flex-col items-center transition-all duration-300 ${isSpinning ? 'scale-[0.98]' : 'scale-100'}`}>
          {!currentFood ? (
            <div className="py-16 flex flex-col items-center">
              <span className="text-8xl mb-6 opacity-30">🍽️</span>
              <p className="text-lg font-cute text-orange-200">
                {crowdType === 'fat-loss' ? '减脂之路，从这一顿开始' : 
                 crowdType === 'muscle-gain' ? '开启战斗模式，补充能量' : 
                 '选个好吃的，犒劳一下自己'}
              </p>
            </div>
          ) : (
            <div className={`w-full flex flex-col items-center ${isSpinning ? 'opacity-40 blur-[1px]' : 'opacity-100'}`}>
              <div className="text-8xl mb-4 h-32 flex items-center drop-shadow-md animate-bounce-subtle">
                {currentFood.emoji}
              </div>
              <h2 className="text-2xl sm:text-3xl font-cute text-[#FF7F50] text-center mb-1">
                {currentFood.name}
              </h2>
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 bg-orange-50 text-orange-400 rounded-full text-[10px] font-bold border border-orange-100">
                  {currentFood.category}
                </span>
                {currentFood.suitableFor.includes('fat-loss') && (
                  <span className="px-2 py-1 bg-green-50 text-green-500 rounded-full text-[10px] border border-green-100">轻负担</span>
                )}
                {currentFood.suitableFor.includes('muscle-gain') && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-500 rounded-full text-[10px] border border-blue-100">高蛋白</span>
                )}
              </div>
              
              <div className="w-full min-h-[100px] flex items-center justify-center border-t border-orange-50 pt-4">
                {!isSpinning && aiRating && (
                  <div className="w-full bg-orange-50/40 rounded-2xl p-4 transition-all animate-in slide-in-from-bottom-2">
                    <p className="text-sm text-[#8D6E63] font-medium italic text-center leading-relaxed">
                      “ {aiRating.reason} ”
                    </p>
                    <div className="mt-2 text-[10px] font-bold text-orange-400 text-right uppercase tracking-wider">
                      Status: {aiRating.mood}
                    </div>
                  </div>
                )}
                {isLoadingReason && !isSpinning && (
                  <div className="flex flex-col items-center gap-2 text-orange-300">
                    <div className="w-4 h-4 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                    <span className="text-xs font-cute">正在分析营养构成...</span>
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
            {showSettings ? '收起偏好 ↑' : '还有特殊要求？点这里 ↓'}
          </button>
        </div>

        {showSettings && (
          <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-orange-100 animate-in fade-in zoom-in-95">
            <h3 className="text-[#8D6E63] font-bold text-sm mb-4">进阶偏好</h3>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={preferences.onlyVegetarian}
                  onChange={(e) => setPreferences(prev => ({ ...prev, onlyVegetarian: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500 rounded"
                />
                <span className="text-sm text-[#8D6E63] group-hover:text-orange-500 transition-colors">我今天吃素 🌱</span>
              </label>
              
              <div>
                <p className="text-xs text-gray-400 mb-2">不想碰到这些:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(TAG_LABELS).map(([tag, label]) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs border transition-all ${
                        preferences.excludedTags.includes(tag)
                          ? 'bg-red-50 border-red-100 text-red-400'
                          : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'
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
          <div className="mt-4 animate-in fade-in">
            <p className="text-[10px] text-gray-300 mb-2 ml-2 uppercase tracking-tighter">History</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {history.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="flex-shrink-0 bg-white/40 border border-orange-50/50 px-3 py-2 rounded-xl flex items-center gap-2">
                  <span className="grayscale-[0.5]">{item.emoji}</span>
                  <span className="text-[10px] text-[#8D6E63]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-auto py-8 text-orange-200 text-xs font-cute tracking-widest opacity-40">
        MADE WITH ❤️ FOR FOODIES
      </footer>
    </div>
  );
};

export default App;
