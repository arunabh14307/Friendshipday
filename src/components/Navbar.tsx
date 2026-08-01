import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Heart, Gift, FileText, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onToggleAudio: () => void;
  isAudioActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleAudio, isAudioActive }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['hero', 'creator', 'gift', 'certificate', 'scratch'];
      const scrollPosition = window.scrollY + 200;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero', id: 'hero', icon: Heart },
    { name: 'Card Creator', href: '#creator', id: 'creator', icon: Sparkles },
    { name: 'Virtual Gift', href: '#gift', id: 'gift', icon: Gift },
    { name: 'Certificate & Badges', href: '#certificate', id: 'certificate', icon: FileText },
    { name: 'Secret Scratch', href: '#scratch', id: 'scratch', icon: Sparkles },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3 shadow-xl' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#FF6FB5] p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FF6FB5] animate-pulse" />
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-tight font-heading text-white">
            Friend<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6FB5] to-[#FFD166]">Verse</span>
          </span>
        </a>

        {/* Interactive Desktop Nav Links with Active Pill Animation */}
        <nav className="hidden lg:flex items-center space-x-1 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full relative">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center space-x-1.5 ${
                  isActive ? 'text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#6C63FF] to-[#FF6FB5] rounded-full shadow-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <link.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#FF6FB5]'}`} />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Controls & Interactive Guitar Audio Toggle */}
        <div className="flex items-center space-x-3">
          {/* Guitar Audio Autoplay Toggle */}
          <button
            onClick={onToggleAudio}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all flex items-center space-x-2 ${
              isAudioActive
                ? 'bg-[#FF6FB5]/20 border-[#FF6FB5] text-[#FF6FB5] shadow-[0_0_20px_rgba(255,111,181,0.5)] animate-pulse'
                : 'bg-white/10 border-white/20 text-slate-400 hover:bg-white/20'
            }`}
            title="Guitar Audio Toggle (Autoplay ON by default)"
          >
            {isAudioActive ? <Volume2 className="w-4 h-4 text-[#FF6FB5]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline text-xs font-bold">
              {isAudioActive ? '🎸 Guitar Sound ON' : 'Audio Muted'}
            </span>
          </button>

          {/* Create CTA Button */}
          <a
            href="#creator"
            className="hidden sm:flex btn-primary px-4 py-2 rounded-full text-xs font-bold items-center space-x-1.5 shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD166]" />
            <span>Create Card</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/10 border border-white/20 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-card border-t border-white/10 mt-2 px-4 py-4 space-y-2 overflow-hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-xl transition-all"
              >
                <link.icon className="w-4 h-4 text-[#FF6FB5]" />
                <span>{link.name}</span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
