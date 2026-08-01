import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Award, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { quizQuestions } from '../data/initialData';

interface FriendshipQuizProps {
  friendName: string;
  yourName: string;
  onUnlockBadge: (badgeTitle: string) => void;
}

export const FriendshipQuiz: React.FC<FriendshipQuizProps> = ({ friendName, yourName, onUnlockBadge }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalBadge, setFinalBadge] = useState<string>('');

  const handleSelectOption = (badgeCategory: string) => {
    const newAnswers = [...answers, badgeCategory];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate winning category
      const counts: Record<string, number> = {};
      newAnswers.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });

      let topCategory = newAnswers[0];
      let maxCount = 0;
      Object.entries(counts).forEach(([cat, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topCategory = cat;
        }
      });

      setFinalBadge(topCategory);
      setQuizCompleted(true);
      onUnlockBadge(topCategory);

      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setFinalBadge('');
  };

  return (
    <section id="quiz" className="py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-1.5 rounded-full border-white/20 text-xs font-bold text-[#FFD166]">
            <HelpCircle className="w-4 h-4" />
            <span>Vibe Calculator & Quiz</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
            Friendship <span className="text-gradient-primary">Meter & Quiz</span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Measure your duo compatibility score and discover your official friendship badge!
          </p>
        </div>

        {/* 1. Friendship Meter Progress Bar */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-white/20 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-heading text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#FF6FB5]" />
              <span>Duo Compatibility Level: 100%</span>
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              Match Guaranteed
            </span>
          </div>

          {/* Rainbow Progress Bar */}
          <div className="relative h-6 w-full rounded-full bg-slate-900 overflow-hidden p-1 border border-white/20">
            <motion.div
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] via-[#FF6FB5] to-[#FFD166] shadow-[0_0_20px_rgba(255,111,181,0.6)]"
            />
          </div>

          {/* Percentage Metrics breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] text-slate-400 font-medium">Vibe Match</p>
              <p className="text-xl font-bold font-number text-[#FF6FB5]">99.9%</p>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] text-slate-400 font-medium">Secret Keeper</p>
              <p className="text-xl font-bold font-number text-[#FFD166]">100%</p>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] text-slate-400 font-medium">Late For Plans</p>
              <p className="text-xl font-bold font-number text-cyan-400">95%</p>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] text-slate-400 font-medium">Lifetime Warranty</p>
              <p className="text-xl font-bold font-number text-emerald-400">∞ %</p>
            </div>
          </div>
        </div>

        {/* 2. Interactive Quiz Card */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl border-white/20 relative overflow-hidden">
          
          {!quizCompleted ? (
            <div className="space-y-6">
              
              {/* Question Header & Step Indicator */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <span className="text-xs font-bold text-slate-300">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <div className="flex space-x-1">
                  {quizQuestions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentQuestion
                          ? 'w-6 bg-[#FF6FB5]'
                          : idx < currentQuestion
                          ? 'w-2 bg-[#6C63FF]'
                          : 'w-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Active Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    {quizQuestions[currentQuestion].question}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quizQuestions[currentQuestion].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt.badgeCategory)}
                        className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FF6FB5] text-left transition-all flex items-center space-x-3 group"
                      >
                        <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-[#FF6FB5] text-white transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white">
                          {opt.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          ) : (
            /* Quiz Result Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="inline-flex p-4 rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#FF6FB5] text-white shadow-2xl animate-bounce">
                <Award className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Congratulations {friendName || 'Friend'} & {yourName || 'You'}!
                </p>
                <h3 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                  You Awarded: <span className="text-gradient-primary">{finalBadge}</span> 🏆
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Your friendship radiates elite energy! Keep making memories and causing chaos together.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRestart}
                  className="btn-secondary px-6 py-3 rounded-full text-xs font-bold inline-flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4 text-[#FF6FB5]" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
};
