import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  friendName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl, friendName }) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current && shareUrl) {
      QRCode.toCanvas(canvasRef.current, shareUrl, {
        width: 160,
        margin: 2,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF'
        }
      }, (err) => {
        if (err) console.error("QR Code generation error", err);
      });
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(shareUrl);
  const shareText = encodeURIComponent(`Hey ${friendName || 'friend'}, I made a special Friendship Day gift for you on FriendVerse! 💜 Check it out here:`);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="glass-card p-6 sm:p-8 rounded-3xl max-w-lg w-full text-center space-y-6 relative border-white/30"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex p-3 rounded-full bg-[#FF6FB5]/20 text-[#FF6FB5]">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold font-heading text-white">
              Share Personalized Experience
            </h3>
            <p className="text-xs text-slate-300">
              Send this unique link or let your friend scan the QR code!
            </p>
          </div>

          {/* Copy Input Bar */}
          <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-2xl border border-white/20">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-xs text-slate-200 px-3 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Social Quick Share Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <span>WhatsApp</span>
            </a>

            <a
              href={`https://t.me/share/url?url=${encodedUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 text-sky-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Telegram</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <span>X (Twitter)</span>
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Facebook</span>
            </a>
          </div>

          {/* QR Code Canvas Display */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <p className="text-[11px] font-semibold text-slate-300 flex items-center justify-center space-x-1">
              <QrCode className="w-3.5 h-3.5 text-[#FFD166]" />
              <span>Scan QR Code on Mobile Camera:</span>
            </p>
            <div className="inline-block p-3 rounded-2xl bg-white shadow-xl">
              <canvas ref={canvasRef} />
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
