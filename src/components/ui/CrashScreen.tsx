"use client";

import { useGameStore } from "@/store/game-store";
import { useEffect, useState } from "react";

export function CrashScreen() {
  const entropy = useGameStore((state) => state.entropy);
  const maxEntropy = useGameStore((state) => state.maxEntropy);
  const resetEntropy = useGameStore((state) => state.resetEntropy);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (entropy >= maxEntropy) {
      setShow(true);
      const timer = setTimeout(() => {
        resetEntropy(); // Reboot system
        setShow(false);
        // We might want to reload the page or just reset physics, but global store reset is a start
         window.location.reload(); // Hard reset for maximum effect
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [entropy, maxEntropy, resetEntropy]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-[100] bg-blue-700 text-white font-mono flex flex-col items-center justify-center p-10 cursor-none">
      <div className="max-w-3xl">
        <h1 className="text-9xl mb-8">:(</h1>
        <h2 className="text-3xl mb-8">Your system ran into a problem and needs to restart.</h2>
        <p className="text-xl mb-4">
          SYSTEM_THREAD_EXCEPTION_NOT_HANDLED (ENTROPY_OVERFLOW)
        </p>
        <p className="text-lg opacity-70">
           Collecting error info... 100% complete.
        </p>
      </div>
    </div>
  );
}
