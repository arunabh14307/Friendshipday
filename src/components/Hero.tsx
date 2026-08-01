import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Gift, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Hero: React.FC = () => {
  useEffect(() => {
    // Soft celebratory confetti burst on load
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#6C63FF', '#FF6FB5', '#FFD166']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#6C63FF', '#FF6FB5', '#FFD166']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-12 px-4 overflow-hidden">
      
      {/* Floating illustrations / decorative elements */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-28 left-8 sm:left-20 hidden md:flex items-center space-x-2 glass-card px-4 py-2 rounded-2xl border-white/20 shadow-2xl"
      >
        <div className="p-2 rounded-xl bg-pink-500/20 text-[#FF6FB5]">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div>
          <p className="text-xs text-slate-300 font-medium">BFF Status</p>
          <p className="text-sm font-bold text-white font-heading">100% Forever 💜</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-20 right-8 sm:right-20 hidden md:flex items-center space-x-2 glass-card px-4 py-2 rounded-2xl border-white/20 shadow-2xl"
      >
        <div className="p-2 rounded-xl bg-amber-500/20 text-[#FFD166]">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-300 font-medium">Digital Gift Box</p>
          <p className="text-sm font-bold text-white font-heading">Surprise Ready 🎁</p>
        </div>
      </motion.div>

      {/* Main Content Box */}
      <div className="max-w-4xl mx-auto text-center z-10 space-y-10">
        
        {/* Top Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 glass-card px-5 py-2 rounded-full border-white/20 text-xs font-semibold tracking-wide uppercase text-slate-200"
        >
          <Sparkles className="w-4 h-4 text-[#FFD166] animate-pulse" />
          <span>The Ultimate Friendship Day Experience</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6FB5]" />
        </motion.div>

        {/* Dynamic & Highly Engaging Main Heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight font-heading leading-tight drop-shadow-[0_10px_35px_rgba(255,111,181,0.4)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#FF6FB5] hover:scale-105 inline-block transition-transform duration-300 cursor-default">
              Happy Friendship Day
            </span>{' '}
            <span className="inline-block animate-bounce drop-shadow-[0_0_20px_rgba(108,99,255,0.8)]">💜</span>
          </h1>

          <p className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-wide leading-snug">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] via-[#FF6FB5] to-[#FFD166] drop-shadow-[0_5px_20px_rgba(255,209,102,0.4)]">
              Some friendships become our favorite stories.
            </span>
          </p>
        </motion.div>

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center pt-2"
        >
          <a
            href="#creator"
            className="btn-primary px-10 py-4 rounded-full text-lg font-extrabold flex items-center justify-center space-x-3 shadow-[0_0_40px_rgba(255,111,181,0.5)] group hover:scale-105 transition-all"
          >
            <Sparkles className="w-5 h-5 text-[#FFD166]" />
            <span>Create Your Friendship Card</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};
