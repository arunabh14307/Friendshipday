import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Crown, Zap, UtensilsCrossed, Gamepad2, HeartHandshake, MoonStar, Laugh, Clock, X } from 'lucide-react';
import { badgesList } from '../data/initialData';
import type { BadgeItem } from '../types';

interface BadgeCollectionProps {
  unlockedBadgeTitles: string[];
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({ unlockedBadgeTitles }) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown': return <Crown className="w-8 h-8 text-amber-300" />;
      case 'Zap': return <Zap className="w-8 h-8 text-purple-300" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-8 h-8 text-pink-300" />;
      case 'Gamepad2': return <Gamepad2 className="w-8 h-8 text-cyan-300" />;
      case 'HeartHandshake': return <HeartHandshake className="w-8 h-8 text-rose-300" />;
      case 'MoonStar': return <MoonStar className="w-8 h-8 text-indigo-300" />;
      case 'Laugh': return <Laugh className="w-8 h-8 text-emerald-300" />;
      case 'Clock': return <Clock className="w-8 h-8 text-orange-300" />;
      default: return <Award className="w-8 h-8 text-yellow-300" />;
    }
  };

  return (
    <section id="badges" className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-1.5 rounded-full border-white/20 text-xs font-bold text-[#FF6FB5]">
            <Award className="w-4 h-4" />
            <span>Digital Honor Medals</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
            Friendship <span className="text-gradient-primary">Badges</span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Collection of earned titles and hilarious trophies recognizing your unique dynamic.
          </p>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {badgesList.map((badge, idx) => {
            const isUnlocked = unlockedBadgeTitles.length === 0 || unlockedBadgeTitles.includes(badge.title);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -6 }}
                onClick={() => setSelectedBadge(badge)}
                className={`glass-card p-6 rounded-3xl border-white/20 text-center space-y-4 cursor-pointer relative group overflow-hidden ${!isUnlocked ? 'opacity-60' : ''}`}
              >
                {/* Glow Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} opacity-10 group-hover:opacity-25 transition-opacity`} />

                {/* Badge Icon Shield */}
                <div className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${badge.gradient} p-0.5 shadow-xl flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                  <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
                    {getBadgeIcon(badge.icon)}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold font-heading text-white group-hover:text-[#FF6FB5] transition-colors">
                    {badge.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Badge Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="glass-card p-8 rounded-3xl max-w-sm w-full text-center space-y-6 relative border-white/30"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr ${selectedBadge.gradient} p-1 shadow-2xl flex items-center justify-center animate-bounce`}>
                <div className="w-full h-full bg-[#0F172A] rounded-[22px] flex items-center justify-center">
                  {getBadgeIcon(selectedBadge.icon)}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD166]">
                  Official Friendship Medal
                </span>
                <h3 className="text-2xl font-extrabold font-heading text-white">
                  {selectedBadge.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedBadge.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold"
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
