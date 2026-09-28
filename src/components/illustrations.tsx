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

export function ProductArt({ kind }: { kind: "single" | "mass" | "panel" }) {
  return (
    <svg viewBox="0 0 220 140" className="mb-2 h-28 w-full tilt-3d" fill="none">
      <defs>
        <linearGradient id={`pa-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc46b" />
          <stop offset="55%" stopColor="#ff6a00" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id={`pb-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a34" />
          <stop offset="100%" stopColor="#0c0c12" />
        </linearGradient>
        <filter id={`ps-${kind}`} x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#ff6a00" floodOpacity="0.22" />
        </filter>
      </defs>
      <ellipse cx="110" cy="126" rx="70" ry="8" fill="#000" opacity="0.35" />

      {kind === "single" && (
        <g filter={`url(#ps-${kind})`}>
          <rect x="48" y="22" width="110" height="88" rx="18" fill={`url(#pb-${kind})`} stroke={`url(#pa-${kind})`} strokeWidth="1.6" />
          <rect x="62" y="36" width="54" height="8" rx="4" fill={`url(#pa-${kind})`} />
          <rect x="62" y="52" width="82" height="28" rx="10" fill="#16161e" />
          <circle cx="76" cy="66" r="8" fill={`url(#pa-${kind})`} />
          <rect x="90" y="60" width="42" height="6" rx="3" fill="#2c2c36" />
          <rect x="90" y="70" width="28" height="6" rx="3" fill="#2c2c36" />
          <rect x="62" y="88" width="36" height="10" rx="5" fill={`url(#pa-${kind})`} />
          <path d="M148 86l28 10-10 6 8 18-12-4-8 14-6-44Z" fill={`url(#pa-${kind})`} />
          <path d="M154 96l8 3" stroke="#1a0a00" strokeWidth="2" />
        </g>
      )}

      {kind === "mass" && (
        <g filter={`url(#ps-${kind})`}>
          <rect x="86" y="18" width="92" height="62" rx="14" fill="#14141c" stroke="#ffc46b" strokeWidth="1.4" transform="rotate(8 132 49)" />
          <rect x="70" y="28" width="92" height="62" rx="14" fill="#181820" stroke="#ff8c1a" strokeWidth="1.4" transform="rotate(3 116 59)" />
          <rect x="42" y="36" width="100" height="68" rx="16" fill={`url(#pb-${kind})`} stroke={`url(#pa-${kind})`} strokeWidth="1.6" />
          <rect x="56" y="50" width="72" height="7" rx="3.5" fill={`url(#pa-${kind})`} />
          <rect x="56" y="64" width="64" height="6" rx="3" fill="#2a2a34" />
          <rect x="56" y="76" width="52" height="6" rx="3" fill="#2a2a34" />
          <rect x="56" y="88" width="28" height="6" rx="3" fill="#2a2a34" />
          <circle cx="168" cy="42" r="16" fill={`url(#pa-${kind})`} />
          <path d="M163 42h10M168 37v10" stroke="#1a0a00" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )}

      {kind === "panel" && (
        <g filter={`url(#ps-${kind})`}>
          <rect x="36" y="28" width="118" height="78" rx="16" fill={`url(#pb-${kind})`} stroke={`url(#pa-${kind})`} strokeWidth="1.6" />
          <rect x="48" y="40" width="28" height="54" rx="8" fill="#12121a" />
          <rect x="52" y="46" width="20" height="5" rx="2.5" fill={`url(#pa-${kind})`} />
          <rect x="52" y="56" width="16" height="4" rx="2" fill="#2c2c36" />
          <rect x="52" y="64" width="16" height="4" rx="2" fill="#2c2c36" />
          <rect x="86" y="40" width="56" height="24" rx="8" fill="#16161e" />
          <rect x="86" y="70" width="26" height="24" rx="8" fill="#16161e" />
          <rect x="116" y="70" width="26" height="24" rx="8" fill="#16161e" />
          <rect x="138" y="18" width="52" height="42" rx="12" fill="#101018" stroke="#ffc46b" strokeWidth="1.5" />
          <circle cx="164" cy="39" r="8" fill={`url(#pa-${kind})`} />
          <path d="M154 86c18-6 28-18 32-34" stroke="#ff8c1a" strokeWidth="2" strokeDasharray="3 3" />
        </g>
      )}
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
