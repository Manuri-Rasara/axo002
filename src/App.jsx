import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Volume2, VolumeX } from 'lucide-react';
import { HeadacheBlob } from './components/HeadacheBlob';
import { BanishButton } from './components/BanishButton';
import { ComboBadge } from './components/ComboBadge';
import { useSound } from './hooks/useSound';

const EMOJIS = ['😵‍💫', '🤕', '✨', '💥', '💨', '🌈'];

export default function App() {
  const [count, setCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentBlobEmoji, setCurrentBlobEmoji] = useState('🤕');
  
  const blobRef = useRef(null);
  const containerRef = useRef(null);
  const comboRef = useRef(null);
  const comboTimer = useRef(null);
  
  const { playPip, playWhoosh, playSparkle, initAudio } = useSound(isMuted);
const messages = [
  "ඔලුව කැක්කුම දුරු වේවා! ඒස්වා පුහ්!💀",
  "Get Lost ඔලුව කැක්කුම from Navoda Rajapaksha!😈",
];
  const spawnPopup = () => {
    const popup = document.createElement('div');
    popup.className = 'popup-message';
    const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
   popup.innerText =`${messages[Math.floor(Math.random() * messages.length)]} ${randomEmoji}`;
    
    containerRef.current.appendChild(popup);

    const rect = containerRef.current.getBoundingClientRect();
    const x = (Math.random() - 0.5) * 60; // ±30px
    const rotation = (Math.random() - 0.5) * 20; // ±10°
    
    gsap.set(popup, {
      x: x,
      y: 50,
      rotation: rotation,
      left: '50%',
      top: '40%',
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      scale: 0.5
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.to(popup, {
      y: -150,
      opacity: 1,
      scale: 1,
      duration: prefersReducedMotion ? 0.8 : 1.2,
      ease: "back.out(1.7)",
      onComplete: () => {
        gsap.to(popup, {
          opacity: 0,
          y: -200,
          duration: 0.5,
          delay: 0.5,
          onComplete: () => popup.remove()
        });
      }
    });
  };

  const handleBanish = () => {
    initAudio();
    setCount(prev => prev + 1);
    
    // Combo logic
    setCombo(prev => prev + 1);
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => {
      setCombo(0);
      gsap.to(comboRef.current, { opacity: 0, scale: 0.5, duration: 0.3 });
    }, 2000);

    // Sound effects
    playPip();
    if (combo > 5) playSparkle();
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Blob animation
    const tl = gsap.timeline();
    tl.to(blobRef.current, {
      x: prefersReducedMotion ? 0 : "random(-20, 20)",
      duration: 0.1,
      repeat: 3,
      yoyo: true
    })
    .to(blobRef.current, {
      y: -200,
      opacity: 0,
      scale: 1.5,
      rotation: prefersReducedMotion ? 0 : "random(-45, 45)",
      duration: prefersReducedMotion ? 0.3 : 0.5,
      ease: "power2.in",
      onStart: () => playWhoosh()
    })
    .set(blobRef.current, { 
      y: 0, 
      opacity: 0, 
      scale: 0,
      rotation: 0 
    })
    .to(blobRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.7)",
      delay: 0.2,
      onStart: () => setCurrentBlobEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)])
    });

    // Combo badge animation
    if (combo + 1 >= 2) {
      gsap.fromTo(comboRef.current, 
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    }

    spawnPopup();
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleBanish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [combo]);

  return (
    <div className="game-container" ref={containerRef}>
      <ComboBadge combo={combo} ref={comboRef} />
      
      <h1>NO HEADACHE!</h1>
      <p className="hint-text">Tap the button to shoo away the headache!</p>
      
      <div className="counter-container">
        <span className="counter-label">Headaches Banished</span>
        <span className="counter-value">{count}</span>
      </div>

      <HeadacheBlob ref={blobRef} emoji={currentBlobEmoji} />
      
      <BanishButton onClick={handleBanish} />
      
      <button 
        className="mute-toggle" 
        onClick={() => setIsMuted(!isMuted)}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
    </div>
  );
}
