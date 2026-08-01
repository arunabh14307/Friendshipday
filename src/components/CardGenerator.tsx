import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Share2, Upload, Heart, RefreshCw, Palette, User } from 'lucide-react';
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

    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch Foil to Reveal Secret ✨', width / 2, height / 2 + 4);

    setIsUnlocked(false);
    setPercentScratched(0);
  };

  useEffect(() => {
    initScratchCanvas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scratch logic
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
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Estimate scratched %
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 128) transparent++;
    }
    const pct = Math.round((transparent / (canvas.width * canvas.height)) * 100);
    setPercentScratched(pct);
    if (pct > 55 && !isUnlocked) {
      setIsUnlocked(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#FF6FB5', '#FFD166', '#6C63FF'] });
    }
  };

  const handleScratchMouseDown = () => setIsScratching(true);
  const handleScratchMouseUp = () => setIsScratching(false);
  const handleScratchMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };
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

  // ── Canvas download helpers ────────────────────────────────────────────────

  const loadImg = (src: string): Promise<HTMLImageElement | null> =>
    new Promise((resolve) => {
      if (!src) { resolve(null); return; }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Retry without CORS (works for base64 data: URLs)
        const img2 = new Image();
        img2.onload = () => resolve(img2);
        img2.onerror = () => resolve(null);
        img2.src = src;
      };
      img.src = src;
    });

  const rrect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const drawCirclePhoto = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement | null,
    cx: number, cy: number, r: number,
    fallbackColor: string
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    if (img) {
      // Cover crop: take the largest centered square from the image
      const size = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - size) / 2;
      const sy = (img.naturalHeight - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, cx - r, cy - r, r * 2, r * 2);
    } else {
      ctx.fillStyle = fallbackColor;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = `${r * 0.8}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👤', cx, cy);
      ctx.textBaseline = 'alphabetic';
    }
    ctx.restore();
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    cx: number,
    startY: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const words = text.split(' ');
    let line = '';
    let y = startY;
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line.trim(), cx, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = test;
      }
    }
    if (line.trim()) ctx.fillText(line.trim(), cx, y);
    return y;
  };

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      const [friendImg, yourImg] = await Promise.all([
        loadImg(cardData.friendPhotoUrl),
        loadImg(cardData.yourPhotoUrl),
      ]);

      const W = 540;
      const SCALE = 2;

      // ── First pass: measure content height dynamically ──
      const measureCanvas = document.createElement('canvas');
      measureCanvas.width = W;
      measureCanvas.height = 1;
      const mctx = measureCanvas.getContext('2d')!;

      // Simulate message wrap to find height
      mctx.font = 'italic 13px Georgia, serif';
      const msgText = `"${cardData.message || 'Happy Friendship Day!'}"`;
      const msgWords = msgText.split(' ');
      let mLine = ''; let mLines = 1;
      for (const w of msgWords) {
        const t = mLine + w + ' ';
        if (mctx.measureText(t).width > W - 80 && mLine) { mLine = w + ' '; mLines++; } else { mLine = t; }
      }

      mctx.font = 'bold 13px Inter, Arial, sans-serif';
      const secText = cardData.secretMessage || '';
      const secWords = secText.split(' ');
      let sLine = ''; let sLines = 1;
      for (const w of secWords) {
        const t = sLine + w + ' ';
        if (mctx.measureText(t).width > W - 120 && sLine) { sLine = w + ' '; sLines++; } else { sLine = t; }
      }

      // Layout constants
      const TOP_PAD = 24;
      const PILL_H = 32;
      const PHOTO_GAP = 18;
      const PHOTO_R = 62;
      const PHOTO_BLOCK = PHOTO_R * 2 + 28; // photo + labels
      const NAMES_BLOCK = 72;
      const TAGLINE_BLOCK = 46;
      const MSG_BLOCK = 28 + mLines * 22;
      const BADGE_BLOCK = 56;
      const DIVIDER_BLOCK = 36;
      const SECRET_BOX_H = 54 + sLines * 20;
      const SECRET_BLOCK = SECRET_BOX_H + 24;
      const CERT_BLOCK = 70;
      const FOOTER_H = 54;

      const H = TOP_PAD + PILL_H + PHOTO_GAP + PHOTO_BLOCK + NAMES_BLOCK +
                TAGLINE_BLOCK + MSG_BLOCK + BADGE_BLOCK + DIVIDER_BLOCK +
                SECRET_BLOCK + CERT_BLOCK + FOOTER_H + 16;

      // ── Create real canvas ──
      const cv = document.createElement('canvas');
      cv.width = W * SCALE;
      cv.height = H * SCALE;
      const ctx = cv.getContext('2d')!;
      ctx.scale(SCALE, SCALE);

      // ── 1. Rich gradient background ──
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#130d3a');
      bg.addColorStop(0.35, '#1e0f5e');
      bg.addColorStop(0.7, '#2a1260');
      bg.addColorStop(1, '#0c0820');
      ctx.fillStyle = bg;
      rrect(ctx, 0, 0, W, H, 28);
      ctx.fill();

      // Subtle dot grid pattern
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let gx = 18; gx < W; gx += 22) {
        for (let gy = 18; gy < H; gy += 22) {
          ctx.beginPath(); ctx.arc(gx, gy, 1, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Corner radial glows
      const glowTL = ctx.createRadialGradient(0, 0, 5, 0, 0, 200);
      glowTL.addColorStop(0, 'rgba(108,99,255,0.28)'); glowTL.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowTL; ctx.fillRect(0, 0, W, H);

      const glowBR = ctx.createRadialGradient(W, H, 5, W, H, 220);
      glowBR.addColorStop(0, 'rgba(255,111,181,0.22)'); glowBR.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowBR; ctx.fillRect(0, 0, W, H);

      // ── 2. Gradient border (outer + inner) ──
      const borderGrad = ctx.createLinearGradient(0, 0, W, H);
      borderGrad.addColorStop(0, '#6C63FF');
      borderGrad.addColorStop(0.5, '#FF6FB5');
      borderGrad.addColorStop(1, '#FFD166');
      ctx.strokeStyle = borderGrad; ctx.lineWidth = 2.5;
      rrect(ctx, 3, 3, W - 6, H - 6, 27); ctx.stroke();

      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
      rrect(ctx, 8, 8, W - 16, H - 16, 23); ctx.stroke();

      // ── 3. Scattered sparkle decorations ──
      const sparks = [
        [28, 55, 8, '#FFD166'], [W - 28, 55, 6, '#FF6FB5'],
        [18, H * 0.4, 5, '#6C63FF'], [W - 18, H * 0.38, 4, '#FFD166'],
        [38, H * 0.72, 6, '#FF6FB5'], [W - 40, H * 0.68, 5, '#6C63FF'],
        [W / 2 - 100, 76, 4, '#FFD166'], [W / 2 + 100, 76, 4, '#FF6FB5'],
      ] as const;
      for (const [sx, sy, sr, sc] of sparks) {
        ctx.fillStyle = sc as string;
        ctx.beginPath(); ctx.arc(sx as number, sy as number, sr as number, 0, Math.PI * 2); ctx.fill();
        // 4-point star
        ctx.beginPath();
        ctx.moveTo(sx as number, (sy as number) - (sr as number) * 1.8);
        ctx.lineTo(sx as number, (sy as number) + (sr as number) * 1.8);
        ctx.moveTo((sx as number) - (sr as number) * 1.8, sy as number);
        ctx.lineTo((sx as number) + (sr as number) * 1.8, sy as number);
        ctx.strokeStyle = sc as string; ctx.lineWidth = 1; ctx.stroke();
      }

      let curY = TOP_PAD;

      // ── 4. HAPPY FRIENDSHIP DAY pill ──
      const pillW = 240;
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      rrect(ctx, W / 2 - pillW / 2, curY, pillW, PILL_H, 16); ctx.fill();
      const pillBorder = ctx.createLinearGradient(W / 2 - pillW / 2, 0, W / 2 + pillW / 2, 0);
      pillBorder.addColorStop(0, 'rgba(108,99,255,0.6)');
      pillBorder.addColorStop(1, 'rgba(255,111,181,0.6)');
      ctx.strokeStyle = pillBorder; ctx.lineWidth = 1;
      rrect(ctx, W / 2 - pillW / 2, curY, pillW, PILL_H, 16); ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11.5px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨  HAPPY FRIENDSHIP DAY  💜  ✨', W / 2, curY + 21);
      curY += PILL_H + PHOTO_GAP;

      // ── 5. Overlapping circular photos ──
      const photoR = PHOTO_R;
      const friendCX = W / 2 - 40;
      const yourCX = W / 2 + 40;
      const photoCY = curY + photoR;

      // You ring
      const ringY = ctx.createLinearGradient(yourCX - photoR, photoCY - photoR, yourCX + photoR, photoCY + photoR);
      ringY.addColorStop(0, '#FF6FB5'); ringY.addColorStop(1, '#FFD166');
      ctx.strokeStyle = ringY; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(yourCX, photoCY, photoR + 4, 0, Math.PI * 2); ctx.stroke();
      drawCirclePhoto(ctx, yourImg, yourCX, photoCY, photoR, '#c2185b');

      // Dark separator + Friend ring
      ctx.strokeStyle = '#130d3a'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(friendCX, photoCY, photoR + 5, 0, Math.PI * 2); ctx.stroke();
      const ringF = ctx.createLinearGradient(friendCX - photoR, photoCY - photoR, friendCX + photoR, photoCY + photoR);
      ringF.addColorStop(0, '#6C63FF'); ringF.addColorStop(1, '#FF6FB5');
      ctx.strokeStyle = ringF; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(friendCX, photoCY, photoR + 3, 0, Math.PI * 2); ctx.stroke();
      drawCirclePhoto(ctx, friendImg, friendCX, photoCY, photoR, '#4527a0');

      // Badges under photos
      const badgeLabelY = photoCY + photoR + 6;
      const drawBadge = (bx: number, label: string, color: string) => {
        const bw = 52, bh = 18;
        ctx.fillStyle = color;
        rrect(ctx, bx - bw / 2, badgeLabelY, bw, bh, 9); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9.5px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, bx, badgeLabelY + 12.5);
      };
      drawBadge(friendCX, 'Friend', '#FF6FB5');
      drawBadge(yourCX, 'You', '#6C63FF');
      curY += PHOTO_BLOCK;

      // ── 6. Names ──
      ctx.textAlign = 'center';
      // Friend name with text shadow effect (draw twice offset)
      ctx.fillStyle = 'rgba(108,99,255,0.4)';
      ctx.font = 'bold 40px Georgia, serif';
      ctx.fillText(cardData.friendName || "Friend's Name", W / 2 + 2, curY + 42);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(cardData.friendName || "Friend's Name", W / 2, curY + 40);

      ctx.fillStyle = '#FFD166';
      ctx.font = 'bold 16px Inter, Arial, sans-serif';
      ctx.fillText(`& ${cardData.yourName || 'Your Name'}`, W / 2, curY + 66);
      curY += NAMES_BLOCK;

      // ── 7. Tagline pill ──
      const tagText = `"${cardData.tagline || 'Forever Best Friends'}"`;
      ctx.font = 'bold 12px Inter, Arial, sans-serif';
      const tagW = Math.min(ctx.measureText(tagText).width + 50, W - 60);
      const tagGrad = ctx.createLinearGradient(W / 2 - tagW / 2, 0, W / 2 + tagW / 2, 0);
      tagGrad.addColorStop(0, 'rgba(108,99,255,0.25)');
      tagGrad.addColorStop(1, 'rgba(255,111,181,0.25)');
      ctx.fillStyle = tagGrad;
      rrect(ctx, W / 2 - tagW / 2, curY, tagW, 34, 17); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
      rrect(ctx, W / 2 - tagW / 2, curY, tagW, 34, 17); ctx.stroke();
      ctx.fillStyle = '#E2E8F0';
      ctx.textAlign = 'center';
      ctx.fillText(tagText, W / 2, curY + 22);
      curY += TAGLINE_BLOCK;

      // ── 8. Heartfelt message ──
      ctx.fillStyle = '#C7D2FE';
      ctx.font = 'italic 13px Georgia, serif';
      ctx.textAlign = 'center';
      const fullMsg = `"${cardData.message || 'Happy Friendship Day!'}"`;
      curY += 10;
      const lastMsgY = wrapText(ctx, fullMsg, W / 2, curY, W - 80, 22);
      curY = lastMsgY + 18;

      // ── 9. Badge row — fills space between sections ──
      const badges = ['💫 BFFs Forever', '🌙 Late Night Crew', '🎉 Party Squad'];
      const bColW = (W - 60) / 3;
      badges.forEach((badge, i) => {
        const bx = 30 + i * (bColW + 0) + bColW / 2;
        const bColors = ['rgba(108,99,255,0.3)', 'rgba(255,111,181,0.3)', 'rgba(255,209,102,0.3)'];
        const bBorders = ['rgba(108,99,255,0.7)', 'rgba(255,111,181,0.7)', 'rgba(255,209,102,0.7)'];
        ctx.fillStyle = bColors[i];
        rrect(ctx, 30 + i * (bColW + 0), curY, bColW - 4, 36, 10); ctx.fill();
        ctx.strokeStyle = bBorders[i]; ctx.lineWidth = 1;
        rrect(ctx, 30 + i * (bColW + 0), curY, bColW - 4, 36, 10); ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10.5px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(badge, bx - 2, curY + 22);
      });
      curY += BADGE_BLOCK;

      // ── 10. Decorative star divider ──
      const divMid = curY - 8;
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(36, divMid); ctx.lineTo(W / 2 - 28, divMid); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W / 2 + 28, divMid); ctx.lineTo(W - 36, divMid); ctx.stroke();
      ctx.fillStyle = '#FFD166';
      ctx.font = '16px serif'; ctx.textAlign = 'center';
      ctx.fillText('✦', W / 2, divMid + 5);
      ctx.font = '10px serif';
      ctx.fillText('✦', W / 2 - 18, divMid + 4);
      ctx.fillText('✦', W / 2 + 18, divMid + 4);
      curY = divMid + DIVIDER_BLOCK - 20;

      // ── 11. Secret message box ──
      const secBoxH = SECRET_BOX_H;
      const secBoxGrad = ctx.createLinearGradient(36, curY, W - 36, curY + secBoxH);
      secBoxGrad.addColorStop(0, 'rgba(15,10,50,0.9)');
      secBoxGrad.addColorStop(1, 'rgba(30,15,80,0.85)');
      ctx.fillStyle = secBoxGrad;
      rrect(ctx, 36, curY, W - 72, secBoxH, 16); ctx.fill();
      // Glow border on secret box
      const secBorder = ctx.createLinearGradient(36, curY, W - 36, curY + secBoxH);
      secBorder.addColorStop(0, 'rgba(255,111,181,0.5)');
      secBorder.addColorStop(1, 'rgba(108,99,255,0.5)');
      ctx.strokeStyle = secBorder; ctx.lineWidth = 1.5;
      rrect(ctx, 36, curY, W - 72, secBoxH, 16); ctx.stroke();

      // ♥ + label
      ctx.font = '15px serif'; ctx.fillStyle = '#FF6FB5'; ctx.textAlign = 'center';
      ctx.fillText('♥', W / 2, curY + 22);
      ctx.font = 'bold 9px Inter, Arial, sans-serif'; ctx.fillStyle = '#94A3B8';
      ctx.fillText('SECRET MESSAGE', W / 2, curY + 38);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13.5px Inter, Arial, sans-serif';
      const secStartY = curY + 56;
      wrapText(ctx, cardData.secretMessage || '', W / 2, secStartY, W - 110, 20);
      curY += secBoxH + 24;

      // ── 12. Gold certification stamp ──
      // Outer ring
      ctx.strokeStyle = 'rgba(255,209,102,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(W / 2, curY + 24, 30, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,209,102,0.15)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(W / 2, curY + 24, 26, 0, Math.PI * 2); ctx.stroke();

      // Star
      ctx.fillStyle = '#FFD166';
      ctx.font = '26px serif'; ctx.textAlign = 'center';
      ctx.fillText('★', W / 2, curY + 31);

      // "GOLD STANDARD FRIENDSHIP" text
      ctx.font = 'bold 9px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FFD166';
      ctx.fillText('GOLD STANDARD FRIENDSHIP', W / 2, curY + 56);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '8.5px Inter, Arial, sans-serif';
      ctx.fillText('CERTIFIED ✦ AUGUST 2026', W / 2, curY + 69);
      curY += CERT_BLOCK;

      // ── 13. Gradient footer ──
      const footerGrad = ctx.createLinearGradient(0, curY, W, curY + FOOTER_H);
      footerGrad.addColorStop(0, 'rgba(108,99,255,0.18)');
      footerGrad.addColorStop(1, 'rgba(255,111,181,0.18)');
      ctx.fillStyle = footerGrad;
      rrect(ctx, 0, curY, W, FOOTER_H + 28, 28); ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, curY); ctx.lineTo(W, curY); ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px Inter, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('FRIENDVERSE OFFICIAL', 32, curY + 32);
      ctx.textAlign = 'right';
      ctx.fillText('friendshipday-blsx.onrender.com', W - 32, curY + 32);

      // ── Download ──
      const dataUrl = cv.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `FriendVerse_${(cardData.friendName || 'Friend').replace(/\s+/g, '_')}_Card.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
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
