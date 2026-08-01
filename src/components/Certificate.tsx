import React, { useRef, useState } from 'react';
import { Award, Download, Printer, Share2, Sparkles, Crown, Zap, UtensilsCrossed, Gamepad2, HeartHandshake, MoonStar, Laugh, Clock, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import type { FriendshipCardData } from '../types';
import { badgesList } from '../data/initialData';

interface CertificateProps {
  cardData: FriendshipCardData;
  onOpenShareModal: (url: string) => void;
}

export const Certificate: React.FC<CertificateProps> = ({ cardData, onOpenShareModal }) => {
  const certRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<string[]>(['b1', 'b2', 'b5']); // Default selected badges

  const handleToggleBadge = (id: string) => {
    if (selectedBadgeIds.includes(id)) {
      if (selectedBadgeIds.length > 1) {
        setSelectedBadgeIds(selectedBadgeIds.filter((bId) => bId !== id));
      }
    } else {
      if (selectedBadgeIds.length < 4) {
        setSelectedBadgeIds([...selectedBadgeIds, id]);
      }
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown': return <Crown className="w-5 h-5 text-amber-300 shrink-0" />;
      case 'Zap': return <Zap className="w-5 h-5 text-purple-300 shrink-0" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 text-pink-300 shrink-0" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-cyan-300 shrink-0" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-rose-300 shrink-0" />;
      case 'MoonStar': return <MoonStar className="w-5 h-5 text-indigo-300 shrink-0" />;
      case 'Laugh': return <Laugh className="w-5 h-5 text-emerald-300 shrink-0" />;
      case 'Clock': return <Clock className="w-5 h-5 text-orange-300 shrink-0" />;
      default: return <Award className="w-5 h-5 text-yellow-300 shrink-0" />;
    }
  };

  const handleDownloadPNG = async () => {
    setIsExporting(true);
    try {
      if (!certRef.current) throw new Error('No ref');
      const canvas = await html2canvas(certRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0F172A',
        logging: false,
        imageTimeout: 5000,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Official_Friendship_Certificate_${(cardData.friendName || 'Friend').replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (_err) {
      // Fallback: Canvas 2D drawn certificate (no CORS issues)
      try {
        const W = 900; const H = 640;
        const cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        const ctx = cv.getContext('2d')!;

        // Background
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#0f172a'); bg.addColorStop(0.5, '#1e1b4b'); bg.addColorStop(1, '#0f172a');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        // Outer border
        ctx.strokeStyle = '#FFD166'; ctx.lineWidth = 4;
        ctx.roundRect(12, 12, W - 24, H - 24, 28); ctx.stroke();
        // Inner border
        ctx.strokeStyle = 'rgba(255,209,102,0.35)'; ctx.lineWidth = 1.5;
        ctx.roundRect(24, 24, W - 48, H - 48, 22); ctx.stroke();

        // Title area
        ctx.fillStyle = '#FFD166';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✦  OFFICIAL DIGITAL FRIENDSHIP CERTIFICATE  ✦', W/2, 70);

        // Award icon placeholder
        ctx.fillStyle = 'rgba(255,209,102,0.15)';
        ctx.beginPath(); ctx.arc(W/2, 140, 36, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFD166';
        ctx.font = 'bold 36px serif';
        ctx.fillText('🏆', W/2 - 18, 158);

        // Headline
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 48px Georgia, serif';
        ctx.fillText('Certificate of', W/2, 225);
        const grad = ctx.createLinearGradient(W/2 - 200, 0, W/2 + 200, 0);
        grad.addColorStop(0, '#FF6FB5'); grad.addColorStop(1, '#FFD166');
        ctx.fillStyle = grad;
        ctx.font = 'bold 52px Georgia, serif';
        ctx.fillText('Best Friendship', W/2, 285);

        // Body text
        ctx.fillStyle = '#94A3B8';
        ctx.font = '15px Inter, sans-serif';
        ctx.fillText('This is to certify that the extraordinary bond shared by', W/2, 340);

        // Names
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 34px Georgia, serif';
        ctx.fillText(`${cardData.friendName || 'Friend'} & ${cardData.yourName || 'You'}`, W/2, 390);

        // Tagline
        ctx.fillStyle = '#FFD166';
        ctx.font = 'italic 16px Georgia, serif';
        ctx.fillText(`"${cardData.tagline || 'Forever Best Friends'}"`, W/2, 430);

        // Description line
        ctx.fillStyle = '#94A3B8';
        ctx.font = '13px Inter, sans-serif';
        ctx.fillText('is hereby officially certified as Gold Standard Friendship — built on trust, loyalty, and unforgettable memories.', W/2, 465);

        // Divider
        ctx.strokeStyle = 'rgba(255,209,102,0.3)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(100, 500); ctx.lineTo(W - 100, 500); ctx.stroke();

        // Footer
        ctx.fillStyle = '#64748B';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('FRIENDVERSE OFFICIAL REGISTRY', 80, 535);
        ctx.textAlign = 'right';
        ctx.fillText('ISSUED: AUGUST 2026', W - 80, 535);
        ctx.textAlign = 'center';
        ctx.fillText('🌟 Gold Standard Friendship 🌟', W/2, 580);

        const dataUrl = cv.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Official_Friendship_Certificate_${(cardData.friendName || 'Friend').replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackErr) {
        console.error('Certificate download failed:', fallbackErr);
        alert('Download failed. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const activeBadges = badgesList.filter((b) => selectedBadgeIds.includes(b.id));

  return (
    <section id="certificate" className="py-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-1.5 rounded-full border-white/20 text-xs font-bold text-[#FFD166]">
            <Award className="w-4 h-4" />
            <span>Official Recognition & Medals</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
            Digital <span className="text-gradient-gold">Friendship Certificate & Badges</span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Customize awarded honor medals and print your official certificate certifying an unbreakable lifetime bond.
          </p>
        </div>

        {/* Badge Selector Bar */}
        <div className="glass-card p-6 rounded-3xl border-white/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-heading text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#FFD166]" />
              <span>Select Honor Badges to Stamp on Certificate (1 to 4):</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-300">
              {selectedBadgeIds.length} / 4 Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {badgesList.map((badge) => {
              const isSelected = selectedBadgeIds.includes(badge.id);
              return (
                <button
                  key={badge.id}
                  onClick={() => handleToggleBadge(badge.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-400 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="p-2 rounded-xl bg-[#0F172A] border border-white/15">
                      {getBadgeIcon(badge.icon)}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white font-heading">{badge.title}</p>
                    <p className="text-[11px] text-slate-300 leading-snug mt-1">{badge.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Printable Luxury Certificate Frame */}
        <div className="flex justify-center">
          <div
            id="printable-certificate"
            ref={certRef}
            className="w-full max-w-3xl rounded-3xl p-8 sm:p-12 border-4 border-amber-400/70 shadow-[0_0_60px_rgba(251,191,36,0.35)] bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-center space-y-8 relative overflow-hidden"
          >
            {/* Corner Filigree Borders */}
            <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-400/80" />
            <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-400/80" />
            <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-400/80" />
            <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-400/80" />

            {/* Header Emblem */}
            <div className="inline-flex p-3 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 text-slate-950 shadow-2xl animate-pulse">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">
                Official International Registry of Friendship
              </span>
              <h3 className="text-3xl sm:text-5xl font-extrabold font-heading text-gradient-gold">
                Certificate of Best Friendship
              </h3>
              <p className="text-xs text-slate-300 font-medium pt-1">
                THIS CERTIFICATE PROUDLY CONFORMS THAT
              </p>
            </div>

            {/* Recipients Names */}
            <div className="py-4 border-y border-amber-400/30 max-w-xl mx-auto space-y-2">
              <p className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-wide">
                {cardData.friendName || "Friend's Name"}
              </p>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-widest">
                Is Officially Declared Best Friend & Soulmate To
              </p>
              <p className="text-xl sm:text-2xl font-bold text-slate-200">
                {cardData.yourName || "Your Name"}
              </p>
            </div>

            {/* Stamped Awarded Friendship Badges Section with Visible Paragraph Descriptions */}
            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-bold tracking-widest uppercase text-amber-400">
                Awarded Friendship Honor Medals:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {activeBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-3.5 rounded-2xl bg-white/10 border border-amber-400/40 backdrop-blur-md flex items-start space-x-3 shadow-lg"
                  >
                    <div className="p-2 rounded-xl bg-[#0F172A] border border-amber-400/30 mt-0.5">
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white font-heading">{badge.title}</h4>
                      <p className="text-[11px] text-slate-200 font-normal leading-relaxed mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Citation Note */}
            <p className="text-xs sm:text-sm text-slate-300 italic max-w-lg mx-auto leading-relaxed pt-2">
              "For endless laughter, unconditional loyalty, late-night deep talks, and standing together through every season of life."
            </p>

            {/* Footer Signatures & Golden Seal */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 text-xs text-slate-300">
              <div className="text-left space-y-1">
                <p className="font-quote text-lg text-amber-400">{cardData.yourName}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 border-t border-white/20 pt-1">Authorized Signature</p>
              </div>

              {/* Golden Seal Badge */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-500 to-amber-600 p-0.5 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full bg-[#0F172A] rounded-full flex flex-col items-center justify-center p-1 text-[9px] font-bold text-amber-400 text-center">
                  <Sparkles className="w-4 h-4 mb-0.5 text-amber-300" />
                  <span>SEAL OF</span>
                  <span>LOYALTY</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className="font-number text-amber-400 font-bold">AUG 02, 2026</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 border-t border-white/20 pt-1">Date Issued</p>
              </div>
            </div>

          </div>
        </div>

        {/* Certificate Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleDownloadPNG}
            disabled={isExporting}
            className="btn-primary py-3 px-6 rounded-full text-xs font-bold flex items-center space-x-2 shadow-xl"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Download Certificate (PNG)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-secondary py-3 px-6 rounded-full text-xs font-bold flex items-center space-x-2 shadow-xl"
          >
            <Printer className="w-4 h-4 text-[#FFD166]" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={() => onOpenShareModal(window.location.href)}
            className="btn-secondary py-3 px-6 rounded-full text-xs font-bold flex items-center space-x-2 shadow-xl"
          >
            <Share2 className="w-4 h-4 text-[#FF6FB5]" />
            <span>Share Certificate</span>
          </button>
        </div>

      </div>
    </section>
  );
};
