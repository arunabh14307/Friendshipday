import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Shuffle, Copy, Check } from 'lucide-react';
import { quotesList } from '../data/initialData';

export const QuoteSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleShuffle = () => {
    let nextIndex = Math.floor(Math.random() * quotesList.length);
    if (nextIndex === currentIndex) {
      nextIndex = (currentIndex + 1) % quotesList.length;
    }
    setCurrentIndex(nextIndex);
  };

  const currentQuote = quotesList[currentIndex];

  const handleCopyQuote = () => {
    const text = `"${currentQuote.quote}" — ${currentQuote.author} (via FriendVerse 💜)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        <div className="glass-card p-8 sm:p-12 rounded-3xl border-white/20 relative overflow-hidden text-center space-y-6">
          
          {/* Background Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#6C63FF]/30 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#FF6FB5]/30 rounded-full blur-[90px] pointer-events-none" />

          {/* Quote Icon */}
          <div className="inline-flex p-3 rounded-2xl bg-white/10 text-[#FFD166]">
            <Quote className="w-8 h-8" />
          </div>

          {/* Animated Quote Container */}
          <div className="min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <p className="font-quote text-2xl sm:text-4xl text-white font-bold leading-relaxed">
                  "{currentQuote.quote}"
                </p>
                <p className="text-sm font-semibold text-[#FF6FB5] tracking-wide">
                  — {currentQuote.author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleShuffle}
              className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold flex items-center space-x-2 shadow-lg"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle Random Quote</span>
            </button>

            <button
              onClick={handleCopyQuote}
              className="btn-secondary py-2.5 px-5 rounded-full text-xs font-semibold flex items-center space-x-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Quote'}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
