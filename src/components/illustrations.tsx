export function Flag3D({ country }: { country: "Nigeria" | "Ghana" | "Kenya" }) {
  const id = country.toLowerCase();
  return (
    <svg viewBox="0 0 140 110" className="h-14 w-16 shrink-0 flag-3d sm:h-20 sm:w-24" fill="none">
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
    <svg viewBox="0 0 220 140" className="mb-2 h-20 w-full tilt-3d sm:h-28" fill="none">
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

const platformLogos = {
  instagram: { src: "/illustrations/instagram.svg", label: "Instagram" },
  tiktok: { src: "/illustrations/tiktok.svg", label: "TikTok" },
  x: { src: "/illustrations/x.svg", label: "X" },
} as const;

export function PlatformMark({
  kind,
}: {
  kind: "instagram" | "tiktok" | "x" | "youtube";
}) {
  if (kind === "youtube") {
    return (
      <svg viewBox="0 0 88 88" className="h-16 w-16" fill="none" aria-hidden>
        <rect x="6" y="10" width="76" height="68" rx="22" fill="#ff0033" />
        <path d="M36 34v20l20-10-20-10Z" fill="#fff" />
      </svg>
    );
  }

  const logo = platformLogos[kind];
  return (
    <span
      className={`flex h-16 w-16 items-center justify-center rounded-[1.15rem] ${
        kind === "instagram"
          ? "bg-[linear-gradient(135deg,#f9ce34_0%,#ee2a7b_55%,#6228d7_100%)]"
          : "border border-white/10 bg-black"
      }`}
    >
      <img src={logo.src} alt={logo.label} width={40} height={40} className="h-9 w-9" />
    </span>
  );
}

export function GlobeArt() {
  return (
    <svg viewBox="0 0 280 220" className="mx-auto h-40 w-full max-w-[16rem] tilt-3d sm:h-52 sm:max-w-sm" fill="none">
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

export function VisibilityArt() {
  return (
    <div className="relative mx-auto h-[340px] w-full max-w-lg sm:h-[420px] perspective-scene">
      <div className="orb left-6 top-8 h-28 w-28 bg-smg/30" />
      <div className="orb right-4 top-0 h-20 w-20 bg-gold/25" />
      <div className="orb bottom-8 left-20 h-16 w-16 bg-smg/20" />
      <svg viewBox="0 0 480 420" className="relative z-10 h-full w-full" fill="none">
        <defs>
          <linearGradient id="vis-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffc46b" />
            <stop offset="55%" stopColor="#ff6a00" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id="vis-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a34" />
            <stop offset="100%" stopColor="#0b0b10" />
          </linearGradient>
          <linearGradient id="vis-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="vis-chart" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ff6a00" stopOpacity="0" />
            <stop offset="100%" stopColor="#ff6a00" stopOpacity="0.45" />
          </linearGradient>
          <filter id="vis-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="22" stdDeviation="16" floodColor="#ff6a00" floodOpacity="0.32" />
          </filter>
          <clipPath id="vis-screen">
            <rect x="168" y="62" width="144" height="248" rx="18" />
          </clipPath>
        </defs>

        <ellipse cx="240" cy="392" rx="118" ry="16" fill="#000" opacity="0.5" />

        <g filter="url(#vis-glow)" className="floaty">
          <rect x="154" y="42" width="172" height="292" rx="36" fill="url(#vis-body)" stroke="url(#vis-stroke)" strokeWidth="2" />
          <rect x="168" y="62" width="144" height="248" rx="18" fill="#08080c" />
          <rect x="168" y="62" width="144" height="248" rx="18" fill="url(#vis-glass)" />
          <g clipPath="url(#vis-screen)">
            <rect x="180" y="76" width="52" height="8" rx="4" fill="url(#vis-stroke)" />
            <rect x="180" y="92" width="88" height="6" rx="3" fill="#2a2a34" />
            <rect x="180" y="112" width="120" height="72" rx="14" fill="#12121a" />
            <circle cx="216" cy="148" r="18" fill="#1a1a24" stroke="#ff8c1a" strokeWidth="2" />
            <path d="M212 140v16l14-8-14-8Z" fill="url(#vis-stroke)" />
            <rect x="244" y="128" width="44" height="7" rx="3.5" fill="#2c2c36" />
            <rect x="244" y="142" width="32" height="6" rx="3" fill="#2c2c36" />
            <path d="M180 248h120V196H180Z" fill="url(#vis-chart)" />
            <path
              d="M180 236c18-6 28-28 44-32 18-4 24 10 40 6 14-4 24-22 36-28"
              stroke="url(#vis-stroke)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="300" cy="182" r="5" fill="#ffc46b" />
            <rect x="184" y="262" width="18" height="28" rx="5" fill="#1c1c24" />
            <rect x="208" y="250" width="18" height="40" rx="5" fill="#2a2118" />
            <rect x="232" y="242" width="18" height="48" rx="5" fill="#ff6a00" opacity="0.85" />
            <rect x="256" y="228" width="18" height="62" rx="5" fill="url(#vis-stroke)" />
            <rect x="280" y="218" width="18" height="72" rx="5" fill="#ffc46b" />
          </g>
          <circle cx="240" cy="322" r="8" stroke="#ff6a00" strokeWidth="2" />
        </g>

        <g className="floaty-slow">
          <rect x="36" y="112" width="88" height="88" rx="24" fill="#121218" stroke="#ff8c1a" strokeWidth="1.6" />
          <path
            d="M52 156c10-18 26-28 28-28s18 10 28 28c-10 18-26 28-28 28s-18-10-28-28Z"
            stroke="url(#vis-stroke)"
            strokeWidth="3"
          />
          <circle cx="80" cy="156" r="8" fill="url(#vis-stroke)" />
        </g>

        <g className="floaty">
          <circle cx="400" cy="96" r="38" fill="url(#vis-stroke)" />
          <path
            d="M400 118c-22-16-28-30-28-40 0-12 10-18 20-18 8 0 12 4 8 12 4-8 8-12 16-12 10 0 20 6 20 18 0 10-6 24-28 40Z"
            fill="#1a0a00"
          />
        </g>

        <g className="floaty-slow">
          <rect x="368" y="228" width="86" height="86" rx="24" fill="#121218" stroke="#ffc46b" strokeWidth="1.8" />
          <path d="M396 248h30l-12 18h16L392 298l10-22h-18z" fill="url(#vis-stroke)" />
        </g>

        <g className="floaty">
          <rect x="46" y="248" width="64" height="64" rx="18" fill="#101018" stroke="#dd2a7b" strokeWidth="1.6" />
          <rect x="62" y="264" width="32" height="32" rx="10" stroke="#fff" strokeWidth="2.4" />
          <circle cx="78" cy="280" r="8" stroke="#fff" strokeWidth="2.4" />
          <circle cx="90" cy="268" r="2.5" fill="#fff" />
        </g>

        <g className="floaty-slow">
          <rect x="388" y="156" width="56" height="40" rx="12" fill="#cc0000" />
          <path d="M408 168v16l14-8-14-8Z" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}

export function FeatureArt({ kind }: { kind: "fast" | "private" | "checkout" }) {
  return (
    <svg viewBox="0 0 240 150" className="mb-1 h-20 w-full tilt-3d sm:h-32" fill="none">
      <defs>
        <linearGradient id={`fa-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc46b" />
          <stop offset="55%" stopColor="#ff6a00" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id={`fb-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a34" />
          <stop offset="100%" stopColor="#0c0c12" />
        </linearGradient>
        <linearGradient id={`ftop-${kind}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffd89a" />
          <stop offset="100%" stopColor="#ff6a00" />
        </linearGradient>
        <filter id={`fs-${kind}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#ff6a00" floodOpacity="0.28" />
        </filter>
      </defs>
      <ellipse cx="120" cy="136" rx="78" ry="8" fill="#000" opacity="0.38" />

      {kind === "fast" && (
        <g filter={`url(#fs-${kind})`}>
          <ellipse cx="118" cy="112" rx="70" ry="14" fill="#101018" />
          <circle cx="118" cy="78" r="44" fill={`url(#fb-${kind})`} stroke={`url(#fa-${kind})`} strokeWidth="3" />
          <circle cx="118" cy="78" r="34" fill="#08080c" stroke="#ffc46b" strokeWidth="1.4" />
          <path d="M118 78 118 52" stroke="#ffc46b" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M118 78 140 86" stroke="#ff6a00" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="118" cy="78" r="5" fill={`url(#fa-${kind})`} />
          <path d="M118 28v8M118 120v8M68 78h8M160 78h8" stroke="#ff8c1a" strokeWidth="3" strokeLinecap="round" />
          <g transform="translate(168 18) scale(1.55)">
            <path fill="#9a3100" d="M15 28h9l-4 17 15-23h-9l4-17" />
            <path fill="#ff6a00" d="M13 29h10l-5 19 19-27h-10l5-20" />
            <path fill="#ffc46b" d="M30 5 15 28l5-3" />
          </g>
          <path d="M36 58h22M30 70h16M40 82h18" stroke="#ffc46b" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
        </g>
      )}

      {kind === "private" && (
        <g filter={`url(#fs-${kind})`}>
          <path
            d="M120 22 178 44v40c0 28-26 48-58 62-32-14-58-34-58-62V44Z"
            fill={`url(#fb-${kind})`}
            stroke={`url(#fa-${kind})`}
            strokeWidth="2"
          />
          <path d="M120 22 178 44 120 62 62 44Z" fill={`url(#ftop-${kind})`} opacity="0.92" />
          <path d="M178 44v40c0 28-26 48-58 62V62Z" fill="#ff6a00" opacity="0.28" />
          <path d="M62 44 120 62v84c-32-14-58-34-58-62V44Z" fill="#000" opacity="0.28" />
          <rect x="100" y="72" width="40" height="32" rx="7" fill="#101018" stroke="#ffc46b" strokeWidth="1.8" />
          <path d="M109 72v-9a11 11 0 0 1 22 0v9" stroke="#ffc46b" strokeWidth="2.8" />
          <circle cx="120" cy="88" r="4" fill={`url(#fa-${kind})`} />
          <rect x="86" y="112" width="22" height="8" rx="4" fill="#16161e" />
          <rect x="112" y="112" width="22" height="8" rx="4" fill="#16161e" />
          <rect x="138" y="112" width="16" height="8" rx="4" fill="#ff6a00" opacity="0.85" />
        </g>
      )}

      {kind === "checkout" && (
        <g filter={`url(#fs-${kind})`}>
          <path
            d="M48 86 118 58l86 26v40L118 150 48 126Z"
            fill={`url(#fb-${kind})`}
            stroke={`url(#fa-${kind})`}
            strokeWidth="1.6"
          />
          <path d="M48 86 118 58l86 26-70 28Z" fill={`url(#ftop-${kind})`} opacity="0.4" />
          <path d="M118 84l86 26v40L118 150Z" fill="#26A17B" opacity="0.18" />
          <rect x="64" y="78" width="72" height="44" rx="10" fill="#12121a" stroke="#ffc46b" strokeWidth="1.4" transform="rotate(-12 100 100)" />
          <rect x="72" y="88" width="40" height="6" rx="3" fill="#2a2a34" transform="rotate(-12 92 91)" />
          <rect x="72" y="100" width="24" height="6" rx="3" fill="#ff6a00" transform="rotate(-12 84 103)" />
          <g transform="translate(142 28) scale(2.35)">
            <circle cx="16" cy="16" r="16" fill="#26A17B" />
            <path
              fill="#FFF"
              d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117"
            />
          </g>
        </g>
      )}
    </svg>
  );
}

export function ResellerArt({ kind }: { kind: "brand" | "api" | "money" }) {
  return (
    <svg viewBox="0 0 220 140" className="mb-1 h-28 w-full tilt-3d" fill="none">
      <defs>
        <linearGradient id={`ra-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc46b" />
          <stop offset="55%" stopColor="#ff6a00" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id={`rb-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a34" />
          <stop offset="100%" stopColor="#0c0c12" />
        </linearGradient>
        <linearGradient id={`rtop-${kind}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffd89a" />
          <stop offset="100%" stopColor="#ff6a00" />
        </linearGradient>
        <filter id={`rs-${kind}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#ff6a00" floodOpacity="0.26" />
        </filter>
      </defs>
      <ellipse cx="110" cy="126" rx="72" ry="8" fill="#000" opacity="0.38" />

      {kind === "brand" && (
        <g filter={`url(#rs-${kind})`}>
          <path d="M48 78 110 52l72 24v40L110 140 48 118Z" fill={`url(#rb-${kind})`} stroke={`url(#ra-${kind})`} strokeWidth="1.6" />
          <path d="M48 78 110 52l72 24-62 26Z" fill={`url(#rtop-${kind})`} opacity="0.4" />
          <path d="M110 76l72 24v40L110 140Z" fill="#ff6a00" opacity="0.2" />
          <rect x="72" y="86" width="28" height="28" rx="8" fill="#12121a" stroke="#ffc46b" strokeWidth="1.3" />
          <rect x="108" y="86" width="44" height="12" rx="4" fill="#16161e" />
          <rect x="108" y="102" width="32" height="8" rx="4" fill="#2a2a34" />
          <path d="M92 22h36l8 12H84l8-12Z" fill={`url(#ra-${kind})`} />
          <path d="M100 34v18h20V34" stroke="#ffc46b" strokeWidth="3" />
          <circle cx="110" cy="22" r="14" fill="#101018" stroke="#ffd89a" strokeWidth="1.8" />
          <path d="M110 14l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L110 26.4 105 29.2l1.2-5.6-4.2-3.8 5.6-.6Z" fill={`url(#ra-${kind})`} />
        </g>
      )}

      {kind === "api" && (
        <g filter={`url(#rs-${kind})`}>
          <rect x="38" y="28" width="144" height="86" rx="18" fill={`url(#rb-${kind})`} stroke={`url(#ra-${kind})`} strokeWidth="1.6" />
          <circle cx="56" cy="44" r="4" fill="#ff6a00" />
          <circle cx="68" cy="44" r="4" fill="#ffc46b" />
          <circle cx="80" cy="44" r="4" fill="#2a2a34" />
          <rect x="52" y="58" width="72" height="7" rx="3.5" fill={`url(#ra-${kind})`} />
          <rect x="52" y="70" width="96" height="6" rx="3" fill="#2a2a34" />
          <rect x="52" y="82" width="54" height="6" rx="3" fill="#2a2a34" />
          <rect x="52" y="94" width="80" height="6" rx="3" fill="#1c1c24" />
          <g>
            <circle cx="176" cy="36" r="18" fill="#121218" stroke="#ffc46b" strokeWidth="1.6" />
            <path d="M168 36h16M176 28v16" stroke="#ff6a00" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          <path d="M158 54c10 8 14 18 16 28" stroke="#ff8c1a" strokeWidth="2" strokeDasharray="3 3" />
          <rect x="154" y="84" width="36" height="22" rx="8" fill="#101018" stroke="#ff8c1a" strokeWidth="1.4" />
          <path d="M164 91h16M164 98h10" stroke="#ffc46b" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {kind === "money" && (
        <g filter={`url(#rs-${kind})`}>
          <ellipse cx="86" cy="86" rx="28" ry="16" fill="#0b3d2a" />
          <ellipse cx="86" cy="80" rx="28" ry="16" fill="#008751" />
          <ellipse cx="86" cy="76" rx="28" ry="16" fill="#00a35e" />
          <rect x="80" y="70" width="12" height="14" rx="2" fill="#fff" opacity="0.9" />
          <ellipse cx="138" cy="72" rx="26" ry="15" fill="#8a1600" />
          <ellipse cx="138" cy="66" rx="26" ry="15" fill="#CE1126" />
          <ellipse cx="138" cy="62" rx="26" ry="15" fill="#FCD116" />
          <path d="M138 54l3.2 7.4h7.8l-6.3 4.6 2.4 7.4-7.1-4.6-7.1 4.6 2.4-7.4-6.3-4.6h7.8Z" fill="#111" />
          <ellipse cx="168" cy="96" rx="24" ry="14" fill="#004400" />
          <ellipse cx="168" cy="90" rx="24" ry="14" fill="#BB0000" />
          <ellipse cx="168" cy="86" rx="24" ry="14" fill="#111" />
          <ellipse cx="168" cy="86" rx="7" ry="10" stroke="#FCD116" strokeWidth="1.6" />
          <rect x="36" y="48" width="64" height="36" rx="8" fill={`url(#rb-${kind})`} stroke={`url(#ra-${kind})`} strokeWidth="1.4" transform="rotate(-18 68 66)" />
          <rect x="44" y="56" width="36" height="6" rx="3" fill={`url(#ra-${kind})`} transform="rotate(-18 62 59)" />
        </g>
      )}
    </svg>
  );
}

export function ReviewPortrait({ person }: { person: "kunle" | "amani" | "akosua" }) {
  const woman = person === "amani";
  const skin = person === "kunle" ? "#f0b27a" : person === "amani" ? "#c68642" : "#f6c99a";
  const shirt = person === "kunle" ? "#ff8a2a" : person === "akosua" ? "#ffb347" : "#ff6a00";
  const disc = person === "amani" ? "#14110e" : "#3a2e24";
  return (
    <svg viewBox="0 0 80 80" className="h-12 w-12 shrink-0" aria-hidden>
      <circle cx="40" cy="40" r="40" fill={disc} />
      <ellipse cx="40" cy="78" rx="28" ry="20" fill={shirt} />
      <circle cx="40" cy="40" r="16" fill={skin} />
      {person === "kunle" ? (
        <path d="M24 34c1-12 8-18 16-18s15 6 16 18v3H24v-3Z" fill="#4a3022" />
      ) : null}
      {person === "amani" ? (
        <path d="M24 34c2-16 10-22 16-22s14 6 16 22c-6 2-10 2-16 2s-10 0-16-2Z" fill="#1a120c" />
      ) : null}
      {person === "akosua" ? (
        <path d="M27 31c1-9 7-13 13-13s12 4 13 13c-1 1-3 2-13 2s-12-1-13-2Z" fill="#6a432c" />
      ) : null}
      {person === "kunle" ? <path d="M30 49c2.6 5 17.4 5 20 0-1 7-5 10-10 10s-9-3-10-10Z" fill="#c4844e" /> : null}
      {person === "akosua" ? <path d="M32 49c2 4.2 14 4.2 16 0-1 5-4 7-8 7s-7-2-8-7Z" fill="#d4925c" /> : null}
      <ellipse cx="34" cy="40" rx="1.6" ry="2" fill="#3a2418" />
      <ellipse cx="46" cy="40" rx="1.6" ry="2" fill="#3a2418" />
      <path d="M35 47c2.4 2.4 7.6 2.4 10 0" stroke={woman ? "#5a3824" : "#8a5434"} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {person === "amani" ? <circle cx="57" cy="44" r="1.8" fill="#ffc46b" /> : null}
    </svg>
  );
}
