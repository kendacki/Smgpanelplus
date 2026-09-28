export function HeroArt() {
  return (
    <div className="relative mx-auto h-[280px] w-full max-w-sm perspective-scene">
      <div className="orb -left-6 top-8 h-28 w-28 bg-smg/30" />
      <div className="orb right-4 top-0 h-20 w-20 bg-gold/25" />
      <svg viewBox="0 0 420 380" className="relative z-10 h-full w-full drop-shadow-2xl" fill="none">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffb347" />
            <stop offset="55%" stopColor="#ff6a00" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a32" />
            <stop offset="100%" stopColor="#0b0b10" />
          </linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#ff6a00" floodOpacity="0.28" />
          </filter>
        </defs>
        <ellipse cx="210" cy="340" rx="130" ry="18" fill="#000" opacity="0.45" />
        <g filter="url(#soft)" className="floaty">
          <path d="M120 70h180a28 28 0 0 1 28 28v190a28 28 0 0 1-28 28H120a28 28 0 0 1-28-28V98a28 28 0 0 1 28-28Z" fill="url(#g2)" stroke="url(#g1)" strokeWidth="2" />
          <rect x="132" y="88" width="156" height="188" rx="18" fill="#08080c" />
          <rect x="132" y="88" width="156" height="188" rx="18" fill="url(#glass)" />
          <rect x="148" y="108" width="72" height="10" rx="5" fill="url(#g1)" />
          <rect x="148" y="132" width="124" height="54" rx="12" fill="#16161d" />
          <rect x="148" y="198" width="124" height="18" rx="9" fill="#1c1c24" />
          <rect x="148" y="226" width="88" height="18" rx="9" fill="#1c1c24" />
          <circle cx="210" cy="292" r="10" stroke="#ff6a00" strokeWidth="2" />
        </g>
        <g className="floaty-slow">
          <path d="M48 150l46-18 18 46-46 18z" fill="url(#g1)" opacity="0.95" />
          <path d="M52 154l38-15 6 16-38 15z" fill="#fff" opacity="0.25" />
        </g>
        <g className="floaty">
          <circle cx="348" cy="128" r="34" fill="url(#g1)" />
          <path d="M338 128h20M348 118v20" stroke="#1a0a00" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g className="floaty-slow">
          <rect x="318" y="214" width="72" height="72" rx="20" fill="#121218" stroke="#ff8c1a" strokeWidth="2" />
          <path d="M342 238h24l-10 16h12l-28 28 8-20h-14z" fill="url(#g1)" />
        </g>
      </svg>
    </div>
  );
}

