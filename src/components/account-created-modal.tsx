"use client";

import { useEffect } from "react";
import { Button } from "./ui";

export function AccountCreatedModal({
  notice,
  onContinue,
}: {
  notice: string;
  onContinue: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onContinue, 2400);
    return () => window.clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl border border-smg/30 bg-[#0c0c12] p-6 text-center shadow-[0_24px_80px_rgba(255,106,0,0.28)]">
        <SuccessBadge />
        <h2 className="mt-4 font-display text-2xl font-semibold">Account created</h2>
        <p className="mt-2 text-sm text-white/55">{notice}</p>
        <Button type="button" className="mt-5 w-full" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function SuccessBadge() {
  return (
    <svg viewBox="0 0 220 160" className="mx-auto h-36 w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="ok-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc46b" />
          <stop offset="55%" stopColor="#ff6a00" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <filter id="ok-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#ff6a00" floodOpacity="0.45" />
        </filter>
      </defs>
      <ellipse cx="110" cy="142" rx="58" ry="8" fill="#000" opacity="0.4" />
      <g filter="url(#ok-glow)">
        <circle cx="110" cy="78" r="46" fill="#121218" stroke="url(#ok-fill)" strokeWidth="3" />
        <circle cx="110" cy="78" r="34" fill="url(#ok-fill)" />
        <path
          d="M92 78l12 12 24-26"
          stroke="#1a0a00"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path d="M42 36l8 14M34 52h16" stroke="#ffc46b" strokeWidth="3" strokeLinecap="round" />
      <path d="M178 30l6 12M172 44h14" stroke="#ff6a00" strokeWidth="3" strokeLinecap="round" />
      <circle cx="48" cy="88" r="4" fill="#ffc46b" />
      <circle cx="176" cy="96" r="5" fill="#ff6a00" />
      <circle cx="168" cy="58" r="3" fill="#ffd89a" />
    </svg>
  );
}
