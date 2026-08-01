import { useState, useEffect } from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CardGenerator } from './components/CardGenerator';
import { QuoteSection } from './components/QuoteSection';
import { GiftBox } from './components/GiftBox';
import { Certificate } from './components/Certificate';
import { ScratchCard } from './components/ScratchCard';
import { ShareModal } from './components/ShareModal';
import { Footer } from './components/Footer';

import type { FriendshipCardData } from './types';
import { defaultCardData } from './data/initialData';
import { decodeCardFromUrl, getCardFromLocalStorage } from './utils/shareUtils';
import { guitarSynth } from './utils/audioSynth';

export function App() {
  const [cardData, setCardData] = useState<FriendshipCardData>(defaultCardData);

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareUrl, setActiveShareUrl] = useState('');
  const [isAudioActive, setIsAudioActive] = useState(true); // Default ON

  // Automatic Audio Playback on website open
  useEffect(() => {
    // Start audio automatically on page load
    guitarSynth.play();

    const forceResume = () => {
      guitarSynth.initCtx();
      guitarSynth.play();
    };

    // Auto-attempt playback immediately & on window load
    if (document.readyState === 'complete') {
      forceResume();
    } else {
      window.addEventListener('load', forceResume, { once: true });
    }

    // Secondary fallback for strict browser policies
    const events = ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll', 'mousemove'];
    events.forEach(evt => window.addEventListener(evt, forceResume, { once: true }));

    return () => {
      events.forEach(evt => window.removeEventListener(evt, forceResume));
    };
  }, []);

  // Check URL payload or LocalStorage on initial load
  useEffect(() => {
    try {
      localStorage.removeItem('friendverse_saved_card');
    } catch {}

    const urlCard = decodeCardFromUrl();
    if (urlCard) {
      setCardData(urlCard);
    } else {
      const savedCard = getCardFromLocalStorage();
      if (savedCard) {
        setCardData(savedCard);
      } else {
        setCardData(defaultCardData);
      }
    }
  }, []);

  const handleOpenShareModal = (url: string) => {
    setActiveShareUrl(url);
    setIsShareModalOpen(true);
  };

  const handleToggleAudio = () => {
    const active = guitarSynth.toggleMute();
    setIsAudioActive(active);
  };

  return (
    <div className="relative min-h-screen text-white bg-[#0F172A] selection:bg-[#FF6FB5] selection:text-white">
      {/* Background Animated Particle Canvas & Blobs */}
      <ParticleBackground />

      {/* Sticky Interactive Navbar */}
      <Navbar
        onToggleAudio={handleToggleAudio}
        isAudioActive={isAudioActive}
      />

      {/* Main Content Sections */}
      <main className="relative z-10 space-y-12">
        <Hero />
        <CardGenerator
          cardData={cardData}
          onUpdateCardData={setCardData}
          onOpenShareModal={handleOpenShareModal}
        />
        <QuoteSection />
        <GiftBox />
        <Certificate
          cardData={cardData}
          onOpenShareModal={handleOpenShareModal}
        />
        {/* Scratch Card rendered at the very end after Certificate */}
        <ScratchCard secretMessage={cardData.secretMessage} />
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={activeShareUrl || window.location.href}
        friendName={cardData.friendName}
      />

      {/* Modern Glass Footer */}
      <Footer />
    </div>
  );
}

export default App;
