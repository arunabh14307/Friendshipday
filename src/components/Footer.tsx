import React from 'react';
import { Sparkles, Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 pt-16 pb-8 px-4 border-t border-white/10 glass-card mt-20">
      
      {/* Top Animated Gradient Line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF6FB5] to-transparent animate-pulse" />

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          {/* Logo & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#FF6FB5] p-0.5 flex items-center justify-center shadow-lg">
                <div className="w-full h-full bg-[#0F172A] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#FF6FB5]" />
                </div>
              </div>
              <span className="text-xl font-extrabold font-heading text-white">
                Friend<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6FB5] to-[#FFD166]">Verse</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              The premium Apple-level digital experience for creating unforgettable Friendship Day gifts.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-300">
            <a href="#hero" className="hover:text-white transition-colors">Home</a>
            <a href="#creator" className="hover:text-white transition-colors">Card Creator</a>
            <a href="#timeline" className="hover:text-white transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <a href="#quiz" className="hover:text-white transition-colors">Quiz</a>
            <a href="#gift" className="hover:text-white transition-colors">Virtual Gift</a>
            <a href="#certificate" className="hover:text-white transition-colors">Certificate</a>
          </div>

          {/* Scroll To Top */}
          <div>
            <button
              onClick={scrollToTop}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15"
              title="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-2 sm:space-y-0">
          <p>© 2026 FriendVerse. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#FF6FB5] fill-current animate-pulse" />
            <span>for Best Friends Worldwide</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
