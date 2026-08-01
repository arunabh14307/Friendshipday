import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, RefreshCw, Flower2, Coffee, Pizza, Gem } from 'lucide-react';
import confetti from 'canvas-confetti';
import { giftItems } from '../data/initialData';
import type { GiftItem } from '../types';

export const GiftBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [selectedGift, setSelectedGift] = useState<GiftItem>(giftItems[0]);

  const handleOpenGift = () => {
    if (isOpen) return;

    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setIsOpen(true);

      // Fireworks / Confetti explosion
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF6FB5', '#6C63FF', '#FFD166', '#22C55E']
      });
    }, 600);
  };

  const handleResetGift = (gift: GiftItem) => {
    setSelectedGift(gift);
    setIsOpen(false);
  };

  const renderGiftIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flower2': return <Flower2 className="w-16 h-16 text-yellow-400" />;
      case 'Coffee': return <Coffee className="w-16 h-16 text-pink-400" />;
      case 'Pizza': return <Pizza className="w-16 h-16 text-orange-400" />;
      case 'Gem': return <Gem className="w-16 h-16 text-cyan-400" />;
      default: return <Sparkles className="w-16 h-16 text-amber-400" />;
    }
  };

  return (
    <section id="gift" className="py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto space-y-12 text-center">
        
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-1.5 rounded-full border-white/20 text-xs font-bold text-[#FFD166]">
            <Gift className="w-4 h-4" />
            <span>Virtual Surprise Unboxing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
            Virtual <span className="text-gradient-primary">3D Gift Box</span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Click on the gift box to trigger the shaking mechanism, burst hearts, and unlock your digital present!
          </p>
        </div>

        {/* Gift Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {giftItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleResetGift(item)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedGift.id === item.id
                  ? 'bg-[#FF6FB5] border-[#FF6FB5] text-white shadow-lg'
                  : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/15'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* 3D Gift Box Display Container */}
        <div className="glass-card p-8 sm:p-14 rounded-3xl border-white/20 min-h-[380px] flex flex-col items-center justify-center relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* Closed Animated Gift Box */
              <motion.div
                key="closed-box"
                initial={{ scale: 0.9 }}
                animate={{
                  scale: 1,
                  rotate: isShaking ? [0, -8, 8, -8, 8, 0] : 0
                }}
                transition={{ duration: 0.6 }}
                onClick={handleOpenGift}
                className="cursor-pointer group flex flex-col items-center space-y-6"
              >
                {/* 3D Gift Icon Container */}
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-tr from-[#6C63FF] via-[#FF6FB5] to-[#FFD166] p-1 shadow-[0_0_50px_rgba(255,111,181,0.5)] group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#0F172A] rounded-[22px] flex flex-col items-center justify-center relative overflow-hidden">
                    
                    {/* Ribbon Accent */}
                    <div className="absolute inset-y-0 w-8 bg-gradient-to-b from-[#FF6FB5] to-[#FFD166] opacity-80" />
                    <div className="absolute inset-x-0 h-8 bg-gradient-to-r from-[#FF6FB5] to-[#FFD166] opacity-80" />

                    <Gift className="w-20 h-20 text-[#FFD166] z-10 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="inline-block px-5 py-2 rounded-full btn-primary text-xs font-bold shadow-xl">
                    Tap to Open Gift 🎁
                  </span>
                </div>
              </motion.div>
            ) : (
              /* Revealed Gift Content */
              <motion.div
                key="opened-gift"
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="space-y-6 text-center max-w-lg"
              >
                <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl">
                  {renderGiftIcon(selectedGift.icon)}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FFD166]">
                    Virtual Gift Unlocked
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                    {selectedGift.name}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {selectedGift.description}
                  </p>
                  <p className="font-quote text-base sm:text-lg text-[#FF6FB5] pt-2">
                    "{selectedGift.quote}"
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary px-6 py-2.5 rounded-full text-xs font-bold inline-flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4 text-[#FFD166]" />
                    <span>Wrap Box & Open Another</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};
