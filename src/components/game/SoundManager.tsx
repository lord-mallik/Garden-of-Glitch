/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { useGameStore } from "@/store/game-store";
import { useEffect, useRef, useState } from "react";

export function SoundManager() {
  const entropy = useGameStore((state) => state.entropy);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const [started, setStarted] = useState(false);

  // Initialize Audio
  const initAudio = () => {
    if (audioContextRef.current) return;

    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
    
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.2; // Base volume (lowered)
        masterGain.connect(ctx.destination);
    
        // Filter for muffling effect
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 800;
        filter.connect(masterGain);
        filterNodeRef.current = filter;
    
        // Create a drone chord (C minor add 9)
        // C3, Eb3, G3, D4
        const freqs = [130.81, 155.56, 196.00, 293.66];
        
        freqs.forEach(freq => {
            const osc = ctx.createOscillator();
            osc.type = "sine";
            osc.frequency.value = freq;
            osc.connect(filter);
            osc.start();
            oscillatorsRef.current.push(osc);
        });
    
        setStarted(true);
    } catch (e) {
        console.error("Audio init failed", e);
    }
  };

  // Auto-start on interaction
  useEffect(() => {
      const handleInteraction = () => {
          if (!audioContextRef.current) {
              initAudio();
          }
           // Resume if suspended
           if (audioContextRef.current?.state === 'suspended') {
               audioContextRef.current.resume();
           }
      };

      // Try immediately (might work if user already interacted)
      handleInteraction();

      window.addEventListener('click', handleInteraction);
      window.addEventListener('keydown', handleInteraction);
      
      return () => {
          window.removeEventListener('click', handleInteraction);
          window.removeEventListener('keydown', handleInteraction);
      };
  }, []);

  // Effect to update audio params
  useEffect(() => {
    if (!filterNodeRef.current || oscillatorsRef.current.length === 0 || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    
    // 1. Detune Oscillators (Dissonance)
    // At 0 Entropy: 0 detune. At 1000 Entropy: +/- 100 cents (semitone) or more
    const detuneAmount = (entropy / 1000) * 1200; // Up to 1 octave shift at max!
    
    oscillatorsRef.current.forEach((osc, i) => {
       // Scramble them differently
       const factor = i % 2 === 0 ? 1 : -1;
       const noise = Math.sin(Date.now() / 1000 + i) * (entropy / 50); 
       
       // Note: setParam vs immediate value. Using immediate for simplicity in this loop
       osc.detune.setValueAtTime(noise + (detuneAmount * factor * 0.5), ctx.currentTime);
       
       // Morph waveform
       if (entropy > 800) {
           osc.type = "sawtooth";
       } else if (entropy > 400) {
           osc.type = "triangle";
       } else {
           osc.type = "sine";
       }
    });

    // 2. Open Filter (Brightness + Scream)
    // Low entropy = Muffled/Calm (Lowpass 800Hz)
    // High entropy = Screaming (Highpass or just Open)
    const cutoff = 800 + (entropy * 10); 
    filterNodeRef.current.frequency.setValueAtTime(cutoff, ctx.currentTime);
    
    // 3. Resonance (Q) peak at high entropy
    filterNodeRef.current.Q.setValueAtTime(entropy / 50, ctx.currentTime);

  }, [entropy, started]);

  // Cleanup
  useEffect(() => {
      return () => {
          oscillatorsRef.current.forEach(osc => {
              try { osc.stop(); } catch {}
          });
      };
  }, []);

  return null; // No UI needed anymore
}
