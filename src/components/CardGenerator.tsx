import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Share2, Upload, Heart, RefreshCw, Palette, User } from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import type { FriendshipCardData, CardTheme } from '../types';
import { encodeCardToUrl, saveCardToLocalStorage } from '../utils/shareUtils';

interface CardGeneratorProps {
  cardData: FriendshipCardData;
  onUpdateCardData: (updated: FriendshipCardData) => void;
  onOpenShareModal: (url: string) => void;
}

export const CardGenerator: React.FC<CardGeneratorProps> = ({ cardData, onUpdateCardData, onOpenShareModal }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Scratch state inside Card
  const [isScratching, setIsScratching] = useState(false);
  const [percentScratched, setPercentScratched] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Mouse tilt variables
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only tilt if not dragging scratch foil
    if (isScratching) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeaveTilt = () => {
    setRotateX(0);
    setRotateY(0);
    setIsScratching(false);
  };

  // Canvas Scratch Initialization
  const initScratchCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 280);
    const height = (canvas.height = 110);

    // Silver metallic gradient foil
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#CBD5E1');
    grad.addColorStop(0.5, '#94A3B8');
    grad.addColorStop(1, '#64748B');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Text on top of foil
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch Foil to Reveal Secret ✨', width / 2, height / 2 + 4);

    setIsUnlocked(false);
    setPercentScratched(0);
  };

  useEffect(() => {
    initScratchCanvas();
  }, [cardData.secretMessage]);

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
    ctx.arc(x, y, 18, 0, Math.PI * 2);
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
        particleCount: 40,
        spread: 55,
        origin: { y: 0.6 }
      });
    }
  };

  const handleScratchMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleScratchMouseMove = (e: React.MouseEvent) => {
    if (isScratching) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleScratchMouseUp = () => setIsScratching(false);

  const handleScratchTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) scratch(touch.clientX, touch.clientY);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'friend' | 'your') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const updated = {
          ...cardData,
          [target === 'friend' ? 'friendPhotoUrl' : 'yourPhotoUrl']: result
        };
        onUpdateCardData(updated);
        saveCardToLocalStorage(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field: keyof FriendshipCardData, value: string) => {
    const updated = { ...cardData, [field]: value };
    onUpdateCardData(updated);
    saveCardToLocalStorage(updated);
  };

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      // Try html2canvas first with both CORS options
      const canvas = await html2canvas(cardRef.current!, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0F172A',
        logging: false,
        imageTimeout: 5000,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `FriendVerse_${(cardData.friendName || 'Friend').replace(/\s+/g, '_')}_Card.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (_err) {
      // Fallback: draw a beautiful card using Canvas 2D directly (no CORS issues)
      try {
        const W = 800;
        const H = 520;
        const cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        const ctx = cv.getContext('2d')!;

        // Background gradient
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#1e1b4b');
        bg.addColorStop(0.5, '#4c1d95');
        bg.addColorStop(1, '#0f172a');
        ctx.fillStyle = bg;
        ctx.roundRect(0, 0, W, H, 32);
        ctx.fill();

        // Pink/gold accent border
        ctx.strokeStyle = '#FF6FB5';
        ctx.lineWidth = 3;
        ctx.roundRect(6, 6, W - 12, H - 12, 28);
        ctx.stroke();

        // Badge pill
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.roundRect(W/2 - 130, 30, 260, 32, 16);
        ctx.fill();
        ctx.fillStyle = '#FFD166';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨  Happy Friendship Day 💜  ✨', W/2, 52);

        // Names
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 42px Georgia, serif';
        ctx.fillText(cardData.friendName || "Friend's Name", W/2, 150);
        ctx.fillStyle = '#FFD166';
        ctx.font = 'bold 22px Inter, sans-serif';
        ctx.fillText(`& ${cardData.yourName || 'Your Name'}`, W/2, 190);

        // Tagline pill
        const tagText = `"${cardData.tagline || 'Forever Best Friends'}"`;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.roundRect(W/2 - 200, 210, 400, 36, 18);
        ctx.fill();
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText(tagText, W/2, 233);

        // Message
        ctx.fillStyle = '#CBD5E1';
        ctx.font = 'italic 13px Georgia, serif';
        const msg = `"${cardData.message || 'Happy Friendship Day!'}"`;
        // Word wrap
        const maxW = 640;
        const words = msg.split(' ');
        let line = ''; let y = 290;
        for (const word of words) {
          const testLine = line + word + ' ';
          if (ctx.measureText(testLine).width > maxW && line) {
            ctx.fillText(line.trim(), W/2, y);
            line = word + ' '; y += 22;
          } else { line = testLine; }
        }
        if (line) ctx.fillText(line.trim(), W/2, y);

        // Secret message area
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.roundRect(W/2 - 180, y + 24, 360, 70, 14);
        ctx.fill();
        ctx.fillStyle = '#FF6FB5';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText('💌 Secret Message:', W/2, y + 48);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText(cardData.secretMessage || '', W/2, y + 72);

        // Footer
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(0, H - 44, W, 44);
        ctx.roundRect(0, H - 44, W, 44, [0, 0, 28, 28]);
        ctx.fill();
        ctx.fillStyle = '#94A3B8';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('FRIENDVERSE OFFICIAL', 32, H - 16);
        ctx.textAlign = 'right';
        ctx.fillText('AUGUST 2026', W - 32, H - 16);

        const dataUrl = cv.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `FriendVerse_${(cardData.friendName || 'Friend').replace(/\s+/g, '_')}_Card.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackErr) {
        console.error('Download failed completely:', fallbackErr);
        alert('Download failed. Please try again.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareCard = () => {
    const shareUrl = encodeCardToUrl(cardData);
    onOpenShareModal(shareUrl);
  };

  const themeGradients: Record<CardTheme, string> = {
    neon: 'from-[#6C63FF]/40 via-[#FF6FB5]/30 to-[#312E81]/60',
    sunset: 'from-orange-500/40 via-pink-500/30 to-purple-900/60',
    cosmic: 'from-blue-600/40 via-indigo-600/40 to-slate-900/80',
    gold: 'from-amber-400/30 via-yellow-600/30 to-amber-950/70',
    cyberpunk: 'from-cyan-500/40 via-[#FF6FB5]/40 to-black/80'
  };

  return (
    <section id="creator" className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-1.5 rounded-full border-white/20 text-xs font-bold text-[#FF6FB5]">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Customization</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
            Create Your Personalized <span className="text-gradient-primary">Friendship Card</span>
          </h2>
        </div>

        {/* Grid: Form on Left, Live 3D Preview with Embedded Scratch Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Controls */}
          <div className="lg:col-span-6 glass-card p-6 sm:p-8 rounded-3xl border-white/20 space-y-6">
            <h3 className="text-xl font-bold font-heading text-white flex items-center space-x-2">
              <User className="w-5 h-5 text-[#FF6FB5]" />
              <span>Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Friend's Name</label>
                <input
                  type="text"
                  value={cardData.friendName}
                  onChange={(e) => handleInputChange('friendName', e.target.value)}
                  placeholder="Names"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6FB5] transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={cardData.yourName}
                  onChange={(e) => handleInputChange('yourName', e.target.value)}
                  placeholder="Names"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6FB5] transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Friendship Tagline / Motto</label>
              <input
                type="text"
                value={cardData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                placeholder="Partners in Crime & Late Night Pizza"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6FB5] transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Personal Heartfelt Note</label>
              <textarea
                rows={3}
                value={cardData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Write your special note here..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6FB5] transition-colors text-sm resize-none"
              />
            </div>

            {/* Photo Upload Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Friend's Photo</label>
                <label className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 border border-dashed border-white/30 text-xs font-semibold text-slate-200 cursor-pointer hover:bg-white/20 transition-all">
                  <Upload className="w-4 h-4 text-[#FF6FB5]" />
                  <span>Upload Friend Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'friend')}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Photo</label>
                <label className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 border border-dashed border-white/30 text-xs font-semibold text-slate-200 cursor-pointer hover:bg-white/20 transition-all">
                  <Upload className="w-4 h-4 text-[#FFD166]" />
                  <span>Upload Your Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'your')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Palette className="w-4 h-4 text-[#FF6FB5]" />
                <span>Card Aesthetic Theme</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {(['neon', 'sunset', 'cosmic', 'gold', 'cyberpunk'] as CardTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleInputChange('themeStyle', theme)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all border ${
                      cardData.themeStyle === theme
                        ? 'bg-[#FF6FB5] border-[#FF6FB5] text-white shadow-lg'
                        : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Live 3D Tilt Card Preview with Integrated Scratch Area */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6">
            
            <div className="perspective-1000 w-full max-w-md">
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMoveTilt}
                onMouseLeave={handleMouseLeaveTilt}
                animate={{ rotateX, rotateY }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
                className={`relative rounded-3xl p-6 sm:p-8 border border-white/30 shadow-2xl overflow-hidden bg-gradient-to-br ${themeGradients[cardData.themeStyle]} backdrop-blur-2xl`}
              >
                {/* Floating Heart / Sparkle Embellishments */}
                <div className="absolute top-4 right-4 flex space-x-1 text-[#FF6FB5] animate-pulse">
                  <Heart className="w-5 h-5 fill-current" />
                  <Sparkles className="w-5 h-5 text-[#FFD166]" />
                </div>

                <div className="space-y-5 text-center">
                  
                  {/* Top Badge */}
                  <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold tracking-widest uppercase text-white shadow-md">
                    Happy Friendship Day 💜
                  </div>

                  {/* Dual Photos Avatar Display */}
                  <div className="flex items-center justify-center -space-x-4 pt-1">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-[#6C63FF] to-[#FF6FB5] shadow-xl">
                      <img
                        src={cardData.friendPhotoUrl}
                        alt={cardData.friendName || "Friend"}
                        className="w-full h-full object-cover rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 bg-[#FF6FB5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        Friend
                      </span>
                    </div>

                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-[#FF6FB5] to-[#FFD166] shadow-xl">
                      <img
                        src={cardData.yourPhotoUrl}
                        alt={cardData.yourName || "You"}
                        className="w-full h-full object-cover rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 bg-[#6C63FF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        You
                      </span>
                    </div>
                  </div>

                  {/* Friend & Your Names */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                      {cardData.friendName || "Friend's Name"}
                    </h3>
                    <p className="text-xs font-semibold text-[#FFD166] mt-1">
                      & {cardData.yourName || "Your Name"}
                    </p>
                  </div>

                  {/* Tagline */}
                  <div className="px-4 py-1.5 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-slate-200">
                    "{cardData.tagline || 'Forever Best Friends'}"
                  </div>

                  {/* Heartfelt Note */}
                  <p className="text-xs text-slate-200 font-normal leading-relaxed italic px-2">
                    "{cardData.message || 'Happy Friendship Day!'}"
                  </p>

                  {/* Integrated Scratch Card Area inside the 3D Friendship Card */}
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-[#FFD166] mb-1 flex items-center justify-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Scratch Card Secret Reveal</span>
                    </p>

                    <div className="relative w-full h-28 rounded-xl overflow-hidden border border-white/30 shadow-xl flex items-center justify-center bg-black/40 p-3 text-center">
                      {/* Hidden Secret Message Underneath */}
                      <div className="space-y-1 select-none">
                        <Heart className="w-5 h-5 text-[#FF6FB5] mx-auto animate-pulse" />
                        <p className="font-quote text-xs sm:text-sm text-white font-bold leading-snug">
                          "{cardData.secretMessage}"
                        </p>
                        <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FF6FB5]/20 text-[#FF6FB5]">
                          {isUnlocked ? 'Unlocked 🎉' : 'Keep Scratching...'}
                        </span>
                      </div>

                      {/* Canvas Scratch Foil Layer */}
                      <canvas
                        ref={canvasRef}
                        onMouseDown={handleScratchMouseDown}
                        onMouseMove={handleScratchMouseMove}
                        onMouseUp={handleScratchMouseUp}
                        onTouchMove={handleScratchTouchMove}
                        className="absolute inset-0 cursor-pointer touch-none"
                      />
                    </div>

                    <button
                      onClick={initScratchCanvas}
                      className="mt-1 text-[10px] font-semibold text-slate-300 hover:text-white flex items-center justify-center space-x-1 mx-auto"
                    >
                      <RefreshCw className="w-3 h-3 text-[#FFD166]" />
                      <span>Reset Foil ({percentScratched}% Scratched)</span>
                    </button>
                  </div>

                  {/* Card Footer Stamp */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-300 font-semibold">
                    <span>FRIENDVERSE OFFICIAL</span>
                    <span>AUGUST 2026</span>
                  </div>

                </div>
              </motion.div>
            </div>

            {/* Card Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
              <button
                onClick={handleDownloadPNG}
                disabled={isDownloading}
                className="flex-1 btn-primary py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg"
              >
                {isDownloading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isDownloading ? 'Exporting...' : 'Download Card (PNG)'}</span>
              </button>

              <button
                onClick={handleShareCard}
                className="flex-1 btn-secondary py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg"
              >
                <Share2 className="w-4 h-4 text-[#FF6FB5]" />
                <span>Share Card Link</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
