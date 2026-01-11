
import React, { useState, useRef, useEffect } from 'react';
import { PEOPLE_DATA } from './constants';
import { Person, RouletteState } from './types';
import { PersonCard } from './components/PersonCard';
import { RouletteWheel } from './components/RouletteWheel';

const App: React.FC = () => {
  const [state, setState] = useState<RouletteState>({
    spinning: false,
    winner: null,
    selectedIds: new Set(PEOPLE_DATA.map(p => p.id)),
  });
  const [rotation, setRotation] = useState(0);
  
  const toggleSelection = (id: string) => {
    if (state.spinning) return;
    setState(prev => {
      const newSet = new Set(prev.selectedIds);
      if (newSet.has(id)) {
        if (newSet.size <= 2) return prev;
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { ...prev, selectedIds: newSet, winner: null };
    });
  };

  const selectedPeople = PEOPLE_DATA.filter(p => state.selectedIds.has(p.id));

  const handleSpin = () => {
    if (state.spinning || selectedPeople.length < 2) return;
    setState(prev => ({ ...prev, spinning: true, winner: null }));

    const spinDuration = 5500;
    const extraSpins = 15 + Math.random() * 8;
    const finalRotation = rotation + extraSpins * Math.PI * 2;
    const startTime = performance.now();
    const startRotation = rotation;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 5);
      const currentRot = startRotation + (finalRotation - startRotation) * easeOut;
      
      setRotation(currentRot);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        finishSpin(currentRot);
      }
    };
    requestAnimationFrame(animate);
  };

  const finishSpin = async (finalRot: number) => {
    const sliceAngle = (Math.PI * 2) / selectedPeople.length;
    const normalizedRot = (1.5 * Math.PI - (finalRot % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const winnerIndex = Math.floor(normalizedRot / sliceAngle) % selectedPeople.length;
    const winner = selectedPeople[winnerIndex];
    setState(prev => ({ ...prev, spinning: false, winner }));
  };

  // 背景裝飾元素配置
  const bgItems = [
    { icon: '🥯', size: 'text-4xl', top: '15%', left: '5%', delay: '0s' },
    { icon: '🌟', size: 'text-2xl', top: '25%', left: '85%', delay: '2s' },
    { icon: '🚁', size: 'text-3xl', top: '70%', left: '10%', delay: '5s' },
    { icon: '🥯', size: 'text-2xl', top: '85%', left: '80%', delay: '1s' },
    { icon: '☁️', size: 'text-5xl', top: '10%', left: '40%', delay: '3s' },
    { icon: '🌟', size: 'text-3xl', top: '55%', left: '90%', delay: '4s' },
    { icon: '☁️', size: 'text-6xl', top: '65%', left: '45%', delay: '7s' },
    { icon: '🚁', size: 'text-4xl', top: '40%', left: '75%', delay: '2.5s' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden">
      {/* 背景裝飾層 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {bgItems.map((item, idx) => (
          <div 
            key={idx}
            className={`absolute drifting ${item.size} opacity-20`}
            style={{ 
              top: item.top, 
              left: item.left, 
              animationDelay: item.delay,
              filter: 'blur(1px)'
            }}
          >
            <div className={item.icon === '🚁' ? 'spinning-slow' : 'floating'}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 裝飾性背景雲朵 */}
      <div className="absolute top-20 left-[10%] w-32 h-16 bg-white rounded-full blur-md opacity-40 floating" style={{animationDelay: '0s'}}></div>
      <div className="absolute top-40 right-[15%] w-48 h-20 bg-white rounded-full blur-lg opacity-30 floating" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute bottom-20 left-[20%] w-40 h-16 bg-white rounded-full blur-lg opacity-40 floating" style={{animationDelay: '2.5s'}}></div>

      {/* 左上角標題區域 */}
      <header className="fixed top-4 left-6 z-50 flex items-center gap-4">
        {/* 標題旁豆沙包圖片 */}
        <div className="relative group">
          <img 
            src="https://duk.tw/ZMH124.png" 
            alt="豆沙包" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md floating transition-transform group-hover:scale-110 active:scale-95 cursor-pointer"
          />
        </div>
        
        {/* 標題圖片 - 套用 title-dynamic 動態效果 */}
        <div className="flex flex-col">
          <img 
            src="https://duk.tw/1NLxqC.png" 
            alt="下一屆會計是..." 
            className="h-10 md:h-14 lg:h-16 object-contain drop-shadow-xl title-dynamic"
          />
          <div className="h-1 w-full bg-gradient-to-r from-[#00A0E9] to-transparent rounded-full opacity-50 mt-1"></div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto w-full flex-1 flex flex-col p-6 pt-24 relative z-10">
        <main className="flex-1 flex flex-col lg:flex-row gap-8 items-center lg:items-stretch h-full overflow-hidden">
          {/* 左側：輪盤 */}
          <section className="lg:w-[55%] flex flex-col h-full">
            <div className="h-full bubble-border p-8 flex flex-col justify-center items-center relative overflow-hidden">
              <RouletteWheel 
                selectedPeople={selectedPeople} 
                isSpinning={state.spinning}
                onSpin={handleSpin}
                rotation={rotation}
              />
              
              <div className="mt-8 text-center relative">
                {selectedPeople.length < 2 && (
                  <div className="bg-red-100/80 border-2 border-red-400 px-5 py-1.5 rounded-full relative z-10">
                    <p className="text-red-500 text-xs font-black animate-pulse">請至少從口袋拿出 2 位成員</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 右側：名單面板 */}
          <section className="lg:w-[45%] flex flex-col h-full">
            <div className="h-full anywhere-door-border p-6 shadow-2xl flex flex-col relative overflow-hidden">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-16 bg-[#E6F7FF] border-4 border-[#00A0E9] border-b-0 rounded-t-full opacity-40"></div>
              
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div>
                  <h2 className="text-xl font-black dora-pink leading-none mb-1">成員任意門</h2>
                  <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">候選口袋名單</p>
                </div>
                <button 
                  onClick={() => {
                    setState(s => ({ ...s, selectedIds: new Set(PEOPLE_DATA.map(p => p.id)) }));
                  }}
                  className="px-4 py-1.5 text-[9px] font-black text-[#F0558F] uppercase tracking-wider border-2 border-[#F0558F]/30 rounded-full hover:bg-[#F0558F] hover:text-white transition-all shadow-sm bg-white"
                >
                  全部復位
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar relative z-10">
                <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {PEOPLE_DATA.map(person => (
                    <PersonCard
                      key={person.id}
                      person={person}
                      isSelected={state.selectedIds.has(person.id)}
                      onToggle={toggleSelection}
                      disabled={state.spinning}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t-2 border-dashed border-[#F0558F]/20 relative z-10">
                <div className="flex justify-between text-[10px] font-black text-[#F0558F]/60 mb-1.5 uppercase">
                  <span>傳送機負載</span>
                  <span><span className="dora-blue">{selectedPeople.length}</span> / {PEOPLE_DATA.length}</span>
                </div>
                <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-200">
                   <div 
                     className="h-full bg-gradient-to-r from-[#00A0E9] to-[#69C3FF] transition-all duration-700 shadow-inner" 
                     style={{ width: `${(selectedPeople.length / PEOPLE_DATA.length) * 100}%` }}
                   ></div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {state.winner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div className="relative w-full max-w-lg">
            <div className="rays"></div>
            <div className="sparkle" style={{ top: '5%', left: '15%' }}>✨</div>
            <div className="sparkle" style={{ top: '15%', right: '10%', animationDelay: '0.3s' }}>⭐</div>
            <div className="sparkle" style={{ bottom: '20%', left: '5%', animationDelay: '0.6s' }}>🌟</div>
            <div className="sparkle" style={{ bottom: '10%', right: '20%', animationDelay: '0.9s' }}>✨</div>

            <div className="relative gadget-reveal-animation bg-[#FFFBEC] rounded-[50px] border-8 border-[#FFD700] shadow-[0_15px_0_#B8860B] p-10 overflow-hidden">
                <div className="flex flex-col items-center gap-8 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-white blur-2xl scale-125 opacity-70"></div>
                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-[10px] border-[#00A0E9] bg-white shadow-2xl p-0.5">
                            <img src={state.winner.photoUrl} alt={state.winner.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-[#E4002B] text-white px-4 py-1 rounded-full text-xs font-black tracking-widest border-4 border-white shadow-lg animate-bounce">
                           登場！
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-[#00A0E9] uppercase tracking-[0.2em] mb-2" style={{ fontFamily: 'Mochiypop One' }}>噔噔噔噔～！</h2>
                        <div className="relative inline-block px-8 py-2">
                           <div className="absolute inset-0 bg-[#FFD700]/20 rounded-lg skew-x-[-15deg]"></div>
                           <h3 className="text-5xl font-black text-[#333] relative z-10">{state.winner.name}</h3>
                        </div>
                        <p className="mt-4 text-[#E4002B] font-black text-lg">成為了下一屆的神奇會計師！</p>
                    </div>

                    <button 
                        onClick={() => {
                          setState(s => ({...s, winner: null}));
                        }}
                        className="px-12 py-3 bg-gradient-to-b from-[#00A0E9] to-[#0080BA] text-white font-black text-lg rounded-full border-b-6 border-[#006090] hover:translate-y-[2px] hover:border-b-4 active:translate-y-[4px] active:border-b-0 transition-all shadow-xl"
                    >
                        太棒了！
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8f8f8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F0558F; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
