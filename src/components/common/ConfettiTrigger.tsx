'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiTrigger() {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#14b8a6', '#0c4a4e', '#facc15'],
    });
  }, []);

  return null;
}

