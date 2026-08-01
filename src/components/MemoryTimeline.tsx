import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Sparkles, Coffee, Laugh, Compass, MessageCircleHeart, HeartHandshake } from 'lucide-react';
import type { TimelineItem } from '../types';

interface MemoryTimelineProps {
  timeline: TimelineItem[];
  onAddTimelineItem: (item: TimelineItem) => void;
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ timeline, onAddTimelineItem }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee': return <Coffee className="w-5 h-5 text-[#FF6FB5]" />;
      case 'Laugh': return <Laugh className="w-5 h-5 text-[#FFD166]" />;
      case 'Compass': return <Compass className="w-5 h-5 text-cyan-400" />;
      case 'MessageCircleHeart': return <MessageCircleHeart className="w-5 h-5 text-purple-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-pink-400" />;
      default: return <Sparkles className="w-5 h-5 text-[#6C63FF]" />;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: TimelineItem = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate || '2026',
      description: newDescription,
      iconName: 'Sparkles',
      photoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80'
    };

    onAddTimelineItem(newItem);
    setNewTitle('');
    setNewDate('');
    setNewDescription('');
    setIsAdding(false);
  };

  return (
    <section id="timeline" className="py-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-1.5 rounded-full border-white/20 text-xs font-bold text-cyan-400">
            <Clock className="w-4 h-4" />
            <span>Our Journey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
            Memory <span className="text-gradient-primary">Timeline</span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Every chapter of your friendship, from the first accidental meeting to your forever bond.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-white/20 ml-4 sm:ml-32 pl-6 sm:pl-10 space-y-12">
          {timeline.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Left Floating Date Tag (Desktop) */}
              <div className="hidden sm:block absolute -left-44 top-4 w-32 text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-[#FFD166]">
                  {item.date}
                </span>
              </div>

              {/* Timeline Icon Node */}
              <div className="absolute -left-[35px] sm:-left-[51px] top-3 w-10 h-10 rounded-full bg-[#0F172A] border-2 border-[#FF6FB5] flex items-center justify-center shadow-lg group-hover:scale-125 group-hover:border-[#FFD166] transition-all">
                {getIcon(item.iconName)}
              </div>

              {/* Memory Glass Card */}
              <div className="glass-card p-6 rounded-3xl border-white/20 glass-card-hover space-y-4 max-w-2xl">
                
                {/* Mobile Date Badge */}
                <div className="sm:hidden inline-block px-3 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-[#FFD166]">
                  {item.date}
                </div>

                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold font-heading text-white group-hover:text-[#FF6FB5] transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>

                {item.photoUrl && (
                  <div className="pt-2">
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-2xl border border-white/15 shadow-md"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Custom Memory Section */}
        <div className="text-center pt-6">
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="btn-secondary px-6 py-3 rounded-full text-xs font-bold inline-flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-4 h-4 text-[#FF6FB5]" />
              <span>Add Custom Memory Chapter</span>
            </button>
          ) : (
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleAddSubmit}
              className="glass-card p-6 rounded-3xl border-white/20 max-w-lg mx-auto space-y-4 text-left"
            >
              <h4 className="text-base font-bold font-heading text-white">Add New Memory Chapter</h4>
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Concert Night"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#FF6FB5]"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Date / Period</label>
                <input
                  type="text"
                  placeholder="e.g. Summer 2025"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#FF6FB5]"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="What made this memory unforgettable?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#FF6FB5] resize-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Save Memory
                </button>
              </div>
            </motion.form>
          )}
        </div>

      </div>
    </section>
  );
};
