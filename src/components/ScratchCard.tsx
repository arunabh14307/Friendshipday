import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, RefreshCw, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchCardProps {
  secretMessage: string;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ secretMessage }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [percentScratched, setPercentScratched] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 320);
    const height = (canvas.height = 180);

    // Silver metallic gradient foil
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#CBD5E1');
    grad.addColorStop(0.5, '#94A3B8');
    grad.addColorStop(1, '#64748B');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Text on top of foil
    ctx.font = 'bold 16px Poppins, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch Here to Reveal Secret ✨', width / 2, height / 2 + 6);

    setIsUnlocked(false);
    setPercentScratched(0);
  };

  useEffect(() => {
    initCanvas();
  }, [secretMessage]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentCount = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentCount++;
    }

    const pct = Math.round((transparentCount / (canvas.width * canvas.height)) * 100);
    setPercentScratched(pct);

    if (pct > 40 && !isUnlocked) {
      setIsUnlocked(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScratching) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => setIsScratching(false);

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) scratch(touch.clientX, touch.clientY);
  };

  return (
    <section id="scratch" className="py-16 px-4 relative z-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-1.5 rounded-full border-white/20 text-xs font-bold text-[#FF6FB5]">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Secret Message</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Magic <span className="text-gradient-primary">Scratch Card</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Use your mouse or finger to scratch off the silver foil and reveal a hidden note!
          </p>
        </div>

        {/* Scratch Card Frame */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl border-white/20 flex flex-col items-center justify-center space-y-6">
          
          <div className="relative w-full max-w-md h-48 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl flex items-center justify-center bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] p-6 text-center">
            
            {/* Hidden Secret Message Underneath */}
            <div className="space-y-2 select-none">
              <Heart className="w-8 h-8 text-[#FF6FB5] mx-auto animate-pulse" />
              <p className="font-quote text-lg sm:text-xl text-white font-bold leading-snug">
                "{secretMessage}"
              </p>
              <span className="inline-block text-[10px] font-bold px-3 py-1 rounded-full bg-[#FF6FB5]/20 text-[#FF6FB5]">
                {isUnlocked ? 'Unlocked 🎉' : 'Keep Scratching...'}
              </span>
            </div>

            {/* Canvas Scratch Foil Layer */}
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchMove={handleTouchMove}
              className="absolute inset-0 cursor-pointer touch-none"
            />
          </div>

          {/* Reset Control */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
            <button
              onClick={initCanvas}
              className="btn-secondary py-2.5 px-5 rounded-full text-xs font-bold flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4 text-[#FFD166]" />
              <span>Reset Foil ({percentScratched}% Scratched)</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
