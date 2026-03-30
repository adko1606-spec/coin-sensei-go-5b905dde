import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import React from "react";

interface SoundContextType {
  enabled: boolean;
  volume: number;
  setEnabled: (v: boolean) => void;
  setVolume: (v: number) => void;
  playClick: () => void;
  playCorrect: () => void;
  playWrong: () => void;
  playWrongMild: () => void;
  playWrongSerious: () => void;
  playReward: () => void;
  playLifeLost: () => void;
  playInvest: () => void;
  playWithdraw: () => void;
  playPurchase: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

let audioCtx: AudioContext | null = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType, vol: number) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol * 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem("finap_sound");
    return saved !== "false";
  });
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem("finap_volume");
    return saved ? parseFloat(saved) : 0.5;
  });

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    localStorage.setItem("finap_volume", String(v));
  }, []);

  const setEnabledWrapped = useCallback((v: boolean) => {
    setEnabled(v);
    localStorage.setItem("finap_sound", String(v));
  }, []);

  const playClick = useCallback(() => {
    if (!enabled) return;
    playTone(800, 0.08, "sine", volume);
  }, [enabled, volume]);

  const playCorrect = useCallback(() => {
    if (!enabled) return;
    playTone(523, 0.1, "sine", volume);
    setTimeout(() => playTone(659, 0.1, "sine", volume), 100);
    setTimeout(() => playTone(784, 0.15, "sine", volume), 200);
  }, [enabled, volume]);

  const playWrong = useCallback(() => {
    if (!enabled) return;
    playTone(300, 0.15, "sawtooth", volume);
    setTimeout(() => playTone(250, 0.2, "sawtooth", volume), 150);
  }, [enabled, volume]);

  // Mild wrong sound for first 2 errors
  const playWrongMild = useCallback(() => {
    if (!enabled) return;
    playTone(350, 0.1, "sine", volume * 0.7);
    setTimeout(() => playTone(300, 0.12, "sine", volume * 0.7), 100);
  }, [enabled, volume]);

  // Serious warning sound for 3rd error
  const playWrongSerious = useCallback(() => {
    if (!enabled) return;
    playTone(200, 0.2, "sawtooth", volume);
    setTimeout(() => playTone(150, 0.25, "sawtooth", volume), 150);
    setTimeout(() => playTone(120, 0.3, "sawtooth", volume), 300);
  }, [enabled, volume]);

  const playReward = useCallback(() => {
    if (!enabled) return;
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.15, "sine", volume), i * 120));
  }, [enabled, volume]);

  const playLifeLost = useCallback(() => {
    if (!enabled) return;
    playTone(400, 0.2, "triangle", volume);
    setTimeout(() => playTone(300, 0.3, "triangle", volume), 200);
  }, [enabled, volume]);

  // Invest sound - coins going in
  const playInvest = useCallback(() => {
    if (!enabled) return;
    playTone(440, 0.08, "sine", volume);
    setTimeout(() => playTone(550, 0.08, "sine", volume), 80);
    setTimeout(() => playTone(660, 0.12, "sine", volume), 160);
  }, [enabled, volume]);

  // Withdraw sound - coins coming out
  const playWithdraw = useCallback(() => {
    if (!enabled) return;
    playTone(660, 0.08, "sine", volume);
    setTimeout(() => playTone(550, 0.08, "sine", volume), 80);
    setTimeout(() => playTone(440, 0.12, "sine", volume), 160);
  }, [enabled, volume]);

  // Purchase sound - coin clink
  const playPurchase = useCallback(() => {
    if (!enabled) return;
    playTone(1200, 0.06, "sine", volume);
    setTimeout(() => playTone(1500, 0.06, "sine", volume), 60);
    setTimeout(() => playTone(1800, 0.1, "sine", volume), 120);
  }, [enabled, volume]);

  return React.createElement(SoundContext.Provider, {
    value: {
      enabled, volume, setEnabled: setEnabledWrapped, setVolume,
      playClick, playCorrect, playWrong, playWrongMild, playWrongSerious,
      playReward, playLifeLost, playInvest, playWithdraw, playPurchase,
    },
  }, children);
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) return {
    enabled: false, volume: 0.5, setEnabled: () => {}, setVolume: () => {},
    playClick: () => {}, playCorrect: () => {}, playWrong: () => {},
    playWrongMild: () => {}, playWrongSerious: () => {},
    playReward: () => {}, playLifeLost: () => {},
    playInvest: () => {}, playWithdraw: () => {}, playPurchase: () => {},
  };
  return ctx;
}
