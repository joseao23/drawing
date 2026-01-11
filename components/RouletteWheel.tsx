
import React, { useRef, useEffect, useState } from 'react';
import { Person } from '../types';
import { COLORS } from '../constants';

interface RouletteWheelProps {
  selectedPeople: Person[];
  isSpinning: boolean;
  onSpin: () => void;
  rotation: number;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({ 
  selectedPeople, 
  isSpinning, 
  onSpin,
  rotation 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<{ [key: string]: HTMLImageElement }>({});
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    selectedPeople.forEach(p => {
      if (!images[p.id]) {
        const img = new Image();
        img.src = p.photoUrl;
        img.crossOrigin = "anonymous";
        img.onload = () => {
          setImages(prev => ({ ...prev, [p.id]: img }));
        };
      }
    });
  }, [selectedPeople, images]);

  // 點擊鈴鐺時觸發特效
  const handleBellClick = () => {
    if (isSpinning || selectedPeople.length < 2) return;
    setIsRinging(true);
    setTimeout(() => setIsRinging(false), 1000);
    onSpin();
  };

  // 輔助函數：判斷顏色亮度以決定文字顏色
  const getContrastYIQ = (hexcolor: string) => {
    hexcolor = hexcolor.replace("#", "");
    if (hexcolor.length === 3) {
      hexcolor = hexcolor.split('').map(char => char + char).join('');
    }
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#333333' : '#FFFFFF';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 40;
    const sliceAngle = (2 * Math.PI) / selectedPeople.length;

    ctx.clearRect(0, 0, size, size);
    
    // 繪製背景大圓（外圈裝飾）
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#00A0E9';
    ctx.lineWidth = 12;
    ctx.stroke();

    selectedPeople.forEach((person, i) => {
      const bgColor = COLORS[i % COLORS.length];
      const startAngle = i * sliceAngle + rotation;
      const endAngle = (i + 1) * sliceAngle + rotation;

      // 繪製扇形
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = bgColor;
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 進入扇形座標系
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);

      // 繪製頭像（靠近邊緣）
      const img = images[person.id];
      if (img) {
        const imgSize = radius / 3.2;
        const imgX = radius * 0.74; // 放在靠外側
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX, 0, imgSize / 2 + 6, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(imgX, 0, imgSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, imgX - imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.restore();
      }

      // 繪製名字（放置位置靠近邊緣並放大）
      // 顯著放大字體：根據人數調整，但基數提高
      const fontSize = selectedPeople.length > 8 ? 60 : 72;
      ctx.fillStyle = getContrastYIQ(bgColor);
      ctx.font = `900 ${fontSize}px "Zen Maru Gothic"`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = bgColor === '#FFFFFF' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 8;
      
      // 將名字放在半徑約 52% 的位置，使其更靠近外圈，呈現更動感的視覺
      ctx.fillText(person.name, radius * 0.52, 0);
      
      ctx.restore();
    });

    // 中心裝飾圈
    ctx.beginPath();
    ctx.arc(centerX, centerY, 48, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 5;
    ctx.stroke();

  }, [selectedPeople, rotation, images]);

  return (
    <div className="relative w-full max-w-[460px] aspect-square mx-auto">
      {/* 指針 - 竹蜻蜓風格 */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-20 transition-transform duration-300 ${isSpinning ? 'scale-110' : ''}`}>
        <div className="flex flex-col items-center">
            <div className={`flex gap-1.5 transition-all ${isSpinning ? 'animate-spin' : ''}`} style={{ animationDuration: isSpinning ? '0.2s' : '3s' }}>
                <div className="w-10 h-2.5 bg-[#D4AF37] rounded-full border border-[#8B4513]"></div>
                <div className="w-10 h-2.5 bg-[#D4AF37] rounded-full border border-[#8B4513]"></div>
            </div>
            <div className="w-2 h-7 bg-[#8B4513]"></div>
            <div className="w-10 h-10 bg-[#E4002B] rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full opacity-60 -translate-x-1 -translate-y-1"></div>
            </div>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={1000} 
        height={1000} 
        className={`w-full h-full transition-all duration-300 ${isSpinning ? 'drop-shadow-[0_0_40px_rgba(0,160,233,0.5)]' : ''}`}
      />

      {/* 聲波特效 */}
      {isRinging && (
        <>
          <div className="ring-wave" style={{ animationDelay: '0s' }}></div>
          <div className="ring-wave" style={{ animationDelay: '0.2s' }}></div>
        </>
      )}

      {/* 中心啟動按鈕 - 鈴鐺 */}
      <button
        onClick={handleBellClick}
        disabled={isSpinning || selectedPeople.length < 2}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96px] h-[96px] rounded-full z-30 flex flex-col items-center justify-center transition-all duration-300 border-[6px] border-[#333] shadow-[0_8px_0_#B8860B] ${
          isSpinning || selectedPeople.length < 2
            ? 'bg-gray-300 grayscale cursor-not-allowed scale-95 opacity-80'
            : `bg-[#FFD700] hover:scale-110 active:scale-90 active:shadow-none active:translate-y-1 cursor-pointer ${isRinging ? 'shake-active' : ''}`
        }`}
      >
        <div className="w-full h-full relative flex items-center justify-center pointer-events-none">
            {/* 鈴鐺中間的橫條與圓孔 */}
            <div className="absolute top-1/2 left-0 w-full h-3 bg-[#333] -translate-y-1.5"></div>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#333] rounded-full shadow-inner"></div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-2 h-4 bg-[#333] rounded-full"></div>
            
            {/* 鈴鐺的高光感 */}
            <div className="absolute top-4 left-4 w-6 h-4 bg-white/40 rounded-full rotate-[-45deg] blur-[2px]"></div>
        </div>
      </button>
    </div>
  );
};
