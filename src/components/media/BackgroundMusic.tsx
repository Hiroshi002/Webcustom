'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    __bgAudio?: HTMLAudioElement;
  }
}

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!window.__bgAudio) {
      const audio = new Audio('/sounds/bg-ambient.mp3');
      audio.loop = true;
      audio.volume = 0.01;
      window.__bgAudio = audio;
    }

    audioRef.current = window.__bgAudio;

    const audio = audioRef.current;

    const removeEventListeners = () => {
      window.removeEventListener('click', attemptPlay);
      window.removeEventListener('scroll', attemptPlay);
      window.removeEventListener('keydown', attemptPlay);
      window.removeEventListener('touchstart', attemptPlay);
    };

    const attemptPlay = () => {
      if (!audio || !audio.paused) return;

      audio.muted = true;
      audio.play()
        .then(() => {
          audio.muted = false;
          removeEventListeners();
        })
        .catch(() => {});
    };

    attemptPlay();
    window.addEventListener('click', attemptPlay);
    window.addEventListener('scroll', attemptPlay);
    window.addEventListener('keydown', attemptPlay);
    window.addEventListener('touchstart', attemptPlay);

    const handleVolumeUpdate = (e: any) => {
      if (audio) {
        const { volume, isMuted } = e.detail;
        audio.muted = isMuted;
        audio.volume = volume;
      }
    };
    window.addEventListener('update-bg-music', handleVolumeUpdate);

    return () => {
      removeEventListeners();
      window.removeEventListener('update-bg-music', handleVolumeUpdate);
    };
  }, []);

  return null;
};

export default BackgroundMusic;