export function Flag3D({ country }: { country: "Nigeria" | "Ghana" | "Kenya" }) {
  const id = country.toLowerCase();
  return (
    <svg viewBox="0 0 140 110" className="h-20 w-24 shrink-0 flag-3d" fill="none">
      <defs>
        <filter id={`flag-shadow-${id}`} x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#000" floodOpacity="0.55" />
        </filter>
        <clipPath id={`flag-clip-${id}`}>
          <path d="M32 14c18 3 36-4 54-1 14 2 28 8 36 7v46c-10 3-24-2-38-4-18-3-36 5-52 2V14Z" />
        </clipPath>
      </defs>
      <ellipse cx="78" cy="98" rx="42" ry="7" fill="#000" opacity="0.35" />
      <rect x="24" y="8" width="7" height="88" rx="3" fill="#c9cdd3" />
      <rect x="25" y="8" width="3" height="88" rx="1" fill="#f4f6f8" opacity="0.7" />
      <g filter={`url(#flag-shadow-${id})`} clipPath={`url(#flag-clip-${id})`}>
        {country === "Nigeria" && (
          <>
            <rect x="32" y="10" width="92" height="60" fill="#008751" />
            <rect x="58" y="10" width="32" height="60" fill="#fff" />
            <rect x="90" y="10" width="34" height="60" fill="#008751" />
            <path d="M32 14c18 3 36-4 54-1" stroke="#fff" strokeOpacity="0.18" />
          </>
        )}
        {country === "Ghana" && (
          <>
            <rect x="32" y="10" width="92" height="20" fill="#CE1126" />
            <rect x="32" y="30" width="92" height="20" fill="#FCD116" />
            <rect x="32" y="50" width="92" height="20" fill="#006B3F" />
            <path d="M77 33l4.2 12.8h13.5l-11 8 4.2 12.8L77 59.6l-10.9 7.9 4.2-12.8-11-8h13.5Z" fill="#111" />
          </>
        )}
        {country === "Kenya" && (
          <>
            <rect x="32" y="10" width="92" height="12" fill="#000" />
            <rect x="32" y="22" width="92" height="5" fill="#fff" />
            <rect x="32" y="27" width="92" height="26" fill="#BB0000" />
            <rect x="32" y="53" width="92" height="5" fill="#fff" />
            <rect x="32" y="58" width="92" height="12" fill="#006600" />
            <ellipse cx="78" cy="40" rx="11" ry="16" fill="#9a5b1a" stroke="#c9a227" strokeWidth="2" />
            <path d="M78 26v28M70 40h16" stroke="#c9a227" strokeWidth="1.6" />
            <path d="M73 32c4 3 6 3 10 0M73 48c4-3 6-3 10 0" stroke="#111" strokeWidth="1.4" />
          </>
        )}
      </g>
      <path
        d="M122 20c4 8 6 18 4 28-2 10-1 18 4 24"
        stroke="#ff6a00"
        strokeOpacity="0.0"
      />
      <path
        d="M32 14c18 3 36-4 54-1 14 2 28 8 36 7v46c-10 3-24-2-38-4-18-3-36 5-52 2V14Z"
        stroke="#fff"
        strokeOpacity="0.12"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function IsoCube({
  title,
  accent = "#ff6a00",
}: {
  title: string;
  accent?: string;
}) {
  const id = `cube-${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  return (
    <svg viewBox="0 0 160 140" className="h-24 w-24 shrink-0" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc46b" />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>
      <path d="M80 18 138 48v60L80 138 22 108V48Z" fill="#0c0c12" stroke={accent} strokeWidth="1.5" />
      <path d="M80 18 138 48 80 78 22 48Z" fill={`url(#${id})`} opacity="0.9" />
      <path d="M80 78 138 48v60L80 138Z" fill="#ff6a00" opacity="0.35" />
      <path d="M80 78 22 48v60L80 138Z" fill="#000" opacity="0.35" />
    </svg>
  );
}

export function PlatformMark({
  kind,
}: {
  kind: "instagram" | "tiktok" | "x" | "youtube";
}) {
  const colors = {
    instagram: ["#f58529", "#dd2a7b"],
    tiktok: ["#25f4ee", "#fe2c55"],
    x: ["#e7e7e7", "#888"],
    youtube: ["#ff4d4d", "#cc0000"],
  }[kind];

  return (
    <svg viewBox="0 0 88 88" className="h-16 w-16 tilt-3d" fill="none">
      <defs>
        <linearGradient id={`p-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <rect x="6" y="10" width="76" height="68" rx="22" fill="#101018" />
      <rect x="6" y="10" width="76" height="68" rx="22" fill={`url(#p-${kind})`} opacity="0.95" />
      {kind === "instagram" && (
        <>
          <rect x="28" y="28" width="32" height="32" rx="10" stroke="#fff" strokeWidth="3" />
          <circle cx="44" cy="44" r="8" stroke="#fff" strokeWidth="3" />
          <circle cx="56" cy="32" r="3" fill="#fff" />
        </>
      )}
      {kind === "tiktok" && (
        <path d="M38 30v22a8 8 0 1 0 8-8h-2" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      )}
      {kind === "x" && (
        <path d="M30 30 58 58M58 30 30 58" stroke="#111" strokeWidth="6" strokeLinecap="round" />
      )}
      {kind === "youtube" && <path d="M36 34v20l20-10-20-10Z" fill="#fff" />}
    </svg>
  );
}

export function GlobeArt() {
  return (
    <svg viewBox="0 0 280 220" className="h-52 w-full max-w-sm tilt-3d" fill="none">
      <defs>
        <linearGradient id="globe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb347" />
          <stop offset="100%" stopColor="#ff6a00" />
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="200" rx="90" ry="12" fill="#000" opacity="0.4" />
      <circle cx="140" cy="110" r="78" fill="#120c08" stroke="url(#globe)" strokeWidth="3" />
      <ellipse cx="140" cy="110" rx="28" ry="78" stroke="#ff6a00" strokeOpacity="0.5" />
      <ellipse cx="140" cy="110" rx="78" ry="28" stroke="#ffb347" strokeOpacity="0.45" />
      <path d="M70 90c30 10 50-20 90-8 28 8 44 6 52 2" stroke="#ff6a00" strokeWidth="4" fill="none" />
      <path d="M78 140c40-18 70 8 110 4" stroke="#ffb347" strokeWidth="3" fill="none" opacity="0.8" />
      <circle cx="188" cy="86" r="8" fill="url(#globe)" />
    </svg>
  );
}
